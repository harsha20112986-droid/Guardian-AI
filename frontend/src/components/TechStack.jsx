import {
  Cpu,
  Database,
  Brain,
  Code2,
  Zap,
} from "lucide-react";

function TechStack() {
  const tech = [
    {
      icon: (
        <Code2
          size={34}
          className="text-sky-400"
        />
      ),
      title: "React + Vite",
      description: "Modern frontend development",
    },

    {
      icon: (
        <Cpu
          size={34}
          className="text-emerald-400"
        />
      ),
      title: "FastAPI",
      description: "High-performance backend API",
    },

    {
      icon: (
        <Brain
          size={34}
          className="text-purple-400"
        />
      ),
      title: "Machine Learning",
      description: "AI-powered threat detection",
    },

    {
      icon: (
        <Database
          size={34}
          className="text-yellow-400"
        />
      ),
      title: "SQLite Database",
      description: "Secure scan history storage",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden">

      {/* Background Glow */}

      <div
        className="
          absolute
          top-1/2
          left-1/2
          -translate-x-1/2
          -translate-y-1/2
          w-[400px]
          h-[250px]
          bg-emerald-500/5
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      {/* Main Container */}

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Header */}

        <div className="text-center mb-10 md:mb-12">

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-slate-800
              border
              border-slate-700
              text-gray-300
              text-xs
              md:text-sm
              font-semibold
              mb-4
            "
          >
            <Zap
              size={15}
              className="text-emerald-400"
            />

            Built with Modern Technology
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Technology Stack
          </h2>

          <p
            className="
              text-gray-400
              text-sm
              md:text-base
              mt-4
              max-w-2xl
              mx-auto
              leading-7
            "
          >
            Technologies powering the Guardian AI cybersecurity platform.
          </p>

        </div>

        {/* Technology Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">

          {tech.map((item, index) => (

            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                bg-slate-900/90
                rounded-2xl
                p-6
                border
                border-slate-800
                hover:border-emerald-500/50
                hover:-translate-y-1.5
                hover:shadow-xl
                hover:shadow-emerald-500/10
                transition-all
                duration-300
                text-center
              "
            >

              {/* Hover Glow */}

              <div
                className="
                  absolute
                  -top-14
                  -right-14
                  w-32
                  h-32
                  bg-emerald-500/10
                  rounded-full
                  blur-3xl
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-500
                  pointer-events-none
                "
              />

              {/* Icon */}

              <div
                className="
                  relative
                  z-10
                  mx-auto
                  w-14
                  h-14
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-slate-800
                  border
                  border-slate-700
                  group-hover:border-emerald-500/40
                  group-hover:bg-emerald-500/5
                  transition-all
                  duration-300
                "
              >
                {item.icon}
              </div>

              {/* Content */}

              <div className="relative z-10">

                <h3
                  className="
                    text-lg
                    md:text-xl
                    font-bold
                    text-white
                    mt-5
                    group-hover:text-emerald-400
                    transition-colors
                    duration-300
                  "
                >
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm mt-2 leading-6">
                  {item.description}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default TechStack;