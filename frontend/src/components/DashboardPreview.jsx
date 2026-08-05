import CountUp from "react-countup";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
} from "lucide-react";

function DashboardPreview() {
  return (
    <section className="bg-slate-950 py-20 px-6">

      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <div className="text-center mb-14">

          <h2 className="text-4xl font-bold text-white">
            Real-Time Security Dashboard
          </h2>

          <p className="text-gray-400 mt-4 max-w-3xl mx-auto text-lg">
            Monitor phishing URLs, QR scans and SMS analysis from a single
            intelligent dashboard.
          </p>

        </div>

        {/* Statistics */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-cyan-400 hover:shadow-cyan-400/20 hover:shadow-xl transition-all duration-300">

            <Shield
              size={42}
              className="text-cyan-400 mb-4"
            />

            <p className="text-gray-400">
              Total Scans
            </p>

            <h2 className="text-4xl font-bold text-white mt-3">
              <CountUp end={500} duration={2} />+
            </h2>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-green-400 hover:shadow-green-400/20 hover:shadow-xl transition-all duration-300">

            <ShieldCheck
              size={42}
              className="text-green-400 mb-4"
            />

            <p className="text-gray-400">
              Safe Scans
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-3">
              <CountUp end={410} duration={2} />
            </h2>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-red-400 hover:shadow-red-400/20 hover:shadow-xl transition-all duration-300">

            <ShieldAlert
              size={42}
              className="text-red-400 mb-4"
            />

            <p className="text-gray-400">
              Threats Blocked
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-3">
              <CountUp end={90} duration={2} />
            </h2>

          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 hover:border-yellow-400 hover:shadow-yellow-400/20 hover:shadow-xl transition-all duration-300">

            <Activity
              size={42}
              className="text-yellow-400 mb-4"
            />

            <p className="text-gray-400">
              Detection Accuracy
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-3">
              <CountUp end={99} duration={2} />%
            </h2>

          </div>

        </div>

        {/* Dashboard Card */}

        <div className="mt-16 bg-slate-900 rounded-3xl border border-slate-800 p-8 shadow-2xl">

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-3xl font-bold text-white">
              Dashboard Preview
            </h2>

            <span className="bg-emerald-500 text-white px-4 py-2 rounded-full font-semibold">
              LIVE
            </span>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-slate-800 rounded-xl p-6 hover:scale-105 transition-all duration-300">

              <Shield
                className="text-emerald-400 mb-4"
                size={38}
              />

              <h3 className="text-xl font-bold text-white">
                URL Scanner
              </h3>

              <p className="text-gray-400 mt-3">
                AI-powered phishing URL detection with intelligent
                rule-based verification.
              </p>

            </div>

            <div className="bg-slate-800 rounded-xl p-6 hover:scale-105 transition-all duration-300">

              <ShieldCheck
                className="text-cyan-400 mb-4"
                size={38}
              />

              <h3 className="text-xl font-bold text-white">
                QR Scanner
              </h3>

              <p className="text-gray-400 mt-3">
                Decode QR codes safely and verify embedded links
                before opening.
              </p>

            </div>

            <div className="bg-slate-800 rounded-xl p-6 hover:scale-105 transition-all duration-300">

              <ShieldAlert
                className="text-orange-400 mb-4"
                size={38}
              />

              <h3 className="text-xl font-bold text-white">
                SMS Scanner
              </h3>

              <p className="text-gray-400 mt-3">
                Detect scam messages, phishing attacks and malicious
                URLs instantly.
              </p>

            </div>

          </div>

          {/* Recent Activity */}

          <div className="mt-10">

            <h3 className="text-2xl font-bold text-white mb-6">
              Sample Recent Activity
            </h3>

            <div className="space-y-4">

              <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">

                <span className="text-gray-300">
                  https://youtube.com
                </span>

                <span className="bg-green-600 px-3 py-1 rounded-full font-semibold">
                  Legitimate
                </span>

              </div>

              <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">

                <span className="text-gray-300">
                  bank-login-security.xyz
                </span>

                <span className="bg-red-600 px-3 py-1 rounded-full font-semibold">
                  Phishing
                </span>

              </div>

              <div className="bg-slate-800 rounded-xl p-4 flex justify-between items-center">

                <span className="text-gray-300">
                  Congratulations! Claim your reward now.
                </span>

                <span className="bg-yellow-500 text-black px-3 py-1 rounded-full font-semibold">
                  Suspicious
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DashboardPreview;