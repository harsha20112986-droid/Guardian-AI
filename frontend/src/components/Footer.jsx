import {
  ShieldCheck,
  Mail,
  Heart,
  Globe,
  QrCode,
  MessageSquare,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-[#18241F] border-t border-[#30423A]">
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-12 md:py-14">

        <div className="grid md:grid-cols-[1.4fr_0.8fr_0.9fr] gap-10 md:gap-14">

          <div>
            <Link
              to="/"
              className="inline-flex items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-[#263D32] border border-[#4B6759] flex items-center justify-center">
                <ShieldCheck
                  size={24}
                  className="text-[#5ED394]"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Guardian AI
                </h2>

                <p className="text-xs text-[#B7C4BE] mt-0.5">
                  AI Cybersecurity Platform
                </p>
              </div>
            </Link>

            <p className="text-[#D0D8D4] text-sm mt-5 leading-7 max-w-md">
              A cybersecurity platform designed to help users identify
              suspicious URLs, QR codes and scam messages before interacting
              with them.
            </p>

            <div className="mt-5 flex items-center gap-2 text-sm text-[#C1CCC6]">
              <span className="w-2 h-2 rounded-full bg-[#5ED394]" />
              Security tools available
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-5">
              Security Tools
            </h3>

            <div className="space-y-2">

              <Link
                to="/url-scanner"
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#F1F5F3] hover:bg-[#263D32] hover:text-[#5ED394] transition-colors"
              >
                <Globe
                  size={18}
                  className="text-[#72D9A1] shrink-0"
                />

                <span className="text-sm font-medium text-[#F1F5F3]">
                  URL Scanner
                </span>

                <ArrowUpRight
                  size={15}
                  className="ml-auto text-[#94A59C]"
                />
              </Link>

              <Link
                to="/qr-scanner"
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#F1F5F3] hover:bg-[#263D32] hover:text-[#75C1D8] transition-colors"
              >
                <QrCode
                  size={18}
                  className="text-[#75C1D8] shrink-0"
                />

                <span className="text-sm font-medium text-[#F1F5F3]">
                  QR Scanner
                </span>

                <ArrowUpRight
                  size={15}
                  className="ml-auto text-[#94A59C]"
                />
              </Link>

              <Link
                to="/sms-scanner"
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#F1F5F3] hover:bg-[#263D32] hover:text-[#D8AE63] transition-colors"
              >
                <MessageSquare
                  size={18}
                  className="text-[#D8AE63] shrink-0"
                />

                <span className="text-sm font-medium text-[#F1F5F3]">
                  SMS Scanner
                </span>

                <ArrowUpRight
                  size={15}
                  className="ml-auto text-[#94A59C]"
                />
              </Link>

              <Link
                to="/analytics"
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[#F1F5F3] hover:bg-[#263D32] hover:text-[#B49DD5] transition-colors"
              >
                <BarChart3
                  size={18}
                  className="text-[#B49DD5] shrink-0"
                />

                <span className="text-sm font-medium text-[#F1F5F3]">
                  Analytics
                </span>

                <ArrowUpRight
                  size={15}
                  className="ml-auto text-[#94A59C]"
                />
              </Link>

            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white mb-5">
              Contact
            </h3>

            <a
              href="mailto:harsha20112986@gmail.com"
              className="flex items-center gap-3 w-full p-3 rounded-xl bg-[#21342B] border border-[#3A5146] hover:border-[#5ED394] transition-colors"
            >
              <div className="w-10 h-10 shrink-0 rounded-lg bg-[#2B4539] border border-[#4B6759] flex items-center justify-center">
                <Mail
                  size={18}
                  className="text-[#BFD0C8]"
                />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-[#AABAB2] mb-1">
                  Email
                </p>

                <span className="text-sm font-medium text-white break-all">
                  harsha20112986@gmail.com
                </span>
              </div>
            </a>

            <p className="text-[#C1CCC6] text-sm mt-5 leading-6">
              Questions, suggestions or feedback about Guardian AI?
              We'd be happy to hear from you.
            </p>

            <a
  href="https://github.com/harsha20112986-droid/Guardian-AI"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-[#263D32] border border-[#4B6759] text-[#FFFFFF] hover:bg-[#31503F] hover:border-[#5ED394] hover:text-[#FFFFFF] transition-all duration-200"
>
  <span className="text-sm font-semibold text-white">
    GitHub Repository
  </span>

  <ArrowUpRight
    size={16}
    className="text-[#5ED394]"
  />
</a>
          </div>

        </div>

        <div className="border-t border-[#30423A] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-[#A9B7B0] text-xs">

          <p className="text-center md:text-left">
            © 2026 Guardian AI. All rights reserved.
          </p>

          <p className="flex items-center gap-1.5">
            Built with

            <Heart
              className="text-[#E16D6D]"
              size={13}
              fill="currentColor"
            />

            <span className="text-[#C1CCC6]">
              React • FastAPI • Machine Learning
            </span>
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;