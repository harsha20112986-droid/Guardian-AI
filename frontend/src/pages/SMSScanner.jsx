import { useState } from "react";
import {
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Copy,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../api/api";
import Navbar from "../components/Navbar";

function SMSScanner() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      toast.warning("Please enter an SMS.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post("/sms/scan", {
        message: trimmedMessage,
      });

      setResult(response.data);

      toast.success("SMS scanned successfully!");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async () => {
    if (!message.trim()) {
      toast.warning("There is no SMS to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(message);
      toast.success("SMS copied.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy SMS.");
    }
  };

  const reset = () => {
    setMessage("");
    setResult(null);
  };

  const prediction = result?.prediction || "Unknown";
  const score = Number(result?.score || 0);

  const isSafe =
    prediction === "Safe" ||
    prediction === "Legitimate";

  const getScoreColor = () => {
    if (score < 30) {
      return "bg-green-500";
    }

    if (score < 70) {
      return "bg-yellow-500";
    }

    return "bg-red-500";
  };

  const getRiskColor = () => {
    if (result?.risk_level === "Low") {
      return "bg-green-600";
    }

    if (result?.risk_level === "Medium") {
      return "bg-yellow-500 text-slate-950";
    }

    return "bg-red-600";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="px-6 py-10">

        <div className="max-w-5xl mx-auto">

          <div className="flex items-center gap-3 mb-8">

            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <MessageSquare
                size={32}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                SMS Scanner
              </h1>

              <p className="text-gray-400 mt-1">
                Detect suspicious and fraudulent SMS messages.
              </p>
            </div>

          </div>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">

            <textarea
              rows={8}
              placeholder="Paste suspicious SMS here..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              disabled={loading}
              className="w-full bg-slate-800 rounded-xl p-5 border border-slate-700 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-y disabled:opacity-60"
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-6">

              <button
                type="button"
                onClick={handleScan}
                disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3.5 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Scanning...
                  </span>
                ) : (
                  "Scan SMS"
                )}
              </button>

              <button
                type="button"
                onClick={copyMessage}
                disabled={loading}
                className="sm:w-14 bg-slate-700 hover:bg-slate-600 text-white py-3.5 rounded-xl flex items-center justify-center transition disabled:opacity-50"
                title="Copy SMS"
              >
                <Copy size={20} />
              </button>

              <button
                type="button"
                onClick={reset}
                disabled={loading}
                className="sm:w-32 bg-slate-700 hover:bg-slate-600 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-50"
              >
                Clear
              </button>

            </div>

            {result && (
              <div className="mt-8 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 border-b border-slate-700">

                  <div className="flex items-center gap-4">

                    {isSafe ? (
                      <ShieldCheck
                        className="text-green-400"
                        size={38}
                      />
                    ) : (
                      <ShieldAlert
                        className="text-red-400"
                        size={38}
                      />
                    )}

                    <h2 className="text-2xl md:text-3xl font-bold">
                      Scan Result
                    </h2>

                  </div>

                  <span
                    className={`px-5 py-2 rounded-full font-bold text-center ${
                      prediction === "Safe" ||
                      prediction === "Legitimate"
                        ? "bg-green-600"
                        : prediction === "Suspicious"
                        ? "bg-yellow-500 text-slate-950"
                        : "bg-red-600"
                    }`}
                  >
                    {prediction}
                  </span>

                </div>

                <div className="p-6 space-y-6">

                  <div>

                    <div className="flex justify-between mb-2">

                      <span className="font-semibold">
                        Risk Score
                      </span>

                      <span>
                        {score}%
                      </span>

                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

                      <div
                        className={`h-3 rounded-full transition-all ${getScoreColor()}`}
                        style={{
                          width: `${Math.min(
                            Math.max(score, 0),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  <div>

                    <span className="font-semibold">
                      Risk Level
                    </span>

                    <span
                      className={`ml-4 px-4 py-1 rounded-full text-sm font-semibold ${getRiskColor()}`}
                    >
                      {result.risk_level || "Unknown"}
                    </span>

                  </div>

                  {result.url_analysis && (
                    <div className="bg-slate-700 rounded-xl p-5">

                      <h3 className="text-xl font-bold mb-3">
                        Embedded URL
                      </h3>

                      <p className="break-all text-emerald-400">
                        {result.url_analysis.url}
                      </p>

                      <p className="mt-3">
                        Prediction:

                        <span className="ml-2 font-semibold">
                          {result.url_analysis.prediction}
                        </span>
                      </p>

                    </div>
                  )}

                  {Array.isArray(result.reasons) &&
                    result.reasons.length > 0 && (
                      <div>

                        <h3 className="text-xl font-bold mb-4">
                          Detection Reasons
                        </h3>

                        <div className="space-y-3">

                          {result.reasons.map(
                            (reason, index) => (
                              <div
                                key={`${reason}-${index}`}
                                className="bg-slate-700 rounded-lg px-4 py-3"
                              >
                                {reason}
                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )}

                  <div className="flex justify-end">

                    <button
                      type="button"
                      onClick={reset}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-3 rounded-xl font-bold transition"
                    >
                      <RotateCcw size={18} />
                      Scan Another
                    </button>

                  </div>

                </div>

              </div>
            )}

          </section>

        </div>

      </main>

    </div>
  );
}

export default SMSScanner;