import { motion } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  QrCode,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Activity,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative w-full min-h-[680px] lg:min-h-[720px] flex items-center overflow-hidden">

      {/* ================= BACKGROUND EFFECTS ================= */}

      <div
        className="
          absolute
          -top-40
          -left-40
          w-[500px]
          h-[500px]
          bg-emerald-500/10
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          top-1/2
          -right-40
          w-[500px]
          h-[500px]
          bg-cyan-500/10
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -bottom-40
          left-1/3
          w-[400px]
          h-[400px]
          bg-purple-500/5
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      {/* ================= HERO CONTAINER ================= */}

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6">

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-12 items-center">

          {/* ================= LEFT ================= */}

          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >

            {/* Badge */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                bg-emerald-500/10
                border
                border-emerald-500/30
                text-emerald-400
                px-4
                py-2
                rounded-full
                text-sm
                font-semibold
                mb-6
              "
            >
              <ShieldCheck size={17} />

              AI-Powered Cybersecurity
            </div>

            {/* Heading */}

            <h1
              className="
                text-5xl
                md:text-6xl
                lg:text-6xl
                font-extrabold
                text-white
                leading-[1.04]
                tracking-tight
              "
            >
              Protect Yourself

              <span className="block text-emerald-400 mt-2">
                From Online Scams
              </span>
            </h1>

            {/* Description */}

            <p
              className="
                mt-7
                text-gray-300
                text-base
                md:text-lg
                leading-8
                max-w-lg
              "
            >
              Guardian AI detects phishing websites, malicious QR codes,
              scam SMS messages and suspicious links using Artificial
              Intelligence and Machine Learning.
            </p>

            {/* Buttons */}

            <div className="mt-9 flex flex-col sm:flex-row gap-4">

              <Link to="/url-scanner">
                <button
                  type="button"
                  className="
                    w-full
                    sm:w-auto
                    flex
                    items-center
                    justify-center
                    gap-2
                    bg-emerald-500
                    hover:bg-emerald-600
                    text-slate-950
                    px-7
                    py-4
                    rounded-xl
                    font-bold
                    shadow-lg
                    shadow-emerald-500/10
                    hover:shadow-emerald-500/20
                    transition-all
                    duration-300
                    hover:-translate-y-1
                  "
                >
                  Start Scanning
                  <ArrowRight size={20} />
                </button>
              </Link>

              <Link to="/analytics">
                <button
                  type="button"
                  className="
                    w-full
                    sm:w-auto
                    border
                    border-slate-600
                    hover:border-emerald-400
                    hover:bg-emerald-500/10
                    text-white
                    px-7
                    py-4
                    rounded-xl
                    font-semibold
                    transition-all
                    duration-300
                  "
                >
                  View Analytics
                </button>
              </Link>

            </div>

            {/* Trust Points */}

            <div className="mt-9 grid grid-cols-2 gap-x-6 gap-y-4">

              <div className="flex items-center gap-3 text-gray-300">

                <CheckCircle
                  className="text-emerald-400 shrink-0"
                  size={20}
                />

                <span>AI Detection</span>

              </div>

              <div className="flex items-center gap-3 text-gray-300">

                <CheckCircle
                  className="text-emerald-400 shrink-0"
                  size={20}
                />

                <span>Real-Time Analysis</span>

              </div>

              <div className="flex items-center gap-3 text-gray-300">

                <CheckCircle
                  className="text-emerald-400 shrink-0"
                  size={20}
                />

                <span>Risk Scoring</span>

              </div>

              <div className="flex items-center gap-3 text-gray-300">

                <CheckCircle
                  className="text-emerald-400 shrink-0"
                  size={20}
                />

                <span>Secure History</span>

              </div>

            </div>

          </motion.div>

          {/* ================= RIGHT ================= */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="relative"
          >

            {/* Main Security Card */}

            <div
              className="
                relative
                bg-slate-900/95
                border
                border-slate-700
                rounded-3xl
                p-6
                shadow-2xl
                backdrop-blur-sm
              "
            >

              {/* Header */}

              <div className="flex items-center justify-between mb-6">

                <div className="flex items-center gap-3">

                  <div className="p-3 rounded-xl bg-emerald-500/10">

                    <ShieldCheck
                      size={27}
                      className="text-emerald-400"
                    />

                  </div>

                  <div>

                    <h2 className="font-bold text-lg">
                      Guardian AI
                    </h2>

                    <p className="text-xs text-gray-500">
                      Threat Detection System
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2 text-emerald-400 text-sm">

                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />

                  Active

                </div>

              </div>

              {/* Security Status */}

              <div
                className="
                  bg-slate-800/80
                  border
                  border-slate-700
                  rounded-2xl
                  p-5
                  mb-5
                "
              >

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    <Activity
                      size={24}
                      className="text-emerald-400"
                    />

                    <div>

                      <p className="font-semibold">
                        Security Status
                      </p>

                      <p className="text-sm text-gray-400">
                        Continuous threat analysis
                      </p>

                    </div>

                  </div>

                  <span className="text-emerald-400 font-bold">
                    Protected
                  </span>

                </div>

              </div>

              {/* URL Scanner */}

              <Link to="/url-scanner">

                <div
                  className="
                    bg-slate-800/80
                    border
                    border-slate-700
                    hover:border-emerald-400/60
                    rounded-2xl
                    p-5
                    transition-all
                    duration-300
                    hover:-translate-y-1
                  "
                >

                  <div className="flex items-center gap-4">

                    <div className="p-3 bg-emerald-500/10 rounded-xl">

                      <Globe
                        size={27}
                        className="text-emerald-400"
                      />

                    </div>

                    <div className="flex-1">

                      <h3 className="font-bold text-lg">
                        URL Scanner
                      </h3>

                      <p className="text-sm text-gray-400 mt-1">
                        Detect phishing websites
                      </p>

                    </div>

                    <ArrowRight
                      size={20}
                      className="text-gray-500"
                    />

                  </div>

                </div>

              </Link>

              {/* QR + SMS */}

              <div className="grid grid-cols-2 gap-4 mt-4">

                <Link to="/qr-scanner">

                  <div
                    className="
                      h-full
                      bg-slate-800/80
                      border
                      border-slate-700
                      hover:border-cyan-400/60
                      rounded-2xl
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                    "
                  >

                    <QrCode
                      size={29}
                      className="text-cyan-400 mb-4"
                    />

                    <h3 className="font-bold">
                      QR Scanner
                    </h3>

                    <p className="text-xs text-gray-400 mt-2">
                      Scan QR links
                    </p>

                  </div>

                </Link>

                <Link to="/sms-scanner">

                  <div
                    className="
                      h-full
                      bg-slate-800/80
                      border
                      border-slate-700
                      hover:border-orange-400/60
                      rounded-2xl
                      p-5
                      transition-all
                      duration-300
                      hover:-translate-y-1
                    "
                  >

                    <MessageSquare
                      size={29}
                      className="text-orange-400 mb-4"
                    />

                    <h3 className="font-bold">
                      SMS Scanner
                    </h3>

                    <p className="text-xs text-gray-400 mt-2">
                      Detect scam messages
                    </p>

                  </div>

                </Link>

              </div>

              {/* Bottom Indicator */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  mt-6
                  pt-5
                  border-t
                  border-slate-800
                  text-sm
                  text-gray-400
                "
              >

                <Lock
                  size={16}
                  className="text-emerald-400"
                />

                AI-powered threat protection

              </div>

            </div>

          </motion.div>

        </div>

      </div>

    </section>
  );
}

export default Hero;