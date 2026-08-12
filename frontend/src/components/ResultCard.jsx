import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Copy,
  RotateCcw,
  Activity,
  Brain,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import { toast } from "react-toastify";

function ResultCard({ result, onReset }) {
  if (!result) return null;

  const isSafe =
    result.prediction === "Legitimate" ||
    result.prediction === "Safe";

  const isSuspicious =
    result.prediction === "Suspicious";

  const riskScore = Math.min(
    100,
    Math.max(
      0,
      Number(result.final_score ?? result.score ?? 0)
    )
  );

  const confidence = Math.min(
    100,
    Math.max(
      0,
      Number(result.confidence ?? 0)
    )
  );

  const getStatus = () => {
    if (isSafe) {
      return {
        title: "This URL appears safe",
        description:
          "No significant phishing indicators were detected during the security analysis.",
        container:
          "bg-emerald-50 border-emerald-200",
        icon:
          "bg-emerald-100 text-emerald-600",
        badge:
          "bg-emerald-100 text-emerald-700 border-emerald-200",
        accent:
          "text-emerald-600",
      };
    }

    if (isSuspicious) {
      return {
        title: "This URL looks suspicious",
        description:
          "Some indicators require caution. Review the analysis before visiting the website.",
        container:
          "bg-amber-50 border-amber-200",
        icon:
          "bg-amber-100 text-amber-600",
        badge:
          "bg-amber-100 text-amber-700 border-amber-200",
        accent:
          "text-amber-600",
      };
    }

    return {
      title: "Potential phishing threat detected",
      description:
        "The analysis identified indicators commonly associated with malicious or phishing websites.",
      container:
        "bg-red-50 border-red-200",
      icon:
        "bg-red-100 text-red-600",
      badge:
        "bg-red-100 text-red-700 border-red-200",
      accent:
        "text-red-600",
    };
  };

  const getRiskColor = () => {
    if (riskScore < 30) {
      return "text-emerald-600";
    }

    if (riskScore < 70) {
      return "text-amber-600";
    }

    return "text-red-600";
  };

  const getRiskBarColor = () => {
    if (riskScore < 30) {
      return "bg-emerald-500";
    }

    if (riskScore < 70) {
      return "bg-amber-500";
    }

    return "bg-red-500";
  };

  const getRiskBackground = () => {
    if (riskScore < 30) {
      return "bg-emerald-100";
    }

    if (riskScore < 70) {
      return "bg-amber-100";
    }

    return "bg-red-100";
  };

  const status = getStatus();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        result.decoded_url || result.url || ""
      );

      toast.success("URL copied to clipboard.");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy URL.");
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-[#DDE8E2] bg-white shadow-[0_12px_40px_rgba(32,55,45,0.07)]">

      <div
        className={`border-b px-6 py-6 md:px-8 md:py-7 ${status.container}`}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-4">

            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${status.icon}`}
            >
              {isSafe ? (
                <ShieldCheck size={30} />
              ) : (
                <ShieldAlert size={30} />
              )}
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-xl font-bold tracking-tight text-[#17201C] md:text-2xl">
                  Scan Result
                </h2>

                <Activity
                  size={17}
                  className="text-[#8A9690]"
                />

              </div>

              <p className="mt-1 text-sm text-[#68766F]">
                AI security analysis completed
              </p>

            </div>

          </div>

          <span
            className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${status.badge}`}
          >
            {result.prediction}
          </span>

        </div>
      </div>

      <div className="space-y-6 p-6 md:p-8">

        <div className="flex items-start gap-4 rounded-2xl border border-[#E1EAE5] bg-[#F7FAF8] p-5">

          <div
            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${status.icon}`}
          >
            {isSafe ? (
              <CheckCircle2 size={21} />
            ) : (
              <AlertTriangle size={21} />
            )}
          </div>

          <div>

            <h3 className="font-semibold text-[#17201C]">
              {status.title}
            </h3>

            <p className="mt-1 text-sm leading-6 text-[#68766F]">
              {status.description}
            </p>

          </div>

        </div>

        {(result.url || result.decoded_url) && (
          <div className="rounded-2xl border border-[#E1EAE5] bg-white p-5">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <ExternalLink
                  size={18}
                  className="text-[#159A62]"
                />

                <h3 className="font-semibold text-[#25312B]">
                  Analyzed URL
                </h3>

              </div>

              <button
                type="button"
                onClick={copyToClipboard}
                className="flex w-fit items-center justify-center gap-2 rounded-lg border border-[#D7E2DC] bg-white px-3 py-2 text-sm font-medium text-[#52605A] transition-all hover:border-[#BFD9CB] hover:bg-[#F7FAF8] hover:text-[#159A62]"
              >
                <Copy size={15} />
                Copy URL
              </button>

            </div>

            <div className="mt-4 break-all rounded-xl border border-[#E7EEEA] bg-[#F7FAF8] px-4 py-3">
              <p className="text-sm leading-6 text-[#405049]">
                {result.decoded_url || result.url}
              </p>
            </div>

          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">

          <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5">

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                  <Brain
                    size={18}
                    className="text-purple-600"
                  />
                </div>

                <span className="font-semibold text-[#29352F]">
                  AI Confidence
                </span>

              </div>

              <span className="font-bold text-purple-600">
                {confidence}%
              </span>

            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-purple-100">

              <div
                className="h-full rounded-full bg-purple-500 transition-all duration-700"
                style={{
                  width: `${confidence}%`,
                }}
              />

            </div>

            <p className="mt-3 text-xs leading-5 text-[#727B76]">
              Confidence of the machine learning model in this prediction.
            </p>

          </div>

          <div
            className={`rounded-2xl border border-[#E1EAE5] p-5 ${
              riskScore < 30
                ? "bg-emerald-50/60"
                : riskScore < 70
                ? "bg-amber-50/60"
                : "bg-red-50/60"
            }`}
          >

            <div className="mb-4 flex items-center justify-between">

              <div className="flex items-center gap-2">

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${getRiskBackground()}`}
                >
                  <Activity
                    size={18}
                    className={getRiskColor()}
                  />
                </div>

                <span className="font-semibold text-[#29352F]">
                  Risk Score
                </span>

              </div>

              <span className={`font-bold ${getRiskColor()}`}>
                {riskScore}%
              </span>

            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E5EBE7]">

              <div
                className={`h-full rounded-full transition-all duration-700 ${getRiskBarColor()}`}
                style={{
                  width: `${riskScore}%`,
                }}
              />

            </div>

            <p className="mt-3 text-xs leading-5 text-[#727B76]">
              Combined security risk calculated from the scan analysis.
            </p>

          </div>

        </div>

        <div className="rounded-2xl border border-[#E1EAE5] bg-[#F8FAF9] p-5">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wider text-[#7A8780]">
                Overall Risk Level
              </p>

              <h3 className="mt-1 text-lg font-bold text-[#17201C]">
                Security Assessment
              </h3>

            </div>

            <span
              className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${
                result.risk_level === "Low"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : result.risk_level === "Medium"
                  ? "border-amber-200 bg-amber-50 text-amber-700"
                  : "border-red-200 bg-red-50 text-red-700"
              }`}
            >
              {result.risk_level || "Unknown"} Risk
            </span>

          </div>

        </div>

        {result.reasons?.length > 0 && (
          <div>

            <div className="mb-4 flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <AlertTriangle
                  size={19}
                  className="text-amber-600"
                />
              </div>

              <div>

                <h3 className="text-lg font-bold text-[#17201C]">
                  Detection Reasons
                </h3>

                <p className="mt-0.5 text-sm text-[#718078]">
                  Factors identified during the security analysis.
                </p>

              </div>

            </div>

            <div className="space-y-2.5">

              {result.reasons.map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-[#E4EBE7] bg-white px-4 py-3.5"
                >

                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" />

                  <span className="text-sm leading-6 text-[#52605A]">
                    {reason}
                  </span>

                </div>
              ))}

            </div>

          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-[#E7EEEA] pt-6 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={onReset}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#159A62] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#108653] hover:shadow-md"
          >
            <RotateCcw size={17} />
            Scan Another URL
          </button>

        </div>

      </div>

    </div>
  );
}

export default ResultCard;