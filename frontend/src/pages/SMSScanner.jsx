import { useState } from "react";
import {
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  Copy,
  RotateCcw,
  ScanLine,
  Sparkles,
  Activity,
  Link2,
  AlertTriangle,
  Brain,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../api/api";

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
  const score = Math.min(
    100,
    Math.max(0, Number(result?.score || 0))
  );

  const isSafe =
    prediction === "Safe" ||
    prediction === "Legitimate";

  const isSuspicious =
    prediction === "Suspicious";

  const scoreColor =
    score < 30
      ? "bg-emerald-500"
      : score < 70
      ? "bg-yellow-500"
      : "bg-red-500";

  const scoreTextColor =
    score < 30
      ? "text-emerald-400"
      : score < 70
      ? "text-yellow-400"
      : "text-red-400";

  const riskBadge =
    result?.risk_level === "Low"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : result?.risk_level === "Medium"
      ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
      : "bg-red-500/15 text-red-400 border-red-500/30";

  return (
    <main className="relative min-h-full px-4 sm:px-6 py-10 md:py-14 overflow-hidden">

      {/* Background glow */}

      <div className="absolute top-20 left-[-180px] w-[350px] h-[350px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-20 right-[-180px] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">

          <div className="flex items-center gap-4">

            <div className="p-3.5 bg-orange-500/10 border border-orange-500/20 rounded-2xl">

              <MessageSquare
                size={32}
                className="text-orange-400"
              />

            </div>

            <div>

              <h1 className="text-2xl md:text-4xl font-bold text-white">
                SMS Scanner
              </h1>

              <p className="text-gray-400 mt-1">
                Detect suspicious and fraudulent SMS messages.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 text-sm text-orange-400 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full w-fit">

            <ShieldCheck size={16} />

            Scam Detection Active

          </div>

        </div>

        {/* Scanner Card */}

        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">

          {/* Input heading */}

          <div className="flex items-center gap-2 mb-5">

            <ScanLine
              size={20}
              className="text-orange-400"
            />

            <h2 className="text-lg font-semibold">
              Analyze SMS Message
            </h2>

          </div>

          {/* SMS Input */}

          <div className="relative">

            <MessageSquare
              size={20}
              className="absolute left-4 top-5 text-gray-500"
            />

            <textarea
              rows={9}
              placeholder="Paste suspicious SMS here..."
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              disabled={loading}
              className="
                w-full
                pl-12
                pr-5
                py-5
                bg-slate-950/60
                rounded-2xl
                border
                border-slate-700
                text-white
                placeholder:text-gray-500
                outline-none
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-500/20
                transition-all
                resize-y
                disabled:opacity-60
                leading-7
              "
            />

          </div>

          {/* Character count */}

          <div className="flex justify-end mt-2 text-xs text-gray-500">
            {message.length} characters
          </div>

          {/* Buttons */}

          <div className="flex flex-col sm:flex-row gap-3 mt-5">

            <button
              type="button"
              onClick={handleScan}
              disabled={loading}
              className="
                flex-1
                flex
                items-center
                justify-center
                gap-2
                bg-emerald-500
                hover:bg-emerald-600
                text-slate-950
                py-3.5
                rounded-xl
                font-bold
                transition-all
                duration-300
                hover:-translate-y-0.5
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />

                  Analyzing SMS...
                </>
              ) : (
                <>
                  <ScanLine size={19} />

                  Scan SMS
                </>
              )}

            </button>

            <button
              type="button"
              onClick={copyMessage}
              disabled={loading}
              className="
                sm:w-14
                bg-slate-700
                hover:bg-slate-600
                text-white
                py-3.5
                rounded-xl
                flex
                items-center
                justify-center
                transition
                disabled:opacity-50
              "
              title="Copy SMS"
            >

              <Copy size={20} />

            </button>

            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="
                sm:w-32
                bg-slate-700
                hover:bg-slate-600
                text-white
                py-3.5
                rounded-xl
                font-semibold
                transition
                disabled:opacity-50
              "
            >
              Clear
            </button>

          </div>

          {/* Detection information */}

          <div className="flex flex-wrap gap-4 mt-5 text-xs text-gray-500">

            <span className="flex items-center gap-1.5">
              <Brain
                size={14}
                className="text-purple-400"
              />
              Message Analysis
            </span>

            <span className="flex items-center gap-1.5">
              <Link2
                size={14}
                className="text-cyan-400"
              />
              Embedded URL Detection
            </span>

            <span className="flex items-center gap-1.5">
              <Sparkles
                size={14}
                className="text-orange-400"
              />
              Risk Scoring
            </span>

          </div>

          {/* Result */}

          {result && (

            <div className="mt-8 bg-slate-950/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

              {/* Result Header */}

              <div
                className={`p-6 md:p-8 border-b ${
                  isSafe
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : isSuspicious
                    ? "bg-yellow-500/10 border-yellow-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isSafe
                          ? "bg-emerald-500/10 text-emerald-400"
                          : isSuspicious
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >

                      {isSafe ? (
                        <ShieldCheck size={32} />
                      ) : (
                        <ShieldAlert size={32} />
                      )}

                    </div>

                    <div>

                      <h2 className="text-2xl md:text-3xl font-bold">
                        Scan Result
                      </h2>

                      <p className="text-gray-400 mt-1">
                        SMS Security Analysis
                      </p>

                    </div>

                  </div>

                  <span
                    className={`px-5 py-2.5 rounded-full font-bold text-sm w-fit ${
                      isSafe
                        ? "bg-emerald-500 text-slate-950"
                        : isSuspicious
                        ? "bg-yellow-500 text-slate-950"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {prediction}
                  </span>

                </div>

              </div>

              {/* Result Content */}

              <div className="p-6 md:p-8 space-y-8">

                {/* Original Message */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                  <div className="flex items-center gap-2 mb-4">

                    <MessageSquare
                      size={18}
                      className="text-orange-400"
                    />

                    <h3 className="font-semibold">
                      Analyzed Message
                    </h3>

                  </div>

                  <p className="text-gray-300 leading-7 whitespace-pre-wrap break-words">
                    {result.message || message}
                  </p>

                </div>

                {/* Risk Score */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                  <div className="flex justify-between mb-3">

                    <div className="flex items-center gap-2">

                      <Activity
                        size={18}
                        className={scoreTextColor}
                      />

                      <span className="font-semibold">
                        Risk Score
                      </span>

                    </div>

                    <span className={`font-bold ${scoreTextColor}`}>
                      {score}%
                    </span>

                  </div>

                  <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

                    <div
                      className={`h-full rounded-full transition-all duration-700 ${scoreColor}`}
                      style={{
                        width: `${score}%`,
                      }}
                    />

                  </div>

                  <p className="text-xs text-gray-500 mt-3">
                    Risk score based on detected suspicious patterns and URLs.
                  </p>

                </div>

                {/* Risk Level */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div>

                      <p className="text-gray-400 text-sm">
                        Overall Risk Level
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        SMS Security Assessment
                      </h3>

                    </div>

                    <span
                      className={`px-5 py-2 rounded-full font-bold border w-fit ${riskBadge}`}
                    >
                      {result.risk_level || "Unknown"} Risk
                    </span>

                  </div>

                </div>

                {/* Embedded URL */}

                {result.url_analysis && (

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                    <div className="flex items-center gap-2 mb-4">

                      <div className="p-2.5 rounded-xl bg-cyan-500/10">

                        <Link2
                          size={20}
                          className="text-cyan-400"
                        />

                      </div>

                      <div>

                        <h3 className="text-xl font-bold">
                          Embedded URL
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          URL found inside the SMS message.
                        </p>

                      </div>

                    </div>

                    <div className="bg-slate-950 rounded-xl p-4">

                      <p className="break-all text-cyan-400 leading-7">
                        {result.url_analysis.url}
                      </p>

                    </div>

                    <div className="flex items-center justify-between mt-4">

                      <span className="text-gray-400">
                        URL Prediction
                      </span>

                      <span
                        className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                          result.url_analysis.prediction ===
                          "Legitimate"
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {result.url_analysis.prediction}
                      </span>

                    </div>

                  </div>

                )}

                {/* Detection Reasons */}

                {Array.isArray(result.reasons) &&
                  result.reasons.length > 0 && (

                    <div>

                      <div className="flex items-center gap-3 mb-4">

                        <div className="p-2.5 rounded-xl bg-yellow-500/10">

                          <AlertTriangle
                            className="text-yellow-400"
                            size={20}
                          />

                        </div>

                        <div>

                          <h3 className="text-xl font-bold">
                            Detection Reasons
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Suspicious patterns detected in this message.
                          </p>

                        </div>

                      </div>

                      <div className="space-y-3">

                        {result.reasons.map(
                          (reason, index) => (

                            <div
                              key={`${reason}-${index}`}
                              className="
                                flex
                                items-start
                                gap-3
                                bg-slate-900
                                border
                                border-slate-800
                                rounded-xl
                                px-4
                                py-3.5
                              "
                            >

                              <span className="mt-2 w-2 h-2 rounded-full bg-yellow-400 shrink-0" />

                              <span className="text-gray-300 leading-6">
                                {reason}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                {/* Action */}

                <div className="flex justify-end pt-2">

                  <button
                    type="button"
                    onClick={reset}
                    className="
                      flex
                      items-center
                      gap-2
                      bg-emerald-500
                      hover:bg-emerald-600
                      text-slate-950
                      px-6
                      py-3.5
                      rounded-xl
                      font-bold
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
                    "
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
  );
}

export default SMSScanner;