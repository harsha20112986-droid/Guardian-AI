import {
  ShieldCheck,
  Brain,
  Lock,
  Zap,
  CheckCircle2,
} from "lucide-react";

function WhyGuardian() {
  const items = [
    {
      icon: (
        <Brain
          size={32}
          className="text-purple-400"
        />
      ),
      title: "AI Powered Detection",
      description:
        "Machine Learning and intelligent rule-based analysis accurately identify phishing websites, malicious QR codes and scam SMS messages.",
    },

    {
      icon: (
        <Zap
          size={32}
          className="text-yellow-400"
        />
      ),
      title: "Real-Time Analysis",
      description:
        "Every scan is processed instantly, giving users immediate threat detection and confidence scores.",
    },

    {
      icon: (
        <Lock
          size={32}
          className="text-cyan-400"
        />
      ),
      title: "Privacy Focused",
      description:
        "Guardian AI performs security analysis without collecting unnecessary personal information, helping users stay protected while respecting privacy.",
    },

    {
      icon: (
        <ShieldCheck
          size={32}
          className="text-emerald-400"
        />
      ),
      title: "Trusted Protection",
      description:
        "Designed to help users identify online scams before opening suspicious websites, QR codes or SMS links.",
    },
  ];

  return (
    <section className="relative w-full overflow-hidden">

      {/* Background Glow */}

      <div
        className="
          absolute
          top-20
          right-[-150px]
          w-[350px]
          h-[350px]
          bg-emerald-500/5
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-0
          left-[-150px]
          w-[350px]
          h-[350px]
          bg-cyan-500/5
          rounded-full
          blur-3xl
          pointer-events-none
        "
      />

      {/* Main Container */}

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* Section Header */}

        <div className="text-center mb-10 md:mb-12">

          <div
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-emerald-500/10
              border
              border-emerald-500/20
              text-emerald-400
              text-xs
              md:text-sm
              font-semibold
              mb-4
            "
          >
            <ShieldCheck size={15} />

            Built for Your Security
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Why Guardian AI?
          </h2>

          <p
            className="
              text-gray-400
              mt-4
              text-sm
              md:text-base
              max-w-2xl
              mx-auto
              leading-7
            "
          >
            Guardian AI combines Artificial Intelligence, Machine Learning
            and cybersecurity techniques to help users identify modern
            phishing attacks before they become victims.
          </p>

        </div>

        {/* Feature Grid */}

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">

          {items.map((item, index) => (
            <div
              key={index}
              className="
                group
                relative
                overflow-hidden
                bg-slate-900/90
                rounded-2xl
                p-6
                md:p-7
                border
                border-slate-800
                hover:border-emerald-500/50
                hover:shadow-xl
                hover:shadow-emerald-500/10
                transition-all
                duration-300
                hover:-translate-y-1.5
              "
            >

              {/* Hover Glow */}

              <div
                className="
                  absolute
                  -top-16
                  -right-16
                  w-36
                  h-36
                  rounded-full
                  bg-emerald-500/10
                  blur-3xl
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity
                  duration-500
                  pointer-events-none
                "
              />

              {/* Icon */}

              <div
                className="
                  relative
                  z-10
                  w-12
                  h-12
                  rounded-xl
                  bg-slate-800
                  border
                  border-slate-700
                  flex
                  items-center
                  justify-center
                  group-hover:border-emerald-500/40
                  group-hover:bg-emerald-500/5
                  transition-all
                  duration-300
                "
              >
                {item.icon}
              </div>

              {/* Content */}

              <div className="relative z-10">

                <h3
                  className="
                    text-xl
                    md:text-2xl
                    font-bold
                    text-white
                    mt-5
                    group-hover:text-emerald-400
                    transition-colors
                    duration-300
                  "
                >
                  {item.title}
                </h3>

                <p className="text-gray-400 text-sm md:text-base mt-3 leading-7">
                  {item.description}
                </p>

              </div>

              {/* Bottom Indicator */}

              <div
                className="
                  relative
                  z-10
                  mt-5
                  pt-4
                  border-t
                  border-slate-800
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-gray-500
                  group-hover:text-emerald-400
                  transition-colors
                  duration-300
                "
              >
                <CheckCircle2 size={15} />

                Protected by Guardian AI
              </div>

            </div>
          ))}

        </div>

      </div>

    </section>
  );
}

export default WhyGuardian;