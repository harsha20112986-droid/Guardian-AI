import { useState } from "react";
import {
  QrCode,
  Upload,
  Copy,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  ScanLine,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../api/api";

function QRScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0];

    if (!selected) {
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
  };

  const handleScan = async () => {
    if (!file) {
      toast.warning("Please choose a QR image.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    try {
      const response = await api.post(
        "/scan-qr/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setResult(response.data);

      toast.success("QR scanned successfully!");
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to scan QR code."
      );
    } finally {
      setLoading(false);
    }
  };

  const copyURL = async () => {
    if (!result?.decoded_url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        result.decoded_url
      );

      toast.success("URL copied.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to copy URL.");
    }
  };

  const reset = () => {
    setResult(null);
    setFile(null);
    setPreview(null);
  };

  const normalizedPrediction =
    String(result?.prediction || "").toLowerCase();

  const isLegitimate =
    normalizedPrediction === "legitimate" ||
    normalizedPrediction === "safe";

  const isSuspicious =
    normalizedPrediction === "suspicious";

  const confidence = Math.min(
    100,
    Math.max(
      0,
      Number(result?.confidence || 0)
    )
  );

  const finalScore = Math.min(
    100,
    Math.max(
      0,
      Number(result?.final_score || 0)
    )
  );

  const riskBarColor =
    finalScore < 30
      ? "bg-emerald-500"
      : finalScore < 70
      ? "bg-amber-500"
      : "bg-red-500";

  const riskTextColor =
    finalScore < 30
      ? "text-emerald-600"
      : finalScore < 70
      ? "text-amber-600"
      : "text-red-600";

  const statusStyle = isLegitimate
    ? {
        container:
          "bg-emerald-50 border-emerald-200",
        icon:
          "bg-emerald-100 text-emerald-600",
        badge:
          "bg-emerald-100 text-emerald-700 border-emerald-200",
      }
    : isSuspicious
    ? {
        container:
          "bg-amber-50 border-amber-200",
        icon:
          "bg-amber-100 text-amber-600",
        badge:
          "bg-amber-100 text-amber-700 border-amber-200",
      }
    : {
        container:
          "bg-red-50 border-red-200",
        icon:
          "bg-red-100 text-red-600",
        badge:
          "bg-red-100 text-red-700 border-red-200",
      };

  return (
    <main className="relative min-h-full overflow-hidden bg-[#F7F9F8] px-4 py-10 sm:px-6 md:py-14">

      <div className="pointer-events-none absolute right-[-140px] top-20 h-[360px] w-[360px] rounded-full bg-cyan-100/50 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 left-[-160px] h-[330px] w-[330px] rounded-full bg-emerald-100/50 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-5xl">

        {/* Header */}

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50">
              <QrCode
                size={30}
                className="text-cyan-600"
              />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h1 className="text-2xl font-bold tracking-tight text-[#17201C] md:text-4xl">
                  QR Scanner
                </h1>

                <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-700 sm:inline-block">
                  Security Tool
                </span>

              </div>

              <p className="mt-1 text-sm text-[#68766F] md:text-base">
                Scan QR codes and check their destination safely.
              </p>

            </div>

          </div>

          <div className="flex w-fit items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-700">
            <ShieldCheck size={16} />
            QR Threat Detection
          </div>

        </div>

        {/* Scanner Card */}

        <section className="rounded-3xl border border-[#DDE8E2] bg-white p-6 shadow-[0_12px_40px_rgba(32,55,45,0.06)] md:p-8">

          <div className="mb-5 flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
              <ScanLine
                size={20}
                className="text-cyan-600"
              />
            </div>

            <div>

              <h2 className="font-semibold text-[#25312B]">
                Upload QR Code
              </h2>

              <p className="text-xs text-[#8A9690]">
                Choose an image containing a QR code.
              </p>

            </div>

          </div>

          {/* Upload Area */}

          <label
            htmlFor="qr-upload"
            className="
              group
              relative
              flex
              min-h-[290px]
              cursor-pointer
              flex-col
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              border-2
              border-dashed
              border-[#CFE0D7]
              bg-[#F8FAF9]
              p-6
              transition-all
              duration-200
              hover:border-cyan-400
              hover:bg-cyan-50/30
            "
          >

            {preview ? (

              <div className="relative z-10 flex flex-col items-center">

                <div className="rounded-2xl border border-[#DDE8E2] bg-white p-3 shadow-sm">

                  <img
                    src={preview}
                    alt="QR preview"
                    className="max-h-56 max-w-full rounded-xl object-contain"
                  />

                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-700">
                  <ImageIcon size={16} />
                  Click to choose another image
                </div>

              </div>

            ) : (

              <div className="relative z-10 text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-100 bg-cyan-50">

                  <Upload
                    size={36}
                    className="text-cyan-600"
                  />

                </div>

                <p className="mt-5 text-xl font-bold text-[#25312B]">
                  Upload QR Image
                </p>

                <p className="mt-2 text-sm text-[#7A8780]">
                  Click here to select a QR code image
                </p>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">

                  {["PNG", "JPG", "JPEG", "WEBP"].map(
                    (type) => (
                      <span
                        key={type}
                        className="rounded-full border border-[#DDE8E2] bg-white px-3 py-1 text-xs font-medium text-[#718078]"
                      >
                        {type}
                      </span>
                    )
                  )}

                </div>

              </div>

            )}

          </label>

          <input
            id="qr-upload"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Buttons */}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={handleScan}
              disabled={loading}
              className="
                flex
                flex-1
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
              "
            >

              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Scanning QR...
                </>
              ) : (
                <>
                  <ScanLine size={19} />
                  Scan QR
                </>
              )}

            </button>

            <button
              type="button"
              onClick={reset}
              disabled={loading}
              className="
                rounded-xl
                border
                border-[#D7E2DC]
                bg-white
                px-6
                py-3.5
                font-semibold
                text-[#52605A]
                transition-all
                hover:border-[#BFD9CB]
                hover:bg-[#F7FAF8]
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:w-32
              "
            >
              Clear
            </button>

          </div>

          {/* Information */}

          <div className="mt-5 flex flex-wrap gap-4 text-xs text-[#7A8780]">

            <span className="flex items-center gap-1.5">
              <ShieldCheck
                size={14}
                className="text-emerald-600"
              />
              AI URL Analysis
            </span>

            <span className="flex items-center gap-1.5">
              <Sparkles
                size={14}
                className="text-purple-600"
              />
              Risk Scoring
            </span>

            <span className="flex items-center gap-1.5">
              <ShieldCheck
                size={14}
                className="text-cyan-600"
              />
              Safe QR Inspection
            </span>

          </div>

          {/* Result */}

          {result && (
            <div className="mt-8 overflow-hidden rounded-3xl border border-[#DDE8E2] bg-white shadow-[0_10px_35px_rgba(32,55,45,0.05)]">

              {/* Result Header */}

              <div
                className={`border-b p-6 md:p-8 ${statusStyle.container}`}
              >

                <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

                  <div className="flex items-center gap-4">

                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-2xl ${statusStyle.icon}`}
                    >
                      {isLegitimate ? (
                        <ShieldCheck size={30} />
                      ) : (
                        <ShieldAlert size={30} />
                      )}
                    </div>

                    <div>

                      <h2 className="text-2xl font-bold text-[#17201C] md:text-3xl">
                        Scan Result
                      </h2>

                      <p className="mt-1 text-sm text-[#68766F]">
                        QR security analysis completed
                      </p>

                    </div>

                  </div>

                  <span
                    className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${statusStyle.badge}`}
                  >
                    {result.prediction || "Unknown"}
                  </span>

                </div>

              </div>

              {/* Result Content */}

              <div className="space-y-6 p-6 md:p-8">

                {/* Decoded URL */}

                <div className="rounded-2xl border border-[#E1EAE5] bg-[#F8FAF9] p-5">

                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

                    <div className="flex items-center gap-2">

                      <ExternalLink
                        size={18}
                        className="text-cyan-600"
                      />

                      <h3 className="font-semibold text-[#25312B]">
                        Decoded URL
                      </h3>

                    </div>

                    <button
                      type="button"
                      onClick={copyURL}
                      disabled={!result.decoded_url}
                      className="
                        flex
                        w-fit
                        items-center
                        justify-center
                        gap-2
                        rounded-lg
                        border
                        border-[#D7E2DC]
                        bg-white
                        px-3
                        py-2
                        text-sm
                        font-medium
                        text-[#52605A]
                        transition
                        hover:border-[#BFD9CB]
                        hover:text-[#159A62]
                        disabled:opacity-40
                      "
                    >
                      <Copy size={15} />
                      Copy URL
                    </button>

                  </div>

                  <p className="mt-4 break-all rounded-xl border border-[#E1EAE5] bg-white px-4 py-3 text-sm leading-6 text-[#52605A]">
                    {result.decoded_url ||
                      "No URL decoded"}
                  </p>

                </div>

                {/* Metrics */}

                <div className="grid gap-5 md:grid-cols-2">

                  {/* Confidence */}

                  <div className="rounded-2xl border border-purple-100 bg-purple-50/60 p-5">

                    <div className="mb-3 flex justify-between">

                      <span className="font-semibold text-[#29352F]">
                        AI Confidence
                      </span>

                      <span className="font-bold text-purple-600">
                        {confidence}%
                      </span>

                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-purple-100">

                      <div
                        className="h-full rounded-full bg-purple-500 transition-all duration-700"
                        style={{
                          width: `${confidence}%`,
                        }}
                      />

                    </div>

                    <p className="mt-3 text-xs leading-5 text-[#727B76]">
                      Confidence of the machine learning
                      model in this prediction.
                    </p>

                  </div>

                  {/* Risk Score */}

                  <div className="rounded-2xl border border-[#E1EAE5] bg-[#F8FAF9] p-5">

                    <div className="mb-3 flex justify-between">

                      <span className="font-semibold text-[#29352F]">
                        Risk Score
                      </span>

                      <span
                        className={`font-bold ${riskTextColor}`}
                      >
                        {finalScore}%
                      </span>

                    </div>

                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#E4EBE7]">

                      <div
                        className={`h-full rounded-full transition-all duration-700 ${riskBarColor}`}
                        style={{
                          width: `${finalScore}%`,
                        }}
                      />

                    </div>

                    <p className="mt-3 text-xs leading-5 text-[#727B76]">
                      Combined security risk calculated
                      from the QR analysis.
                    </p>

                  </div>

                </div>

                {/* Risk Level */}

                <div className="rounded-2xl border border-[#E1EAE5] bg-white p-5">

                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

                    <div>

                      <p className="text-sm text-[#7A8780]">
                        Overall Risk Level
                      </p>

                      <h3 className="mt-1 text-xl font-bold text-[#17201C]">
                        QR Security Assessment
                      </h3>

                    </div>

                    <span
                      className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${
                        result.risk_level === "Low"
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : result.risk_level ===
                            "Medium"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-red-200 bg-red-50 text-red-700"
                      }`}
                    >
                      {result.risk_level ||
                        "Unknown"}{" "}
                      Risk
                    </span>

                  </div>

                </div>

                {/* Detection Reasons */}

                {Array.isArray(result.reasons) &&
                  result.reasons.length > 0 && (
                    <div>

                      <div className="mb-4 flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                          <AlertTriangle
                            className="text-amber-600"
                            size={20}
                          />
                        </div>

                        <div>

                          <h3 className="text-xl font-bold text-[#17201C]">
                            Detection Reasons
                          </h3>

                          <p className="mt-1 text-sm text-[#7A8780]">
                            Factors identified during
                            the QR security analysis.
                          </p>

                        </div>

                      </div>

                      <div className="space-y-2.5">

                        {result.reasons.map(
                          (reason, index) => (
                            <div
                              key={`${reason}-${index}`}
                              className="flex items-start gap-3 rounded-xl border border-[#E1EAE5] bg-[#FBFCFB] px-4 py-3.5"
                            >

                              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-amber-500" />

                              <span className="text-sm leading-6 text-[#52605A]">
                                {reason}
                              </span>

                            </div>
                          )
                        )}

                      </div>

                    </div>
                  )}

                {/* Action */}

                <div className="flex justify-end border-t border-[#E7EEEA] pt-6">

                  <button
                    type="button"
                    onClick={reset}
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      bg-[#159A62]
                      px-6
                      py-3.5
                      font-semibold
                      text-white
                      transition-all
                      duration-200
                      hover:-translate-y-0.5
                      hover:bg-[#108653]
                      hover:shadow-md
                    "
                  >
                    <RotateCcw size={18} />
                    Scan Another
                  </button>

                </div>

              </div>

            </div>
          )}

        </section>

      </div>

    </main>
  );
}

export default QRScanner;