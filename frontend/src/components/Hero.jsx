import { motion } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  QrCode,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 min-h-[90vh] flex items-center">

      {/* Background Glow */}

      <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl bottom-0 right-0"></div>

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        {/* Left */}

        <div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-5 py-2 text-emerald-400 font-medium"
          >
            <ShieldCheck size={18} />
            AI Powered Cybersecurity
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-6xl md:text-7xl font-extrabold text-white mt-6 leading-tight"
          >
            Guardian AI
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-300 mt-6 text-xl leading-8"
          >
            Detect phishing websites, malicious QR codes and scam SMS
            messages instantly using Machine Learning and intelligent
            rule-based analysis.
          </motion.p>

          {/* Highlights */}

          <div className="mt-8 space-y-3">

            <div className="flex items-center gap-3">
              <CheckCircle className="text-emerald-400" size={20} />
              <span>Real-Time Threat Detection</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-emerald-400" size={20} />
              <span>Machine Learning Powered</span>
            </div>

            <div className="flex items-center gap-3">
              <CheckCircle className="text-emerald-400" size={20} />
              <span>Secure & Fast Analysis</span>
            </div>

          </div>

          {/* Buttons */}

          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >

            <Link to="/url-scanner">
              <button className="bg-emerald-500 hover:bg-emerald-600 px-6 py-3 rounded-xl font-semibold transition">
                🌐 URL Scanner
              </button>
            </Link>

            <Link to="/qr-scanner">
              <button className="bg-cyan-600 hover:bg-cyan-700 px-6 py-3 rounded-xl font-semibold transition">
                📷 QR Scanner
              </button>
            </Link>

            <Link to="/sms-scanner">
              <button className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition">
                💬 SMS Scanner
              </button>
            </Link>

          </motion.div>

        </div>

        {/* Right */}

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 gap-6"
        >

          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
            <Globe className="text-emerald-400 mb-3" size={40} />
            <h3 className="text-xl font-bold">URL Scanner</h3>
            <p className="text-gray-400 mt-2">
              Detect phishing and malicious websites.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
            <QrCode className="text-cyan-400 mb-3" size={40} />
            <h3 className="text-xl font-bold">QR Scanner</h3>
            <p className="text-gray-400 mt-2">
              Scan QR codes safely before opening.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
            <MessageSquare className="text-orange-400 mb-3" size={40} />
            <h3 className="text-xl font-bold">SMS Scanner</h3>
            <p className="text-gray-400 mt-2">
              Identify scam and phishing messages.
            </p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 shadow-xl hover:scale-105 transition">
            <ShieldCheck className="text-green-400 mb-3" size={40} />
            <h3 className="text-xl font-bold">AI Analysis</h3>
            <p className="text-gray-400 mt-2">
              Hybrid Machine Learning + Rule Engine.
            </p>
          </div>

        </motion.div>

      </div>

    </section>
  );
}

export default Hero;