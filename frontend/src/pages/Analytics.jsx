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
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return history;
    }

    return history.filter((item) => {
      const content = String(
        item?.content || item?.url || ""
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

  const total = history.length;

  const safe = history.filter((item) => {
    const prediction = String(
      item?.prediction || ""
    ).toLowerCase();

    return (
      prediction === "legitimate" ||
      prediction === "safe"
    );
  }).length;

  const threats = history.filter((item) => {
    const prediction = String(
      item?.prediction || ""
    ).toLowerCase();

    return (
      prediction === "phishing" ||
      prediction === "suspicious" ||
      prediction === "malicious"
    );
  }).length;

  const averageRisk =
    total === 0
      ? 0
      : (
          history.reduce(
            (sum, item) =>
              sum + Number(item?.final_score || 0),
            0
          ) / total
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
      item?.content || item?.url || "",
      item?.prediction || "",
      item?.confidence ?? "",
      item?.rule_score ?? "",
      item?.final_score ?? "",
      item?.risk_level || "",
      item?.scanned_at
        ? new Date(item.scanned_at).toLocaleString()
        : "",
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    saveAs(blob, "guardian_ai_report.csv");
  };

  const pieData = {
    labels: ["Safe", "Threats"],
    datasets: [
      {
        data: [safe, threats],
        backgroundColor: [
          "#22c55e",
          "#ef4444",
        ],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ["Low", "Medium", "High"],
    datasets: [
      {
        label: "Risk Level",
        data: [low, medium, high],
        backgroundColor: [
          "#22c55e",
          "#eab308",
          "#ef4444",
        ],
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "#334155",
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
          precision: 0,
        },
        grid: {
          color: "#334155",
        },
      },
    },
  };

  const getPredictionStyle = (prediction) => {
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

      <main className="px-6 py-10">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">

            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Analytics Dashboard
              </h1>

              <p className="text-gray-400 mt-2">
                Real-time cybersecurity insights and scan statistics.
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
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-5 py-3 rounded-xl font-bold transition disabled:opacity-50"
              >
                <Download size={18} />
                Export CSV
              </button>

            </div>

          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

              <Shield
                className="text-cyan-400 mb-4"
                size={38}
              />

              <p className="text-gray-400">
                Total Scans
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {total}
              </h2>

            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

              <ShieldCheck
                className="text-green-400 mb-4"
                size={38}
              />

              <p className="text-gray-400">
                Safe Scans
              </p>

              <h2 className="text-4xl font-bold text-green-400 mt-3">
                {safe}
              </h2>

            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

              <ShieldAlert
                className="text-red-400 mb-4"
                size={38}
              />

              <p className="text-gray-400">
                Threats
              </p>

              <h2 className="text-4xl font-bold text-red-400 mt-3">
                {threats}
              </h2>

            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

              <Activity
                className="text-yellow-400 mb-4"
                size={38}
              />

              <p className="text-gray-400">
                Average Risk
              </p>

              <h2 className="text-4xl font-bold text-yellow-400 mt-3">
                {averageRisk}%
              </h2>

            </div>

          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-10">

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

              <h2 className="text-2xl font-bold mb-6">
                Safe vs Threats
              </h2>

              <div className="max-w-md mx-auto">
                <Pie
                  data={pieData}
                  options={chartOptions}
                />
              </div>

            </div>

            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

              <h2 className="text-2xl font-bold mb-6">
                Risk Distribution
              </h2>

              <Bar
                data={barData}
                options={chartOptions}
              />

            </div>

          </div>

          <div className="bg-slate-900 rounded-2xl border border-slate-800">

            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 p-6 border-b border-slate-800">

              <div>
                <h2 className="text-2xl font-bold">
                  Recent Activity
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  {filteredHistory.length} result
                  {filteredHistory.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-3 top-3 text-gray-500"
                />

                <input
                  type="text"
                  placeholder="Search scans..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  className="w-full lg:w-80 pl-10 pr-4 py-3 bg-slate-800 rounded-xl border border-slate-700 text-white outline-none focus:border-emerald-500"
                />

              </div>

            </div>

            {loading ? (
              <div className="py-16 flex justify-center">

                <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />

              </div>
            ) : filteredHistory.length === 0 ? (
              <div className="py-16 text-center text-gray-400">

                {search
                  ? "No matching scan history found."
                  : "No scan history found."}

              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px]">

                  <thead>

                    <tr className="border-b border-slate-800 text-left">

                      <th className="p-5">
                        Type
                      </th>

                      <th className="p-5">
                        Content
                      </th>

                      <th className="p-5">
                        Prediction
                      </th>

                      <th className="p-5">
                        Confidence
                      </th>

                      <th className="p-5">
                        Risk
                      </th>

                      <th className="p-5">
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
                            className="border-b border-slate-800 hover:bg-slate-800 transition"
                          >

                            <td className="p-5">

                              <span className="px-3 py-1 rounded-full bg-slate-700 text-sm">
                                {item?.scan_type ||
                                  "URL"}
                              </span>

                            </td>

                            <td className="p-5 max-w-md">

                              <div className="break-all">
                                {content}
                              </div>

                            </td>

                            <td className="p-5">

                              <span
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${getPredictionStyle(
                                  prediction
                                )}`}
                              >
                                {prediction}
                              </span>

                            </td>

                            <td className="p-5">
                              {item?.confidence ??
                                0}
                              %
                            </td>

                            <td className="p-5">

                              <div className="flex flex-col gap-2">

                                <span
                                  className={`w-fit px-3 py-1 rounded-full text-sm ${getRiskStyle(
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

                            <td className="p-5 whitespace-nowrap">

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

          </div>

        </div>

      </main>

    </div>
  );
}

export default Analytics;