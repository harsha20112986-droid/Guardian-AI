function StatCard({ title, value, color }) {
  return (
    <div className="bg-slate-800 rounded-xl p-6 shadow-lg">
      <h3 className="text-gray-400">{title}</h3>
      <p className={`text-4xl font-bold mt-3 ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default StatCard;