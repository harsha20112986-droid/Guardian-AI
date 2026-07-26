function RecentScans({ history }) {
  return (
    <div className="mt-10">

      <h2 className="text-2xl font-bold mb-5">
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

export default RecentScans;