import { useState, useEffect } from "react";
import { Link2 } from "lucide-react";
import api from "../api/api";
import { toast } from "react-toastify";

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
     const response = await api.get("/history");
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
  toast.warning("Please enter a URL.");
  return;
}

    try {
      new URL(url);
    } catch {
      toast.warning("Please enter a valid URL.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post("/scan-url", {
  url,
});

      setResult(response.data);
      setUrl("");
      toast.success("URL scanned successfully!");
      await loadHistory();

    } catch (error) {
      console.error(error);
      toast.error("Unable to connect to backend.");
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
            className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 outline-none focus:border-emerald-500 transition shadow-sm focus:shadow-emerald-500/20"
          />

          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.02] py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
  <div className="flex items-center justify-center gap-3">

    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

    <span>Scanning...</span>

  </div>
) : (
  "Scan URL"
)}
          </button>

          {result && (
  <div className="mt-8 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-emerald-500/20 transition-all duration-500">
    <div className="flex justify-between items-center mb-6">

  <h2 className="text-3xl font-bold flex items-center gap-2">
    🛡️ Scan Result
  </h2>

  <span
    className={`px-5 py-2 rounded-full font-bold text-white ${
      result.prediction === "Legitimate"
        ? "bg-green-600"
        : "bg-red-600"
    }`}
  >
    {result.prediction}
  </span>

</div>

    <div className="mt-5 space-y-2 text-gray-300">
      <div>

  <div className="flex justify-between mb-2">

    <span className="font-semibold">
      Confidence
    </span>

    <span>
      {result.confidence}%
    </span>

  </div>

  <div className="w-full bg-slate-700 rounded-full h-3">

    <div
      className="bg-green-500 h-3 rounded-full transition-all duration-700"
      style={{
        width: `${result.confidence}%`,
      }}
    />

  </div>

</div>

      <div className="mt-5">

  <div className="flex justify-between mb-2">

    <span className="font-semibold">
      Risk Score
    </span>

    <span>
      {result.final_score}%
    </span>

  </div>

  <div className="w-full bg-slate-700 rounded-full h-3">

    <div
      className={`h-3 rounded-full transition-all duration-700 ${
        result.final_score < 30
          ? "bg-green-500"
          : result.final_score < 70
          ? "bg-yellow-500"
          : "bg-red-500"
      }`}
      style={{
        width: `${result.final_score}%`,
      }}
    />

  </div>

</div>
      <div className="flex items-center gap-4">

  <span className="font-semibold text-white">
    Risk Level
  </span>

  <span
    className={`px-4 py-1 rounded-full font-semibold text-white ${
      result.risk_level === "Low"
        ? "bg-green-600"
        : result.risk_level === "Medium"
        ? "bg-yellow-500"
        : "bg-red-600"
    }`}
  >
    {result.risk_level}
  </span>

</div>
    </div>

    {result.reasons?.length > 0 && (
      <>
        <h3 className="mt-6 text-lg font-semibold text-white">
          Detection Reasons
        </h3>

        <div className="mt-3 space-y-3">

  {result.reasons.map((reason, index) => (

    <div
      key={index}
      className="flex items-center gap-3 bg-slate-700 rounded-lg px-4 py-3"
    >

      <div className="w-2 h-2 rounded-full bg-emerald-400"></div>

      <span>{reason}</span>

    </div>

  ))}

</div>
      </>
    )}
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