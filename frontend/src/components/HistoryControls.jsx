import { Search, Trash2 } from "lucide-react";

function HistoryControls({
  search,
  setSearch,
  onClearHistory,
  total,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">

      <div className="relative flex-1 w-full">

        <Search
          className="absolute left-3 top-3 text-gray-400"
          size={20}
        />

        <input
          type="text"
          placeholder="Search scanned URLs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-800 border border-slate-700 outline-none focus:border-emerald-500"
        />

      </div>

      <button
        onClick={onClearHistory}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-lg transition"
      >
        <Trash2 size={18} />
        Clear History
      </button>

      <span className="text-gray-400">
        {total} Result{total !== 1 ? "s" : ""}
      </span>

    </div>
  );
}

export default HistoryControls;