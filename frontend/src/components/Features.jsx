import {
  MessageSquareWarning,
  Link2,
  QrCode,
  Shield,
  Globe,
  Bot,
  ArrowUpRight,
} from "lucide-react";

function Features() {
  const features = [
    {
      icon: MessageSquareWarning,
      title: "SMS Scam Detection",
      description:
        "Analyze suspicious SMS messages and identify phishing attempts before they can cause harm.",
      label: "Message security",
      iconBg: "bg-[#FFF4E8]",
      iconColor: "text-[#C47D25]",
      cardBg: "bg-[#FFFDFC]",
      border: "border-[#EEDFCB]",
      hover: "hover:border-[#DDBB88]",
    },

    {
      icon: Link2,
      title: "URL Scanner",
      description:
        "Check suspicious websites using machine learning and rule-based analysis before visiting them.",
      label: "Web protection",
      iconBg: "bg-[#EAF6EF]",
      iconColor: "text-[#159A62]",
      cardBg: "bg-[#FCFFFD]",
      border: "border-[#D5E8DC]",
      hover: "hover:border-[#A9D2BA]",
    },

    {
      icon: QrCode,
      title: "QR Code Scanner",
      description:
        "Scan QR codes safely and inspect their hidden destinations before opening unknown links.",
      label: "QR protection",
      iconBg: "bg-[#EDF5F8]",
      iconColor: "text-[#397E96]",
      cardBg: "bg-[#FCFEFF]",
      border: "border-[#D6E4E9]",
      hover: "hover:border-[#A9C9D3]",
    },

    {
      icon: Bot,
      title: "AI Risk Analysis",
      description:
        "Understand threat predictions, confidence scores and risk factors through intelligent analysis.",
      label: "Intelligent analysis",
      iconBg: "bg-[#F1EFFA]",
      iconColor: "text-[#7562A8]",
      cardBg: "bg-[#FEFDFF]",
      border: "border-[#DFDAEC]",
      hover: "hover:border-[#C4B9DB]",
    },

    {
      icon: Globe,
      title: "Fake Website Detection",
      description:
        "Identify suspicious banking, shopping and login pages designed to steal sensitive information.",
      label: "Website protection",
      iconBg: "bg-[#FFF0EF]",
      iconColor: "text-[#C95A54]",
      cardBg: "bg-[#FFFEFE]",
      border: "border-[#EED8D6]",
      hover: "hover:border-[#D8AAA6]",
    },

    {
      icon: Shield,
      title: "Privacy Protection",
      description:
        "Get clear security recommendations and risk information while checking potentially unsafe content.",
      label: "Personal safety",
      iconBg: "bg-[#EAF4F0]",
      iconColor: "text-[#23865D]",
      cardBg: "bg-[#FCFFFD]",
      border: "border-[#D6E5DE]",
      hover: "hover:border-[#A9CDBA]",
    },
  ];

  return (
    <section className="relative w-full py-16 md:py-20 bg-[#F8FAF9] overflow-hidden">

      {/* Background details */}

      <div className="absolute top-20 left-[-160px] w-[320px] h-[320px] rounded-full bg-[#E8F5EE] blur-3xl opacity-60 pointer-events-none" />

      <div className="absolute bottom-[-120px] right-[-100px] w-[320px] h-[320px] rounded-full bg-[#EDF4F6] blur-3xl opacity-70 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-6">

        {/* HEADER */}

        <div className="max-w-2xl mb-10 md:mb-12">

          <div className="flex items-center gap-2 mb-4">

            <div className="w-8 h-8 rounded-lg bg-[#E7F4EC] border border-[#CEE5D7] flex items-center justify-center">
              <Shield
                size={16}
                className="text-[#159A62]"
              />
            </div>

            <span className="text-xs font-bold tracking-[0.12em] uppercase text-[#60736A]">
              Intelligent Protection
            </span>

          </div>

          <h2 className="text-3xl md:text-4xl lg:text-[42px] font-bold tracking-[-0.035em] text-[#17231D]">
            Everything you need to
            <span className="text-[#159A62]"> stay safer online.</span>
          </h2>

          <p className="text-[#687971] text-sm md:text-base mt-4 leading-7 max-w-xl">
            Guardian AI brings multiple security checks together so
            you can inspect suspicious links, messages and QR codes
            before trusting them.
          </p>

        </div>

        {/* FEATURE GRID */}

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">

          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className={`group relative ${feature.cardBg} border ${feature.border} ${feature.hover} rounded-2xl p-5 md:p-6 shadow-[0_4px_18px_rgba(29,48,39,0.035)] hover:shadow-[0_12px_28px_rgba(29,48,39,0.08)] hover:-translate-y-1 transition-all duration-300`}
              >

                {/* Top row */}

                <div className="flex items-start justify-between">

                  <div
                    className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center`}
                  >
                    <Icon
                      size={22}
                      strokeWidth={1.9}
                      className={feature.iconColor}
                    />
                  </div>

                  <ArrowUpRight
                    size={18}
                    className="text-[#A0AAA5] group-hover:text-[#526158] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />

                </div>

                {/* Content */}

                <div className="mt-5">

                  <p className="text-[10px] uppercase tracking-[0.1em] font-bold text-[#89958F]">
                    {feature.label}
                  </p>

                  <h3 className="text-lg font-bold text-[#1D3027] mt-2">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-[#6C7C74] leading-6 mt-2">
                    {feature.description}
                  </p>

                </div>

                {/* Bottom accent */}

                <div className="mt-5 pt-4 border-t border-[#EDF1EE]">

                  <span className="text-xs font-semibold text-[#64736B] group-hover:text-[#159A62] transition-colors">
                    Learn more
                  </span>

                </div>

              </div>
            );
          })}

        </div>

        {/* BOTTOM MESSAGE */}

        <div className="mt-8 rounded-2xl border border-[#DCE8E1] bg-white px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div className="flex items-center gap-3">

            <div className="w-9 h-9 rounded-lg bg-[#EAF5EF] flex items-center justify-center shrink-0">
              <Shield
                size={18}
                className="text-[#159A62]"
              />
            </div>

            <div>
              <p className="text-sm font-semibold text-[#26332C]">
                One place for everyday security checks
              </p>

              <p className="text-xs text-[#7B8881] mt-0.5">
                Check suspicious content before interacting with it.
              </p>
            </div>

          </div>

          <span className="text-xs font-semibold text-[#159A62]">
            Guardian AI
          </span>

        </div>

      </div>
    </section>
  );
}

export default Features;