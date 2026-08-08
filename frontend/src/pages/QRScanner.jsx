import { useState } from "react";
import {
  QrCode,
  Upload,
  Copy,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { toast } from "react-toastify";

import api from "../api/api";
import Navbar from "../components/Navbar";

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

  const confidence = Number(result?.confidence || 0);
  const finalScore = Number(result?.final_score || 0);

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="px-6 py-10">

        <div className="max-w-5xl mx-auto">

          <div className="flex items-center gap-3 mb-8">

            <div className="p-3 bg-emerald-500/10 rounded-xl">
              <QrCode
                size={32}
                className="text-emerald-400"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                QR Scanner
              </h1>

              <p className="text-gray-400 mt-1">
                Scan QR codes and check their destination safely.
              </p>
            </div>

          </div>

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">

            <label
              htmlFor="qr-upload"
              className="flex flex-col items-center justify-center min-h-60 rounded-xl border-2 border-dashed border-slate-600 hover:border-emerald-500 bg-slate-800 cursor-pointer transition p-6"
            >

              {preview ? (
                <img
                  src={preview}
                  alt="QR preview"
                  className="max-h-56 max-w-full rounded-lg object-contain"
                />
              ) : (
                <>
                  <Upload
                    size={55}
                    className="text-emerald-400 mb-4"
                  />

                  <p className="text-lg font-semibold">
                    Upload QR Image
                  </p>

                  <p className="text-gray-400 mt-2">
                    PNG / JPG / JPEG
                  </p>
                </>
              )}

            </label>

            <input
              id="qr-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col sm:flex-row gap-3 mt-6">

              <button
                type="button"
                onClick={handleScan}
                disabled={loading}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-3.5 rounded-xl font-bold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    Scanning...
                  </span>
                ) : (
                  "Scan QR"
                )}
              </button>

              <button
                type="button"
                onClick={reset}
                disabled={loading}
                className="sm:w-32 bg-slate-700 hover:bg-slate-600 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-50"
              >
                Clear
              </button>

            </div>

            {result && (
              <div className="mt-8 bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-6 border-b border-slate-700">

                  <div className="flex items-center gap-4">

                    {isLegitimate ? (
                      <ShieldCheck
                        className="text-green-400"
                        size={38}
                      />
                    ) : (
                      <ShieldAlert
                        className="text-red-400"
                        size={38}
                      />
                    )}

                    <h2 className="text-2xl md:text-3xl font-bold">
                      Scan Result
                    </h2>

                  </div>

                  <span
                    className={`px-5 py-2 rounded-full font-bold text-center ${
                      isLegitimate
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {result.prediction || "Unknown"}
                  </span>

                </div>

                <div className="p-6 space-y-6">

                  <div>

                    <div className="flex justify-between items-center gap-4">

                      <span className="font-semibold">
                        Decoded URL
                      </span>

                      <button
                        type="button"
                        onClick={copyURL}
                        className="text-emerald-400 hover:text-white transition"
                        title="Copy URL"
                      >
                        <Copy size={18} />
                      </button>

                    </div>

                    <p className="mt-3 break-all text-emerald-400">
                      {result.decoded_url || "No URL decoded"}
                    </p>

                  </div>

                  <div>

                    <div className="flex justify-between mb-2">

                      <span>
                        Confidence
                      </span>

                      <span>
                        {confidence}%
                      </span>

                    </div>

                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            Math.max(confidence, 0),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  <div>

                    <div className="flex justify-between mb-2">

                      <span>
                        Risk Score
                      </span>

                      <span>
                        {finalScore}%
                      </span>

                    </div>

                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">

                      <div
                        className={`h-3 rounded-full transition-all ${
                          finalScore < 30
                            ? "bg-green-500"
                            : finalScore < 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            Math.max(finalScore, 0),
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  <div>

                    <span className="font-semibold">
                      Risk Level
                    </span>

                    <span
                      className={`ml-4 px-4 py-1 rounded-full text-sm font-semibold ${
                        result.risk_level === "Low"
                          ? "bg-green-600"
                          : result.risk_level === "Medium"
                          ? "bg-yellow-500 text-slate-950"
                          : "bg-red-600"
                      }`}
                    >
                      {result.risk_level || "Unknown"}
                    </span>

                  </div>

                  {Array.isArray(result.reasons) &&
                    result.reasons.length > 0 && (
                      <div>

                        <h3 className="text-xl font-bold mb-4">
                          Detection Reasons
                        </h3>

                        <div className="space-y-3">

                          {result.reasons.map(
                            (reason, index) => (
                              <div
                                key={`${reason}-${index}`}
                                className="bg-slate-700 rounded-lg px-4 py-3"
                              >
                                {reason}
                              </div>
                            )
                          )}

                        </div>

                      </div>
                    )}

                  <div className="flex justify-end">

                    <button
                      type="button"
                      onClick={reset}
                      className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-6 py-3 rounded-xl font-bold transition"
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

    </div>
  );
}

export default QRScanner;