import { useState } from "react";
import api from "../api/api";
import HistoryControls from "./HistoryControls";

function RecentScans({ history }) {
  const [search, setSearch] = useState("");

  // Search Filter
  const filteredHistory = history.filter((item) =>
    item.url.toLowerCase().includes(search.toLowerCase())
  );

  // Delete One Scan
  const deleteHistoryItem = async (id) => {
    const confirmed = window.confirm(
      "Delete this scan from history?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/history/${id}`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to delete history.");
    }
  };

  // Clear All History
  const clearHistory = async () => {
    const confirmed = window.confirm(
      "Delete all scan history?"
    );

    if (!confirmed) return;

    try {
      await api.delete("/history");
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Failed to clear history.");
    }
  };

  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-6">
        Recent Scans
      </h2>

      <HistoryControls
        search={search}
        setSearch={setSearch}
        onClearHistory={clearHistory}
        total={filteredHistory.length}
      />

      {filteredHistory.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-6 text-center text-gray-400">
          No scans found.
        </div>
      ) : (
        <div className="space-y-5">

          {filteredHistory.map((item) => (

            <div
              key={item.id}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >

              <div className="flex justify-between items-start">

                <div className="w-4/5">

                  <p className="text-gray-400 text-sm">
                    URL
                  </p>

                  <p className="break-all font-medium mt-1">
                    {item.url}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full font-semibold ${
                    item.prediction === "Legitimate"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {item.prediction}
                </span>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-6">

                <div>
                  <p className="text-gray-400 text-sm">
                    Confidence
                  </p>

                  <p className="font-semibold">
                    {item.confidence}%
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Risk Level
                  </p>

                  <p
                    className={`font-semibold ${
                      item.risk_level === "Low"
                        ? "text-green-400"
                        : item.risk_level === "Medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {item.risk_level}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Risk Score
                  </p>

                  <p className="font-semibold">
                    {item.final_score}%
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Scanned At
                  </p>

                  <p className="font-semibold">
                    {new Date(item.scanned_at).toLocaleString()}
                  </p>
                </div>

              </div>

              <div className="mt-6 flex justify-end">

                <button
                  onClick={() => deleteHistoryItem(item.id)}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>
      )}

    </div>
  );
}

export default RecentScans;