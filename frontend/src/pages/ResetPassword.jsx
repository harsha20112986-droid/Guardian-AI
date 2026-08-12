import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/api";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalidToken(true);
    }
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const validatePassword = () => {
    const password = formData.newPassword;

    if (password.length < 8) {
      toast.warning(
        "Password must contain at least 8 characters."
      );
      return false;
    }

    if (password !== formData.confirmPassword) {
      toast.warning(
        "Passwords do not match."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error(
        "Invalid or missing password reset token."
      );
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/reset-password",
        {
          token,
          new_password: formData.newPassword,
        }
      );

      setSuccess(true);

      toast.success(
        response.data?.message ||
          "Password reset successfully."
      );
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      const message =
        error.response?.data?.detail ||
        "Unable to reset your password.";

      toast.error(message);

      if (
        error.response?.status === 400
      ) {
        setInvalidToken(true);
      }
    } finally {
      setLoading(false);
    }
  };

  if (invalidToken && !success) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">
        <div className="pointer-events-none absolute right-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-160px] left-[-140px] h-[380px] w-[380px] rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
          <div className="w-full">
            <div className="mb-7 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-red-100 bg-red-50">
                <AlertTriangle
                  size={30}
                  className="text-red-500"
                />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#17201C]">
                Invalid Reset Link
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#7A8780]">
                This password reset link is missing,
                invalid, or has expired.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 text-center shadow-[0_18px_50px_rgba(23,32,28,0.07)] md:p-8">
              <p className="text-sm leading-6 text-[#68766F]">
                Password reset links are valid for
                30 minutes. Please request a new
                reset link if you still need to change
                your password.
              </p>

              <Link
                to="/forgot-password"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#159A62] py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#108653] hover:shadow-md"
              >
                <KeyRound size={18} />
                Request New Reset Link
              </Link>

              <Link
                to="/login"
                className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-[#52605A] transition hover:text-[#159A62]"
              >
                <ArrowLeft size={17} />
                Back to Login
              </Link>
            </div>

            <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8A9690]">
              <ShieldCheck
                size={15}
                className="text-[#159A62]"
              />
              Secure password recovery by Guardian AI
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">
        <div className="pointer-events-none absolute right-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-100/60 blur-3xl" />

        <div className="pointer-events-none absolute bottom-[-160px] left-[-140px] h-[380px] w-[380px] rounded-full bg-cyan-100/50 blur-3xl" />

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
          <div className="w-full">
            <div className="mb-7 text-center">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
                <CheckCircle2
                  size={30}
                  className="text-[#159A62]"
                />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#17201C]">
                Password Updated
              </h1>

              <p className="mt-2 text-sm leading-6 text-[#7A8780]">
                Your Guardian AI password has been
                changed successfully.
              </p>
            </div>

            <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 text-center shadow-[0_18px_50px_rgba(23,32,28,0.07)] md:p-8">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <ShieldCheck
                  size={32}
                  className="text-[#159A62]"
                />
              </div>

              <h2 className="text-lg font-bold text-[#17201C]">
                You're all set
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#7A8780]">
                You can now sign in using your new
                password.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/login", {
                    replace: true,
                  })
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#159A62] py-3.5 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#108653] hover:shadow-md"
              >
                Go to Login
                <ArrowRight size={18} />
              </button>
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

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">
      <div className="pointer-events-none absolute right-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-160px] left-[-140px] h-[380px] w-[380px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-7 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
              <KeyRound
                size={30}
                className="text-[#159A62]"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#17201C] md:text-4xl">
              Create New Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#7A8780]">
              Choose a strong new password for your
              Guardian AI account.
            </p>
          </div>

          <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_18px_50px_rgba(23,32,28,0.07)] md:p-8">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="newPassword"
                  className="mb-2 block text-sm font-semibold text-[#34413A]"
                >
                  New Password
                </label>

                <div className="relative">
                  <Lock
                    size={19}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA59F]"
                  />

                  <input
                    id="newPassword"
                    name="newPassword"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    placeholder="Enter new password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#D7E2DC] bg-[#F8FAF9] py-3.5 pl-11 pr-12 text-sm text-[#25312B] outline-none placeholder:text-[#9AA59F] focus:border-[#159A62] focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (previous) => !previous
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

                <p className="mt-2 text-xs text-[#8A9690]">
                  Minimum 8 characters.
                </p>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-semibold text-[#34413A]"
                >
                  Confirm New Password
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
                    placeholder="Confirm new password"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-[#D7E2DC] bg-[#F8FAF9] py-3.5 pl-11 pr-12 text-sm text-[#25312B] outline-none placeholder:text-[#9AA59F] focus:border-[#159A62] focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (previous) => !previous
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#159A62] py-3.5 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#108653] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={19}
                      className="animate-spin"
                    />
                    Updating Password...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-[#E7EEEA] pt-5">
              <Link
                to="/login"
                className="mx-auto flex items-center justify-center gap-2 text-sm font-semibold text-[#52605A] transition hover:text-[#159A62]"
              >
                <ArrowLeft size={17} />
                Back to Login
              </Link>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-[#8A9690]">
            <ShieldCheck
              size={15}
              className="text-[#159A62]"
            />
            Secure password recovery by Guardian AI
          </div>
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;