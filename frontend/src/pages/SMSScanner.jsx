import { useState } from "react";
import { MessageSquare } from "lucide-react";
import api from "../api/api";
import { toast } from "react-toastify";

function SMSScanner() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!message.trim()) {
      toast.warning("Please enter an SMS.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post("/sms/scan", {
        message,
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

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="flex items-center gap-3 mb-8">

          <MessageSquare
            className="text-emerald-400"
            size={36}
          />

          <h1 className="text-4xl font-bold">
            SMS Scanner
          </h1>

        </div>

        {/* Scanner Card */}

        <div className="bg-slate-900 rounded-2xl p-8 shadow-xl">

          <textarea
            rows={8}
            placeholder="Paste your SMS here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-slate-800 rounded-xl p-4 border border-slate-700 outline-none focus:border-emerald-500 transition shadow-sm focus:shadow-emerald-500/20"
          />

          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.02] py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
          >

            {loading ? (

              <div className="flex items-center justify-center gap-3">

                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                <span>Scanning...</span>

              </div>

            ) : (
              "Scan SMS"
            )}

          </button>

          {result && (

            <div className="mt-8 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-emerald-500/20 transition-all duration-500">

              {/* Header */}

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-3xl font-bold flex items-center gap-2">
                  🛡️ Scan Result
                </h2>

                <span
                  className={`px-5 py-2 rounded-full font-bold text-white ${
                    result.prediction === "Safe"
                      ? "bg-green-600"
                      : result.prediction === "Suspicious"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {result.prediction}
                </span>

              </div>

              {/* Risk Score */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-semibold">
                    Risk Score
                  </span>

                  <span>
                    {result.score}%
                  </span>

                </div>

                <div className="w-full bg-slate-700 rounded-full h-3">

                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      result.score < 30
                        ? "bg-green-500"
                        : result.score < 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${result.score}%`,
                    }}
                  />

                </div>

              </div>

              {/* Risk Level */}

              <div className="flex items-center gap-4 mt-6">

                <span className="font-semibold">
                  Risk Level
                </span>

                <span
                  className={`px-4 py-1 rounded-full font-semibold text-white ${
                    result.risk_level === "Low"
                      ? "bg-green-600"
                      : result.risk_level === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {result.risk_level}
                </span>

              </div>

              {/* Embedded URL */}

              {result.url_analysis && (

                <div className="mt-8 bg-slate-900 rounded-xl border border-slate-700 p-5">

                  <h3 className="text-lg font-semibold mb-4">
                    Embedded URL
                  </h3>

                  <p className="break-all text-emerald-400">
                    {result.url_analysis.url}
                  </p>

                  <div className="mt-4 flex justify-between items-center">

                    <span className="text-gray-300">
                      URL Prediction
                    </span>

                    <span
                      className={`px-4 py-1 rounded-full font-semibold text-white ${
                        result.url_analysis.prediction === "Legitimate"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {result.url_analysis.prediction}
                    </span>

                  </div>

                </div>

              )}

              {/* Detection Reasons */}

              {result.reasons.length > 0 && (

                <div className="mt-8">

                  <h3 className="text-lg font-semibold mb-3">
                    Detection Reasons
                  </h3>

                  <div className="space-y-3">

                    {result.reasons.map((reason, index) => (

                      <div
                        key={index}
                        className="flex items-center gap-3 bg-slate-700 rounded-lg px-4 py-3"
                      >

                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>

                        <span>{reason}</span>

                      </div>

                    ))}

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default SMSScanner;