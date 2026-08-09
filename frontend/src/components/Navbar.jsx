import { useState } from "react";
import {
  Shield,
  Bell,
  Menu,
  X,
  Home,
  Link2,
  QrCode,
  MessageSquare,
  BarChart3,
  History,
  Info,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    {
      to: "/",
      label: "Home",
      icon: Home,
    },
    {
      to: "/url-scanner",
      label: "URL Scanner",
      icon: Link2,
    },
    {
      to: "/qr-scanner",
      label: "QR Scanner",
      icon: QrCode,
    },
    {
      to: "/sms-scanner",
      label: "SMS Scanner",
      icon: MessageSquare,
    },
    {
      to: "/analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      to: "/history",
      label: "History",
      icon: History,
    },
    {
      to: "/about",
      label: "About",
      icon: Info,
    },
    {
      to: "/settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const desktopNavClass = ({ isActive }) =>
    `relative flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
      isActive
        ? "text-emerald-400"
        : "text-gray-300 hover:text-emerald-400"
    }`;

  const mobileNavClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
      isActive
        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        : "text-gray-300 hover:bg-slate-800 hover:text-emerald-400"
    }`;

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800">

      {/* Main Navbar */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">

        {/* Logo */}

        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3 group"
        >

          <div className="relative">

            <div className="absolute inset-0 bg-emerald-500/20 rounded-xl blur-md group-hover:bg-emerald-500/30 transition" />

            <div className="relative p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">

              <Shield
                size={30}
                className="text-emerald-400"
              />

            </div>

          </div>

          <div className="hidden sm:block">

            <h1 className="text-xl md:text-2xl font-bold text-white leading-tight">
              Guardian AI
            </h1>

            <p className="text-[11px] text-gray-500">
              AI Cybersecurity Platform
            </p>

          </div>

        </NavLink>

        {/* Desktop Navigation */}

        <div className="hidden lg:flex items-center gap-6">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={desktopNavClass}
              >

                <Icon size={16} />

                {item.label}

                {/* Active indicator */}

                <span
                  className="
                    absolute
                    -bottom-7
                    left-0
                    right-0
                    h-0.5
                    bg-emerald-400
                    rounded-full
                    opacity-0
                    scale-x-0
                    transition-all
                    duration-300
                  "
                />

              </NavLink>
            );
          })}

        </div>

        {/* Right Side */}

        <div className="flex items-center gap-3">

          {/* Notification */}

          <button
            type="button"
            className="
              hidden
              sm:flex
              relative
              p-2.5
              rounded-xl
              bg-slate-900
              border
              border-slate-800
              hover:border-emerald-500/30
              hover:bg-slate-800
              transition
            "
            title="Notifications"
          >

            <Bell
              size={20}
              className="text-gray-300"
            />

            <span
              className="
                absolute
                top-1.5
                right-1.5
                w-2
                h-2
                rounded-full
                bg-red-500
                ring-2
                ring-slate-950
              "
            />

          </button>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="
              lg:hidden
              p-2.5
              rounded-xl
              bg-slate-900
              border
              border-slate-800
              hover:border-emerald-500/30
              transition
            "
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
          >

            {menuOpen ? (
              <X
                size={26}
                className="text-emerald-400"
              />
            ) : (
              <Menu
                size={26}
                className="text-gray-300"
              />
            )}

          </button>

        </div>

      </div>

      {/* Mobile Navigation */}

      <div
        className={`
          lg:hidden
          overflow-hidden
          transition-all
          duration-300
          ${
            menuOpen
              ? "max-h-[700px] opacity-100"
              : "max-h-0 opacity-0"
          }
        `}
      >

        <div className="border-t border-slate-800 bg-slate-950 px-4 sm:px-6 py-5">

          <div className="max-w-7xl mx-auto space-y-2">

            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={mobileNavClass}
                  onClick={closeMenu}
                >

                  <Icon size={19} />

                  <span>
                    {item.label}
                  </span>

                </NavLink>
              );
            })}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;