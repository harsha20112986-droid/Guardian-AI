import { useEffect, useState } from "react";
import api from "../api/api";

import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";
import { saveAs } from "file-saver";
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

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await api.get("/history");
      setHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const total = history.length;
  const exportCSV = () => {
  if (history.length === 0) {
    alert("No history available.");
    return;
  }

  const headers = [
    "URL",
    "Prediction",
    "Confidence",
    "Risk Score",
    "Risk Level",
    "Scanned At",
  ];

  const rows = history.map((item) => [
    item.url,
    item.prediction,
    item.confidence,
    item.final_score,
    item.risk_level,
    new Date(item.scanned_at).toLocaleString(),
  ]);

  const csv =
    [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");

  const blob = new Blob([csv], {
    type: "text/csv;charset=utf-8;",
  });

  saveAs(blob, "guardian_ai_report.csv");
};
  const safe = history.filter(
    (item) => item.prediction === "Legitimate"
  ).length;

  const phishing = history.filter(
    (item) => item.prediction === "Phishing"
  ).length;

  const avgRisk =
    total === 0
      ? 0
      : (
          history.reduce(
            (sum, item) => sum + item.final_score,
            0
          ) / total
        ).toFixed(1);

  const low = history.filter(
    (item) => item.risk_level === "Low"
  ).length;

  const medium = history.filter(
    (item) => item.risk_level === "Medium"
  ).length;

  const high = history.filter(
    (item) => item.risk_level === "High"
  ).length;

  const pieData = {
    labels: ["Safe", "Phishing"],
    datasets: [
      {
        data: [safe, phishing],
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
        label: "Risk Levels",
        data: [low, medium, high],
        backgroundColor: [
          "#22c55e",
          "#eab308",
          "#ef4444",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
          font: {
            size: 13,
          },
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
        ticks: {
          color: "white",
        },
        grid: {
          color: "#334155",
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">

      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-8">

  <h1 className="text-4xl font-bold">
    Analytics Dashboard
  </h1>

  <button
    onClick={exportCSV}
    className="bg-emerald-500 hover:bg-emerald-600 px-5 py-3 rounded-lg font-semibold transition"
  >
    📄 Export CSV
  </button>

</div>

        {/* Statistics */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

          <div className="bg-slate-900 rounded-xl p-6 flex justify-between items-center shadow-lg hover:scale-105 transition">

            <div>
              <p className="text-gray-400">
                Total Scans
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {total}
              </h2>
            </div>

            <Shield
              size={42}
              className="text-cyan-400"
            />

          </div>

          <div className="bg-slate-900 rounded-xl p-6 flex justify-between items-center shadow-lg hover:scale-105 transition">

            <div>
              <p className="text-gray-400">
                Safe URLs
              </p>

              <h2 className="text-4xl font-bold text-green-400 mt-2">
                {safe}
              </h2>
            </div>

            <ShieldCheck
              size={42}
              className="text-green-400"
            />

          </div>

          <div className="bg-slate-900 rounded-xl p-6 flex justify-between items-center shadow-lg hover:scale-105 transition">

            <div>
              <p className="text-gray-400">
                Phishing
              </p>

              <h2 className="text-4xl font-bold text-red-400 mt-2">
                {phishing}
              </h2>
            </div>

            <ShieldAlert
              size={42}
              className="text-red-400"
            />

          </div>

          <div className="bg-slate-900 rounded-xl p-6 flex justify-between items-center shadow-lg hover:scale-105 transition">

            <div>
              <p className="text-gray-400">
                Average Risk
              </p>

              <h2 className="text-4xl font-bold text-yellow-400 mt-2">
                {avgRisk}%
              </h2>
            </div>

            <Activity
              size={42}
              className="text-yellow-400"
            />

          </div>

        </div>

        {/* Charts */}

        <div className="grid md:grid-cols-2 gap-8">

          <div className="bg-slate-900 rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Safe vs Phishing
            </h2>

            <Pie
              data={pieData}
              options={chartOptions}
            />

          </div>

          <div className="bg-slate-900 rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Risk Distribution
            </h2>

            <Bar
              data={barData}
              options={chartOptions}
            />

          </div>

        </div>

        {/* Recent Activity */}

        <div className="mt-10">

          <div className="bg-slate-900 rounded-xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Recent Activity
            </h2>

            {history.length === 0 ? (

              <div className="text-center text-gray-400 py-8">
                No scan history available.
              </div>

            ) : (

              <div className="space-y-4">

                {history.slice(0, 5).map((item) => (

                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-slate-700 pb-4"
                  >

                    <div>

                      <p className="font-medium break-all">
                        {item.url}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        {new Date(item.scanned_at).toLocaleString()}
                      </p>

                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        item.prediction === "Legitimate"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }`}
                    >
                      {item.prediction}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Analytics;