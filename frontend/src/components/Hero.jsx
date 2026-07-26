import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 min-h-[90vh] flex items-center justify-center">

      {/* Background Glow */}
      <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -top-20 -left-20"></div>
      <div className="absolute w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl bottom-0 right-0"></div>

      <div className="relative text-center px-6">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-6"
        >
          <ShieldCheck size={80} className="text-emerald-400" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white text-6xl md:text-7xl font-extrabold"
        >
          Guardian AI
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: .3 }}
          className="text-gray-300 mt-6 max-w-3xl mx-auto text-xl"
        >
          Your intelligent cybersecurity companion that protects you
          against phishing, scam messages, fake websites and malicious QR
          codes in real time.
        </motion.p>

        <motion.div
          className="mt-10 flex justify-center gap-5 flex-wrap"
          initial={{ opacity:0 }}
          animate={{ opacity:1 }}
          transition={{ delay:.5 }}
        >
          <Link to="/url-scanner">
  <button className="bg-emerald-500 hover:bg-emerald-600 transition px-8 py-4 rounded-xl text-lg font-semibold">
    Start Scanning
  </button>
</Link>

          <button className="border border-emerald-500 hover:bg-emerald-500 transition px-8 py-4 rounded-xl text-lg font-semibold text-white">
            Learn More
          </button>
        </motion.div>

      </div>

    </section>
  );
}

export default Hero;