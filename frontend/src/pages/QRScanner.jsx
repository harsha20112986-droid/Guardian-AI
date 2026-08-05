import { useState } from "react";
import { QrCode } from "lucide-react";
import api from "../api/api";
import { toast } from "react-toastify";

function QRScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

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
      const response = await api.post("/scan-qr/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-8">

      <div className="max-w-5xl mx-auto">

        {/* Header */}

        <div className="flex items-center gap-3 mb-8">
          <QrCode className="text-emerald-400" size={36} />

          <h1 className="text-4xl font-bold">
            QR Scanner
          </h1>
        </div>

        {/* Upload Card */}

        <div className="bg-slate-900 rounded-2xl p-8 shadow-xl">

          <label
            htmlFor="qr-upload"
            className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:border-emerald-500 transition bg-slate-800"
          >

            {preview ? (
              <img
                src={preview}
                alt="QR Preview"
                className="max-h-48 rounded-lg"
              />
            ) : (
              <>
                <QrCode
                  size={60}
                  className="text-emerald-400 mb-4"
                />

                <p className="text-lg font-semibold">
                  Click to Upload QR Image
                </p>

                <p className="text-gray-400 mt-2">
                  PNG, JPG or JPEG
                </p>
              </>
            )}

          </label>

          <input
            id="qr-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Scan Button */}

          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full mt-6 bg-emerald-500 hover:bg-emerald-600 hover:scale-[1.02] py-3 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50"
          >

            {loading ? (
              <div className="flex items-center justify-center gap-3">

                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                <span>Scanning...</span>

              </div>
            ) : (
              "Scan QR"
            )}

          </button>

          {/* Result */}

          {result && (

            <div className="mt-8 bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl hover:shadow-emerald-500/20 transition-all duration-500">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-3xl font-bold flex items-center gap-2">
                  🛡️ Scan Result
                </h2>

                <span
                  className={`px-5 py-2 rounded-full font-bold text-white ${
                    result.prediction === "Legitimate"
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {result.prediction}
                </span>

              </div>

              {/* Decoded URL */}

              <div className="mb-6">

                <p className="font-semibold text-white mb-2">
                  Decoded URL
                </p>

                <p className="break-all text-emerald-400">
                  {result.decoded_url}
                </p>

              </div>

              {/* Confidence */}

              <div>

                <div className="flex justify-between mb-2">

                  <span className="font-semibold">
                    Confidence
                  </span>

                  <span>
                    {result.confidence}%
                  </span>

                </div>

                <div className="w-full bg-slate-700 rounded-full h-3">

                  <div
                    className="bg-green-500 h-3 rounded-full transition-all duration-700"
                    style={{
                      width: `${result.confidence}%`,
                    }}
                  />

                </div>

              </div>

              {/* Risk Score */}

              <div className="mt-6">

                <div className="flex justify-between mb-2">

                  <span className="font-semibold">
                    Risk Score
                  </span>

                  <span>
                    {result.final_score}%
                  </span>

                </div>

                <div className="w-full bg-slate-700 rounded-full h-3">

                  <div
                    className={`h-3 rounded-full transition-all duration-700 ${
                      result.final_score < 30
                        ? "bg-green-500"
                        : result.final_score < 70
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${result.final_score}%`,
                    }}
                  />

                </div>

              </div>

              {/* Risk Level */}

              <div className="flex items-center gap-4 mt-6">

                <span className="font-semibold">
                  Risk Level
                </span>

                <span
                  className={`px-4 py-1 rounded-full font-semibold text-white ${
                    result.risk_level === "Low"
                      ? "bg-green-600"
                      : result.risk_level === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-600"
                  }`}
                >
                  {result.risk_level}
                </span>

              </div>

              {/* Detection Reasons */}

              {result.reasons?.length > 0 && (

                <div className="mt-8">

                  <h3 className="text-lg font-semibold mb-3">
                    Detection Reasons
                  </h3>

                  <div className="space-y-3">

                    {result.reasons.map((reason, index) => (

                      <div
                        key={index}
                        className="flex items-center gap-3 bg-slate-700 rounded-lg px-4 py-3"
                      >

                        <div className="w-2 h-2 rounded-full bg-emerald-400"></div>

                        <span>{reason}</span>

                      </div>

                    ))}

                  </div>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default QRScanner;