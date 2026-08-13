import { useEffect, useState } from "react";
import api from "../api/api";

function ScanHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/history");

      setHistory(response.data);
    } catch (err) {
      console.error("Failed to load scan history:", err);

      if (err.response?.status === 401) {
        setError("Please log in again to view your scan history.");
      } else {
        setError("Unable to load scan history.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Recent Scans
      </h2>

      {loading && (
        <p className="text-slate-400">
          Loading scan history...
        </p>
      )}

      {!loading && error && (
        <p className="text-red-400">
          {error}
        </p>
      )}

      {!loading && !error && history.length === 0 && (
        <p className="text-slate-400">
          No scans found.
        </p>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="space-y-3">
          {history.map((item, index) => (
            <div
              key={item.id ?? index}
              className="bg-slate-800 rounded-lg p-4 flex justify-between"
            >
              <span className="break-all mr-4">
                {item.url}
              </span>

              <span
                className={`font-bold whitespace-nowrap ${
                  item.status === "Safe"
                    ? "text-green-400"
                    : item.status === "Suspicious"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ScanHistory;