import { Clock, ShieldCheck, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/api";

function RecentScans({ history = [], onHistoryChange }) {
  const safeHistory = Array.isArray(history) ? history : [];

  const deleteScan = async (id) => {
    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      "Delete this scan from history?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/history/${id}`);

      toast.success("Scan deleted successfully.");

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

  if (safeHistory.length === 0) {
    return (
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <Clock
            size={24}
            className="text-emerald-400"
          />

          <h2 className="text-2xl font-bold text-white">
            Recent Scans
          </h2>
        </div>

        <div className="text-center py-10 text-gray-400">
          No scans found.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">

      <div className="flex items-center gap-3 mb-6">
        <Clock
          size={24}
          className="text-emerald-400"
        />

        <h2 className="text-2xl font-bold text-white">
          Recent Scans
        </h2>

        <span className="ml-auto text-sm text-gray-400">
          {safeHistory.length} Results
        </span>
      </div>

      <div className="space-y-4">

        {safeHistory.slice(0, 10).map((item, index) => {
          const prediction = item?.prediction || "Unknown";
          const content = item?.content || item?.url || "Unknown content";
          const riskLevel = item?.risk_level || "Unknown";
          const confidence = item?.confidence ?? 0;
          const finalScore = item?.final_score ?? 0;

          const normalizedPrediction = String(
            prediction
          ).toLowerCase();

          const isSafe =
            normalizedPrediction === "legitimate" ||
            normalizedPrediction === "safe";

          return (
            <div
              key={item?.id || index}
              className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition"
            >

              <div className="flex flex-col lg:flex-row lg:items-center gap-5">

                <div className="flex-1 min-w-0">

                  <div className="flex items-start gap-3">

                    {isSafe ? (
                      <ShieldCheck
                        size={24}
                        className="text-green-400 flex-shrink-0 mt-1"
                      />
                    ) : (
                      <ShieldAlert
                        size={24}
                        className="text-red-400 flex-shrink-0 mt-1"
                      />
                    )}

                    <div className="min-w-0">

                      <p className="text-white font-medium break-all">
                        {content}
                      </p>

                      <p className="text-gray-500 text-sm mt-2">
                        {item?.scanned_at
                          ? new Date(
                              item.scanned_at
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>

                    </div>

                  </div>

                </div>

                <div className="flex flex-wrap items-center gap-3">

                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      isSafe
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {prediction}
                  </span>

                  <span
                    className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                      riskLevel === "High"
                        ? "bg-red-500/15 text-red-400"
                        : riskLevel === "Medium"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : riskLevel === "Low"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-slate-700 text-gray-300"
                    }`}
                  >
                    {riskLevel}
                  </span>

                  <span className="text-sm text-gray-400">
                    {confidence}% confidence
                  </span>

                  <span className="text-sm text-gray-400">
                    Risk: {finalScore}
                  </span>

                  {item?.id && (
                    <button
                      type="button"
                      onClick={() => deleteScan(item.id)}
                      className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                      title="Delete scan"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default RecentScans;