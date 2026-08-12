import { useEffect, useState } from "react";
import {
  Link2,
  ShieldCheck,
  Search,
  Sparkles,
  History,
  CheckCircle2,
  Activity,
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
    <main className="relative min-h-full overflow-hidden bg-[#F4F8F6] px-4 py-10 sm:px-6 md:py-14">

      <div className="pointer-events-none absolute -left-32 top-20 h-80 w-80 rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-sky-100/50 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-100/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">

        <Dashboard history={history} />

        <section className="mt-8 overflow-hidden rounded-3xl border border-[#DDE8E2] bg-white shadow-[0_12px_40px_rgba(32,55,45,0.07)]">

          <div className="border-b border-[#E7EEEA] px-6 py-6 md:px-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                  <Link2
                    size={24}
                    className="text-[#159A62]"
                  />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-[#17201C] md:text-3xl">
                    URL Scanner
                  </h1>

                  <p className="mt-1 text-sm text-[#708078] md:text-base">
                    Check a suspicious website before you visit it.
                  </p>
                </div>

              </div>

              <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-medium text-[#168A55]">
                <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
                AI Protection Active
              </div>

            </div>

          </div>

          <div className="p-6 md:p-8">

            <div className="rounded-2xl border border-[#E1EAE5] bg-[#F7FAF8] p-5 md:p-6">

              <div className="mb-4 flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Search
                    size={18}
                    className="text-[#159A62]"
                  />

                  <span className="text-sm font-semibold text-[#34413A]">
                    Enter website URL
                  </span>

                </div>

                <span className="hidden text-xs text-[#8A9690] sm:block">
                  Press Enter to scan
                </span>

              </div>

              <div className="relative">

                <Link2
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8A9690]"
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
                  className="w-full rounded-xl border border-[#D7E2DC] bg-white py-4 pl-12 pr-5 text-sm text-[#17201C] outline-none placeholder:text-[#9AA59F] focus:border-[#159A62] focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-[#F1F5F3] md:text-base"
                />

              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={handleScan}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#159A62] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#108653] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {loading ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Scanning URL...
                    </>
                  ) : (
                    <>
                      <Search size={18} />
                      Scan URL
                    </>
                  )}

                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="rounded-xl border border-[#D7E2DC] bg-white px-6 py-3.5 text-sm font-semibold text-[#52605A] transition-all duration-200 hover:border-[#BFD9CB] hover:bg-[#F8FBF9] disabled:cursor-not-allowed disabled:opacity-50 sm:w-32"
                >
                  Clear
                </button>

              </div>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#E3EBE6] pt-4">

                <div className="flex items-center gap-2 text-xs text-[#68766F]">
                  <ShieldCheck
                    size={15}
                    className="text-[#159A62]"
                  />
                  Machine Learning
                </div>

                <div className="flex items-center gap-2 text-xs text-[#68766F]">
                  <Sparkles
                    size={15}
                    className="text-purple-500"
                  />
                  Rule-Based Analysis
                </div>

                <div className="flex items-center gap-2 text-xs text-[#68766F]">
                  <Activity
                    size={15}
                    className="text-sky-500"
                  />
                  Risk Scoring
                </div>

              </div>

            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">

              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <CheckCircle2
                    size={17}
                    className="text-[#159A62]"
                  />
                  <span className="text-sm font-semibold text-[#26372E]">
                    URL Analysis
                  </span>
                </div>

                <p className="text-xs leading-5 text-[#6C7A73]">
                  Analyze suspicious links before opening them.
                </p>
              </div>

              <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Activity
                    size={17}
                    className="text-sky-600"
                  />
                  <span className="text-sm font-semibold text-[#26372E]">
                    Risk Scoring
                  </span>
                </div>

                <p className="text-xs leading-5 text-[#6C7A73]">
                  Combine multiple signals to estimate threat level.
                </p>
              </div>

              <div className="rounded-xl border border-purple-100 bg-purple-50/70 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles
                    size={17}
                    className="text-purple-500"
                  />
                  <span className="text-sm font-semibold text-[#26372E]">
                    AI Detection
                  </span>
                </div>

                <p className="text-xs leading-5 text-[#6C7A73]">
                  Machine learning helps identify phishing patterns.
                </p>
              </div>

            </div>

            {result && (
              <div className="mt-8">

                <ResultCard
                  result={result}
                  onReset={resetScan}
                />

              </div>
            )}

          </div>

        </section>

        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between gap-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDE8E2] bg-white">
                <History
                  size={19}
                  className="text-[#159A62]"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#17201C] md:text-2xl">
                  Recent Scans
                </h2>

                <p className="mt-0.5 text-sm text-[#718078]">
                  Your latest URL security checks
                </p>
              </div>

            </div>

            <div className="hidden items-center gap-2 text-xs text-[#718078] sm:flex">
              <ShieldCheck
                size={15}
                className="text-[#159A62]"
              />
              Stored securely
            </div>

          </div>

          <div className="rounded-2xl border border-[#DDE8E2] bg-white p-4 shadow-[0_8px_30px_rgba(32,55,45,0.04)] md:p-5">

            <RecentScans
              history={history}
              onHistoryChange={loadHistory}
            />

          </div>

        </section>

      </div>
    </main>
  );
}

export default UrlScanner;