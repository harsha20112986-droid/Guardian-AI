import {
  ShieldCheck,
  ShieldAlert,
  Activity,
  BarChart3,
} from "lucide-react";

function Dashboard({ history = [] }) {
  const safeHistory = Array.isArray(history) ? history : [];

  const total = safeHistory.length;

  const safe = safeHistory.filter(
    (item) =>
      item?.prediction === "Legitimate" ||
      item?.prediction === "Safe"
  ).length;

  const threats = safeHistory.filter(
    (item) =>
      item?.prediction === "Phishing" ||
      item?.prediction === "Malicious"
  ).length;

  const averageRisk =
    total === 0
      ? 0
      : Math.round(
          safeHistory.reduce(
            (sum, item) =>
              sum + Number(item?.final_score ?? item?.score ?? 0),
            0
          ) / total
        );

  const stats = [
    {
      title: "Total Scans",
      value: total,
      description: "Security checks performed",
      icon: Activity,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-[#17201C]",
    },
    {
      title: "Safe Content",
      value: safe,
      description: "Content identified as safe",
      icon: ShieldCheck,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-600",
    },
    {
      title: "Threats Detected",
      value: threats,
      description: "Potential threats identified",
      icon: ShieldAlert,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
      valueColor: "text-red-500",
    },
    {
      title: "Average Risk",
      value: `${averageRisk}%`,
      description: "Across analyzed content",
      icon: BarChart3,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
      valueColor: "text-amber-600",
    },
  ];

  return (
    <section>

      {/* Header */}

      <div className="mb-7">

        <div className="flex items-center gap-2 mb-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 border border-emerald-100">
            <ShieldCheck
              size={18}
              className="text-emerald-600"
            />
          </div>

          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
            Security Overview
          </span>

        </div>

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#17201C]">
          Your security at a glance
        </h1>

        <p className="mt-2 text-sm md:text-base text-[#68766F]">
          Keep track of your scans, detected threats and overall
          security activity from one place.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="
                group
                rounded-2xl
                border
                border-[#DDE8E2]
                bg-white
                p-5
                shadow-[0_8px_25px_rgba(32,55,45,0.05)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-[#BFD9CB]
                hover:shadow-[0_12px_30px_rgba(32,55,45,0.08)]
              "
            >

              <div className="flex items-start justify-between">

                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
                >
                  <Icon
                    size={20}
                    className={stat.iconColor}
                  />
                </div>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#89958F]">
                  Live
                </span>

              </div>

              <p className="mt-5 text-sm font-medium text-[#64716B]">
                {stat.title}
              </p>

              <p
                className={`mt-1 text-3xl font-bold ${stat.valueColor}`}
              >
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-[#8A9690]">
                {stat.description}
              </p>

            </div>
          );
        })}

      </div>

    </section>
  );
}

export default Dashboard;