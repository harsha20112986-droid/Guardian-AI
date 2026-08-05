import { useState } from "react";
import {
  Shield,
  Bell,
  Menu,
  X,
  Github,
  History,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `transition-all duration-300 font-medium ${
      isActive
        ? "text-emerald-400"
        : "text-gray-300 hover:text-emerald-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 shadow-lg">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}

        <NavLink
          to="/"
          className="flex items-center gap-3"
        >
          <Shield
            size={34}
            className="text-emerald-400"
          />

          <div>

            <h1 className="text-2xl font-bold text-white">
              Guardian AI
            </h1>

            <p className="text-xs text-gray-400">
              AI Cybersecurity Platform
            </p>

          </div>

        </NavLink>

        {/* Desktop Navigation */}

        <div className="hidden lg:flex items-center gap-8">

          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/url-scanner" className={navClass}>
            URL Scanner
          </NavLink>

          <NavLink to="/qr-scanner" className={navClass}>
            QR Scanner
          </NavLink>

          <NavLink to="/sms-scanner" className={navClass}>
            SMS Scanner
          </NavLink>

          <NavLink to="/analytics" className={navClass}>
            Analytics
          </NavLink>

          <NavLink
            to="/history"
            className={navClass}
          >
            History
          </NavLink>

        </div>

        {/* Right Side */}

        <div className="hidden lg:flex items-center gap-4">

          {/* Notification */}

          <button className="relative p-2 rounded-full hover:bg-slate-800 transition">

            <Bell
              size={22}
              className="text-gray-300"
            />

            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>

          </button>

          {/* GitHub */}

          <a
            href="https://github.com/harsha20112986-droid/Guardian-AI"
            target="_blank"
            rel="noopener noreferrer"
          >

            <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-5 py-2 rounded-xl font-semibold transition-all duration-300 hover:scale-105">

              <Github size={18} />

              GitHub

            </button>

          </a>

        </div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white"
        >
          {menuOpen ? (
            <X size={30} />
          ) : (
            <Menu size={30} />
          )}
        </button>

      </div>

      {/* Mobile Menu */}

      {menuOpen && (

        <div className="lg:hidden bg-slate-900 border-t border-slate-800">

          <div className="flex flex-col p-6 gap-5">

            <NavLink
              to="/"
              className={navClass}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </NavLink>

            <NavLink
              to="/url-scanner"
              className={navClass}
              onClick={() => setMenuOpen(false)}
            >
              URL Scanner
            </NavLink>

            <NavLink
              to="/qr-scanner"
              className={navClass}
              onClick={() => setMenuOpen(false)}
            >
              QR Scanner
            </NavLink>

            <NavLink
              to="/sms-scanner"
              className={navClass}
              onClick={() => setMenuOpen(false)}
            >
              SMS Scanner
            </NavLink>

            <NavLink
              to="/analytics"
              className={navClass}
              onClick={() => setMenuOpen(false)}
            >
              Analytics
            </NavLink>

            <NavLink
              to="/history"
              className={navClass}
              onClick={() => setMenuOpen(false)}
            >
              History
            </NavLink>

            <a
              href="https://github.com/harsha20112986-droid/Guardian-AI"
              target="_blank"
              rel="noopener noreferrer"
            >

              <button className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl font-semibold transition">

                GitHub Repository

              </button>

            </a>

          </div>

        </div>

      )}

    </nav>
  );
}

export default Navbar;