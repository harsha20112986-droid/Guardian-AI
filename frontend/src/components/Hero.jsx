import { motion } from "framer-motion";
import {
  ShieldCheck,
  Globe,
  QrCode,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Lock,
  ScanLine,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F4F8F6]">
      <div className="absolute top-[-120px] right-[-80px] w-[420px] h-[420px] bg-[#DFF3EA] rounded-full blur-3xl opacity-70 pointer-events-none" />

      <div className="absolute bottom-[-150px] left-[-100px] w-[360px] h-[360px] bg-[#E8F2F8] rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-20 lg:py-24">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#D8E9E1] text-[#138A58] text-[11px] font-semibold tracking-[0.08em] shadow-sm">
              <ShieldCheck size={15} />
              DIGITAL SAFETY PLATFORM
            </div>

            <h1 className="mt-6 text-[42px] sm:text-5xl lg:text-[58px] font-semibold tracking-[-0.045em] leading-[1.04] text-[#17221D]">
              Check before
              <span className="block text-[#159A62] mt-1">
                you click.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-[16px] md:text-[17px] leading-7 text-[#62726A]">
              Guardian AI helps you inspect suspicious links, QR codes and
              messages before they become a security risk.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                to="/url-scanner"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#159A62] hover:bg-[#108653] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-200"
              >
                Start Scanning
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/analytics"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border border-[#DCE7E1] hover:border-[#BBD8C9] hover:bg-[#FAFCFB] text-[#34413A] font-medium text-sm transition-all duration-200"
              >
                View Analytics
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm text-[#68766F]">
                <CheckCircle size={16} className="text-[#159A62]" />
                AI Detection
              </div>

              <div className="flex items-center gap-2 text-sm text-[#68766F]">
                <CheckCircle size={16} className="text-[#159A62]" />
                Risk Analysis
              </div>

              <div className="flex items-center gap-2 text-sm text-[#68766F]">
                <CheckCircle size={16} className="text-[#159A62]" />
                Scan History
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="relative"
          >
            <div className="relative max-w-[490px] mx-auto">
              <div className="absolute -inset-5 bg-[#CFEDE0]/60 rounded-[34px] blur-2xl" />

              <div className="relative bg-white border border-[#DCE8E2] rounded-[22px] shadow-[0_20px_55px_rgba(32,55,45,0.10)] p-5 md:p-6">
                <div className="flex items-center justify-between pb-5 border-b border-[#EAF0ED]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF7F0] border border-[#CDE8DA] flex items-center justify-center">
                      <ShieldCheck
                        size={22}
                        className="text-[#159A62]"
                      />
                    </div>

                    <div>
                      <h2 className="text-sm font-semibold text-[#17221D]">
                        Guardian AI
                      </h2>

                      <p className="text-xs text-[#8A9690] mt-0.5">
                        Security check
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-medium text-[#168A55]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                    Ready
                  </div>
                </div>

                <div className="mt-5 p-4 rounded-xl bg-[#F6F9F7] border border-[#E4ECE8]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white border border-[#DDE8E2] flex items-center justify-center">
                      <ScanLine
                        size={19}
                        className="text-[#159A62]"
                      />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#25312B]">
                        Security analysis
                      </p>

                      <p className="text-xs text-[#8A9690] mt-1">
                        Inspect content before trusting it.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl bg-[#FCFEFD] border border-[#DCE8E2]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#EAF7F0] flex items-center justify-center">
                        <Globe
                          size={20}
                          className="text-[#159A62]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-[#8A9690]">
                          Sample URL
                        </p>

                        <p className="text-sm font-semibold text-[#25312B] truncate">
                          secure-example.com
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-semibold text-[#159A62]">
                      Checked
                    </span>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-[#F2F8F5] border border-[#D8E9E0]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#728078]">
                        Risk score
                      </span>

                      <CheckCircle
                        size={16}
                        className="text-[#159A62]"
                      />
                    </div>

                    <div className="mt-2 flex items-end gap-1">
                      <span className="text-2xl font-semibold text-[#159A62]">
                        12
                      </span>

                      <span className="text-xs text-[#7C8982] mb-1">
                        / 100
                      </span>
                    </div>

                    <p className="text-[11px] text-[#6E7C74] mt-1">
                      Low risk
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#F8F6EF] border border-[#EEE6D1]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#807866]">
                        Analysis
                      </span>

                      <Lock
                        size={15}
                        className="text-[#B48620]"
                      />
                    </div>

                    <p className="text-sm font-semibold text-[#4F493C] mt-3">
                      No major threats
                    </p>

                    <p className="text-[11px] text-[#827A6A] mt-1">
                      Based on current checks
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#FAFCFB] border border-[#E9EFEC]">
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        size={15}
                        className="text-[#159A62]"
                      />

                      <span className="text-xs text-[#526159]">
                        URL structure
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-[#159A62]">
                      Clear
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#FAFCFB] border border-[#E9EFEC]">
                    <div className="flex items-center gap-2">
                      <CheckCircle
                        size={15}
                        className="text-[#159A62]"
                      />

                      <span className="text-xs text-[#526159]">
                        Domain signals
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-[#159A62]">
                      Clear
                    </span>
                  </div>

                  <div className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#FFF9F2] border border-[#F0E2CE]">
                    <div className="flex items-center gap-2">
                      <AlertCircle
                        size={15}
                        className="text-[#C58A2B]"
                      />

                      <span className="text-xs text-[#665B4C]">
                        Reputation
                      </span>
                    </div>

                    <span className="text-[11px] font-medium text-[#A87924]">
                      Review
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#EAF0ED] flex items-center justify-center gap-2 text-xs text-[#7F8C85]">
                  <Lock
                    size={14}
                    className="text-[#159A62]"
                  />

                  Security analysis at your fingertips
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Hero;