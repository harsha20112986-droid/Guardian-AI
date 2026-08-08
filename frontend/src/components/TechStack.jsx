import {
  Cpu,
  Database,
  Brain,
  Code2,
} from "lucide-react";

function TechStack() {
  const tech = [
    {
      icon: <Code2 size={40} className="text-sky-400" />,
      title: "React + Vite",
    },
    {
      icon: <Cpu size={40} className="text-green-400" />,
      title: "FastAPI",
    },
    {
      icon: <Brain size={40} className="text-purple-400" />,
      title: "Machine Learning",
    },
    {
      icon: <Database size={40} className="text-yellow-400" />,
      title: "SQLite Database",
    },
  ];

  return (
    <section className="bg-slate-950 py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-white">
            Technology Stack
          </h2>

          <p className="text-gray-400 mt-5 text-lg">
            Technologies powering Guardian AI.
          </p>

        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">

          {tech.map((item, index) => (

            <div
              key={index}
              className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-emerald-500 hover:-translate-y-2 transition-all duration-300 text-center"
            >

              <div className="flex justify-center mb-6">
                {item.icon}
              </div>

              <h3 className="text-xl font-bold text-white">
                {item.title}
              </h3>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default TechStack;