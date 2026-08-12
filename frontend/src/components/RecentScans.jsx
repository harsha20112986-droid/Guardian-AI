import {
  Clock,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  ExternalLink,
} from "lucide-react";

import { toast } from "react-toastify";
import api from "../api/api";

function RecentScans({
  history = [],
  onHistoryChange,
}) {
  const safeHistory = Array.isArray(history)
    ? history
    : [];

  const deleteScan = async (id) => {
    if (!id) return;

    const confirmed = window.confirm(
      "Delete this scan from history?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/history/${id}`);

      toast.success(
        "Scan deleted successfully."
      );

      if (onHistoryChange) {
        onHistoryChange();
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to delete scan."
      );
    }
  };

  /* Empty State */

  if (safeHistory.length === 0) {
    return (
      <section className="rounded-2xl border border-[#DDE8E2] bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.05)]">

        <div className="flex items-center gap-3 mb-6">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
            <Clock
              size={20}
              className="text-emerald-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#17201C]">
              Recent Scans
            </h2>

            <p className="text-sm text-[#7B8781] mt-0.5">
              Your latest security checks
            </p>
          </div>

        </div>

        <div className="rounded-xl border border-dashed border-[#DDE8E2] bg-[#F8FAF9] py-12 text-center">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
            <ShieldCheck
              size={22}
              className="text-emerald-600"
            />
          </div>

          <p className="mt-4 font-medium text-[#52605A]">
            No scans found.
          </p>

          <p className="mt-1 text-sm text-[#8A9690]">
            Your recent security checks will appear here.
          </p>

        </div>

      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-[#DDE8E2] bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.05)]">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-100">
            <Clock
              size={20}
              className="text-emerald-600"
            />
          </div>

          <div>

            <h2 className="text-xl md:text-2xl font-bold text-[#17201C]">
              Recent Scans
            </h2>

            <p className="text-sm text-[#7B8781] mt-0.5">
              Your latest URL security checks
            </p>

          </div>

        </div>

        <span className="sm:ml-auto w-fit rounded-full border border-[#DDE8E2] bg-[#F7FAF8] px-3 py-1.5 text-xs font-semibold text-[#68766F]">
          {safeHistory.length}{" "}
          {safeHistory.length === 1
            ? "Result"
            : "Results"}
        </span>

      </div>

      {/* Scan List */}

      <div className="space-y-3">

        {safeHistory.slice(0, 10).map(
          (item, index) => {

            const prediction =
              item?.prediction || "Unknown";

            const content =
              item?.content ||
              item?.url ||
              "Unknown content";

            const riskLevel =
              item?.risk_level || "Unknown";

            const confidence =
              item?.confidence ?? 0;

            const finalScore =
              item?.final_score ??
              item?.score ??
              0;

            const normalizedPrediction =
              String(prediction).toLowerCase();

            const isSafe =
              normalizedPrediction ===
                "legitimate" ||
              normalizedPrediction === "safe";

            const isSuspicious =
              normalizedPrediction ===
              "suspicious";

            const predictionStyle = isSafe
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : isSuspicious
              ? "bg-amber-50 text-amber-700 border-amber-200"
              : "bg-red-50 text-red-700 border-red-200";

            const riskStyle =
              riskLevel === "High"
                ? "bg-red-50 text-red-700 border-red-200"
                : riskLevel === "Medium"
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : riskLevel === "Low"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-gray-50 text-gray-600 border-gray-200";

            return (
              <div
                key={item?.id || index}
                className="
                  group
                  rounded-xl
                  border
                  border-[#E1EAE5]
                  bg-[#FBFCFB]
                  p-4
                  transition-all
                  duration-200
                  hover:border-[#BFD9CB]
                  hover:bg-white
                  hover:shadow-sm
                "
              >

                <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                  {/* URL / Content */}

                  <div className="flex min-w-0 flex-1 items-start gap-3">

                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isSafe
                          ? "bg-emerald-50"
                          : isSuspicious
                          ? "bg-amber-50"
                          : "bg-red-50"
                      }`}
                    >
                      {isSafe ? (
                        <ShieldCheck
                          size={20}
                          className="text-emerald-600"
                        />
                      ) : (
                        <ShieldAlert
                          size={20}
                          className={
                            isSuspicious
                              ? "text-amber-600"
                              : "text-red-600"
                          }
                        />
                      )}
                    </div>

                    <div className="min-w-0">

                      <div className="flex items-center gap-2">

                        <ExternalLink
                          size={14}
                          className="shrink-0 text-[#9AA59F]"
                        />

                        <p className="break-all text-sm font-semibold text-[#29352F]">
                          {content}
                        </p>

                      </div>

                      <p className="mt-1.5 text-xs text-[#8A9690]">
                        {item?.scanned_at
                          ? new Date(
                              item.scanned_at
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>

                    </div>

                  </div>

                  {/* Information */}

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">

                    {/* Prediction */}

                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${predictionStyle}`}
                    >
                      {prediction}
                    </span>

                    {/* Risk */}

                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${riskStyle}`}
                    >
                      {riskLevel} Risk
                    </span>

                    {/* Confidence */}

                    <span className="rounded-lg bg-[#F4F7F5] px-3 py-1.5 text-xs font-medium text-[#68766F]">
                      {confidence}% confidence
                    </span>

                    {/* Score */}

                    <span className="rounded-lg bg-[#F4F7F5] px-3 py-1.5 text-xs font-medium text-[#68766F]">
                      Risk: {finalScore}%
                    </span>

                    {/* Delete */}

                    {item?.id && (
                      <button
                        type="button"
                        onClick={() =>
                          deleteScan(item.id)
                        }
                        className="
                          flex
                          h-9
                          w-9
                          items-center
                          justify-center
                          rounded-lg
                          border
                          border-red-100
                          bg-red-50
                          text-red-500
                          transition-all
                          hover:border-red-200
                          hover:bg-red-500
                          hover:text-white
                        "
                        title="Delete scan"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          }
        )}

      </div>

    </section>
  );
}

export default RecentScans;