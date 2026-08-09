import {
  Shield,
  Brain,
  Globe,
  QrCode,
  MessageSquare,
  Database,
  Code,
  Mail,
  BarChart3,
  Lock,
} from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <main className="px-6 py-10">

        <div className="max-w-7xl mx-auto">

          <section className="text-center py-8">

            <div className="inline-flex items-center justify-center p-5 bg-emerald-500/10 rounded-2xl mb-6">
              <Shield
                size={64}
                className="text-emerald-400"
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold">
              About Guardian AI
            </h1>

            <p className="text-gray-400 mt-6 text-base md:text-lg max-w-3xl mx-auto leading-8">
              Guardian AI is an AI-powered cybersecurity platform that
              helps users detect phishing websites, malicious QR codes
              and scam SMS messages before they become victims of
              cyber attacks.
            </p>

          </section>

          <section className="grid lg:grid-cols-2 gap-8 mt-8">

            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-emerald-500/30 transition">

              <div className="flex items-center gap-3 mb-6">

                <div className="p-3 bg-emerald-500/10 rounded-xl">
                  <Shield
                    size={28}
                    className="text-emerald-400"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold">
                  Project Objective
                </h2>

              </div>

              <p className="text-gray-400 leading-8">
                Guardian AI combines Artificial Intelligence,
                Machine Learning and rule-based analysis to identify
                potential cyber threats. Users can scan suspicious
                URLs, QR codes and SMS messages while receiving
                confidence scores and risk levels.
              </p>

            </div>

            <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 hover:border-emerald-500/30 transition">

              <div className="flex items-center gap-3 mb-6">

                <div className="p-3 bg-purple-500/10 rounded-xl">
                  <Brain
                    size={28}
                    className="text-purple-400"
                  />
                </div>

                <h2 className="text-2xl md:text-3xl font-bold">
                  Core Features
                </h2>

              </div>

              <div className="space-y-5">

                <div className="flex items-center gap-4">
                  <Globe className="text-emerald-400" />
                  <span>
                    URL Phishing Detection
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <QrCode className="text-cyan-400" />
                  <span>
                    QR Code Scanner
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <MessageSquare className="text-orange-400" />
                  <span>
                    SMS Scam Detection
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <Brain className="text-purple-400" />
                  <span>
                    AI Risk Analysis
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <BarChart3 className="text-blue-400" />
                  <span>
                    Security Analytics
                  </span>
                </div>

              </div>

            </div>

          </section>

          <section className="mt-10 bg-slate-900 rounded-2xl p-6 md:p-8 border border-slate-800">

            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Technology Stack
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

              <div className="bg-slate-800 rounded-xl p-6 text-center hover:bg-slate-750 transition">

                <Code
                  size={42}
                  className="mx-auto text-sky-400 mb-4"
                />

                <h3 className="font-bold text-xl">
                  React
                </h3>

                <p className="text-gray-400 mt-2">
                  Frontend
                </p>

              </div>

              <div className="bg-slate-800 rounded-xl p-6 text-center">

                <Database
                  size={42}
                  className="mx-auto text-green-400 mb-4"
                />

                <h3 className="font-bold text-xl">
                  FastAPI
                </h3>

                <p className="text-gray-400 mt-2">
                  Backend
                </p>

              </div>

              <div className="bg-slate-800 rounded-xl p-6 text-center">

                <Brain
                  size={42}
                  className="mx-auto text-purple-400 mb-4"
                />

                <h3 className="font-bold text-xl">
                  Machine Learning
                </h3>

                <p className="text-gray-400 mt-2">
                  AI Detection
                </p>

              </div>

              <div className="bg-slate-800 rounded-xl p-6 text-center">

                <Database
                  size={42}
                  className="mx-auto text-yellow-400 mb-4"
                />

                <h3 className="font-bold text-xl">
                  SQLite
                </h3>

                <p className="text-gray-400 mt-2">
                  Database
                </p>

              </div>

            </div>

          </section>

          <section className="mt-10 bg-slate-900 rounded-2xl p-8 border border-slate-800">

            <div className="flex items-center justify-center gap-3 mb-8">

              <Lock
                size={28}
                className="text-emerald-400"
              />

              <h2 className="text-2xl md:text-3xl font-bold">
                Project Information
              </h2>

            </div>

            <div className="max-w-2xl mx-auto text-center">

              <h3 className="text-2xl font-bold">
                Guardian AI
              </h3>

              <p className="text-gray-400 mt-3">
                AI-Powered Cybersecurity Platform
              </p>

              <p className="text-gray-400 mt-2">
                B.Tech Computer Science & Engineering
              </p>

              <p className="text-gray-400">
                IIIT Kottayam
              </p>

              <div className="flex justify-center mt-8">

                <a
                  href="mailto:harsha20112986@gmail.com"
                  className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl transition"
                >
                  <Mail size={20} />
                  Contact
                </a>

              </div>

            </div>

          </section>

          <footer className="text-center mt-10 pb-6">

            <p className="text-gray-500 text-sm">
              Guardian AI v1.0.0
            </p>

            <p className="text-gray-600 text-xs mt-2">
              AI-powered protection against online threats.
            </p>

          </footer>

        </div>

      </main>

    </div>
  );
}

export default About;