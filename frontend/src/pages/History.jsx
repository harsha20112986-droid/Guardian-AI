import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Download,
  RefreshCw,
  Shield,
} from "lucide-react";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

import api from "../api/api";
import Navbar from "../components/Navbar";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setLoading(true);

    try {
      const response = await api.get("/history");

      setHistory(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to load history."
      );

      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoryItem = async (id) => {
    if (!id) {
      toast.error("Invalid history item.");
      return;
    }

    const confirmed = window.confirm(
      "Delete this scan?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/history/${id}`);

      setHistory((currentHistory) =>
        currentHistory.filter(
          (item) => item.id !== id
        )
      );

      toast.success("History item deleted.");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "History item could not be deleted."
      );
    }
  };

  const clearHistory = async () => {
    if (history.length === 0) {
      toast.info("History is already empty.");
      return;
    }

    const confirmed = window.confirm(
      "Clear complete scan history?"
    );

    if (!confirmed) return;

    try {
      await api.delete("/history/");

      setHistory([]);

      toast.success("History cleared successfully.");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to clear history."
      );
    }
  };

  const exportCSV = () => {
    if (history.length === 0) {
      toast.warning("No history found.");
      return;
    }

    const headers = [
      "Scan Type",
      "Content",
      "Prediction",
      "Confidence",
      "Rule Score",
      "Risk Score",
      "Risk Level",
      "Date",
    ];

    const escapeCSV = (value) => {
      const text = String(value ?? "");

      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = history.map((item) => [
      item?.scan_type || "URL",
      item?.content || item?.url || "",
      item?.prediction || "",
      item?.confidence ?? "",
      item?.rule_score ?? "",
      item?.final_score ?? "",
      item?.risk_level || "",
      item?.scanned_at
        ? new Date(
            item.scanned_at
          ).toLocaleString()
        : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map(escapeCSV).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "guardian_history.csv");

    toast.success("History exported.");
  };

  const filteredHistory = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return history.filter((item) => {
      const content = String(
        item?.content ||
          item?.url ||
          ""
      ).toLowerCase();

      const prediction = String(
        item?.prediction ||
          ""
      ).toLowerCase();

      const scanType = String(
        item?.scan_type ||
          "URL"
      ).toLowerCase();

      const matchesSearch =
        !query ||
        content.includes(query) ||
        prediction.includes(query) ||
        scanType.includes(query);

      let matchesFilter = true;

      if (filter !== "All") {
        if (filter === "Safe") {
          matchesFilter =
            prediction === "legitimate" ||
            prediction === "safe";
        } else if (filter === "Threat") {
          matchesFilter =
            prediction === "phishing" ||
            prediction === "suspicious" ||
            prediction === "malicious";
        }
      }

      return (
        matchesSearch &&
        matchesFilter
      );
    });
  }, [history, search, filter]);

  const total = history.length;

  const safeCount = history.filter(
    (item) => {
      const prediction = String(
        item?.prediction || ""
      ).toLowerCase();

      return (
        prediction === "legitimate" ||
        prediction === "safe"
      );
    }
  ).length;

  const threatCount = history.filter(
    (item) => {
      const prediction = String(
        item?.prediction || ""
      ).toLowerCase();

      return (
        prediction === "phishing" ||
        prediction === "suspicious" ||
        prediction === "malicious"
      );
    }
  ).length;

  const averageRisk =
    total === 0
      ? 0
      : (
          history.reduce(
            (sum, item) =>
              sum +
              Number(
                item?.final_score || 0
              ),
            0
          ) / total
        ).toFixed(1);

  const getPredictionStyle = (
    prediction
  ) => {
    const value = String(
      prediction || ""
    ).toLowerCase();

    if (
      value === "legitimate" ||
      value === "safe"
    ) {
      return "bg-green-600";
    }

    if (value === "suspicious") {
      return "bg-yellow-500 text-slate-950";
    }

    return "bg-red-600";
  };

  const getRiskStyle = (risk) => {
    if (risk === "Low") {
      return "bg-green-600";
    }

    if (risk === "Medium") {
      return "bg-yellow-500 text-slate-950";
    }

    if (risk === "High") {
      return "bg-red-600";
    }

    return "bg-slate-600";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="px-6 py-10">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

            <div>

              <div className="flex items-center gap-3">

                <Shield
                  size={36}
                  className="text-emerald-400"
                />

                <h1 className="text-4xl md:text-5xl font-bold">
                  Scan History
                </h1>

              </div>

              <p className="text-gray-400 mt-3">
                View, search and manage all previous scans.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                onClick={loadHistory}
                disabled={loading}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl transition disabled:opacity-50"
              >
                <RefreshCw
                  size={18}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

              <button
                type="button"
                onClick={exportCSV}
                disabled={history.length === 0}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl transition disabled:opacity-50"
              >
                <Download size={18} />

                Export
              </button>

              <button
                type="button"
                onClick={clearHistory}
                disabled={history.length === 0}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl transition disabled:opacity-50"
              >
                <Trash2 size={18} />

                Clear History
              </button>

            </div>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6 mb-8 border border-slate-800">

            <div className="flex flex-col lg:flex-row gap-4 justify-between">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-3 top-3.5 text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Search scans..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-emerald-500 transition"
                />

              </div>

              <div className="flex gap-3">

                {[
                  "All",
                  "Safe",
                  "Threat",
                ].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setFilter(type)
                    }
                    className={`px-5 py-3 rounded-xl font-medium transition ${
                      filter === type
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-slate-800 hover:bg-slate-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}

              </div>

            </div>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">

              <p className="text-gray-400">
                Total
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {total}
              </h2>

            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">

              <p className="text-gray-400">
                Safe
              </p>

              <h2 className="text-4xl font-bold text-green-400 mt-3">
                {safeCount}
              </h2>

            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">

              <p className="text-gray-400">
                Threats
              </p>

              <h2 className="text-4xl font-bold text-red-400 mt-3">
                {threatCount}
              </h2>

            </div>

            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">

              <p className="text-gray-400">
                Average Risk
              </p>

              <h2 className="text-4xl font-bold text-yellow-400 mt-3">
                {averageRisk}%
              </h2>

            </div>

          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">

            {loading ? (
              <div className="py-16 flex justify-center">

                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />

              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="py-20 text-center text-gray-400">

                {search
                  ? "No matching scan history found."
                  : "No scan history found."}

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[1050px]">

                  <thead>

                    <tr className="bg-slate-800">

                      <th className="p-5 text-left">
                        Type
                      </th>

                      <th className="p-5 text-left">
                        Content
                      </th>

                      <th className="p-5 text-center">
                        Prediction
                      </th>

                      <th className="p-5 text-center">
                        Confidence
                      </th>

                      <th className="p-5 text-center">
                        Risk
                      </th>

                      <th className="p-5 text-center">
                        Date
                      </th>

                      <th className="p-5 text-center">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredHistory.map(
                      (item, index) => {

                        const content =
                          item?.content ||
                          item?.url ||
                          "Unknown";

                        return (
                          <tr
                            key={
                              item?.id ||
                              `${content}-${index}`
                            }
                            className="border-b border-slate-800 hover:bg-slate-800 transition"
                          >

                            <td className="p-5">

                              <span className="px-3 py-1 rounded-full bg-slate-700 text-sm font-medium">
                                {item?.scan_type ||
                                  "URL"}
                              </span>

                            </td>

                            <td className="p-5 max-w-md">

                              <div className="break-all text-gray-200">
                                {content}
                              </div>

                            </td>

                            <td className="p-5 text-center">

                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getPredictionStyle(
                                  item?.prediction
                                )}`}
                              >
                                {item?.prediction ||
                                  "Unknown"}
                              </span>

                            </td>

                            <td className="p-5 text-center whitespace-nowrap">

                              {Number(
                                item?.confidence || 0
                              ).toFixed(1)}
                              %

                            </td>

                            <td className="p-5 text-center">

                              <div className="flex flex-col items-center gap-2">

                                <span
                                  className={`px-3 py-1 rounded-full text-sm ${getRiskStyle(
                                    item?.risk_level
                                  )}`}
                                >
                                  {item?.risk_level ||
                                    "Unknown"}
                                </span>

                                <span className="text-xs text-gray-400">
                                  Score:{" "}
                                  {Number(
                                    item?.final_score ||
                                      0
                                  ).toFixed(1)}
                                </span>

                              </div>

                            </td>

                            <td className="p-5 text-center whitespace-nowrap text-gray-300">

                              {item?.scanned_at
                                ? new Date(
                                    item.scanned_at
                                  ).toLocaleString()
                                : "Unknown"}

                            </td>

                            <td className="p-5 text-center">

                              <button
                                type="button"
                                onClick={() =>
                                  deleteHistoryItem(
                                    item?.id
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 p-3 rounded-lg transition"
                                title="Delete scan"
                              >
                                <Trash2
                                  size={18}
                                />
                              </button>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default History;