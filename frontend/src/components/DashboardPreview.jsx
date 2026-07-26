import {
  MessageSquareWarning,
  Link2,
  QrCode,
  ShieldCheck,
} from "lucide-react";

function DashboardPreview() {
  const scans = [
    {
      icon: <MessageSquareWarning className="text-red-400" />,
      title: "SMS Scam",
      status: "High Risk",
    },
    {
      icon: <Link2 className="text-yellow-400" />,
      title: "Website URL",
      status: "Suspicious",
    },
    {
      icon: <QrCode className="text-green-400" />,
      title: "QR Code",
      status: "Safe",
    },
  ];

  return (
    <section className="bg-slate-950 py-20 px-6">
      <h2 className="text-4xl font-bold text-center text-white mb-12">
        Dashboard Preview
      </h2>

      <div className="max-w-5xl mx-auto bg-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700">
        <div className="flex items-center gap-3 mb-8">
          <ShieldCheck className="text-emerald-400" size={30} />
          <h3 className="text-2xl font-bold text-white">
            Recent Scans
          </h3>
        </div>

        <div className="space-y-4">
          {scans.map((scan) => (
            <div
              key={scan.title}
              className="flex justify-between items-center bg-slate-800 rounded-xl p-4"
            >
              <div className="flex items-center gap-4">
                {scan.icon}
                <span className="text-white">{scan.title}</span>
              </div>

              <span
                className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                  scan.status === "Safe"
                    ? "bg-green-600"
                    : scan.status === "Suspicious"
                    ? "bg-yellow-600"
                    : "bg-red-600"
                }`}
              >
                {scan.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DashboardPreview;