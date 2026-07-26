import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import axios from "axios";

import Dashboard from "../components/Dashboard";
import RecentScans from "../components/RecentScans";

function UrlScanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  // Load scan history
  const loadHistory = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/history");
      setHistory(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Load history when page opens
  useEffect(() => {
    loadHistory();
  }, []);

  // Scan URL
  const handleScan = async () => {
    if (!url.trim()) {
      alert("Please enter a URL.");
      return;
    }

    try {
      new URL(url);
    } catch {
      alert("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/scan-url",
        {
          url: url,
        }
      );

      setResult(response.data);

      // Refresh history after scan
      await loadHistory();

    } catch (error) {
      console.error(error);
      alert("Unable to connect to backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">

      <div className="max-w-6xl mx-auto">

        {/* Dashboard */}
        <Dashboard history={history} />

        {/* Scanner Card */}
        <div className="bg-slate-900 rounded-2xl p-8 shadow-xl mt-8">

          <div className="flex items-center gap-3 mb-6">
            <Link2 className="text-emerald-400" size={32} />
            <h1 className="text-3xl font-bold">
              URL Scanner
            </h1>
          </div>

          <input
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full p-4 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-emerald-500"
          />

          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan URL"}
          </button>

          {result && (
            <div className="mt-8 bg-slate-800 rounded-xl p-6">

              <h2
                className={`text-3xl font-bold ${
                  result.status === "Safe"
                    ? "text-green-400"
                    : result.status === "Suspicious"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {result.status}
              </h2>

              <p className="mt-4 text-lg">
                Risk Score: {result.risk_score}
              </p>

              <p className="mt-2 text-gray-300 break-all">
                URL: {result.url}
              </p>

            </div>
          )}

        </div>

        {/* Recent Scans */}
        <RecentScans history={history} />

      </div>

    </div>
  );
}

export default UrlScanner;