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
  Bot,
  BarChart3,
  User,
  History,
  Settings,
  Info,
  ChevronDown,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const closeAllMenus = () => {
    setMenuOpen(false);
    setScannerOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeAllMenus();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    [
      "flex items-center gap-2",
      "px-3 py-2",
      "rounded-lg",
      "text-sm font-medium",
      "transition-all duration-200",
      isActive
        ? "bg-[#E6F4EC] text-[#159A62]"
        : "text-[#526158] hover:bg-[#F0F5F2] hover:text-[#17231D]",
    ].join(" ");

  const mobileNavClass = ({ isActive }) =>
    [
      "flex items-center gap-3",
      "px-4 py-3",
      "rounded-xl",
      "text-sm font-medium",
      "transition-all duration-200",
      isActive
        ? "bg-[#E6F4EC] text-[#159A62]"
        : "text-[#526158] hover:bg-[#F0F5F2] hover:text-[#17231D]",
    ].join(" ");

  return (
    <nav className="guardian-light-nav relative z-50 w-full border-b border-[#D8E3DD] bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 h-16 flex items-center">
        <NavLink
          to="/"
          onClick={closeAllMenus}
          className="flex items-center gap-3 shrink-0"
        >
          <div className="w-9 h-9 rounded-lg bg-[#E5F4EC] border border-[#C7E4D2] flex items-center justify-center">
            <Shield
              size={21}
              strokeWidth={2}
              className="text-[#159A62]"
            />
          </div>

          <div className="hidden sm:block leading-none">
            <h1 className="text-[17px] font-semibold tracking-[-0.02em] text-[#17231D]">
              Guardian AI
            </h1>

            <p className="mt-1 text-[9px] tracking-[0.12em] font-medium text-[#7D8A83]">
              DIGITAL SAFETY
            </p>
          </div>
        </NavLink>

        <div className="hidden lg:flex items-center gap-1 ml-8">
          <NavLink
            to="/"
            end
            className={navClass}
          >
            <Home size={16} strokeWidth={1.8} />
            <span>Home</span>
          </NavLink>

          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setScannerOpen((previous) => !previous);
                setProfileOpen(false);
              }}
              className={[
                "flex items-center gap-2",
                "px-3 py-2",
                "rounded-lg",
                "text-sm font-medium",
                "transition-all duration-200",
                scannerOpen
                  ? "bg-[#E6F4EC] text-[#159A62]"
                  : "text-[#526158] hover:bg-[#F0F5F2] hover:text-[#17231D]",
              ].join(" ")}
            >
              <Link2 size={16} strokeWidth={1.8} />
              <span>Scanners</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  scannerOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {scannerOpen && (
              <div className="absolute left-0 top-full mt-2 w-[280px] bg-white border border-[#D5E0DA] rounded-xl shadow-[0_16px_40px_rgba(23,35,29,0.14)] overflow-hidden">
                <div className="px-4 py-3 bg-[#F3F8F5] border-b border-[#E4ECE7]">
                  <p className="text-[10px] font-bold tracking-[0.13em] text-[#7C8982]">
                    SECURITY TOOLS
                  </p>

                  <p className="mt-1 text-xs text-[#87948D]">
                    Choose a scanner
                  </p>
                </div>

                <div className="p-2">
                  <NavLink
                    to="/url-scanner"
                    onClick={closeAllMenus}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#EAF6EF] transition-colors"
                  >
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#EAF6EF] flex items-center justify-center">
                      <Link2
                        size={17}
                        className="text-[#159A62]"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#26332C]">
                        URL Scanner
                      </p>

                      <p className="text-xs text-[#718078] mt-0.5">
                        Check suspicious links
                      </p>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/qr-scanner"
                    onClick={closeAllMenus}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#EDF6F9] transition-colors"
                  >
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#EDF6F9] flex items-center justify-center">
                      <QrCode
                        size={17}
                        className="text-[#3B82A0]"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#26332C]">
                        QR Scanner
                      </p>

                      <p className="text-xs text-[#718078] mt-0.5">
                        Check QR destinations
                      </p>
                    </div>
                  </NavLink>

                  <NavLink
                    to="/sms-scanner"
                    onClick={closeAllMenus}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FFF7E9] transition-colors"
                  >
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#FFF7E9] flex items-center justify-center">
                      <MessageSquare
                        size={17}
                        className="text-[#C98A19]"
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#26332C]">
                        SMS Scanner
                      </p>

                      <p className="text-xs text-[#718078] mt-0.5">
                        Analyze suspicious messages
                      </p>
                    </div>
                  </NavLink>
                </div>
              </div>
            )}
          </div>

          <NavLink
            to="/assistant"
            className={navClass}
          >
            <Bot size={16} strokeWidth={1.8} />
            <span>Assistant</span>
          </NavLink>

          <NavLink
            to="/analytics"
            className={navClass}
          >
            <BarChart3 size={16} strokeWidth={1.8} />
            <span>Analytics</span>
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              className={navClass}
            >
              <LayoutDashboard
                size={16}
                strokeWidth={1.8}
              />
              <span>Admin</span>
            </NavLink>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            type="button"
            className="relative w-9 h-9 rounded-lg border border-[#D8E3DD] bg-[#F7FAF8] flex items-center justify-center hover:bg-[#EEF5F1] hover:border-[#C5D7CC] transition-all"
            title="Notifications"
          >
            <Bell
              size={17}
              strokeWidth={1.8}
              className="text-[#526158]"
            />

            <span className="absolute top-[7px] right-[7px] w-1.5 h-1.5 rounded-full bg-[#D94A4A]" />
          </button>

          <div className="hidden sm:block relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((previous) => !previous);
                setScannerOpen(false);
              }}
              className={[
                "flex items-center gap-2",
                "px-2 py-1",
                "rounded-lg",
                "border",
                "transition-all duration-200",
                profileOpen
                  ? "border-[#BFDCCB] bg-[#F0F7F3]"
                  : "border-transparent hover:border-[#D8E3DD] hover:bg-[#F5F8F6]",
              ].join(" ")}
            >
              <div className="w-8 h-8 rounded-full bg-[#E1F2E8] border border-[#C5E2D0] flex items-center justify-center text-xs font-bold text-[#159A62]">
                {(user?.name || "H").charAt(0).toUpperCase()}
              </div>

              <div className="hidden md:block text-left max-w-[90px]">
                <p className="text-xs font-semibold text-[#26332C] truncate">
                  {user?.name || "Harsha"}
                </p>
              </div>

              <ChevronDown
                size={14}
                className={`text-[#69776F] transition-transform duration-200 ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="guardian-dropdown absolute right-0 top-full mt-2 w-[260px] bg-white border border-[#D5E0DA] rounded-xl shadow-[0_16px_40px_rgba(23,35,29,0.14)] overflow-hidden">
                <div className="px-4 py-4 bg-[#F2F8F4] border-b border-[#E0EAE4]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#DDF1E5] border border-[#BEDFCA] flex items-center justify-center text-sm font-bold text-[#159A62]">
                      {(user?.name || "H").charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold !text-[#17231D] truncate">
                        {user?.name || "Harsha"}
                      </p>

                      <p className="dropdown-muted text-xs mt-1 truncate">
                        {user?.email || "User account"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <NavLink
                    to="/profile"
                    onClick={closeAllMenus}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium"
                  >
                    <User
                      size={16}
                      className="dropdown-icon"
                    />
                    <span>My Profile</span>
                  </NavLink>

                  <NavLink
                    to="/history"
                    onClick={closeAllMenus}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium"
                  >
                    <History
                      size={16}
                      className="dropdown-icon"
                    />
                    <span>Scan History</span>
                  </NavLink>

                  <NavLink
                    to="/settings"
                    onClick={closeAllMenus}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium"
                  >
                    <Settings
                      size={16}
                      className="dropdown-icon"
                    />
                    <span>Settings</span>
                  </NavLink>

                  <NavLink
                    to="/about"
                    onClick={closeAllMenus}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium"
                  >
                    <Info
                      size={16}
                      className="dropdown-icon"
                    />
                    <span>About</span>
                  </NavLink>

                  {isAdmin && (
                    <>
                      <NavLink
                        to="/admin"
                        onClick={closeAllMenus}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-semibold text-[#159A62] hover:bg-[#EAF6EF]"
                      >
                        <LayoutDashboard size={16} />
                        <span>Admin Dashboard</span>
                      </NavLink>
                    </>
                  )}

                  <div className="my-2 border-t border-[#E5ECE8]" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="dropdown-danger flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium"
                  >
                    <LogOut size={16} />
                    <span>Log out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((previous) => !previous)}
            className="lg:hidden w-9 h-9 rounded-lg border border-[#D8E3DD] bg-[#F7FAF8] flex items-center justify-center hover:bg-[#EEF5F1] transition-all"
            aria-label={
              menuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
          >
            {menuOpen ? (
              <X
                size={20}
                className="text-[#159A62]"
              />
            ) : (
              <Menu
                size={20}
                className="text-[#526158]"
              />
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden border-t border-[#D8E3DD] bg-[#F7FAF8]">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 py-4 space-y-2">
            <NavLink
              to="/"
              end
              className={mobileNavClass}
              onClick={closeAllMenus}
            >
              <Home size={17} />
              <span>Home</span>
            </NavLink>

            <div className="pt-3 pb-1">
              <p className="px-4 text-[10px] font-bold tracking-[0.13em] text-[#7C8982]">
                SECURITY SCANNERS
              </p>
            </div>

            <NavLink
              to="/url-scanner"
              className={mobileNavClass}
              onClick={closeAllMenus}
            >
              <Link2 size={17} />
              <span>URL Scanner</span>
            </NavLink>

            <NavLink
              to="/qr-scanner"
              className={mobileNavClass}
              onClick={closeAllMenus}
            >
              <QrCode size={17} />
              <span>QR Scanner</span>
            </NavLink>

            <NavLink
              to="/sms-scanner"
              className={mobileNavClass}
              onClick={closeAllMenus}
            >
              <MessageSquare size={17} />
              <span>SMS Scanner</span>
            </NavLink>

            <NavLink
              to="/assistant"
              className={mobileNavClass}
              onClick={closeAllMenus}
            >
              <Bot size={17} />
              <span>Assistant</span>
            </NavLink>

            <NavLink
              to="/analytics"
              className={mobileNavClass}
              onClick={closeAllMenus}
            >
              <BarChart3 size={17} />
              <span>Analytics</span>
            </NavLink>

            <NavLink
              to="/history"
              className={mobileNavClass}
              onClick={closeAllMenus}
            >
              <History size={17} />
              <span>Scan History</span>
            </NavLink>

            <NavLink
              to="/settings"
              className={mobileNavClass}
              onClick={closeAllMenus}
            >
              <Settings size={17} />
              <span>Settings</span>
            </NavLink>

            <NavLink
              to="/about"
              className={mobileNavClass}
              onClick={closeAllMenus}
            >
              <Info size={17} />
              <span>About</span>
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={mobileNavClass}
                onClick={closeAllMenus}
              >
                <LayoutDashboard size={17} />
                <span>Admin Dashboard</span>
              </NavLink>
            )}

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-[#D94A4A] hover:bg-[#FFF1F1]"
            >
              <LogOut size={17} />
              <span>Log out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;