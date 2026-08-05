import {
  ShieldCheck,
  Zap,
  Brain,
  Lock,
  Clock,
  BarChart3,
} from "lucide-react";

function WhyGuardian() {
  const features = [
    {
      icon: <Zap size={42} className="text-yellow-400" />,
      title: "Lightning Fast",
      description:
        "Scan URLs, QR codes and SMS messages in seconds with optimized AI-powered detection.",
    },
    {
      icon: <Brain size={42} className="text-purple-400" />,
      title: "AI + Rule Engine",
      description:
        "Guardian AI combines Machine Learning with intelligent rule-based analysis for better accuracy.",
    },
    {
      icon: <Lock size={42} className="text-green-400" />,
      title: "Privacy Focused",
      description:
        "Your scans stay secure. Guardian AI analyzes threats without exposing sensitive information.",
    },
    {
      icon: <Clock size={42} className="text-cyan-400" />,
      title: "Real-Time Detection",
      description:
        "Instantly identify phishing attempts and malicious content before they can cause harm.",
    },
    {
      icon: <BarChart3 size={42} className="text-orange-400" />,
      title: "Detailed Analytics",
      description:
        "Track scan history, threat trends and security insights through an interactive dashboard.",
    },
    {
      icon: <ShieldCheck size={42} className="text-emerald-400" />,
      title: "Trusted Protection",
      description:
        "Designed to provide reliable cybersecurity assistance for students, professionals and everyday users.",
    },
  ];

  return (
    <section className="bg-slate-950 py-20 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="text-center">

          <h2 className="text-4xl font-bold text-white">
            Why Choose Guardian AI?
          </h2>

          <p className="text-gray-400 mt-4 max-w-3xl mx-auto text-lg">
            Guardian AI is designed to provide fast, accurate and intelligent
            phishing detection through a modern cybersecurity platform.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {features.map((feature, index) => (

            <div
              key={index}
              className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-emerald-500 hover:-translate-y-2 hover:shadow-emerald-500/20 hover:shadow-xl transition-all duration-300"
            >

              {feature.icon}

              <h3 className="text-2xl font-bold text-white mt-5">
                {feature.title}
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                {feature.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default WhyGuardian;