import {
  ShieldCheck,
  Globe,
  Mail,
  Heart,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-8 py-12">

        <div className="grid md:grid-cols-3 gap-10">

          {/* Project Info */}
          <div>
            <div className="flex items-center gap-3">
              <ShieldCheck
                className="text-emerald-400"
                size={32}
              />

              <h2 className="text-2xl font-bold text-white">
                Guardian AI
              </h2>
            </div>

            <p className="text-gray-400 mt-4 leading-7">
              AI-powered cybersecurity platform for detecting phishing URLs,
              malicious QR codes and scam SMS messages using Machine Learning
              and rule-based analysis.
            </p>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Features
            </h3>

            <ul className="space-y-3 text-gray-400">
              <li>🌐 URL Scanner</li>
              <li>📷 QR Scanner</li>
              <li>💬 SMS Scanner</li>
              <li>📊 Analytics Dashboard</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white text-xl font-semibold mb-4">
              Connect
            </h3>

            <div className="flex gap-5 mt-3">

              <a
                href="https://github.com/harsha20112986-droid/Guardian-AI"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Repository"
              >
                <Globe
                  className="text-gray-400 hover:text-emerald-400 transition"
                  size={24}
                />
              </a>

              <a
                href="mailto:harsha20112986@gmail.com"
                title="Email"
              >
                <Mail
                  className="text-gray-400 hover:text-emerald-400 transition"
                  size={24}
                />
              </a>

            </div>

            <p className="text-gray-400 mt-4 text-sm break-all">
              harsha20112986@gmail.com
            </p>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500">

          <p>
            © 2026 Guardian AI. All Rights Reserved.
          </p>

          <p className="flex items-center gap-2 mt-3 md:mt-0">
            Built with
            <Heart
              className="text-red-500"
              size={16}
              fill="currentColor"
            />
            using React • FastAPI • Machine Learning
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;