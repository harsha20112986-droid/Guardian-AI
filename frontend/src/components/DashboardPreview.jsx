import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Globe,
  QrCode,
  MessageSquare,
} from "lucide-react";

function DashboardPreview() {
  return (
    <section className="bg-slate-900 py-20 px-6">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">

          <h2 className="text-4xl font-bold text-white">
            Real-Time Security Dashboard
          </h2>

          <p className="text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
            Monitor phishing URLs, malicious QR codes, scam SMS messages
            and security insights in one place.
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-400/20 hover:-translate-y-2 transition-all">

            <Shield
              size={42}
              className="text-cyan-400 mb-4"
            />

            <p className="text-gray-400">
              Total Scans
            </p>

            <h2 className="text-4xl font-bold text-white mt-2">
              500+
            </h2>

          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-green-400 hover:shadow-xl hover:shadow-green-400/20 hover:-translate-y-2 transition-all">

            <ShieldCheck
              size={42}
              className="text-green-400 mb-4"
            />

            <p className="text-gray-400">
              Safe Content
            </p>

            <h2 className="text-4xl font-bold text-green-400 mt-2">
              410
            </h2>

          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-red-400 hover:shadow-xl hover:shadow-red-400/20 hover:-translate-y-2 transition-all">

            <ShieldAlert
              size={42}
              className="text-red-400 mb-4"
            />

            <p className="text-gray-400">
              Threats Blocked
            </p>

            <h2 className="text-4xl font-bold text-red-400 mt-2">
              90
            </h2>

          </div>

          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-yellow-400 hover:shadow-xl hover:shadow-yellow-400/20 hover:-translate-y-2 transition-all">

            <Activity
              size={42}
              className="text-yellow-400 mb-4"
            />

            <p className="text-gray-400">
              Accuracy
            </p>

            <h2 className="text-4xl font-bold text-yellow-400 mt-2">
              99%
            </h2>

          </div>

        </div>

        <div className="mt-16 bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">

            <h2 className="text-3xl font-bold text-white">
              Dashboard Preview
            </h2>

            <span className="bg-emerald-500 text-slate-950 px-4 py-2 rounded-full font-semibold w-fit">
              LIVE
            </span>

          </div>

          <div className="grid md:grid-cols-3 gap-6">

            <div className="bg-slate-900 rounded-xl p-6 hover:scale-105 transition">

              <Globe
                className="text-emerald-400 mb-4"
                size={36}
              />

              <h3 className="text-xl font-bold text-white">
                URL Scanner
              </h3>

              <p className="text-gray-400 mt-3">
                Detect phishing websites with AI-powered analysis.
              </p>

            </div>

            <div className="bg-slate-900 rounded-xl p-6 hover:scale-105 transition">

              <QrCode
                className="text-cyan-400 mb-4"
                size={36}
              />

              <h3 className="text-xl font-bold text-white">
                QR Scanner
              </h3>

              <p className="text-gray-400 mt-3">
                Scan QR codes before opening unknown links.
              </p>

            </div>

            <div className="bg-slate-900 rounded-xl p-6 hover:scale-105 transition">

              <MessageSquare
                className="text-orange-400 mb-4"
                size={36}
              />

              <h3 className="text-xl font-bold text-white">
                SMS Scanner
              </h3>

              <p className="text-gray-400 mt-3">
                Detect scam messages and malicious URLs instantly.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default DashboardPreview;