import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Copy,
  RotateCcw,
  Activity,
  Brain,
  ExternalLink,
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        result.decoded_url || result.url || ""
      );

      toast.success("Copied to clipboard");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy.");
    }
  };

  const getRiskColor = () => {
    if (riskScore < 30) {
      return "text-emerald-400";
    }

    if (riskScore < 70) {
      return "text-yellow-400";
    }

    return "text-red-400";
  };

  const getRiskBarColor = () => {
    if (riskScore < 30) {
      return "bg-emerald-500";
    }

    if (riskScore < 70) {
      return "bg-yellow-500";
    }

    return "bg-red-500";
  };

  const getStatusStyles = () => {
    if (isSafe) {
      return {
        container:
          "bg-emerald-500/10 border-emerald-500/30",
        icon:
          "bg-emerald-500/10 text-emerald-400",
        badge:
          "bg-emerald-500 text-slate-950",
      };
    }

    if (isSuspicious) {
      return {
        container:
          "bg-yellow-500/10 border-yellow-500/30",
        icon:
          "bg-yellow-500/10 text-yellow-400",
        badge:
          "bg-yellow-500 text-slate-950",
      };
    }

    return {
      container:
        "bg-red-500/10 border-red-500/30",
      icon:
        "bg-red-500/10 text-red-400",
      badge:
        "bg-red-500 text-white",
    };
  };

  const statusStyles = getStatusStyles();

  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

      {/* Result Header */}

      <div
        className={`p-6 md:p-8 border-b ${statusStyles.container}`}
      >

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

          <div className="flex items-center gap-4">

            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center ${statusStyles.icon}`}
            >

              {isSafe ? (
                <ShieldCheck size={32} />
              ) : (
                <ShieldAlert size={32} />
              )}

            </div>

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Scan Result
                </h2>

                <Activity
                  size={18}
                  className="text-gray-500"
                />

              </div>

              <p className="text-gray-400 mt-1">
                AI Security Analysis
              </p>

            </div>

          </div>

          <span
            className={`px-5 py-2.5 rounded-full font-bold text-sm w-fit ${statusStyles.badge}`}
          >
            {result.prediction}
          </span>

        </div>

      </div>

      {/* Content */}

      <div className="p-6 md:p-8 space-y-8">

        {/* URL */}

        {(result.url || result.decoded_url) && (

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

              <div className="flex items-center gap-2">

                <ExternalLink
                  size={18}
                  className="text-emerald-400"
                />

                <h3 className="font-semibold text-white">
                  Analyzed URL
                </h3>

              </div>

              <button
                type="button"
                onClick={copyToClipboard}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  text-sm
                  text-gray-300
                  bg-slate-800
                  hover:bg-slate-700
                  border
                  border-slate-700
                  px-3
                  py-2
                  rounded-lg
                  transition
                "
              >

                <Copy size={15} />

                Copy URL

              </button>

            </div>

            <p className="text-emerald-400 break-all mt-4 leading-7">
              {result.decoded_url || result.url}
            </p>

          </div>

        )}

        {/* Summary */}

        <div className="grid md:grid-cols-2 gap-5">

          {/* Confidence */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2">

                <Brain
                  size={18}
                  className="text-purple-400"
                />

                <span className="font-semibold">
                  AI Confidence
                </span>

              </div>

              <span className="font-bold text-purple-400">
                {confidence}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-700"
                style={{
                  width: `${confidence}%`,
                }}
              />

            </div>

            <p className="text-xs text-gray-500 mt-3">
              Model confidence in the predicted classification.
            </p>

          </div>

          {/* Risk */}

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

            <div className="flex items-center justify-between mb-3">

              <div className="flex items-center gap-2">

                <Activity
                  size={18}
                  className={getRiskColor()}
                />

                <span className="font-semibold">
                  Risk Score
                </span>

              </div>

              <span className={`font-bold ${getRiskColor()}`}>
                {riskScore}%
              </span>

            </div>

            <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

              <div
                className={`h-full rounded-full transition-all duration-700 ${getRiskBarColor()}`}
                style={{
                  width: `${riskScore}%`,
                }}
              />

            </div>

            <p className="text-xs text-gray-500 mt-3">
              Combined security risk based on the scan analysis.
            </p>

          </div>

        </div>

        {/* Risk Level */}

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            <div>

              <p className="text-gray-400 text-sm">
                Overall Risk Level
              </p>

              <h3 className="text-xl font-bold mt-1">
                Security Assessment
              </h3>

            </div>

            <span
              className={`px-5 py-2 rounded-full font-bold w-fit ${
                result.risk_level === "Low"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : result.risk_level === "Medium"
                  ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                  : "bg-red-500/15 text-red-400 border border-red-500/30"
              }`}
            >
              {result.risk_level || "Unknown"} Risk
            </span>

          </div>

        </div>

        {/* Reasons */}

        {result.reasons?.length > 0 && (

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
                  Factors identified during the security analysis.
                </p>

              </div>

            </div>

            <div className="space-y-3">

              {result.reasons.map((reason, index) => (

                <div
                  key={index}
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

                  <span className="mt-1 w-2 h-2 rounded-full bg-yellow-400 shrink-0" />

                  <span className="text-gray-300 leading-6">
                    {reason}
                  </span>

                </div>

              ))}

            </div>

          </div>

        )}

        {/* Action */}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">

          <button
            type="button"
            onClick={onReset}
            className="
              flex
              items-center
              justify-center
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
  );
}

export default ResultCard;