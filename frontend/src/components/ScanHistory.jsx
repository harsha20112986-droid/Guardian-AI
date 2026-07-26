import { useEffect, useState } from "react";
import axios from "axios";

function ScanHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/history"
      );
      setHistory(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">
        Recent Scans
      </h2>

      <div className="space-y-3">
        {history.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 rounded-lg p-4 flex justify-between"
          >
            <span>{item.url}</span>

            <span
              className={`font-bold ${
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
    </div>
  );
}

export default ScanHistory;