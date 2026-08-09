import { useEffect, useState } from "react";
import {
  Link2,
  ShieldCheck,
  Search,
  Sparkles,
  History,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../api/api";

import Dashboard from "../components/Dashboard";
import RecentScans from "../components/RecentScans";
import ResultCard from "../components/ResultCard";

function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await api.get("/history");
      setHistory(response.data);
    } catch (error) {
      console.error("Failed to load history:", error);
    }
  };

  const handleScan = async () => {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      toast.warning("Please enter a URL.");
      return;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      toast.warning("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post("/scan-url", {
        url: trimmedUrl,
      });

      setResult({
        ...response.data,
        url: trimmedUrl,
      });

      toast.success("URL scanned successfully.");

      await loadHistory();
    } catch (error) {
      console.error("URL scan failed:", error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setResult(null);
    setUrl("");
  };

  const handleClear = () => {
    setUrl("");
    setResult(null);
  };

  return (
    <main className="relative min-h-full px-4 sm:px-6 py-10 md:py-14 overflow-hidden">

      {/* Background effects */}

      <div className="absolute top-20 left-[-180px] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-20 right-[-180px] w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Dashboard */}

        <Dashboard history={history} />

        {/* Scanner */}

        <section className="mt-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">

          {/* Header */}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">

            <div className="flex items-center gap-4">

              <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">

                <Link2
                  size={30}
                  className="text-emerald-400"
                />

              </div>

              <div>

                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  URL Scanner
                </h1>

                <p className="text-gray-400 mt-1">
                  Check a suspicious URL before visiting it.
                </p>

              </div>

            </div>

            <div className="flex items-center gap-2 text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full w-fit">

              <ShieldCheck size={16} />

              AI Protection Active

            </div>

          </div>

          {/* Scanner Input */}

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 md:p-6">

            <div className="flex items-center gap-2 mb-4 text-gray-300">

              <Search
                size={18}
                className="text-emerald-400"
              />

              <span className="font-medium">
                Enter website URL
              </span>

            </div>

            <div className="relative">

              <Link2
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !loading) {
                    handleScan();
                  }
                }}
                disabled={loading}
                className="
                  w-full
                  pl-12
                  pr-5
                  py-4
                  rounded-xl
                  bg-slate-800
                  border
                  border-slate-700
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-emerald-500
                  focus:ring-2
                  focus:ring-emerald-500/20
                  transition-all
                  disabled:opacity-60
                "
              />

            </div>

            {/* Buttons */}

            <div className="flex flex-col sm:flex-row gap-3 mt-4">

              <button
                type="button"
                onClick={handleScan}
                disabled={loading}
                className="
                  flex-1
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-emerald-500
                  hover:bg-emerald-600
                  text-slate-950
                  py-3.5
                  rounded-xl
                  font-bold
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >

                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />

                    Scanning URL...
                  </>
                ) : (
                  <>
                    <Search size={19} />

                    Scan URL
                  </>
                )}

              </button>

              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="
                  sm:w-32
                  bg-slate-700
                  hover:bg-slate-600
                  text-white
                  py-3.5
                  rounded-xl
                  font-semibold
                  transition-all
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              >
                Clear
              </button>

            </div>

            {/* Information */}

            <div className="flex flex-wrap gap-4 mt-5 text-xs text-gray-500">

              <span className="flex items-center gap-1.5">
                <ShieldCheck
                  size={14}
                  className="text-emerald-400"
                />
                Machine Learning
              </span>

              <span className="flex items-center gap-1.5">
                <Sparkles
                  size={14}
                  className="text-purple-400"
                />
                Rule-Based Analysis
              </span>

              <span className="flex items-center gap-1.5">
                <ShieldCheck
                  size={14}
                  className="text-cyan-400"
                />
                Risk Scoring
              </span>

            </div>

          </div>

          {/* Result */}

          {result && (
            <div className="mt-8">

              <ResultCard
                result={result}
                onReset={resetScan}
              />

            </div>
          )}

        </section>

        {/* Recent Scans */}

        <section className="mt-8">

          <div className="flex items-center gap-3 mb-5">

            <div className="p-2.5 bg-slate-800 border border-slate-700 rounded-xl">

              <History
                size={20}
                className="text-emerald-400"
              />

            </div>

            <div>

              <h2 className="text-xl md:text-2xl font-bold text-white">
                Recent Scans
              </h2>

              <p className="text-sm text-gray-500">
                Your latest URL security checks
              </p>

            </div>

          </div>

          <RecentScans
            history={history}
            onHistoryChange={loadHistory}
          />

        </section>

      </div>

    </main>
  );
}

export default UrlScanner;