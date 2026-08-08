import { motion } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  QrCode,
  MessageSquare,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 min-h-[92vh] flex items-center">

      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-cyan-500/20 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >

          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">

            <ShieldCheck size={18} />

            AI Powered Cybersecurity

          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold text-white leading-tight">

            Protect Yourself

            <span className="block text-emerald-400">

              From Online Scams

            </span>

          </h1>

          <p className="mt-8 text-gray-300 text-lg leading-8 max-w-2xl">

            Guardian AI detects phishing websites, malicious QR codes,
            scam SMS messages and suspicious links using Artificial
            Intelligence and Machine Learning.

          </p>

          <div className="mt-10 flex flex-wrap gap-5">

            <Link to="/url-scanner">

              <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105">

                Start Scanning

                <ArrowRight size={20} />

              </button>

            </Link>

            <Link to="/analytics">

              <button className="border border-emerald-500 hover:bg-emerald-500 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300">

                View Analytics

              </button>

            </Link>

          </div>

          <div className="mt-10 grid grid-cols-2 gap-5 text-gray-300">

            <div className="flex items-center gap-3">
              <CheckCircle className="text-emerald-400" size={22} />
              AI Detection
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-emerald-400" size={22} />
              Real-Time Analysis
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-emerald-400" size={22} />
              Risk Scoring
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-emerald-400" size={22} />
              Secure History
            </div>

          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9 }}
          className="grid gap-6"
        >

          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-emerald-500 transition-all duration-300 hover:-translate-y-2">

            <Globe className="text-emerald-400 mb-4" size={40} />

            <h3 className="text-2xl font-bold text-white">
              URL Scanner
            </h3>

            <p className="text-gray-400 mt-3">
              Detect phishing websites before opening them.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-6">

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-cyan-400 transition-all duration-300 hover:-translate-y-2">

              <QrCode
                className="text-cyan-400 mb-4"
                size={36}
              />

              <h3 className="text-xl font-bold text-white">
                QR Scanner
              </h3>

            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 hover:border-orange-400 transition-all duration-300 hover:-translate-y-2">

              <MessageSquare
                className="text-orange-400 mb-4"
                size={36}
              />

              <h3 className="text-xl font-bold text-white">
                SMS Scanner
              </h3>

            </div>

          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;