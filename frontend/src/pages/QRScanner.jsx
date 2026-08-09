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
  Activity,
  ExternalLink,
  AlertTriangle,
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

  const isLegitimate =
    result?.prediction === "Legitimate";

  const isSuspicious =
    result?.prediction === "Suspicious";

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
      ? "bg-yellow-500"
      : "bg-red-500";

  const riskTextColor =
    finalScore < 30
      ? "text-emerald-400"
      : finalScore < 70
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <main className="relative min-h-full px-4 sm:px-6 py-10 md:py-14 overflow-hidden">

      {/* Background effects */}

      <div className="absolute top-20 left-[-180px] w-[350px] h-[350px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-20 right-[-180px] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">

        {/* Header */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">

          <div className="flex items-center gap-4">

            <div className="p-3.5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl">

              <QrCode
                size={32}
                className="text-cyan-400"
              />

            </div>

            <div>

              <h1 className="text-2xl md:text-4xl font-bold text-white">
                QR Scanner
              </h1>

              <p className="text-gray-400 mt-1">
                Scan QR codes and check their destination safely.
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 text-sm text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-4 py-2 rounded-full w-fit">

            <ShieldCheck size={16} />

            QR Threat Detection

          </div>

        </div>

        {/* Scanner Card */}

        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">

          {/* Upload Header */}

          <div className="flex items-center gap-2 mb-5">

            <ScanLine
              size={20}
              className="text-cyan-400"
            />

            <h2 className="text-lg font-semibold">
              Upload QR Code
            </h2>

          </div>

          {/* Upload Area */}

          <label
            htmlFor="qr-upload"
            className="
              group
              relative
              flex
              flex-col
              items-center
              justify-center
              min-h-72
              rounded-2xl
              border-2
              border-dashed
              border-slate-700
              hover:border-cyan-400
              bg-slate-950/60
              hover:bg-slate-900
              cursor-pointer
              transition-all
              duration-300
              p-6
              overflow-hidden
            "
          >

            <div className="absolute inset-0 bg-cyan-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />

            {preview ? (

              <div className="relative z-10 flex flex-col items-center">

                <img
                  src={preview}
                  alt="QR preview"
                  className="
                    max-h-56
                    max-w-full
                    rounded-xl
                    object-contain
                    border
                    border-slate-700
                    shadow-xl
                  "
                />

                <p className="text-cyan-400 text-sm mt-4">
                  Click to choose another image
                </p>

              </div>

            ) : (

              <div className="relative z-10 text-center">

                <div className="w-20 h-20 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">

                  <Upload
                    size={38}
                    className="text-cyan-400"
                  />

                </div>

                <p className="text-xl font-bold mt-5">
                  Upload QR Image
                </p>

                <p className="text-gray-400 mt-2">
                  Click here to select a QR code image
                </p>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">

                  <span className="px-3 py-1 bg-slate-800 rounded-full">
                    PNG
                  </span>

                  <span className="px-3 py-1 bg-slate-800 rounded-full">
                    JPG
                  </span>

                  <span className="px-3 py-1 bg-slate-800 rounded-full">
                    JPEG
                  </span>

                  <span className="px-3 py-1 bg-slate-800 rounded-full">
                    WEBP
                  </span>

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

          <div className="flex flex-col sm:flex-row gap-3 mt-6">

            <button
              type="button"
              onClick={handleScan}
              disabled={loading}
              className="
                flex-1
                flex
                items-center
                justify-center
                gap-2
                bg-emerald-500
                hover:bg-emerald-600
                text-slate-950
                py-3.5
                rounded-xl
                font-bold
                transition-all
                duration-300
                hover:-translate-y-0.5
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
            >

              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />

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
                sm:w-32
                bg-slate-700
                hover:bg-slate-600
                text-white
                py-3.5
                rounded-xl
                font-semibold
                transition
                disabled:opacity-50
              "
            >
              Clear
            </button>

          </div>

          {/* Info */}

          <div className="flex flex-wrap gap-4 mt-5 text-xs text-gray-500">

            <span className="flex items-center gap-1.5">
              <ShieldCheck
                size={14}
                className="text-emerald-400"
              />
              AI URL Analysis
            </span>

            <span className="flex items-center gap-1.5">
              <Sparkles
                size={14}
                className="text-purple-400"
              />
              Risk Scoring
            </span>

            <span className="flex items-center gap-1.5">
              <ShieldCheck
                size={14}
                className="text-cyan-400"
              />
              Safe QR Inspection
            </span>

          </div>

          {/* Result */}

          {result && (

            <div className="mt-8 bg-slate-950/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">

              {/* Result Header */}

              <div
                className={`p-6 md:p-8 border-b ${
                  isLegitimate
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : isSuspicious
                    ? "bg-yellow-500/10 border-yellow-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">

                  <div className="flex items-center gap-4">

                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        isLegitimate
                          ? "bg-emerald-500/10 text-emerald-400"
                          : isSuspicious
                          ? "bg-yellow-500/10 text-yellow-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >

                      {isLegitimate ? (
                        <ShieldCheck size={32} />
                      ) : (
                        <ShieldAlert size={32} />
                      )}

                    </div>

                    <div>

                      <h2 className="text-2xl md:text-3xl font-bold">
                        Scan Result
                      </h2>

                      <p className="text-gray-400 mt-1">
                        AI Security Analysis
                      </p>

                    </div>

                  </div>

                  <span
                    className={`px-5 py-2.5 rounded-full font-bold text-sm w-fit ${
                      isLegitimate
                        ? "bg-emerald-500 text-slate-950"
                        : isSuspicious
                        ? "bg-yellow-500 text-slate-950"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {result.prediction || "Unknown"}
                  </span>

                </div>

              </div>

              {/* Result Content */}

              <div className="p-6 md:p-8 space-y-8">

                {/* Decoded URL */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">

                    <div className="flex items-center gap-2">

                      <ExternalLink
                        size={18}
                        className="text-cyan-400"
                      />

                      <h3 className="font-semibold">
                        Decoded URL
                      </h3>

                    </div>

                    <button
                      type="button"
                      onClick={copyURL}
                      disabled={!result.decoded_url}
                      className="
                        flex
                        items-center
                        justify-center
                        gap-2
                        text-sm
                        text-gray-300
                        bg-slate-800
                        hover:bg-slate-700
                        border
                        border-slate-700
                        px-3
                        py-2
                        rounded-lg
                        transition
                        disabled:opacity-40
                      "
                    >

                      <Copy size={15} />

                      Copy URL

                    </button>

                  </div>

                  <p className="mt-4 break-all text-cyan-400 leading-7">
                    {result.decoded_url || "No URL decoded"}
                  </p>

                </div>

                {/* Metrics */}

                <div className="grid md:grid-cols-2 gap-5">

                  {/* Confidence */}

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                    <div className="flex justify-between mb-3">

                      <span className="font-semibold">
                        AI Confidence
                      </span>

                      <span className="font-bold text-purple-400">
                        {confidence}%
                      </span>

                    </div>

                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-purple-500 rounded-full transition-all duration-700"
                        style={{
                          width: `${confidence}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Risk Score */}

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                    <div className="flex justify-between mb-3">

                      <span className="font-semibold">
                        Risk Score
                      </span>

                      <span className={`font-bold ${riskTextColor}`}>
                        {finalScore}%
                      </span>

                    </div>

                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

                      <div
                        className={`h-full rounded-full transition-all duration-700 ${riskBarColor}`}
                        style={{
                          width: `${finalScore}%`,
                        }}
                      />

                    </div>

                  </div>

                </div>

                {/* Risk Level */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    <div>

                      <p className="text-gray-400 text-sm">
                        Overall Risk Level
                      </p>

                      <h3 className="text-xl font-bold mt-1">
                        QR Security Assessment
                      </h3>

                    </div>

                    <span
                      className={`px-5 py-2 rounded-full font-bold w-fit ${
                        result.risk_level === "Low"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : result.risk_level === "Medium"
                          ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                          : "bg-red-500/15 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {result.risk_level || "Unknown"} Risk
                    </span>

                  </div>

                </div>

                {/* Detection Reasons */}

                {Array.isArray(result.reasons) &&
                  result.reasons.length > 0 && (

                    <div>

                      <div className="flex items-center gap-3 mb-4">

                        <div className="p-2.5 rounded-xl bg-yellow-500/10">

                          <AlertTriangle
                            className="text-yellow-400"
                            size={20}
                          />

                        </div>

                        <div>

                          <h3 className="text-xl font-bold">
                            Detection Reasons
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Factors identified during the QR security analysis.
                          </p>

                        </div>

                      </div>

                      <div className="space-y-3">

                        {result.reasons.map(
                          (reason, index) => (

                            <div
                              key={`${reason}-${index}`}
                              className="
                                flex
                                items-start
                                gap-3
                                bg-slate-900
                                border
                                border-slate-800
                                rounded-xl
                                px-4
                                py-3.5
                              "
                            >

                              <span className="mt-2 w-2 h-2 rounded-full bg-yellow-400 shrink-0" />

                              <span className="text-gray-300 leading-6">
                                {reason}
                              </span>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  )}

                {/* Action */}

                <div className="flex justify-end pt-2">

                  <button
                    type="button"
                    onClick={reset}
                    className="
                      flex
                      items-center
                      gap-2
                      bg-emerald-500
                      hover:bg-emerald-600
                      text-slate-950
                      px-6
                      py-3.5
                      rounded-xl
                      font-bold
                      transition-all
                      duration-300
                      hover:-translate-y-0.5
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