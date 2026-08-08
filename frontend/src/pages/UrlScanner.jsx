import { useEffect, useState } from "react";
import { Link2 } from "lucide-react";
import { toast } from "react-toastify";

import api from "../api/api";
import Navbar from "../components/Navbar";
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
      console.error(error);
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
      console.error(error);

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
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="px-6 py-10">
        <div className="max-w-6xl mx-auto">

          <Dashboard history={history} />

          <section className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">

            <div className="flex items-center gap-3 mb-6">

              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Link2
                  size={30}
                  className="text-emerald-400"
                />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  URL Scanner
                </h1>

                <p className="text-gray-400 mt-1">
                  Check a suspicious URL before visiting it.
                </p>
              </div>

            </div>

            <div className="space-y-4">

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
                className="w-full px-5 py-4 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition disabled:opacity-60"
              />

              <div className="flex flex-col sm:flex-row gap-3">

                <button
                  type="button"
                  onClick={handleScan}
                  disabled={loading}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3.5 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-3">
                      <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      Scanning...
                    </span>
                  ) : (
                    "Scan URL"
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleClear}
                  disabled={loading}
                  className="sm:w-32 bg-slate-700 hover:bg-slate-600 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-50"
                >
                  Clear
                </button>

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

          </section>

          <section className="mt-8">

            <RecentScans
              history={history}
              onHistoryChange={loadHistory}
            />

          </section>

        </div>
      </main>

    </div>
  );
}

export default UrlScanner;