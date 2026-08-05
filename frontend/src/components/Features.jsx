import {
  MessageSquareWarning,
  Link2,
  QrCode,
  Shield,
  Bot,
  BarChart3,
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Link2 size={42} className="text-emerald-400" />,
    title: "URL Scanner",
    description:
      "Detect phishing and malicious websites using Machine Learning and rule-based analysis.",
    highlights: [
      "AI Detection",
      "Risk Score",
      "Scan History",
    ],
    button: "Open Scanner",
    path: "/url-scanner",
  },
  {
    icon: <QrCode size={42} className="text-cyan-400" />,
    title: "QR Scanner",
    description:
      "Scan QR codes safely and identify malicious embedded URLs before opening them.",
    highlights: [
      "QR Decoding",
      "URL Analysis",
      "Threat Detection",
    ],
    button: "Open Scanner",
    path: "/qr-scanner",
  },
  {
    icon: (
      <MessageSquareWarning
        size={42}
        className="text-orange-400"
      />
    ),
    title: "SMS Scanner",
    description:
      "Analyze suspicious SMS messages and detect phishing, scams, and malicious links.",
    highlights: [
      "SMS Analysis",
      "Risk Score",
      "Embedded URL Check",
    ],
    button: "Open Scanner",
    path: "/sms-scanner",
  },
  {
    icon: <Bot size={42} className="text-purple-400" />,
    title: "AI Risk Analysis",
    description:
      "Combines Machine Learning with rule-based detection for accurate threat analysis.",
    highlights: [
      "Machine Learning",
      "Rule Engine",
      "Real-Time Detection",
    ],
  },
  {
    icon: <BarChart3 size={42} className="text-yellow-400" />,
    title: "Analytics Dashboard",
    description:
      "Visualize scan history, threat statistics and risk distribution with interactive charts.",
    highlights: [
      "Pie Charts",
      "Risk Analysis",
      "Export CSV",
    ],
    button: "Open Dashboard",
    path: "/analytics",
  },
  {
    icon: <Shield size={42} className="text-green-400" />,
    title: "Privacy Protection",
    description:
      "Receive security recommendations to improve your protection against online threats.",
    highlights: [
      "Safe Browsing",
      "Threat Alerts",
      "Security Tips",
    ],
  },
];

function Features() {
  return (
    <section className="bg-slate-950 py-20 px-6">

      <div className="max-w-7xl mx-auto">

        <h2 className="text-4xl font-bold text-center text-white">
          Core Features
        </h2>

        <p className="text-center text-gray-400 mt-4 max-w-3xl mx-auto">
          Guardian AI combines Artificial Intelligence and cybersecurity
          techniques to detect phishing attacks across URLs, QR codes,
          and SMS messages.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">

          {features.map((feature, index) => (

            <div
              key={index}
              className="bg-slate-900 rounded-2xl p-7 border border-slate-800 hover:border-emerald-500 hover:-translate-y-2 transition-all duration-300 shadow-lg"
            >

              {feature.icon}

              <h3 className="text-2xl font-bold text-white mt-5">
                {feature.title}
              </h3>

              <p className="text-gray-400 mt-4 leading-7">
                {feature.description}
              </p>

              <div className="mt-5 space-y-2">

                {feature.highlights.map((item, i) => (

                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-gray-300"
                  >
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    {item}
                  </div>

                ))}

              </div>

              {feature.path && (
                <Link to={feature.path}>
                  <button className="mt-6 w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-semibold transition">
                    {feature.button}
                  </button>
                </Link>
              )}

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

export default Features;