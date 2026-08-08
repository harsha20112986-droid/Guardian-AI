import { useEffect, useState } from "react";
import api from "../api/api";

function SystemStatus() {
  const [online, setOnline] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        await api.get("/");
        setOnline(true);
      } catch {
        setOnline(false);
      }
    };

    check();

    const interval = setInterval(check, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">

      <div
        className={`w-3 h-3 rounded-full ${
          online
            ? "bg-green-500"
            : "bg-red-500"
        }`}
      />

      {online
        ? "AI Engine Online"
        : "Backend Offline"}

    </div>
  );
}

export default SystemStatus;