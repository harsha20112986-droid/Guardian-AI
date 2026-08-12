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
  RefreshCw,
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

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await api.get("/history/stats");

      setStats({
        total_scans: response.data?.total_scans ?? 0,
        safe_urls: response.data?.safe_urls ?? 0,
        threats: response.data?.threats ?? 0,
        average_risk: response.data?.average_risk ?? 0,
      });
    } catch (error) {
      console.error(
        "Failed to load dashboard statistics:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getRiskLabel = () => {
    const risk = Number(stats.average_risk);

    if (risk === 0) {
      return "No scans yet";
    }

    if (risk < 30) {
      return "Low risk";
    }

    if (risk < 70) {
      return "Moderate risk";
    }

    return "High risk";
  };

  const statCards = [
    {
      label: "Total Scans",
      value: stats.total_scans,
      description: "Security checks performed",
      icon: Shield,
      iconBg: "bg-[#EAF4F0]",
      iconColor: "text-[#23865D]",
      valueColor: "text-[#1D3027]",
    },
    {
      label: "Safe Content",
      value: stats.safe_urls,
      description: "Content identified as safe",
      icon: ShieldCheck,
      iconBg: "bg-[#E8F5EF]",
      iconColor: "text-[#159A62]",
      valueColor: "text-[#159A62]",
    },
    {
      label: "Threats Detected",
      value: stats.threats,
      description: "Potential threats identified",
      icon: ShieldAlert,
      iconBg: "bg-[#FFF0EF]",
      iconColor: "text-[#D85B55]",
      valueColor: "text-[#C94D47]",
    },
    {
      label: "Average Risk",
      value: `${stats.average_risk}%`,
      description: getRiskLabel(),
      icon: TrendingUp,
      iconBg: "bg-[#FFF5E5]",
      iconColor: "text-[#C58A2B]",
      valueColor: "text-[#B5791D]",
    },
  ];

  return (
    <section className="relative py-16 md:py-20 bg-[#F4F8F6] overflow-hidden">
      <div className="absolute top-0 left-0 w-[320px] h-[320px] bg-[#E4F3EC] rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="absolute bottom-0 right-0 w-[360px] h-[360px] bg-[#EAF3F5] rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 md:px-6 relative z-10">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#E5F3EC] border border-[#CEE6D8] flex items-center justify-center">
              <Activity
                size={16}
                className="text-[#159A62]"
              />
            </div>

            <span className="text-xs font-bold tracking-[0.12em] text-[#5D7468] uppercase">
              Security Overview
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold tracking-[-0.03em] text-[#17231D]">
                Your security at a glance
              </h2>

              <p className="text-[#65766D] mt-3 max-w-2xl text-sm md:text-base leading-7">
                Keep track of your scans, detected threats
                and overall security activity from one
                place.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => loadStats(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#526158] hover:text-[#159A62] transition disabled:opacity-50"
              >
                <RefreshCw
                  size={16}
                  className={
                    refreshing
                      ? "animate-spin"
                      : ""
                  }
                />
                Refresh
              </button>

              <Link
                to="/history"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#159A62] hover:text-[#10784C] transition"
              >
                View scan history
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="group bg-white border border-[#DCE6E1] rounded-2xl p-5 shadow-[0_5px_20px_rgba(29,48,39,0.05)] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(29,48,39,0.09)] transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.iconBg}`}
                  >
                    <Icon
                      size={22}
                      className={card.iconColor}
                    />
                  </div>

                  <span className="text-[10px] font-semibold tracking-[0.08em] text-[#8A9891] uppercase">
                    Live
                  </span>
                </div>

                <p className="text-sm font-medium text-[#65766D] mt-5">
                  {card.label}
                </p>

                <h3
                  className={`text-3xl font-bold mt-1 tracking-[-0.02em] ${card.valueColor}`}
                >
                  {loading ? "—" : card.value}
                </h3>

                <p className="text-xs text-[#8A9891] mt-2">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-8 bg-white border border-[#DCE6E1] rounded-3xl p-5 md:p-7 shadow-[0_8px_30px_rgba(29,48,39,0.06)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-7">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E8F5EF] flex items-center justify-center">
                  <Shield
                    size={20}
                    className="text-[#159A62]"
                  />
                </div>

                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#17231D]">
                    Security tools
                  </h2>

                  <p className="text-sm text-[#74837B] mt-1">
                    Check links, QR codes and messages before
                    trusting them.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/analytics"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#D5E2DB] bg-[#F7FAF8] text-sm font-semibold text-[#526158] hover:bg-[#EEF5F1] hover:text-[#17231D] transition"
            >
              View Analytics
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Link to="/url-scanner">
              <div className="group h-full bg-[#F1F8F4] border border-[#D7E8DE] rounded-2xl p-5 hover:border-[#A9D2BA] hover:bg-[#ECF7F1] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#D7E8DE] flex items-center justify-center">
                    <Globe
                      size={22}
                      className="text-[#159A62]"
                    />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-[#91A29A] group-hover:text-[#159A62] group-hover:translate-x-1 transition"
                  />
                </div>

                <h3 className="text-lg font-bold text-[#1D3027] mt-5">
                  URL Scanner
                </h3>

                <p className="text-[#6C7C74] text-sm mt-2 leading-6">
                  Analyze suspicious websites and identify
                  phishing links before you open them.
                </p>

                <div className="mt-4 text-sm text-[#159A62] font-semibold">
                  Scan a URL
                  <span className="ml-1">→</span>
                </div>
              </div>
            </Link>

            <Link to="/qr-scanner">
              <div className="group h-full bg-[#F1F6F8] border border-[#D7E3E7] rounded-2xl p-5 hover:border-[#A9C9D3] hover:bg-[#EDF5F7] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#D7E3E7] flex items-center justify-center">
                    <QrCode
                      size={22}
                      className="text-[#397E96]"
                    />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-[#91A29A] group-hover:text-[#397E96] group-hover:translate-x-1 transition"
                  />
                </div>

                <h3 className="text-lg font-bold text-[#1D3027] mt-5">
                  QR Scanner
                </h3>

                <p className="text-[#6C7C74] text-sm mt-2 leading-6">
                  Decode QR codes and inspect their destinations
                  for potential security risks.
                </p>

                <div className="mt-4 text-sm text-[#397E96] font-semibold">
                  Scan a QR code
                  <span className="ml-1">→</span>
                </div>
              </div>
            </Link>

            <Link to="/sms-scanner">
              <div className="group h-full bg-[#FFF8ED] border border-[#F0E1C7] rounded-2xl p-5 hover:border-[#E4C98F] hover:bg-[#FFF5E4] hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-white border border-[#F0E1C7] flex items-center justify-center">
                    <MessageSquare
                      size={22}
                      className="text-[#BD8224]"
                    />
                  </div>

                  <ArrowRight
                    size={18}
                    className="text-[#9B907D] group-hover:text-[#BD8224] group-hover:translate-x-1 transition"
                  />
                </div>

                <h3 className="text-lg font-bold text-[#1D3027] mt-5">
                  SMS Scanner
                </h3>

                <p className="text-[#6C7C74] text-sm mt-2 leading-6">
                  Detect scam messages, suspicious phrases and
                  malicious links inside SMS content.
                </p>

                <div className="mt-4 text-sm text-[#BD8224] font-semibold">
                  Scan an SMS
                  <span className="ml-1">→</span>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#829089]">
          <ShieldCheck
            size={14}
            className="text-[#159A62]"
          />

          Your security activity is analyzed by Guardian AI
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;