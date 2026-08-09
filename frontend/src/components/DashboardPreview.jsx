import { useEffect, useState } from "react";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Globe,
  QrCode,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

import api from "../api/api";

function DashboardPreview() {
  const [stats, setStats] = useState({
    total_scans: 0,
    safe_urls: 0,
    threats: 0,
    average_risk: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get("/history/stats");

        setStats({
          total_scans: response.data.total_scans ?? 0,
          safe_urls: response.data.safe_urls ?? 0,
          threats: response.data.threats ?? 0,
          average_risk: response.data.average_risk ?? 0,
        });
      } catch (error) {
        console.error(
          "Failed to load dashboard statistics:",
          error
        );
      }
    };

    loadStats();
  }, []);

  const statCards = [
    {
      label: "Total Scans",
      value: stats.total_scans,
      tag: "ALL SCANS",
      icon: Shield,
      color: "cyan",
    },
    {
      label: "Safe Content",
      value: stats.safe_urls,
      tag: "SAFE",
      icon: ShieldCheck,
      color: "emerald",
    },
    {
      label: "Threats Detected",
      value: stats.threats,
      tag: "THREATS",
      icon: ShieldAlert,
      color: "red",
    },
    {
      label: "Average Risk",
      value: `${stats.average_risk}%`,
      tag: "CURRENT DATA",
      icon: TrendingUp,
      color: "yellow",
    },
  ];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">

      {/* Background Effects */}

      <div className="absolute top-1/2 left-[-180px] w-[380px] h-[380px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-[-120px] right-[-120px] w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-10">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs md:text-sm font-semibold mb-4">

            <Activity size={15} />

            Live Security Overview

          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Real-Time Security Dashboard
          </h2>

          <p className="text-gray-400 mt-4 text-sm md:text-base max-w-2xl mx-auto leading-7">
            Monitor phishing URLs, malicious QR codes, scam SMS
            messages and security insights from one centralized dashboard.
          </p>

        </div>

        {/* ================= STATISTICS ================= */}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">

          {statCards.map((card) => {
            const Icon = card.icon;

            const colorClasses = {
              cyan: {
                icon: "bg-cyan-500/10 text-cyan-400",
                hover: "hover:border-cyan-400/50",
                value: "text-white",
              },
              emerald: {
                icon: "bg-emerald-500/10 text-emerald-400",
                hover: "hover:border-emerald-400/50",
                value: "text-emerald-400",
              },
              red: {
                icon: "bg-red-500/10 text-red-400",
                hover: "hover:border-red-400/50",
                value: "text-red-400",
              },
              yellow: {
                icon: "bg-yellow-500/10 text-yellow-400",
                hover: "hover:border-yellow-400/50",
                value: "text-yellow-400",
              },
            };

            const colors = colorClasses[card.color];

            return (
              <div
                key={card.label}
                className={`
                  bg-slate-900/90
                  border border-slate-800
                  rounded-2xl
                  p-5 md:p-6
                  ${colors.hover}
                  hover:-translate-y-1
                  transition-all duration-300
                  shadow-lg
                `}
              >

                <div className="flex items-start justify-between">

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${colors.icon}`}
                  >
                    <Icon size={23} />
                  </div>

                  <span className="text-[10px] md:text-xs text-gray-500 font-medium">
                    {card.tag}
                  </span>

                </div>

                <p className="text-gray-400 text-sm mt-5">
                  {card.label}
                </p>

                <h3
                  className={`text-3xl md:text-4xl font-bold mt-1 ${colors.value}`}
                >
                  {card.value}
                </h3>

              </div>
            );
          })}

        </div>

        {/* ================= SECURITY TOOLS ================= */}

        <div className="mt-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 md:p-7 shadow-2xl">

          {/* Header */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-6">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                  <Activity
                    size={21}
                    className="text-emerald-400"
                  />

                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Security Tools
                </h2>

              </div>

              <p className="text-gray-400 text-sm mt-2">
                Choose a scanner to analyze potential cyber threats.
              </p>

            </div>

            <Link to="/analytics">

              <button
                type="button"
                className="
                  flex items-center justify-center gap-2
                  bg-slate-800
                  hover:bg-slate-700
                  border border-slate-700
                  hover:border-emerald-400/50
                  px-5 py-3
                  rounded-xl
                  text-sm
                  font-semibold
                  transition-all duration-300
                "
              >
                View Analytics
                <ArrowRight size={17} />
              </button>

            </Link>

          </div>

          {/* Scanner Cards */}

          <div className="grid md:grid-cols-3 gap-4">

            {/* URL */}

            <Link to="/url-scanner">

              <div
                className="
                  group
                  h-full
                  bg-slate-800/70
                  border border-slate-700
                  rounded-2xl
                  p-5
                  hover:border-emerald-400/60
                  hover:bg-slate-800
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center">

                    <Globe
                      size={25}
                      className="text-emerald-400"
                    />

                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-600 group-hover:text-emerald-400 transition"
                  />

                </div>

                <h3 className="text-lg font-bold text-white mt-5">
                  URL Scanner
                </h3>

                <p className="text-gray-400 text-sm mt-2 leading-6">
                  Analyze suspicious websites and detect phishing URLs
                  before you open them.
                </p>

                <div className="mt-4 text-sm text-emerald-400 font-semibold">
                  Scan a URL →
                </div>

              </div>

            </Link>

            {/* QR */}

            <Link to="/qr-scanner">

              <div
                className="
                  group
                  h-full
                  bg-slate-800/70
                  border border-slate-700
                  rounded-2xl
                  p-5
                  hover:border-cyan-400/60
                  hover:bg-slate-800
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center">

                    <QrCode
                      size={25}
                      className="text-cyan-400"
                    />

                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-600 group-hover:text-cyan-400 transition"
                  />

                </div>

                <h3 className="text-lg font-bold text-white mt-5">
                  QR Scanner
                </h3>

                <p className="text-gray-400 text-sm mt-2 leading-6">
                  Decode QR codes and analyze embedded links for
                  potential threats.
                </p>

                <div className="mt-4 text-sm text-cyan-400 font-semibold">
                  Scan a QR code →
                </div>

              </div>

            </Link>

            {/* SMS */}

            <Link to="/sms-scanner">

              <div
                className="
                  group
                  h-full
                  bg-slate-800/70
                  border border-slate-700
                  rounded-2xl
                  p-5
                  hover:border-orange-400/60
                  hover:bg-slate-800
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >

                <div className="flex items-center justify-between">

                  <div className="w-11 h-11 rounded-xl bg-orange-500/10 flex items-center justify-center">

                    <MessageSquare
                      size={25}
                      className="text-orange-400"
                    />

                  </div>

                  <ArrowRight
                    size={18}
                    className="text-gray-600 group-hover:text-orange-400 transition"
                  />

                </div>

                <h3 className="text-lg font-bold text-white mt-5">
                  SMS Scanner
                </h3>

                <p className="text-gray-400 text-sm mt-2 leading-6">
                  Detect scam messages, suspicious keywords and
                  malicious links in SMS content.
                </p>

                <div className="mt-4 text-sm text-orange-400 font-semibold">
                  Scan an SMS →
                </div>

              </div>

            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DashboardPreview;