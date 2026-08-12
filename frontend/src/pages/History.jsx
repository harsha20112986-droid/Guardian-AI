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
  Globe,
  QrCode,
  MessageSquare,
  X,
} from "lucide-react";
import { saveAs } from "file-saver";
import { toast } from "react-toastify";

import api from "../api/api";

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  const [deleteTarget, setDeleteTarget] =
    useState(null);
  const [showClearModal, setShowClearModal] =
    useState(false);
  const [deleting, setDeleting] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
      setRefreshing(false);
    }
  };

  const deleteHistoryItem = async () => {
    if (!deleteTarget?.id) {
      return;
    }

    try {
      setDeleting(true);

      await api.delete(
        `/history/${deleteTarget.id}`
      );

      setHistory((currentHistory) =>
        currentHistory.filter(
          (item) =>
            item.id !== deleteTarget.id
        )
      );

      toast.success(
        "History item deleted successfully."
      );

      setDeleteTarget(null);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "History item could not be deleted."
      );
    } finally {
      setDeleting(false);
    }
  };

  const clearHistory = async () => {
    try {
      setClearing(true);

      await api.delete("/history/");

      setHistory([]);

      toast.success(
        "History cleared successfully."
      );

      setShowClearModal(false);
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to clear history."
      );
    } finally {
      setClearing(false);
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
      "Final Score",
      "Risk Level",
      "Reasons",
      "Date",
    ];

    const escapeCSV = (value) => {
      const text = String(value ?? "");

      return `"${text.replace(
        /"/g,
        '""'
      )}"`;
    };

    const rows = history.map((item) => [
      item?.scan_type || "URL",
      item?.content || "",
      item?.prediction || "",
      item?.confidence ?? "",
      item?.rule_score ?? "",
      item?.final_score ?? "",
      item?.risk_level || "",
      item?.reasons || "",
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
      `guardian-history-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );

    toast.success("History exported.");
  };

  const filteredHistory = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return history.filter((item) => {
      const content = String(
        item?.content || ""
      ).toLowerCase();

      const prediction = String(
        item?.prediction || ""
      ).toLowerCase();

      const scanType = String(
        item?.scan_type || "URL"
      ).toLowerCase();

      const riskLevel = String(
        item?.risk_level || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        content.includes(query) ||
        prediction.includes(query) ||
        scanType.includes(query) ||
        riskLevel.includes(query);

      let matchesResult = true;
      let matchesType = true;
      let matchesRisk = true;

      if (resultFilter !== "All") {
        if (resultFilter === "Safe") {
          matchesResult =
            prediction === "legitimate" ||
            prediction === "safe";
        }

        if (resultFilter === "Threat") {
          matchesResult =
            prediction === "phishing" ||
            prediction === "suspicious" ||
            prediction === "malicious";
        }
      }

      if (typeFilter !== "All") {
        matchesType =
          scanType ===
          typeFilter.toLowerCase();
      }

      if (riskFilter !== "All") {
        matchesRisk =
          riskLevel ===
          riskFilter.toLowerCase();
      }

      return (
        matchesSearch &&
        matchesResult &&
        matchesType &&
        matchesRisk
      );
    });
  }, [
    history,
    search,
    resultFilter,
    typeFilter,
    riskFilter,
  ]);

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

  const urlCount = history.filter(
    (item) =>
      String(
        item?.scan_type || "URL"
      ).toUpperCase() === "URL"
  ).length;

  const qrCount = history.filter(
    (item) =>
      String(
        item?.scan_type || ""
      ).toUpperCase() === "QR"
  ).length;

  const smsCount = history.filter(
    (item) =>
      String(
        item?.scan_type || ""
      ).toUpperCase() === "SMS"
  ).length;

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
    const value = String(
      risk || ""
    ).toLowerCase();

    if (value === "low") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (value === "medium") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (value === "high") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-slate-50 text-slate-600 border-slate-200";
  };

  const getScanIcon = (type) => {
    const value = String(
      type || "URL"
    ).toUpperCase();

    if (value === "QR") {
      return QrCode;
    }

    if (value === "SMS") {
      return MessageSquare;
    }

    return Globe;
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    resultFilter !== "All" ||
    typeFilter !== "All" ||
    riskFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setResultFilter("All");
    setTypeFilter("All");
    setRiskFilter("All");
  };

  return (
    <main className="relative min-h-full overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">
      <div className="pointer-events-none absolute right-[-150px] top-10 h-[380px] w-[380px] rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 left-[-170px] h-[330px] w-[330px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
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
              onClick={() =>
                loadHistory(true)
              }
              disabled={loading || refreshing}
              className="flex items-center gap-2 rounded-xl border border-[#D7E2DC] bg-white px-5 py-3 font-medium text-[#52605A] transition-all hover:border-[#BFD9CB] hover:bg-[#F8FAF9] disabled:opacity-50"
            >
              <RefreshCw
                size={18}
                className={
                  refreshing
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
              className="flex items-center gap-2 rounded-xl bg-[#159A62] px-5 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#108653] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={18} />
              Export
            </button>

            <button
              type="button"
              onClick={() =>
                setShowClearModal(true)
              }
              disabled={history.length === 0}
              className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-600 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={18} />
              Clear History
            </button>
          </div>
        </div>

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

        <section className="mb-7 rounded-2xl border border-[#DDE8E2] bg-white p-5 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA59F]"
                />

                <input
                  type="text"
                  placeholder="Search URLs, messages, predictions or risk..."
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#D7E2DC] bg-[#F8FAF9] py-3.5 pl-11 pr-4 text-sm text-[#29352F] outline-none placeholder:text-[#9AA59F] focus:border-[#159A62] focus:bg-white focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-[#7A8780]">
                <Filter size={17} />
                Filters
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#8A9690]">
                  Result
                </label>

                <select
                  value={resultFilter}
                  onChange={(event) =>
                    setResultFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#D7E2DC] bg-[#F8FAF9] px-4 py-3 text-sm font-medium text-[#52605A] outline-none focus:border-[#159A62] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="All">
                    All Results
                  </option>
                  <option value="Safe">
                    Safe
                  </option>
                  <option value="Threat">
                    Threat
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#8A9690]">
                  Scan Type
                </label>

                <select
                  value={typeFilter}
                  onChange={(event) =>
                    setTypeFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#D7E2DC] bg-[#F8FAF9] px-4 py-3 text-sm font-medium text-[#52605A] outline-none focus:border-[#159A62] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="All">
                    All Types
                  </option>
                  <option value="URL">
                    URL
                  </option>
                  <option value="QR">
                    QR
                  </option>
                  <option value="SMS">
                    SMS
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#8A9690]">
                  Risk Level
                </label>

                <select
                  value={riskFilter}
                  onChange={(event) =>
                    setRiskFilter(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#D7E2DC] bg-[#F8FAF9] px-4 py-3 text-sm font-medium text-[#52605A] outline-none focus:border-[#159A62] focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="All">
                    All Risk Levels
                  </option>
                  <option value="Low">
                    Low
                  </option>
                  <option value="Medium">
                    Medium
                  </option>
                  <option value="High">
                    High
                  </option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <div className="flex items-center justify-between rounded-xl bg-[#F1F7F4] px-4 py-3">
                <p className="text-sm text-[#68766F]">
                  Showing{" "}
                  <span className="font-bold text-[#159A62]">
                    {filteredHistory.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#25312B]">
                    {history.length}
                  </span>{" "}
                  scans
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex items-center gap-1.5 text-sm font-semibold text-[#159A62] hover:text-[#108653]"
                >
                  <X size={15} />
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="mb-7 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-[#DDE8E2] bg-white p-4">
            <div className="flex items-center gap-2">
              <Globe
                size={18}
                className="text-[#159A62]"
              />

              <span className="text-xs font-semibold text-[#7A8780]">
                URL
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-[#25312B]">
              {urlCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#DDE8E2] bg-white p-4">
            <div className="flex items-center gap-2">
              <QrCode
                size={18}
                className="text-[#397E96]"
              />

              <span className="text-xs font-semibold text-[#7A8780]">
                QR
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-[#25312B]">
              {qrCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#DDE8E2] bg-white p-4">
            <div className="flex items-center gap-2">
              <MessageSquare
                size={18}
                className="text-[#BD8224]"
              />

              <span className="text-xs font-semibold text-[#7A8780]">
                SMS
              </span>
            </div>

            <p className="mt-2 text-2xl font-bold text-[#25312B]">
              {smsCount}
            </p>
          </div>
        </div>

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
                {hasActiveFilters
                  ? "No matching scans"
                  : "No scan history yet"}
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-[#8A9690]">
                {hasActiveFilters
                  ? "Try changing your search or filters to find other scan records."
                  : "Your completed URL, QR and SMS security checks will appear here."}
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-[#159A62] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#108653]"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1150px]">
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

                      const ScanIcon =
                        getScanIcon(
                          item?.scan_type
                        );

                      return (
                        <tr
                          key={
                            item?.id ||
                            `${content}-${index}`
                          }
                          className="border-b border-[#EEF2EF] transition-colors hover:bg-[#FAFCFB]"
                        >
                          <td className="p-5">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF6F2]">
                                <ScanIcon
                                  size={17}
                                  className="text-[#159A62]"
                                />
                              </div>

                              <span className="text-xs font-bold text-[#52605A]">
                                {String(
                                  item?.scan_type ||
                                    "URL"
                                ).toUpperCase()}
                              </span>
                            </div>
                          </td>

                          <td className="max-w-md p-5">
                            <div
                              title={content}
                              className="max-w-[330px] break-all text-sm leading-6 text-[#34413A]"
                            >
                              {content}
                            </div>
                          </td>

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

                          <td className="whitespace-nowrap p-5 text-center">
                            <span className="text-sm font-semibold text-[#52605A]">
                              {Number(
                                item?.confidence ||
                                  0
                              ).toFixed(1)}
                              %
                            </span>
                          </td>

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

                          <td className="whitespace-nowrap p-5 text-center text-sm text-[#68766F]">
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
                                setDeleteTarget(
                                  item
                                )
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-all hover:border-red-300 hover:bg-red-500 hover:text-white"
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

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#829089]">
          <ShieldCheck
            size={14}
            className="text-[#159A62]"
          />

          Your scan history is private to your account.
        </div>
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17231D]/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <Trash2
                size={22}
                className="text-red-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#25312B]">
              Delete this scan?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#718078]">
              This scan will be permanently removed
              from your history.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteTarget(null)
                }
                disabled={deleting}
                className="flex-1 rounded-xl border border-[#D7E2DC] bg-white px-4 py-3 text-sm font-semibold text-[#52605A] hover:bg-[#F7F9F8] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={deleteHistoryItem}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {deleting
                  ? "Deleting..."
                  : "Delete Scan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#17231D]/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <Trash2
                size={22}
                className="text-red-500"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#25312B]">
              Clear all scan history?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#718078]">
              This will permanently delete all{" "}
              <span className="font-semibold text-[#25312B]">
                {history.length}
              </span>{" "}
              scans from your account. This action
              cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowClearModal(false)
                }
                disabled={clearing}
                className="flex-1 rounded-xl border border-[#D7E2DC] bg-white px-4 py-3 text-sm font-semibold text-[#52605A] hover:bg-[#F7F9F8] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={clearHistory}
                disabled={clearing}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {clearing
                  ? "Clearing..."
                  : "Clear History"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default History;