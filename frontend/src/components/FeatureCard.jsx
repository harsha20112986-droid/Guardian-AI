import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        scale: 1.015,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        group
        relative
        overflow-hidden
        bg-slate-900/90
        border
        border-slate-800
        hover:border-emerald-500/50
        rounded-2xl
        p-6
        md:p-7
        shadow-lg
        hover:shadow-xl
        hover:shadow-emerald-500/10
        transition-all
        duration-300
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
          bg-emerald-500/10
          rounded-full
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
          flex
          items-center
          justify-center
          rounded-xl
          bg-slate-800
          border
          border-slate-700
          group-hover:border-emerald-500/40
          group-hover:bg-emerald-500/5
          transition-all
          duration-300
          mb-5
        "
      >
        {icon}
      </div>

      {/* Content */}

      <div className="relative z-10">

        <h3
          className="
            text-xl
            font-bold
            text-white
            mb-3
            group-hover:text-emerald-400
            transition-colors
            duration-300
          "
        >
          {title}
        </h3>

        <p className="text-gray-400 text-sm md:text-base leading-7">
          {description}
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
          justify-between
          text-xs
          text-gray-500
          group-hover:text-emerald-400
          transition-colors
          duration-300
        "
      >
        <span>
          Guardian AI Protection
        </span>

        <ArrowUpRight
          size={17}
          className="
            opacity-0
            translate-x-[-4px]
            group-hover:opacity-100
            group-hover:translate-x-0
            transition-all
            duration-300
          "
        />
      </div>

    </motion.div>
  );
}

export default FeatureCard;