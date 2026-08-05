import {
  Atom,
  Server,
  Database,
  Brain,
  BarChart3,
  Shield,
} from "lucide-react";

function TechStack() {
  const technologies = [
    {
      icon: <Atom size={42} className="text-cyan-400" />,
      name: "React",
      desc: "Modern frontend framework",
    },
    {
      icon: <Server size={42} className="text-green-400" />,
      name: "FastAPI",
      desc: "High-performance backend",
    },
    {
      icon: <Database size={42} className="text-yellow-400" />,
      name: "SQLite",
      desc: "Lightweight database",
    },
    {
      icon: <Brain size={42} className="text-purple-400" />,
      name: "Machine Learning",
      desc: "AI-based phishing detection",
    },
    {
      icon: <BarChart3 size={42} className="text-orange-400" />,
      name: "Chart.js",
      desc: "Interactive analytics",
    },
    {
      icon: <Shield size={42} className="text-emerald-400" />,
      name: "Tailwind CSS",
      desc: "Modern responsive UI",
    },
  ];

  return (
    <section className="bg-slate-900 py-20 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-white">
            Technology Stack
          </h2>

          <p className="text-gray-400 mt-4 max-w-3xl mx-auto text-lg">
            Guardian AI is built using modern technologies to deliver
            a fast, scalable and secure cybersecurity platform.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-16">

          {technologies.map((tech, index) => (

            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-6 text-center border border-slate-700 hover:border-emerald-500 hover:-translate-y-2 hover:shadow-emerald-500/20 hover:shadow-xl transition-all duration-300"
            >

              <div className="flex justify-center">
                {tech.icon}
              </div>

              <h3 className="text-white font-bold mt-5">
                {tech.name}
              </h3>

              <p className="text-gray-400 text-sm mt-2">
                {tech.desc}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default TechStack;