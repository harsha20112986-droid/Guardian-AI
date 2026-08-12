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
  ExternalLink,
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
      ? "bg-amber-500"
      : "bg-red-500";

  const scoreTextColor =
    score < 30
      ? "text-emerald-600"
      : score < 70
      ? "text-amber-600"
      : "text-red-600";

  const riskBadge =
    result?.risk_level === "Low"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : result?.risk_level === "Medium"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-red-50 text-red-700 border-red-200";

  const statusStyle = isSafe
    ? {
        container:
          "bg-emerald-50 border-emerald-200",
        icon:
          "bg-emerald-100 text-emerald-600",
        badge:
          "bg-emerald-100 text-emerald-700 border-emerald-200",
      }
    : isSuspicious
    ? {
        container:
          "bg-amber-50 border-amber-200",
        icon:
          "bg-amber-100 text-amber-600",
        badge:
          "bg-amber-100 text-amber-700 border-amber-200",
      }
    : {
        container:
          "bg-red-50 border-red-200",
        icon:
          "bg-red-100 text-red-600",
        badge:
          "bg-red-100 text-red-700 border-red-200",
      };

  return (
    <main className="relative min-h-full overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">

      <div className="pointer-events-none absolute left-[-160px] top-20 h-[350px] w-[350px] rounded-full bg-orange-100/60 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 right-[-150px] h-[330px] w-[330px] rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50">
              <MessageSquare
                size={30}
                className="text-orange-600"
              />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-2xl font-bold tracking-tight text-[#17201C] md:text-4xl">
                  SMS Scanner
                </h1>

                <span className="hidden rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-orange-700 sm:inline-block">
                  Security Tool
                </span>

              </div>

              <p className="mt-1 text-sm text-[#68766F] md:text-base">
                Check suspicious messages before responding or clicking.
              </p>

            </div>

          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-700">
            <ShieldCheck size={16} />
            Scam Detection Active
          </div>

        </div>

        {/* Scanner Card */}

        <section className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_12px_40px_rgba(32,55,45,0.06)] md:p-8">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <ScanLine
                size={20}
                className="text-orange-600"
              />
            </div>

            <div>

              <h2 className="font-semibold text-[#25312B]">
                Analyze SMS Message
              </h2>

              <p className="text-xs text-[#8A9690]">
                Paste a suspicious message for security analysis.
              </p>

            </div>

          </div>

          {/* SMS Input */}

          <div className="relative">

            <MessageSquare
              size={20}
              className="absolute left-4 top-5 text-[#9AA59F]"
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
                resize-y
                rounded-2xl
                border
                border-[#DDE8E2]
                bg-[#F8FAF9]
                py-5
                pl-12
                pr-5
                leading-7
                text-[#29352F]
                outline-none
                placeholder:text-[#9AA59F]
                transition-all
                focus:border-orange-400
                focus:bg-white
                focus:ring-2
                focus:ring-orange-100
                disabled:opacity-60
              "
            />

          </div>

          {/* Character Count */}

          <div className="mt-2 flex justify-end text-xs text-[#8A9690]">
            {message.length} characters
          </div>

          {/* Buttons */}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleScan}
              disabled={loading}
              className="
                flex
                flex-1
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#159A62]
                py-3.5
                font-semibold
                text-white
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#108653]
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >

              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
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
              disabled={loading || !message.trim()}
              className="
                flex
                items-center
                justify-center
                rounded-xl
                border
                border-[#D7E2DC]
                bg-white
                px-5
                py-3.5
                text-[#52605A]
                transition-all
                hover:border-[#BFD9CB]
                hover:bg-[#F7FAF8]
                hover:text-[#159A62]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              title="Copy SMS"
            >
              <Copy size={19} />
            </button>

            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="
                rounded-xl
                border
                border-[#D7E2DC]
                bg-white
                px-6
                py-3.5
                font-semibold
                text-[#52605A]
                transition-all
                hover:border-[#BFD9CB]
                hover:bg-[#F7FAF8]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-32
              "
            >
              Clear
            </button>

          </div>

          {/* Detection Information */}

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#7A8780]">

            <span className="flex items-center gap-1.5">
              <Brain
                size={14}
                className="text-purple-600"
              />
              Message Analysis
            </span>

            <span className="flex items-center gap-1.5">
              <Link2
                size={14}
                className="text-cyan-600"
              />
              Embedded URL Detection
            </span>

            <span className="flex items-center gap-1.5">
              <Sparkles
                size={14}
                className="text-orange-600"
              />
              Risk Scoring
            </span>

          </div>

          {/* Result */}

          {result && (
            <div className="mt-8 overflow-hidden rounded-3xl border border-[#DDE8E2] bg-white shadow-[0_10px_35px_rgba(32,55,45,0.05)]">

              {/* Result Header */}

              <div
                className={`border-b p-6 md:p-8 ${statusStyle.container}`}
              >

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${statusStyle.icon}`}
                    >
                      {isSafe ? (
                        <ShieldCheck size={30} />
                      ) : (
                        <ShieldAlert size={30} />
                      )}
                    </div>

                    <div>

                      <h2 className="text-2xl font-bold text-[#17201C] md:text-3xl">
                        Scan Result
                      </h2>

                      <p className="mt-1 text-sm text-[#68766F]">
                        SMS security analysis completed
                      </p>

                    </div>

                  </div>

                  <span
                    className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusStyle.badge}`}
                  >
                    {prediction}
                  </span>

                </div>

              </div>

              {/* Result Content */}

              <div className="space-y-6 p-6 md:p-8">

                {/* Original Message */}

                <div className="rounded-2xl border border-[#E1EAE5] bg-[#F8FAF9] p-5">

                  <div className="mb-4 flex items-center gap-2">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50">
                      <MessageSquare
                        size={18}
                        className="text-orange-600"
                      />
                    </div>

                    <h3 className="font-semibold text-[#25312B]">
                      Analyzed Message
                    </h3>

                  </div>

                  <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#52605A]">
                    {result.message || message}
                  </p>

                </div>

                {/* Risk Score */}

                <div className="rounded-2xl border border-[#E1EAE5] bg-white p-5">

                  <div className="mb-3 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7FAF8]">
                        <Activity
                          size={18}
                          className={scoreTextColor}
                        />
                      </div>

                      <span className="font-semibold text-[#29352F]">
                        Risk Score
                      </span>

                    </div>

                    <span
                      className={`font-bold ${scoreTextColor}`}
                    >
                      {score}%
                    </span>

                  </div>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-[#E5EBE7]">

                    <div
                      className={`h-full rounded-full transition-all duration-700 ${scoreColor}`}
                      style={{
                        width: `${score}%`,
                      }}
                    />

                  </div>

                  <p className="mt-3 text-xs leading-5 text-[#7A8780]">
                    Risk score based on detected suspicious patterns and URLs.
                  </p>

                </div>

                {/* Risk Level */}

                <div className="rounded-2xl border border-[#E1EAE5] bg-[#F8FAF9] p-5">

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                      <p className="text-sm text-[#7A8780]">
                        Overall Risk Level
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-[#17201C]">
                        SMS Security Assessment
                      </h3>

                    </div>

                    <span
                      className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${riskBadge}`}
                    >
                      {result.risk_level || "Unknown"} Risk
                    </span>

                  </div>

                </div>

                {/* Embedded URL */}

                {result.url_analysis && (
                  <div className="rounded-2xl border border-cyan-100 bg-cyan-50/40 p-5">

                    <div className="mb-4 flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                        <Link2
                          size={20}
                          className="text-cyan-600"
                        />
                      </div>

                      <div>

                        <h3 className="text-xl font-bold text-[#17201C]">
                          Embedded URL
                        </h3>

                        <p className="mt-1 text-sm text-[#7A8780]">
                          A URL was found inside this SMS.
                        </p>

                      </div>

                    </div>

                    <div className="rounded-xl border border-cyan-100 bg-white p-4">

                      <div className="flex items-start gap-2">

                        <ExternalLink
                          size={16}
                          className="mt-1 shrink-0 text-cyan-600"
                        />

                        <p className="break-all text-sm leading-6 text-[#52605A]">
                          {result.url_analysis.url}
                        </p>

                      </div>

                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">

                      <span className="text-sm font-medium text-[#68766F]">
                        URL Prediction
                      </span>

                      <span
                        className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${
                          result.url_analysis.prediction ===
                          "Legitimate"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700"
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

                      <div className="mb-4 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                          <AlertTriangle
                            className="text-amber-600"
                            size={20}
                          />
                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-[#17201C]">
                            Detection Reasons
                          </h3>

                          <p className="mt-1 text-sm text-[#7A8780]">
                            Suspicious patterns identified in this message.
                          </p>

                        </div>

                      </div>

                      <div className="space-y-2.5">

                        {result.reasons.map(
                          (reason, index) => (
                            <div
                              key={`${reason}-${index}`}
                              className="flex items-start gap-3 rounded-xl border border-[#E1EAE5] bg-[#FBFCFB] px-4 py-3.5"
                            >

                              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" />

                              <span className="text-sm leading-6 text-[#52605A]">
                                {reason}
                              </span>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                {/* Action */}

                <div className="flex justify-end border-t border-[#E7EEEA] pt-6">

                  <button
                    type="button"
                    onClick={reset}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-[#159A62]
                      px-6
                      py-3.5
                      font-semibold
                      text-white
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-[#108653]
                      hover:shadow-md
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