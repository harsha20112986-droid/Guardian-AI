import {
  Cpu,
  Database,
  Brain,
  Code2,
  Zap,
  CheckCircle2,
} from "lucide-react";

function TechStack() {
  const tech = [
    {
      icon: Code2,
      title: "React + Vite",
      description: "Modern frontend development",
      category: "Frontend",
      iconBg: "bg-[#EDF5F8]",
      iconColor: "text-[#397E96]",
    },

    {
      icon: Cpu,
      title: "FastAPI",
      description: "High-performance backend API",
      category: "Backend",
      iconBg: "bg-[#EAF6EF]",
      iconColor: "text-[#159A62]",
    },

    {
      icon: Brain,
      title: "Machine Learning",
      description: "AI-powered threat detection",
      category: "Intelligence",
      iconBg: "bg-[#F1EFF8]",
      iconColor: "text-[#7562A8]",
    },

    {
      icon: Database,
      title: "SQLite",
      description: "Scan history and user data",
      category: "Database",
      iconBg: "bg-[#FFF5E5]",
      iconColor: "text-[#BD8224]",
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-20 bg-[#F8FAF9] overflow-hidden">

      <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full bg-[#E5F2EB] blur-3xl opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">

          <div className="max-w-2xl">

            <div className="flex items-center gap-2 mb-4">

              <div className="w-8 h-8 rounded-lg bg-white border border-[#D7E3DC] flex items-center justify-center">
                <Zap
                  size={16}
                  className="text-[#159A62]"
                />
              </div>

              <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#60736A]">
                Built with modern technology
              </span>

            </div>

            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold tracking-[-0.035em] text-[#17231D]">
              Technology behind
              <span className="text-[#159A62]">
                {" "}Guardian AI.
              </span>
            </h2>

            <p className="text-[#687971] text-sm md:text-base mt-4 leading-7 max-w-xl">
              A combination of modern web technologies, backend services,
              machine learning and lightweight data storage powers the
              Guardian AI platform.
            </p>

          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-[#6E7D75] bg-white border border-[#DCE6E1] rounded-lg px-3 py-2">

            <CheckCircle2
              size={15}
              className="text-[#159A62]"
            />

            Full-stack architecture

          </div>

        </div>

        {/* TECHNOLOGY LIST */}

        <div className="bg-white border border-[#D9E5DF] rounded-3xl overflow-hidden shadow-[0_8px_28px_rgba(29,48,39,0.05)]">

          {tech.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 px-5 md:px-7 py-5 md:py-6 hover:bg-[#F8FAF9] transition-colors ${
                  index !== tech.length - 1
                    ? "border-b border-[#E8EEEB]"
                    : ""
                }`}
              >

                {/* ICON */}

                <div
                  className={`w-12 h-12 shrink-0 rounded-xl ${item.iconBg} flex items-center justify-center`}
                >
                  <Icon
                    size={23}
                    strokeWidth={1.9}
                    className={item.iconColor}
                  />
                </div>

                {/* NAME */}

                <div className="sm:w-44 shrink-0">

                  <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#8A9690]">
                    {item.category}
                  </span>

                  <h3 className="text-base md:text-lg font-bold text-[#26332C] mt-1">
                    {item.title}
                  </h3>

                </div>

                {/* DESCRIPTION */}

                <div className="flex-1">

                  <p className="text-sm text-[#6C7C74] leading-6">
                    {item.description}
                  </p>

                </div>

                {/* STATUS */}

                <div className="flex items-center gap-2 sm:ml-auto">

                  <span className="w-2 h-2 rounded-full bg-[#36A96F]" />

                  <span className="text-xs font-medium text-[#718078]">
                    In use
                  </span>

                </div>

              </div>
            );
          })}

        </div>

        {/* ARCHITECTURE SUMMARY */}

        <div className="mt-5 grid sm:grid-cols-3 gap-3">

          <div className="bg-[#EAF6EF] border border-[#D2E8DA] rounded-xl px-4 py-3">

            <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#6F8579]">
              Frontend
            </p>

            <p className="text-sm font-semibold text-[#26332C] mt-1">
              React + Vite
            </p>

          </div>

          <div className="bg-[#EDF5F8] border border-[#D6E5E9] rounded-xl px-4 py-3">

            <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#71858D]">
              Backend
            </p>

            <p className="text-sm font-semibold text-[#26332C] mt-1">
              FastAPI + SQLAlchemy
            </p>

          </div>

          <div className="bg-[#F1EFF8] border border-[#E0DCEF] rounded-xl px-4 py-3">

            <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#817A93]">
              Intelligence
            </p>

            <p className="text-sm font-semibold text-[#26332C] mt-1">
              Machine Learning
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}

export default TechStack;