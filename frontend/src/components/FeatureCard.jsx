function FeatureCard({ icon, title, description }) {
  return (
    <div className="
      bg-white/5
      backdrop-blur-lg
      border border-white/10
      rounded-2xl
      p-8
      hover:scale-105
      hover:border-emerald-500
      transition-all
      duration-300
      shadow-xl">

      <div className="mb-5">
        {icon}
      </div>

      <h3 className="text-2xl text-white font-bold">
        {title}
      </h3>

      <p className="text-gray-400 mt-3">
        {description}
      </p>

    </div>
  );
}

export default FeatureCard;