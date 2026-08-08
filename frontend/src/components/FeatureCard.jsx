import { motion } from "framer-motion";

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.03,
      }}
      transition={{
        duration: 0.3,
      }}
      className="group bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-2xl p-8 shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
    >
      <div className="w-16 h-16 rounded-2xl bg-slate-800 group-hover:bg-emerald-500/10 flex items-center justify-center mb-6 transition-all duration-300">
        {icon}
      </div>

      <h3 className="text-2xl font-bold text-white mb-4">
        {title}
      </h3>

      <p className="text-gray-400 leading-7">
        {description}
      </p>
    </motion.div>
  );
}

export default FeatureCard;