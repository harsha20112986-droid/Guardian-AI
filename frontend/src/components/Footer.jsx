import {
  ShieldCheck,
  Mail,
  Heart,
  Globe,
  QrCode,
  MessageSquare,
  BarChart3,
  Github,
} from "lucide-react";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="relative w-full border-t border-slate-800 bg-slate-950">

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-12">

        {/* Main Footer */}

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">

          {/* Project Info */}

          <div>

            <div className="flex items-center gap-3">

              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/10">

                <ShieldCheck
                  className="text-emerald-400"
                  size={27}
                />

              </div>

              <div>

                <h2 className="text-xl font-bold text-white">
                  Guardian AI
                </h2>

                <p className="text-xs text-gray-500">
                  AI Cybersecurity Platform
                </p>

              </div>

            </div>

            <p className="text-gray-400 text-sm mt-4 leading-7 max-w-md">
              AI-powered cybersecurity platform for detecting phishing URLs,
              malicious QR codes and scam SMS messages using Machine Learning
              and rule-based analysis.
            </p>

          </div>

          {/* Security Tools */}

          <div>

            <h3 className="text-white text-base font-semibold mb-4">
              Security Tools
            </h3>

            <div className="space-y-3">

              <Link
                to="/url-scanner"
                className="flex items-center gap-3 text-gray-400 hover:text-emerald-400 transition-colors"
              >
                <Globe size={17} />
                <span>URL Scanner</span>
              </Link>

              <Link
                to="/qr-scanner"
                className="flex items-center gap-3 text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <QrCode size={17} />
                <span>QR Scanner</span>
              </Link>

              <Link
                to="/sms-scanner"
                className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors"
              >
                <MessageSquare size={17} />
                <span>SMS Scanner</span>
              </Link>

              <Link
                to="/analytics"
                className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors"
              >
                <BarChart3 size={17} />
                <span>Analytics Dashboard</span>
              </Link>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-white text-base font-semibold mb-4">
              Contact
            </h3>

            <a
              href="mailto:harsha20112986@gmail.com"
              className="
                inline-flex
                items-center
                gap-3
                text-gray-400
                hover:text-emerald-400
                transition-colors
              "
            >

              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">

                <Mail size={18} />

              </div>

              <span className="text-sm break-all">
                harsha20112986@gmail.com
              </span>

            </a>

            <p className="text-gray-500 text-sm mt-4 leading-6 max-w-sm">
              Have questions or feedback about Guardian AI?
              Feel free to get in touch.
            </p>

            <a
              href="https://github.com/harsha20112986-droid/Guardian-AI"
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-flex
                items-center
                gap-2
                mt-4
                text-sm
                text-gray-400
                hover:text-white
                transition-colors
              "
            >
              <Github size={18} />
              GitHub Repository
            </a>

          </div>

        </div>

        {/* Bottom */}

        <div
          className="
            border-t
            border-slate-800
            mt-9
            pt-6
            flex
            flex-col
            md:flex-row
            justify-between
            items-center
            gap-3
            text-gray-500
            text-xs
          "
        >

          <p className="text-center md:text-left">
            © 2026 Guardian AI. All Rights Reserved.
          </p>

          <p className="flex items-center gap-2">

            Built with

            <Heart
              className="text-red-500"
              size={14}
              fill="currentColor"
            />

            React • FastAPI • Machine Learning

          </p>

        </div>

      </div>

    </footer>
  );
}

export default Footer;