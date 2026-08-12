import {
  ShieldCheck,
  Brain,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

function WhyGuardian() {
  const items = [
    {
      icon: Brain,
      title: "AI-Powered Detection",
      description:
        "Machine Learning and intelligent rule-based analysis help identify phishing websites, malicious QR codes and scam SMS messages.",
      iconBg: "bg-[#F0EDF8]",
      iconColor: "text-[#7562A8]",
    },

    {
      icon: Zap,
      title: "Real-Time Analysis",
      description:
        "Scans are processed quickly so users can receive immediate threat detection and risk information.",
      iconBg: "bg-[#FFF5E5]",
      iconColor: "text-[#BD8224]",
    },

    {
      icon: Lock,
      title: "Privacy Focused",
      description:
        "Guardian AI focuses on security analysis without requiring unnecessary personal information from users.",
      iconBg: "bg-[#EDF5F8]",
      iconColor: "text-[#397E96]",
    },

    {
      icon: ShieldCheck,
      title: "Practical Protection",
      description:
        "Designed to help users recognize suspicious websites, QR destinations and messages before interacting with them.",
      iconBg: "bg-[#EAF6EF]",
      iconColor: "text-[#159A62]",
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-20 bg-[#EEF5F1] overflow-hidden">

      {/* Background shapes */}

      <div className="absolute top-[-120px] right-[-100px] w-[300px] h-[300px] rounded-full bg-[#DCEFE5] opacity-70 blur-3xl pointer-events-none" />

      <div className="absolute bottom-[-140px] left-[-100px] w-[300px] h-[300px] rounded-full bg-[#E3EFF2] opacity-70 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-start">

          {/* LEFT SIDE */}

          <div className="lg:sticky lg:top-24">

            <div className="flex items-center gap-2 mb-5">

              <div className="w-8 h-8 rounded-lg bg-white border border-[#D4E4DB] flex items-center justify-center">
                <ShieldCheck
                  size={17}
                  className="text-[#159A62]"
                />
              </div>

              <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#60736A]">
                Built for your security
              </span>

            </div>

            <h2 className="text-3xl md:text-4xl lg:text-[43px] font-bold tracking-[-0.035em] text-[#17231D] leading-[1.08]">
              Security that helps you
              <span className="text-[#159A62]">
                {" "}think before you click.
              </span>
            </h2>

            <p className="text-[#687971] text-sm md:text-base leading-7 mt-5 max-w-lg">
              Online threats are not always obvious. Guardian AI combines
              multiple security checks to give users a clearer understanding
              of what they are about to open, scan or respond to.
            </p>

            <div className="mt-7">

              <div className="flex items-center gap-3">

                <div className="w-9 h-9 rounded-full bg-white border border-[#D4E4DB] flex items-center justify-center">
                  <CheckCircle2
                    size={17}
                    className="text-[#159A62]"
                  />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#26332C]">
                    One security platform
                  </p>

                  <p className="text-xs text-[#7B8881] mt-0.5">
                    URLs, QR codes and SMS messages
                  </p>
                </div>

              </div>

            </div>

            <div className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#159A62]">
              Smart checks. Clear results.
              <ArrowRight size={16} />
            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="bg-white border border-[#D9E5DF] rounded-3xl p-4 md:p-6 shadow-[0_10px_35px_rgba(29,48,39,0.06)]">

            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.title}
                  className={`group flex gap-4 md:gap-5 p-4 md:p-5 rounded-2xl hover:bg-[#F7FAF8] transition-colors ${
                    index !== items.length - 1
                      ? "border-b border-[#E9EFEC]"
                      : ""
                  }`}
                >

                  {/* ICON */}

                  <div
                    className={`w-11 h-11 md:w-12 md:h-12 shrink-0 rounded-xl ${item.iconBg} flex items-center justify-center`}
                  >
                    <Icon
                      size={21}
                      strokeWidth={1.9}
                      className={item.iconColor}
                    />
                  </div>

                  {/* CONTENT */}

                  <div className="min-w-0">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">

                      <h3 className="text-base md:text-lg font-bold text-[#26332C]">
                        {item.title}
                      </h3>

                      <span className="hidden sm:block w-1 h-1 rounded-full bg-[#B7C3BC]" />

                      <span className="hidden sm:block text-[10px] uppercase tracking-[0.08em] font-semibold text-[#8A9690]">
                        Guardian AI
                      </span>

                    </div>

                    <p className="text-sm text-[#6C7C74] leading-6 mt-1.5">
                      {item.description}
                    </p>

                  </div>

                </div>
              );
            })}

          </div>

        </div>

      </div>
    </section>
  );
}

export default WhyGuardian;