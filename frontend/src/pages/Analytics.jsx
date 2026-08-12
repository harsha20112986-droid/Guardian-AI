import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  ShieldCheck,
  ShieldAlert,
  Search,
  Download,
  RefreshCw,
  Globe,
  QrCode,
  MessageSquare,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { saveAs } from "file-saver";

import api from "../api/api";

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
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const loadAnalytics = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

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
          statsResponse.data?.total_scans ?? 0,
        safe_urls:
          statsResponse.data?.safe_urls ?? 0,
        threats:
          statsResponse.data?.threats ?? 0,
        average_risk:
          statsResponse.data?.average_risk ?? 0,
      });
    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
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
        item?.content || ""
      ).toLowerCase();

      const prediction = String(
        item?.prediction || ""
      ).toLowerCase();

      const scanType = String(
        item?.scan_type || ""
      ).toLowerCase();

      const riskLevel = String(
        item?.risk_level || ""
      ).toLowerCase();

      return (
        content.includes(query) ||
        prediction.includes(query) ||
        scanType.includes(query) ||
        riskLevel.includes(query)
      );
    });
  }, [history, search]);

  const urlScans = history.filter(
    (item) =>
      String(
        item?.scan_type || ""
      ).toUpperCase() === "URL"
  ).length;

  const qrScans = history.filter(
    (item) =>
      String(
        item?.scan_type || ""
      ).toUpperCase() === "QR"
  ).length;

  const smsScans = history.filter(
    (item) =>
      String(
        item?.scan_type || ""
      ).toUpperCase() === "SMS"
  ).length;

  const lowRisk = history.filter(
    (item) =>
      String(
        item?.risk_level || ""
      ).toLowerCase() === "low"
  ).length;

  const mediumRisk = history.filter(
    (item) =>
      String(
        item?.risk_level || ""
      ).toLowerCase() === "medium"
  ).length;

  const highRisk = history.filter(
    (item) =>
      String(
        item?.risk_level || ""
      ).toLowerCase() === "high"
  ).length;

  const safePercentage =
    stats.total_scans > 0
      ? Math.round(
          (stats.safe_urls /
            stats.total_scans) *
            100
        )
      : 0;

  const threatPercentage =
    stats.total_scans > 0
      ? Math.round(
          (stats.threats /
            stats.total_scans) *
            100
        )
      : 0;

  const getRiskLabel = () => {
    const risk = Number(
      stats.average_risk || 0
    );

    if (stats.total_scans === 0) {
      return "No scan data";
    }

    if (risk < 30) {
      return "Low overall risk";
    }

    if (risk < 70) {
      return "Moderate overall risk";
    }

    return "High overall risk";
  };

  const pieData = {
    labels: ["Safe", "Threats"],
    datasets: [
      {
        data: [
          stats.safe_urls,
          stats.threats,
        ],
        backgroundColor: [
          "#159A62",
          "#D85B55",
        ],
        borderWidth: 0,
      },
    ],
  };

  const riskData = {
    labels: [
      "Low Risk",
      "Medium Risk",
      "High Risk",
    ],
    datasets: [
      {
        label: "Scans",
        data: [
          lowRisk,
          mediumRisk,
          highRisk,
        ],
        backgroundColor: [
          "#159A62",
          "#BD8224",
          "#D85B55",
        ],
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const scanTypeData = {
    labels: ["URL", "QR", "SMS"],
    datasets: [
      {
        label: "Scans",
        data: [
          urlScans,
          qrScans,
          smsScans,
        ],
        backgroundColor: [
          "#159A62",
          "#397E96",
          "#BD8224",
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
          color: "#526158",
          font: {
            size: 12,
          },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#17231D",
        titleColor: "#FFFFFF",
        bodyColor: "#DDE8E2",
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#7A8981",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          color: "#7A8981",
        },
        grid: {
          color: "#E7EEEA",
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#526158",
          padding: 18,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: "#17231D",
        titleColor: "#FFFFFF",
        bodyColor: "#DDE8E2",
        padding: 12,
        cornerRadius: 10,
      },
    },
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "—";
    }

    return parsedDate.toLocaleString();
  };

  const getRiskClass = (risk) => {
    const value = String(
      risk || ""
    ).toLowerCase();

    if (value === "high") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    if (value === "medium") {
      return "bg-amber-50 text-amber-700 border-amber-100";
    }

    if (value === "low") {
      return "bg-emerald-50 text-emerald-700 border-emerald-100";
    }

    return "bg-slate-50 text-slate-600 border-slate-100";
  };

  const getPredictionClass = (
    prediction
  ) => {
    const value = String(
      prediction || ""
    ).toLowerCase();

    if (value === "phishing") {
      return "bg-red-50 text-red-600 border-red-100";
    }

    return "bg-emerald-50 text-emerald-700 border-emerald-100";
  };

  const getScanIcon = (type) => {
    const value = String(
      type || ""
    ).toUpperCase();

    if (value === "QR") {
      return QrCode;
    }

    if (value === "SMS") {
      return MessageSquare;
    }

    return Globe;
  };

  const exportCSV = () => {
    if (history.length === 0) {
      return;
    }

    const headers = [
      "ID",
      "Scan Type",
      "Content",
      "Prediction",
      "Confidence",
      "Rule Score",
      "Final Score",
      "Risk Level",
      "Scanned At",
    ];

    const rows = history.map(
      (item) => [
        item?.id ?? "",
        item?.scan_type ?? "",
        item?.content ?? "",
        item?.prediction ?? "",
        item?.confidence ?? "",
        item?.rule_score ?? "",
        item?.final_score ?? "",
        item?.risk_level ?? "",
        item?.scanned_at ?? "",
      ]
    );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => {
            const stringValue = String(
              value ?? ""
            );

            return `"${stringValue.replace(
              /"/g,
              '""'
            )}"`;
          })
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
      `guardian-ai-analytics-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );
  };

  const statCards = [
    {
      title: "Total Scans",
      value: stats.total_scans,
      description:
        "Security checks performed",
      icon: Activity,
      iconClass:
        "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Safe Content",
      value: stats.safe_urls,
      description: `${safePercentage}% of all scans`,
      icon: ShieldCheck,
      iconClass:
        "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Threats Detected",
      value: stats.threats,
      description: `${threatPercentage}% of all scans`,
      icon: ShieldAlert,
      iconClass:
        "bg-red-50 text-red-500",
    },
    {
      title: "Average Risk",
      value: `${stats.average_risk}%`,
      description: getRiskLabel(),
      icon: TrendingUp,
      iconClass:
        "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <main className="min-h-screen bg-[#F4F8F6] px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
                <BarChart3
                  size={18}
                  className="text-[#159A62]"
                />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.12em] text-[#61736A]">
                Security Analytics
              </span>
            </div>

            <h1 className="text-3xl font-bold tracking-[-0.03em] text-[#17231D] md:text-4xl">
              Security Analytics
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718078] md:text-base">
              Understand your scanning activity,
              detected threats and overall security
              posture.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                loadAnalytics(true)
              }
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D4E1DB] bg-white px-4 py-3 text-sm font-semibold text-[#526158] transition hover:border-[#B8D2C4] hover:text-[#159A62] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
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
              disabled={
                loading ||
                history.length === 0
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#159A62] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#108653] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download size={17} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="rounded-2xl border border-[#DCE6E1] bg-white p-5 shadow-[0_6px_22px_rgba(29,48,39,0.05)]"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconClass}`}
                  >
                    <Icon size={21} />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#8A9891]">
                    Live
                  </span>
                </div>

                <p className="mt-5 text-sm font-medium text-[#687870]">
                  {card.title}
                </p>

                <h2 className="mt-1 text-3xl font-bold tracking-[-0.02em] text-[#1D3027]">
                  {loading
                    ? "—"
                    : card.value}
                </h2>

                <p className="mt-2 text-xs text-[#8A9891]">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#25312B]">
                Safe vs Threats
              </h2>

              <p className="mt-1 text-sm text-[#8A9690]">
                Overall scan outcome distribution
              </p>
            </div>

            <div className="h-[300px]">
              {stats.total_scans > 0 ? (
                <Pie
                  data={pieData}
                  options={pieOptions}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShieldCheck
                    size={40}
                    className="text-[#B6C5BE]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#687870]">
                    No scan data yet
                  </p>

                  <p className="mt-1 text-xs text-[#9AA59F]">
                    Start scanning to see analytics.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#25312B]">
                Risk Distribution
              </h2>

              <p className="mt-1 text-sm text-[#8A9690]">
                Number of scans by risk level
              </p>
            </div>

            <div className="h-[300px]">
              {history.length > 0 ? (
                <Bar
                  data={riskData}
                  options={chartOptions}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <AlertTriangle
                    size={40}
                    className="text-[#B6C5BE]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#687870]">
                    No risk data yet
                  </p>

                  <p className="mt-1 text-xs text-[#9AA59F]">
                    Risk analytics will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_8px_25px_rgba(32,55,45,0.04)]">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-[#25312B]">
                Scan Type Distribution
              </h2>

              <p className="mt-1 text-sm text-[#8A9690]">
                URL, QR and SMS scanning activity
              </p>
            </div>

            <div className="h-[300px]">
              {history.length > 0 ? (
                <Bar
                  data={scanTypeData}
                  options={chartOptions}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <Globe
                    size={40}
                    className="text-[#B6C5BE]"
                  />

                  <p className="mt-3 text-sm font-semibold text-[#687870]">
                    No scan activity yet
                  </p>

                  <p className="mt-1 text-xs text-[#9AA59F]">
                    Your scan types will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-[#DDE8E2] bg-white p-5 shadow-[0_8px_25px_rgba(32,55,45,0.04)] md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#25312B]">
                Scan Activity
              </h2>

              <p className="mt-1 text-sm text-[#8A9690]">
                Search through your previous security
                scans.
              </p>
            </div>

            <div className="relative w-full lg:w-80">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9AA59F]"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search scans..."
                className="w-full rounded-xl border border-[#D7E2DC] bg-[#F8FAF9] py-3 pl-10 pr-4 text-sm text-[#25312B] outline-none placeholder:text-[#9AA59F] focus:border-[#159A62] focus:bg-white focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-[#E6ECE9]">
                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#8A9690]">
                    Type
                  </th>

                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#8A9690]">
                    Content
                  </th>

                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#8A9690]">
                    Prediction
                  </th>

                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#8A9690]">
                    Risk
                  </th>

                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#8A9690]">
                    Score
                  </th>

                  <th className="px-4 py-3 text-xs font-bold uppercase tracking-wide text-[#8A9690]">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex items-center justify-center gap-2 text-sm text-[#7A8981]">
                        <RefreshCw
                          size={17}
                          className="animate-spin"
                        />
                        Loading scan activity...
                      </div>
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-12 text-center"
                    >
                      <div className="flex flex-col items-center">
                        <Activity
                          size={38}
                          className="text-[#B6C5BE]"
                        />

                        <p className="mt-3 text-sm font-semibold text-[#687870]">
                          {search
                            ? "No matching scans found."
                            : "No scans yet."}
                        </p>

                        <p className="mt-1 text-xs text-[#9AA59F]">
                          {search
                            ? "Try a different search term."
                            : "Start using a Guardian AI scanner to build your history."}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredHistory
                    .slice(0, 50)
                    .map((item) => {
                      const ScanIcon =
                        getScanIcon(
                          item?.scan_type
                        );

                      return (
                        <tr
                          key={item.id}
                          className="border-b border-[#EEF2F0] last:border-0 hover:bg-[#FAFCFB] transition"
                        >
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF6F2]">
                                <ScanIcon
                                  size={17}
                                  className="text-[#159A62]"
                                />
                              </div>

                              <span className="text-sm font-semibold text-[#425149]">
                                {String(
                                  item?.scan_type ||
                                    "URL"
                                ).toUpperCase()}
                              </span>
                            </div>
                          </td>

                          <td className="max-w-[300px] px-4 py-4">
                            <p
                              title={
                                item?.content ||
                                ""
                              }
                              className="truncate text-sm text-[#526158]"
                            >
                              {item?.content ||
                                "—"}
                            </p>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getPredictionClass(
                                item?.prediction
                              )}`}
                            >
                              {item?.prediction ||
                                "Unknown"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${getRiskClass(
                                item?.risk_level
                              )}`}
                            >
                              {item?.risk_level ||
                                "Unknown"}
                            </span>
                          </td>

                          <td className="px-4 py-4">
                            <span className="text-sm font-semibold text-[#425149]">
                              {item?.final_score ??
                                0}
                            </span>
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-sm text-[#748078]">
                            {formatDate(
                              item?.scanned_at
                            )}
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>

          {filteredHistory.length > 50 && (
            <p className="mt-4 text-center text-xs text-[#8A9690]">
              Showing the latest 50 matching scans.
            </p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#829089]">
          <ShieldCheck
            size={14}
            className="text-[#159A62]"
          />

          Analytics are based on your Guardian AI
          scan history.
        </div>
      </div>
    </main>
  );
}

export default Analytics;