import {
  ShieldCheck,
  Brain,
  Lock,
  Zap,
} from "lucide-react";

function WhyGuardian() {
  const items = [
    {
      icon: <Brain size={40} className="text-emerald-400" />,
      title: "AI Powered Detection",
      description:
        "Machine Learning and intelligent rule-based analysis accurately identify phishing websites, malicious QR codes and scam SMS messages.",
    },
    {
      icon: <Zap size={40} className="text-cyan-400" />,
      title: "Real-Time Analysis",
      description:
        "Every scan is processed instantly, giving users immediate threat detection and confidence scores.",
    },
    {
      icon: <Lock size={40} className="text-orange-400" />,
      title: "Privacy Focused",
      description:
        "Guardian AI performs security analysis without collecting unnecessary personal information, helping users stay protected while respecting privacy.",
    },
    {
      icon: <ShieldCheck size={40} className="text-green-400" />,
      title: "Trusted Protection",
      description:
        "Designed to help users identify online scams before opening suspicious websites, QR codes or SMS links.",
    },
  ];

  return (
    <section className="bg-slate-900 py-24 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-white">
            Why Guardian AI?
          </h2>

          <p className="text-gray-400 mt-5 text-lg max-w-3xl mx-auto">
            Guardian AI combines Artificial Intelligence, Machine Learning
            and cybersecurity techniques to help users identify modern
            phishing attacks before they become victims.
          </p>

        </div>

        <div className="grid md:grid-cols-2 gap-8">

          {items.map((item, index) => (

            <div
              key={index}
              className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-emerald-500 hover:shadow-emerald-500/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >

              {item.icon}

              <h3 className="text-2xl font-bold text-white mt-6">
                {item.title}
              </h3>

              <p className="text-gray-400 mt-4 leading-8">
                {item.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default WhyGuardian;