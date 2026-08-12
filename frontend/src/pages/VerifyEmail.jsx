import { useEffect, useState } from "react";
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/api";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Verification token is missing.");
        return;
      }

      try {
        const response = await api.get(
          `/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        setStatus("success");
        setMessage(
          response.data?.message ||
            "Your email has been verified successfully."
        );
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.detail ||
            "This verification link is invalid or has expired."
        );
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <main className="min-h-screen bg-[#F7F9F8] flex items-center justify-center px-6 py-12 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute -bottom-40 -right-40 w-[450px] h-[450px] bg-cyan-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 mb-5">
            <ShieldCheck
              size={34}
              className="text-emerald-600"
            />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-[#17201C]">
            Guardian AI
          </h1>

          <p className="text-[#64716B] mt-3">
            Email verification
          </p>
        </div>

        <div className="bg-white border border-[#E1E8E4] rounded-2xl p-8 shadow-[0_18px_50px_rgba(23,32,28,0.09)] text-center">
          {status === "loading" && (
            <>
              <div className="flex justify-center mb-5">
                <Loader2
                  size={48}
                  className="text-emerald-600 animate-spin"
                />
              </div>

              <h2 className="text-xl font-bold text-[#17201C]">
                Verifying your email
              </h2>

              <p className="text-[#64716B] mt-3">
                Please wait while Guardian AI verifies your
                email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                  <CheckCircle
                    size={38}
                    className="text-emerald-600"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#17201C]">
                Email Verified!
              </h2>

              <p className="text-[#64716B] mt-3 leading-6">
                {message}
              </p>

              <Link
                to="/login"
                className="mt-7 inline-flex items-center justify-center gap-2 w-full bg-[#159A62] hover:bg-[#108653] text-white py-3.5 rounded-xl font-semibold transition"
              >
                Continue to Login
                <ArrowRight size={19} />
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="flex justify-center mb-5">
                <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                  <XCircle
                    size={38}
                    className="text-red-500"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#17201C]">
                Verification Failed
              </h2>

              <p className="text-[#64716B] mt-3 leading-6">
                {message}
              </p>

              <Link
                to="/login"
                className="mt-7 inline-flex items-center justify-center gap-2 w-full bg-[#159A62] hover:bg-[#108653] text-white py-3.5 rounded-xl font-semibold transition"
              >
                Go to Login
                <ArrowRight size={19} />
              </Link>
            </>
          )}
        </div>

        <p className="text-center text-xs text-[#8A9690] mt-6">
          Protected by Guardian AI Security
        </p>
      </div>
    </main>
  );
}

export default VerifyEmail;