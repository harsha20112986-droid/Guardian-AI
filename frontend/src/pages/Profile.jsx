import {
  ShieldCheck,
  User,
  Mail,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  LogOut,
  Settings,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, logout } = useAuth();

  const displayName = user?.name || "Guardian User";
  const email = user?.email || "No email available";
  const role = user?.role || "User";

  const initial = displayName
    .charAt(0)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <main className="relative min-h-full overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">

      <div className="pointer-events-none absolute right-[-160px] top-[-120px] h-[380px] w-[380px] rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-140px] left-[-140px] h-[350px] w-[350px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl">

        <div className="mb-8">

          <div className="mb-3 inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-700">
            <ShieldCheck size={15} />
            ACCOUNT CENTER
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#17201C] md:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-[#718078] md:text-base">
            Manage your Guardian AI account and security activity.
          </p>

        </div>

        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">

          <section className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_16px_40px_rgba(23,32,28,0.06)] md:p-8">

            <div className="flex flex-col items-center text-center">

              <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#E5F4EC] bg-[#DDF1E5] text-3xl font-bold text-[#159A62]">
                {initial}
              </div>

              <h2 className="mt-5 text-2xl font-bold text-[#17201C]">
                {displayName}
              </h2>

              <div className="mt-2 flex items-center gap-2 text-sm text-[#718078]">
                <Mail size={15} />
                {email}
              </div>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-[#159A62]">
                <ShieldCheck size={14} />
                {role}
              </div>

            </div>

            <div className="my-7 h-px bg-[#E7EEEA]" />

            <div className="space-y-3">

              <Link
                to="/settings"
                className="flex items-center gap-3 rounded-xl border border-[#DDE8E2] bg-[#F8FAF9] px-4 py-3 text-sm font-semibold text-[#526158] transition hover:border-[#BFD9CB] hover:bg-emerald-50 hover:text-[#159A62]"
              >
                <Settings size={18} />
                Account Settings
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100"
              >
                <LogOut size={18} />
                Log Out
              </button>

            </div>

          </section>

          <div className="space-y-6">

            <section className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_16px_40px_rgba(23,32,28,0.06)] md:p-8">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
                  <BarChart3
                    size={21}
                    className="text-[#159A62]"
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#17201C]">
                    Security Overview
                  </h2>

                  <p className="mt-1 text-sm text-[#7A8780]">
                    Your Guardian AI activity at a glance.
                  </p>
                </div>

              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl border border-[#DDE8E2] bg-[#F8FAF9] p-5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#E1E8E4]">
                    <BarChart3
                      size={18}
                      className="text-[#159A62]"
                    />
                  </div>

                  <p className="mt-4 text-2xl font-bold text-[#17201C]">
                    —
                  </p>

                  <p className="mt-1 text-xs text-[#7A8780]">
                    Total Scans
                  </p>

                </div>

                <div className="rounded-2xl border border-[#DDE8E2] bg-[#F8FAF9] p-5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#E1E8E4]">
                    <CheckCircle2
                      size={18}
                      className="text-[#159A62]"
                    />
                  </div>

                  <p className="mt-4 text-2xl font-bold text-[#17201C]">
                    —
                  </p>

                  <p className="mt-1 text-xs text-[#7A8780]">
                    Safe Scans
                  </p>

                </div>

                <div className="rounded-2xl border border-[#DDE8E2] bg-[#F8FAF9] p-5">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white border border-[#E1E8E4]">
                    <ShieldAlert
                      size={18}
                      className="text-[#D94A4A]"
                    />
                  </div>

                  <p className="mt-4 text-2xl font-bold text-[#17201C]">
                    —
                  </p>

                  <p className="mt-1 text-xs text-[#7A8780]">
                    Threats
                  </p>

                </div>

              </div>

            </section>

            <section className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_16px_40px_rgba(23,32,28,0.06)] md:p-8">

              <div className="flex items-start gap-4">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
                  <User
                    size={21}
                    className="text-[#159A62]"
                  />
                </div>

                <div>

                  <h2 className="text-lg font-bold text-[#17201C]">
                    Account Information
                  </h2>

                  <div className="mt-4 space-y-3 text-sm">

                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-[#8A9690]">
                        Name
                      </span>
                      <span className="font-medium text-[#34413A]">
                        {displayName}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-[#8A9690]">
                        Email
                      </span>
                      <span className="font-medium text-[#34413A] break-all sm:text-right">
                        {email}
                      </span>
                    </div>

                    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
                      <span className="text-[#8A9690]">
                        Account Type
                      </span>
                      <span className="font-medium text-[#34413A]">
                        {role}
                      </span>
                    </div>

                  </div>

                </div>

              </div>

            </section>

          </div>

        </div>

      </div>

    </main>
  );
}

export default Profile;