import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ScanLine,
  ShieldAlert,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../context/AuthContext";
import api from "../api/api";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      toast.warning("Please enter your email.");
      return;
    }

    if (!password) {
      toast.warning("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data = response.data;

      if (!data.access_token || !data.user) {
        throw new Error(
          "Invalid login response from server."
        );
      }

      login(
        data.user,
        data.access_token,
        data.token_type || "bearer"
      );

      toast.success("Login successful!");

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.detail ||
        error.message ||
        "Invalid email or password.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">

      <div className="pointer-events-none absolute right-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-160px] left-[-140px] h-[380px] w-[380px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">

        <div className="hidden lg:block">

          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-700">
            <ShieldCheck size={15} />
            GUARDIAN AI SECURITY
          </div>

          <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight text-[#17201C] xl:text-5xl">
            Your security starts
            <span className="block text-[#159A62]">
              before you click.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-[16px] leading-7 text-[#68766F]">
            Sign in to Guardian AI to access your security
            tools, scan history and personal analytics.
          </p>

          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white">
                <ScanLine
                  size={19}
                  className="text-[#159A62]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#34413A]">
                  Intelligent scanning
                </p>
                <p className="text-xs text-[#8A9690]">
                  Check suspicious URLs, QR codes and messages.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white">
                <ShieldAlert
                  size={19}
                  className="text-[#159A62]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#34413A]">
                  Clear risk analysis
                </p>
                <p className="text-xs text-[#8A9690]">
                  Understand threats before taking action.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white">
                <CheckCircle2
                  size={19}
                  className="text-[#159A62]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#34413A]">
                  Personal scan history
                </p>
                <p className="text-xs text-[#8A9690]">
                  Keep track of your previous security checks.
                </p>
              </div>

            </div>

          </div>

        </div>

        <div className="mx-auto w-full max-w-md">

          <div className="mb-7 text-center">

            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
              <ShieldCheck
                size={30}
                className="text-[#159A62]"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#17201C] md:text-4xl">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-[#7A8780]">
              Sign in to your Guardian AI account
            </p>

          </div>

          <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_18px_50px_rgba(23,32,28,0.07)] md:p-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>

                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-[#34413A]"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA59F]"
                  />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="email"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#D7E2DC]
                      bg-[#F8FAF9]
                      py-3.5
                      pl-11
                      pr-4
                      text-sm
                      text-[#25312B]
                      outline-none
                      placeholder:text-[#9AA59F]
                      focus:border-[#159A62]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-emerald-100
                      disabled:opacity-60
                    "
                  />

                </div>

              </div>

              <div>

                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-semibold text-[#34413A]"
                >
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA59F]"
                  />

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="current-password"
                    className="
                      w-full
                      rounded-xl
                      border
                      border-[#D7E2DC]
                      bg-[#F8FAF9]
                      py-3.5
                      pl-11
                      pr-12
                      text-sm
                      text-[#25312B]
                      outline-none
                      placeholder:text-[#9AA59F]
                      focus:border-[#159A62]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-emerald-100
                      disabled:opacity-60
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8A9690] transition hover:bg-emerald-50 hover:text-[#159A62]"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#159A62]
                  py-3.5
                  font-semibold
                  text-white
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#108653]
                  hover:shadow-md
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  disabled:hover:translate-y-0
                "
              >

                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={19} />
                  </>
                )}

              </button>

            </form>

            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-[#E7EEEA]" />

              <span className="text-xs text-[#9AA59F]">
                New to Guardian AI?
              </span>

              <div className="h-px flex-1 bg-[#E7EEEA]" />

            </div>

            <Link
              to="/signup"
              className="
                flex
                w-full
                items-center
                justify-center
                rounded-xl
                border
                border-[#D7E2DC]
                bg-[#F8FAF9]
                py-3
                text-sm
                font-semibold
                text-[#52605A]
                transition-all
                hover:border-[#BFD9CB]
                hover:bg-emerald-50
                hover:text-[#159A62]
              "
            >
              Create an account
            </Link>

          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8A9690]">
            <ShieldCheck
              size={15}
              className="text-[#159A62]"
            />
            Your security matters to Guardian AI
          </div>

        </div>

      </div>

    </main>
  );
}

export default Login;