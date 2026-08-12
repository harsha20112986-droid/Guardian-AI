import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import { saveAs } from "file-saver";

import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  RefreshCw,
  Search,
  Download,
  BarChart3,
  TrendingUp,
  Clock3,
} from "lucide-react";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Analytics() {
  const [history, setHistory] = useState([]);

  const [stats, setStats] = useState({
    total_scans: 0,
    safe_urls: 0,
    threats: 0,
    average_risk: 0,
  });

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadAnalytics = async () => {
    setLoading(true);

    try {
      const [historyResponse, statsResponse] =
        await Promise.all([
          api.get("/history/"),
          api.get("/history/stats"),
        ]);

      setHistory(
        Array.isArray(historyResponse.data)
          ? historyResponse.data
          : []
      );

      setStats({
        total_scans:
          Number(
            statsResponse.data?.total_scans
          ) || 0,

        safe_urls:
          Number(
            statsResponse.data?.safe_urls
          ) || 0,

        threats:
          Number(
            statsResponse.data?.threats
          ) || 0,

        average_risk:
          Number(
            statsResponse.data?.average_risk
          ) || 0,
      });
    } catch (error) {
      console.error(
        "Analytics loading error:",
        error
      );

      setHistory([]);

      setStats({
        total_scans: 0,
        safe_urls: 0,
        threats: 0,
        average_risk: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return history;
    }

    return history.filter((item) => {
      const content = String(
        item?.content ||
          item?.url ||
          ""
      ).toLowerCase();

      const prediction = String(
        item?.prediction || ""
      ).toLowerCase();

      const scanType = String(
        item?.scan_type || ""
      ).toLowerCase();

      return (
        content.includes(query) ||
        prediction.includes(query) ||
        scanType.includes(query)
      );
    });
  }, [history, search]);

  const total = stats.total_scans;
  const safe = stats.safe_urls;
  const threats = stats.threats;

  const averageRisk = Number(
    stats.average_risk || 0
  ).toFixed(1);

  const low = history.filter(
    (item) => item?.risk_level === "Low"
  ).length;

  const medium = history.filter(
    (item) => item?.risk_level === "Medium"
  ).length;

  const high = history.filter(
    (item) => item?.risk_level === "High"
  ).length;

  const exportCSV = () => {
    if (history.length === 0) {
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
      "Scanned At",
    ];

    const escapeCSV = (value) => {
      const text = String(value ?? "");

      return `"${text.replace(/"/g, '""')}"`;
    };

    const rows = history.map((item) => [
      item?.scan_type || "URL",
      item?.content ||
        item?.url ||
        "",
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
        row
          .map(escapeCSV)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    saveAs(
      blob,
      "guardian_ai_report.csv"
    );
  };

  const pieData = {
    labels: [
      "Safe",
      "Threats",
    ],

    datasets: [
      {
        data: [
          safe,
          threats,
        ],

        backgroundColor: [
          "#16A34A",
          "#DC2626",
        ],

        borderColor: [
          "#FFFFFF",
          "#FFFFFF",
        ],

        borderWidth: 3,
      },
    ],
  };

  const barData = {
    labels: [
      "Low",
      "Medium",
      "High",
    ],

    datasets: [
      {
        label: "Scans",

        data: [
          low,
          medium,
          high,
        ],

        backgroundColor: [
          "#16A34A",
          "#D97706",
          "#DC2626",
        ],

        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        labels: {
          color: "#52605A",
          font: {
            size: 13,
          },
          usePointStyle: true,
          padding: 20,
        },
      },

      tooltip: {
        backgroundColor: "#17201C",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
        padding: 12,
        cornerRadius: 10,
      },
    },

    scales: {
      x: {
        ticks: {
          color: "#68766F",
        },

        grid: {
          color: "#E8EEEA",
        },
      },

      y: {
        beginAtZero: true,

        ticks: {
          color: "#68766F",
          precision: 0,
        },

        grid: {
          color: "#E8EEEA",
        },
      },
    },
  };

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
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (value === "suspicious") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-red-50 text-red-700 border-red-200";
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

      <div className="pointer-events-none absolute right-[-150px] top-20 h-[380px] w-[380px] rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 left-[-160px] h-[330px] w-[330px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Header */}

        <div className="mb-10 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>

            <div className="flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                <BarChart3
                  size={25}
                  className="text-emerald-600"
                />
              </div>

              <div>

                <h1 className="text-3xl font-bold tracking-tight text-[#17201C] md:text-4xl">
                  Analytics Dashboard
                </h1>

                <p className="mt-1 text-sm text-[#68766F] md:text-base">
                  Monitor your cybersecurity activity and scan results.
                </p>

              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={loadAnalytics}
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
              disabled={
                history.length === 0
              }
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
              Export CSV
            </button>

          </div>

        </div>

        {/* Statistics */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}

          <div className="rounded-2xl border border-[#DDE8E2] bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50">
              <Shield
                size={23}
                className="text-cyan-600"
              />
            </div>

            <p className="text-sm font-medium text-[#7A8780]">
              Total Scans
            </p>

            <h2 className="mt-2 text-4xl font-bold text-[#17201C]">
              {total}
            </h2>

            <p className="mt-2 text-xs text-[#8A9690]">
              All security checks
            </p>

          </div>

          {/* Safe */}

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <ShieldCheck
                size={23}
                className="text-emerald-600"
              />
            </div>

            <p className="text-sm font-medium text-[#7A8780]">
              Safe Scans
            </p>

            <h2 className="mt-2 text-4xl font-bold text-emerald-600">
              {safe}
            </h2>

            <p className="mt-2 text-xs text-[#8A9690]">
              Legitimate results
            </p>

          </div>

          {/* Threats */}

          <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <ShieldAlert
                size={23}
                className="text-red-600"
              />
            </div>

            <p className="text-sm font-medium text-[#7A8780]">
              Threats
            </p>

            <h2 className="mt-2 text-4xl font-bold text-red-600">
              {threats}
            </h2>

            <p className="mt-2 text-xs text-[#8A9690]">
              Potentially dangerous scans
            </p>

          </div>

          {/* Average Risk */}

          <div className="rounded-2xl border border-amber-100 bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <Activity
                size={23}
                className="text-amber-600"
              />
            </div>

            <p className="text-sm font-medium text-[#7A8780]">
              Average Risk
            </p>

            <h2 className="mt-2 text-4xl font-bold text-amber-600">
              {averageRisk}%
            </h2>

            <p className="mt-2 text-xs text-[#8A9690]">
              Across all scans
            </p>

          </div>

        </div>

        {/* Quick Summary */}

        <div className="mb-8 grid gap-5 lg:grid-cols-3">

          <div className="rounded-2xl border border-[#DDE8E2] bg-white p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <TrendingUp
                  size={19}
                  className="text-emerald-600"
                />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-[#8A9690]">
                  Safe Rate
                </p>

                <p className="text-xl font-bold text-[#25312B]">
                  {total > 0
                    ? Math.round(
                        (safe / total) * 100
                      )
                    : 0}
                  %
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-[#DDE8E2] bg-white p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                <ShieldAlert
                  size={19}
                  className="text-red-600"
                />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-[#8A9690]">
                  Threat Rate
                </p>

                <p className="text-xl font-bold text-[#25312B]">
                  {total > 0
                    ? Math.round(
                        (threats / total) * 100
                      )
                    : 0}
                  %
                </p>

              </div>

            </div>

          </div>

          <div className="rounded-2xl border border-[#DDE8E2] bg-white p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                <Clock3
                  size={19}
                  className="text-cyan-600"
                />
              </div>

              <div>

                <p className="text-xs uppercase tracking-wide text-[#8A9690]">
                  Activity
                </p>

                <p className="text-xl font-bold text-[#25312B]">
                  {history.length} scans
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Charts */}

        <div className="mb-8 grid gap-6 lg:grid-cols-2">

          {/* Safe vs Threats */}

          <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <div className="mb-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <ShieldCheck
                    size={20}
                    className="text-emerald-600"
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#25312B]">
                    Safe vs Threats
                  </h2>

                  <p className="text-sm text-[#8A9690]">
                    Overall prediction breakdown
                  </p>

                </div>

              </div>

            </div>

            <div className="mx-auto h-[300px] max-w-[380px]">
              <Pie
                data={pieData}
                options={chartOptions}
              />
            </div>

          </div>

          {/* Risk Distribution */}

          <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

            <div className="mb-6">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                  <Activity
                    size={20}
                    className="text-amber-600"
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#25312B]">
                    Risk Distribution
                  </h2>

                  <p className="text-sm text-[#8A9690]">
                    Low, medium and high risk scans
                  </p>

                </div>

              </div>

            </div>

            <div className="h-[300px]">
              <Bar
                data={barData}
                options={chartOptions}
              />
            </div>

          </div>

        </div>

        {/* Recent Activity */}

        <section className="overflow-hidden rounded-3xl border border-[#DDE8E2] bg-white shadow-[0_8px_25px_rgba(32,55,45,0.04)]">

          <div className="flex flex-col justify-between gap-5 border-b border-[#E7EEEA] p-6 lg:flex-row lg:items-center">

            <div>

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                  <Clock3
                    size={20}
                    className="text-cyan-600"
                  />
                </div>

                <div>

                  <h2 className="text-xl font-bold text-[#25312B]">
                    Recent Activity
                  </h2>

                  <p className="mt-1 text-sm text-[#8A9690]">
                    {filteredHistory.length} result
                    {filteredHistory.length !== 1
                      ? "s"
                      : ""}
                  </p>

                </div>

              </div>

            </div>

            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-3 text-[#9AA59F]"
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
                className="
                  w-full
                  rounded-xl
                  border
                  border-[#D7E2DC]
                  bg-[#F8FAF9]
                  py-3
                  pl-10
                  pr-4
                  text-sm
                  text-[#29352F]
                  outline-none
                  placeholder:text-[#9AA59F]
                  focus:border-[#159A62]
                  focus:bg-white
                  focus:ring-2
                  focus:ring-emerald-100
                  lg:w-80
                "
              />

            </div>

          </div>

          {loading ? (

            <div className="flex justify-center py-16">

              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />

            </div>

          ) : filteredHistory.length === 0 ? (

            <div className="py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F1F5F3]">
                <Search
                  size={24}
                  className="text-[#8A9690]"
                />
              </div>

              <p className="mt-4 font-medium text-[#52605A]">
                {search
                  ? "No matching scan history found."
                  : "No scan history found."}
              </p>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>

                  <tr className="border-b border-[#E7EEEA] bg-[#F8FAF9] text-left">

                    <th className="p-5 text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Type
                    </th>

                    <th className="p-5 text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Content
                    </th>

                    <th className="p-5 text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Prediction
                    </th>

                    <th className="p-5 text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Confidence
                    </th>

                    <th className="p-5 text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Risk
                    </th>

                    <th className="p-5 text-xs font-semibold uppercase tracking-wide text-[#7A8780]">
                      Date
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

                      return (
                        <tr
                          key={
                            item?.id ||
                            `${content}-${index}`
                          }
                          className="border-b border-[#EEF2EF] transition hover:bg-[#F8FAF9]"
                        >

                          <td className="p-5">

                            <span className="rounded-full border border-[#D7E2DC] bg-[#F7F9F8] px-3 py-1 text-xs font-semibold text-[#52605A]">
                              {item?.scan_type ||
                                "URL"}
                            </span>

                          </td>

                          <td className="max-w-md p-5">

                            <div className="break-all text-sm leading-6 text-[#34413A]">
                              {content}
                            </div>

                          </td>

                          <td className="p-5">

                            <span
                              className={`rounded-full border px-3 py-1 text-xs font-semibold ${getPredictionStyle(
                                prediction
                              )}`}
                            >
                              {prediction}
                            </span>

                          </td>

                          <td className="p-5 text-sm text-[#52605A]">
                            {item?.confidence ??
                              0}
                            %
                          </td>

                          <td className="p-5">

                            <div className="flex flex-col gap-2">

                              <span
                                className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getRiskStyle(
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

                          <td className="whitespace-nowrap p-5 text-sm text-[#68766F]">

                            {item?.scanned_at
                              ? new Date(
                                  item.scanned_at
                                ).toLocaleString()
                              : "Unknown"}

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

export default Analytics;