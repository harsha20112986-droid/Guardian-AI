import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  Loader2,
  ArrowLeft,
  CheckCircle2,
  KeyRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      toast.warning("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/forgot-password",
        {
          email: normalizedEmail,
        }
      );

      setSent(true);

      toast.success(
        response.data?.message ||
          "If the account exists, a reset link has been sent."
      );
    } catch (error) {
      console.error(
        "Forgot password error:",
        error
      );

      const message =
        error.response?.data?.detail ||
        "Unable to process your request. Please try again.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">
      <div className="pointer-events-none absolute right-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-emerald-100/60 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-160px] left-[-140px] h-[380px] w-[380px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center justify-center">
        <div className="w-full">
          <div className="mb-7 text-center">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
              {sent ? (
                <CheckCircle2
                  size={30}
                  className="text-[#159A62]"
                />
              ) : (
                <KeyRound
                  size={30}
                  className="text-[#159A62]"
                />
              )}
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-[#17201C] md:text-4xl">
              {sent
                ? "Check Your Email"
                : "Forgot Password?"}
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#7A8780]">
              {sent
                ? "If an account exists for this email, we have sent you a password reset link."
                : "Enter your registered email address and we'll send you a secure password reset link."}
            </p>
          </div>

          <div className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_18px_50px_rgba(23,32,28,0.07)] md:p-8">
            {!sent ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="forgot-email"
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
                      id="forgot-email"
                      type="email"
                      placeholder="you@gmail.com"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      disabled={loading}
                      autoComplete="email"
                      className="w-full rounded-xl border border-[#D7E2DC] bg-[#F8FAF9] py-3.5 pl-11 pr-4 text-sm text-[#25312B] outline-none placeholder:text-[#9AA59F] focus:border-[#159A62] focus:bg-white focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                    />
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
                      Sending Reset Link...
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <ArrowRight size={19} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <Mail
                    size={30}
                    className="text-[#159A62]"
                  />
                </div>

                <h2 className="text-lg font-bold text-[#17201C]">
                  Check your inbox
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#7A8780]">
                  If the email address is registered and
                  verified, a password reset link has been
                  sent to:
                </p>

                <p className="mt-3 break-all rounded-xl bg-[#F8FAF9] px-4 py-3 text-sm font-semibold text-[#34413A]">
                  {email.trim()}
                </p>

                <p className="mt-4 text-xs leading-5 text-[#8A9690]">
                  The reset link will expire after 30
                  minutes. If you don't see the email,
                  check your spam or junk folder.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setEmail("");
                  }}
                  className="mt-6 text-sm font-semibold text-[#159A62] transition hover:text-[#108653]"
                >
                  Try another email
                </button>
              </div>
            )}

            <div className="mt-6 border-t border-[#E7EEEA] pt-5">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="mx-auto flex items-center justify-center gap-2 text-sm font-semibold text-[#52605A] transition hover:text-[#159A62]"
              >
                <ArrowLeft size={17} />
                Back to Login
              </button>
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

export default ForgotPassword;