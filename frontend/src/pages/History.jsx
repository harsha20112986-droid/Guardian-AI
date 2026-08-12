import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Trash2,
  Download,
  RefreshCw,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock3,
  Filter,
} from "lucide-react";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

import api from "../api/api";

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

      toast.success(
        "History cleared successfully."
      );
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

    saveAs(
      blob,
      "guardian_history.csv"
    );

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
      return {
        badge:
          "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: ShieldCheck,
      };
    }

    if (value === "suspicious") {
      return {
        badge:
          "bg-amber-50 text-amber-700 border-amber-200",
        icon: ShieldAlert,
      };
    }

    return {
      badge:
        "bg-red-50 text-red-700 border-red-200",
      icon: ShieldAlert,
    };
  };

  const getRiskStyle = (risk) => {
    if (risk === "Low") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (risk === "Medium") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (risk === "High") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  return (
    <main className="relative min-h-full overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">

      <div className="pointer-events-none absolute right-[-150px] top-10 h-[380px] w-[380px] rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 left-[-170px] h-[330px] w-[330px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                <Shield
                  size={25}
                  className="text-emerald-600"
                />
              </div>

              <div>

                <h1 className="text-3xl font-bold tracking-tight text-[#17201C] md:text-4xl">
                  Scan History
                </h1>

                <p className="mt-1 text-sm text-[#68766F] md:text-base">
                  View, search and manage your previous security scans.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={loadHistory}
              disabled={loading}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-[#D7E2DC]
                bg-white
                px-5
                py-3
                font-medium
                text-[#52605A]
                transition-all
                hover:border-[#BFD9CB]
                hover:bg-[#F8FAF9]
                disabled:opacity-50
              "
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
              className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-[#159A62]
                px-5
                py-3
                font-semibold
                text-white
                transition-all
                hover:-translate-y-0.5
                hover:bg-[#108653]
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Download size={18} />
              Export
            </button>

            <button
              type="button"
              onClick={clearHistory}
              disabled={history.length === 0}
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-5
                py-3
                font-semibold
                text-red-600
                transition-all
                hover:bg-red-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Trash2 size={18} />
              Clear History
            </button>

          </div>

        </div>

        {/* Search and Filters */}

        <section className="mb-7 rounded-2xl border border-[#DDE8E2] bg-white p-5 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative flex-1">

              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA59F]"
              />

              <input
                type="text"
                placeholder="Search URLs, messages or scan types..."
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D7E2DC]
                  bg-[#F8FAF9]
                  py-3.5
                  pl-11
                  pr-4
                  text-sm
                  text-[#29352F]
                  outline-none
                  placeholder:text-[#9AA59F]
                  focus:border-[#159A62]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-emerald-100
                "
              />

            </div>

            <div className="flex items-center gap-2">

              <div className="hidden items-center gap-2 text-sm text-[#7A8780] sm:flex">
                <Filter size={17} />
                Filter:
              </div>

              <div className="flex rounded-xl border border-[#D7E2DC] bg-[#F8FAF9] p-1">

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
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                      filter === type
                        ? "bg-white text-[#159A62] shadow-sm"
                        : "text-[#68766F] hover:text-[#25312B]"
                    }`}
                  >
                    {type}
                  </button>
                ))}

              </div>

            </div>

          </div>

        </section>

        {/* Statistics */}

        <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-4">

          <div className="rounded-2xl border border-[#DDE8E2] bg-white p-5 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <p className="text-sm font-medium text-[#7A8780]">
              Total Scans
            </p>

            <p className="mt-2 text-3xl font-bold text-[#17201C]">
              {total}
            </p>

            <p className="mt-1 text-xs text-[#9AA59F]">
              All recorded scans
            </p>

          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <p className="text-sm font-medium text-[#7A8780]">
              Safe
            </p>

            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {safeCount}
            </p>

            <p className="mt-1 text-xs text-[#9AA59F]">
              Legitimate results
            </p>

          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <p className="text-sm font-medium text-[#7A8780]">
              Threats
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {threatCount}
            </p>

            <p className="mt-1 text-xs text-[#9AA59F]">
              Suspicious or harmful
            </p>

          </div>

          <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <p className="text-sm font-medium text-[#7A8780]">
              Average Risk
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {averageRisk}%
            </p>

            <p className="mt-1 text-xs text-[#9AA59F]">
              Across all scans
            </p>

          </div>

        </div>

        {/* History Table */}

        <section className="overflow-hidden rounded-3xl border border-[#DDE8E2] bg-white shadow-[0_8px_25px_rgba(32,55,45,0.05)]">

          <div className="flex flex-col justify-between gap-3 border-b border-[#E7EEEA] px-6 py-5 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Clock3
                  size={20}
                  className="text-emerald-600"
                />
              </div>

              <div>

                <h2 className="text-lg font-bold text-[#25312B]">
                  Scan Records
                </h2>

                <p className="text-sm text-[#8A9690]">
                  {filteredHistory.length} result
                  {filteredHistory.length !== 1
                    ? "s"
                    : ""}{" "}
                  shown
                </p>

              </div>

            </div>

            {(search || filter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setFilter("All");
                }}
                className="text-sm font-medium text-[#159A62] hover:text-[#108653]"
              >
                Clear filters
              </button>
            )}

          </div>

          {loading ? (

            <div className="flex flex-col items-center justify-center py-20">

              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />

              <p className="mt-4 text-sm text-[#7A8780]">
                Loading scan history...
              </p>

            </div>

          ) : filteredHistory.length === 0 ? (

            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F1F5F3]">
                <Shield
                  size={28}
                  className="text-[#8A9690]"
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-[#34413A]">
                {search ||
                filter !== "All"
                  ? "No matching scans"
                  : "No scan history yet"}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#8A9690]">
                {search ||
                filter !== "All"
                  ? "Try changing your search or filter to find other scan records."
                  : "Your completed URL, QR and SMS security checks will appear here."}
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                <thead>

                  <tr className="border-b border-[#E7EEEA] bg-[#F8FAF9]">

                    <th className="p-5 text-left text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Type
                    </th>

                    <th className="p-5 text-left text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Content
                    </th>

                    <th className="p-5 text-center text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Prediction
                    </th>

                    <th className="p-5 text-center text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Confidence
                    </th>

                    <th className="p-5 text-center text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Risk
                    </th>

                    <th className="p-5 text-center text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Date
                    </th>

                    <th className="p-5 text-center text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
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

                      const prediction =
                        item?.prediction ||
                        "Unknown";

                      const predictionStyle =
                        getPredictionStyle(
                          prediction
                        );

                      const PredictionIcon =
                        predictionStyle.icon;

                      return (
                        <tr
                          key={
                            item?.id ||
                            `${content}-${index}`
                          }
                          className="border-b border-[#EEF2EF] transition-colors hover:bg-[#FAFCFB]"
                        >

                          {/* Type */}

                          <td className="p-5">

                            <span className="inline-flex rounded-full border border-[#D7E2DC] bg-[#F5F8F6] px-3 py-1.5 text-xs font-semibold text-[#52605A]">
                              {item?.scan_type ||
                                "URL"}
                            </span>

                          </td>

                          {/* Content */}

                          <td className="max-w-md p-5">

                            <div className="break-all text-sm leading-6 text-[#34413A]">
                              {content}
                            </div>

                          </td>

                          {/* Prediction */}

                          <td className="p-5 text-center">

                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${predictionStyle.badge}`}
                            >
                              <PredictionIcon
                                size={14}
                              />

                              {prediction}
                            </span>

                          </td>

                          {/* Confidence */}

                          <td className="whitespace-nowrap p-5 text-center">

                            <span className="text-sm font-medium text-[#52605A]">
                              {Number(
                                item?.confidence ||
                                  0
                              ).toFixed(1)}
                              %
                            </span>

                          </td>

                          {/* Risk */}

                          <td className="p-5 text-center">

                            <div className="flex flex-col items-center gap-2">

                              <span
                                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${getRiskStyle(
                                  item?.risk_level
                                )}`}
                              >
                                {item?.risk_level ||
                                  "Unknown"}
                              </span>

                              <span className="text-xs text-[#8A9690]">
                                Score:{" "}
                                {Number(
                                  item?.final_score ||
                                    0
                                ).toFixed(1)}
                              </span>

                            </div>

                          </td>

                          {/* Date */}

                          <td className="whitespace-nowrap p-5 text-center text-sm text-[#68766F]">

                            {item?.scanned_at
                              ? new Date(
                                  item.scanned_at
                                ).toLocaleString()
                              : "Unknown"}

                          </td>

                          {/* Delete */}

                          <td className="p-5 text-center">

                            <button
                              type="button"
                              onClick={() =>
                                deleteHistoryItem(
                                  item?.id
                                )
                              }
                              className="
                                inline-flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                text-red-500
                                transition-all
                                hover:border-red-300
                                hover:bg-red-500
                                hover:text-white
                              "
                              title="Delete scan"
                            >
                              <Trash2
                                size={17}
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

        </section>

      </div>

    </main>
  );
}

export default History;