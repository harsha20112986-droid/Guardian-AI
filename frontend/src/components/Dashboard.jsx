import StatCard from "./StatCard";

function Dashboard({ history }) {
  const total = history.length;

  const safe = history.filter(
    (item) => item.status === "Safe"
  ).length;

  const threats = history.filter(
    (item) => item.status !== "Safe"
  ).length;

  const averageRisk =
    total === 0
      ? 0
      : Math.round(
          history.reduce(
            (sum, item) => sum + item.risk_score,
            0
          ) / total
        );

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Guardian AI Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <StatCard
          title="Total Scans"
          value={total}
          color="text-cyan-400"
        />

        <StatCard
          title="Safe URLs"
          value={safe}
          color="text-green-400"
        />

        <StatCard
          title="Threats"
          value={threats}
          color="text-red-400"
        />

        <StatCard
          title="Average Risk"
          value={`${averageRisk}%`}
          color="text-yellow-400"
        />

      </div>

    </div>
  );
}

export default Dashboard;