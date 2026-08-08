import { useState } from "react";
import {
  Shield,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navClass = ({ isActive }) =>
    `transition-all duration-300 font-medium ${
      isActive
        ? "text-emerald-400 border-b-2 border-emerald-400 pb-1"
        : "text-gray-300 hover:text-emerald-400"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">

      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

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

          <NavLink to="/history" className={navClass}>
            History
          </NavLink>

          <NavLink to="/about" className={navClass}>
            About
          </NavLink>

          <NavLink to="/settings" className={navClass}>
            Settings
          </NavLink>

        </div>

        <div className="hidden lg:flex items-center">

          <button className="relative p-2 rounded-full hover:bg-slate-800 transition">

            <Bell
              size={22}
              className="text-gray-300"
            />

            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

          </button>

        </div>

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

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >

        <div className="bg-slate-900 border-t border-slate-800 px-6 py-6 space-y-5">

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

          <NavLink
            to="/about"
            className={navClass}
            onClick={() => setMenuOpen(false)}
          >
            About
          </NavLink>

          <NavLink
            to="/settings"
            className={navClass}
            onClick={() => setMenuOpen(false)}
          >
            Settings
          </NavLink>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;