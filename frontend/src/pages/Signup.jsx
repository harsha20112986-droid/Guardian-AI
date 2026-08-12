import { useState } from "react";
import {
  ShieldCheck,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/api";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
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

    const name = formData.name.trim();
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!name) {
      toast.warning("Please enter your name.");
      return;
    }

    if (!email) {
      toast.warning("Please enter your email.");
      return;
    }

    if (!password) {
      toast.warning("Please enter a password.");
      return;
    }

    if (password.length < 8) {
      toast.warning(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.warning("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/signup", {
        name,
        email,
        password,
      });

      toast.success(
        response.data?.message ||
          "Account created successfully!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 800);
    } catch (error) {
      console.error("Signup error:", error);

      toast.error(
        error.response?.data?.detail ||
          "Unable to create your account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">

      <div className="pointer-events-none absolute left-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-160px] right-[-140px] h-[380px] w-[380px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">

        <div className="hidden lg:block">

          <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-emerald-700">
            <ShieldCheck size={15} />
            JOIN GUARDIAN AI
          </div>

          <h1 className="max-w-lg text-4xl font-bold leading-tight tracking-tight text-[#17201C] xl:text-5xl">
            Build safer
            <span className="block text-[#159A62]">
              online habits.
            </span>
          </h1>

          <p className="mt-5 max-w-md text-[16px] leading-7 text-[#68766F]">
            Create your Guardian AI account and keep your
            security scans, results and activity together in
            one place.
          </p>

          <div className="mt-8 space-y-4">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white">
                <CheckCircle2
                  size={19}
                  className="text-[#159A62]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#34413A]">
                  Personal security dashboard
                </p>
                <p className="text-xs text-[#8A9690]">
                  Keep your security activity organized.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white">
                <ShieldCheck
                  size={19}
                  className="text-[#159A62]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#34413A]">
                  Intelligent threat detection
                </p>
                <p className="text-xs text-[#8A9690]">
                  Analyze suspicious digital content before acting.
                </p>
              </div>

            </div>

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-white">
                <Lock
                  size={19}
                  className="text-[#159A62]"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#34413A]">
                  Account-based access
                </p>
                <p className="text-xs text-[#8A9690]">
                  Access your personal scans after signing in.
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
              Create Account
            </h1>

            <p className="mt-2 text-sm text-[#7A8780]">
              Join Guardian AI and stay protected
            </p>

          </div>

          <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_18px_50px_rgba(23,32,28,0.07)] md:p-8">

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              <div>

                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-[#34413A]"
                >
                  Full Name
                </label>

                <div className="relative">

                  <User
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA59F]"
                  />

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="name"
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
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
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

              <div>

                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#34413A]"
                >
                  Confirm Password
                </label>

                <div className="relative">

                  <Lock
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA59F]"
                  />

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
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
                      setShowConfirmPassword(
                        (previous) =>
                          !previous
                      )
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-[#8A9690] transition hover:bg-emerald-50 hover:text-[#159A62]"
                    aria-label={
                      showConfirmPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>

                </div>

                <p className="mt-2 text-xs text-[#8A9690]">
                  Use at least 8 characters for your password.
                </p>

              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-2
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={19} />
                  </>
                )}

              </button>

            </form>

            <div className="my-6 flex items-center gap-3">

              <div className="h-px flex-1 bg-[#E7EEEA]" />

              <span className="text-xs text-[#9AA59F]">
                Already registered?
              </span>

              <div className="h-px flex-1 bg-[#E7EEEA]" />

            </div>

            <Link
              to="/login"
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
              Sign in to your account
            </Link>

          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8A9690]">
            <ShieldCheck
              size={15}
              className="text-[#159A62]"
            />
            Your account is protected by Guardian AI
          </div>

        </div>

      </div>

    </main>
  );
}

export default Signup;