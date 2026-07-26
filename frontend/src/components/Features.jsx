import {
  MessageSquareWarning,
  Link2,
  QrCode,
  Shield,
  Globe,
  Bot,
} from "lucide-react";
import FeatureCard from "./FeatureCard";

function Features() {
  return (
    <section className="bg-slate-950 py-20 px-8">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Core Features
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

        <FeatureCard
          icon={<MessageSquareWarning size={40} className="text-emerald-400" />}
          title="SMS Scam Detection"
          description="Analyze suspicious SMS messages using AI."
        />

        <FeatureCard
          icon={<Link2 size={40} className="text-emerald-400" />}
          title="Phishing URL Detection"
          description="Detect fake and malicious websites instantly."
        />

        <FeatureCard
          icon={<QrCode size={40} className="text-emerald-400" />}
          title="QR Code Scanner"
          description="Scan QR codes and identify dangerous links."
        />

        <FeatureCard
          icon={<Bot size={40} className="text-emerald-400" />}
          title="AI Risk Analysis"
          description="Get an AI-generated risk score for suspicious content."
        />

        <FeatureCard
          icon={<Globe size={40} className="text-emerald-400" />}
          title="Fake Website Detection"
          description="Identify cloned websites designed to steal information."
        />

        <FeatureCard
          icon={<Shield size={40} className="text-emerald-400" />}
          title="Privacy Protection"
          description="Receive recommendations to improve your online security."
        />

      </div>
    </section>
  );
}

export default Features;