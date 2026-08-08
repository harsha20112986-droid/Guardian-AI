import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Copy,
  RotateCcw,
} from "lucide-react";
import { toast } from "react-toastify";

function ResultCard({
  result,
  onReset,
}) {
  if (!result) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      result.decoded_url || result.url || ""
    );

    toast.success("Copied to clipboard");
  };

  return (
    <div className="mt-8 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl overflow-hidden">

      <div className="flex items-center justify-between p-6 border-b border-slate-700">

        <div className="flex items-center gap-4">

          {result.prediction === "Legitimate" ||
          result.prediction === "Safe" ? (
            <ShieldCheck
              className="text-green-400"
              size={42}
            />
          ) : (
            <ShieldAlert
              className="text-red-400"
              size={42}
            />
          )}

          <div>

            <h2 className="text-3xl font-bold text-white">
              Scan Result
            </h2>

            <p className="text-gray-400">
              AI Security Analysis
            </p>

          </div>

        </div>

        <span
          className={`px-5 py-2 rounded-full font-bold text-white ${
            result.prediction === "Legitimate" ||
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

      <div className="p-6 space-y-6">

        {(result.url || result.decoded_url) && (
          <div>

            <div className="flex justify-between items-center">

              <h3 className="font-semibold text-lg">
                URL
              </h3>

              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 text-sm bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg transition"
              >
                <Copy size={16} />
                Copy
              </button>

            </div>

            <p className="text-emerald-400 break-all mt-3">
              {result.decoded_url || result.url}
            </p>

          </div>
        )}

        <div>

          <div className="flex justify-between mb-2">

            <span className="font-semibold">
              Confidence
            </span>

            <span>
              {result.confidence}%
            </span>

          </div>

          <div className="w-full bg-slate-700 rounded-full h-3">

            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-700"
              style={{
                width: `${result.confidence}%`,
              }}
            />

          </div>

        </div>

        <div>

          <div className="flex justify-between mb-2">

            <span className="font-semibold">
              Risk Score
            </span>

            <span>
              {result.final_score ?? result.score}%
            </span>

          </div>

          <div className="w-full bg-slate-700 rounded-full h-3">

            <div
              className={`h-3 rounded-full transition-all duration-700 ${
                (result.final_score ?? result.score) < 30
                  ? "bg-green-500"
                  : (result.final_score ?? result.score) < 70
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{
                width: `${
                  result.final_score ?? result.score
                }%`,
              }}
            />

          </div>

        </div>

        <div className="flex items-center gap-4">

          <span className="font-semibold">
            Risk Level
          </span>

          <span
            className={`px-4 py-2 rounded-full font-semibold text-white ${
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

        {result.reasons?.length > 0 && (

          <div>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">

              <AlertTriangle
                className="text-yellow-400"
                size={24}
              />

              Detection Reasons

            </h3>

            <div className="space-y-3">

              {result.reasons.map((reason, index) => (

                <div
                  key={index}
                  className="bg-slate-700 rounded-lg px-4 py-3"
                >
                  {reason}
                </div>

              ))}

            </div>

          </div>

        )}

        <div className="flex justify-end">

          <button
            onClick={onReset}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl font-semibold transition"
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