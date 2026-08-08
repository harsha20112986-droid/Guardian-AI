import { useEffect, useState } from "react";
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Moon,
  Trash2,
  RotateCcw,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";

import Navbar from "../components/Navbar";
import api from "../api/api";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(true);
  const [showConfidence, setShowConfidence] = useState(true);
  const [showRiskScore, setShowRiskScore] = useState(true);

  useEffect(() => {
    const savedSettings = localStorage.getItem(
      "guardian_ai_settings"
    );

    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);

        setNotifications(
          settings.notifications ?? true
        );

        setConfirmDelete(
          settings.confirmDelete ?? true
        );

        setShowConfidence(
          settings.showConfidence ?? true
        );

        setShowRiskScore(
          settings.showRiskScore ?? true
        );
      } catch (error) {
        console.error(
          "Failed to load settings:",
          error
        );
      }
    }
  }, []);

  const saveSettings = (
    key,
    value,
    setter
  ) => {
    setter(value);

    const currentSettings = {
      notifications,
      confirmDelete,
      showConfidence,
      showRiskScore,
    };

    currentSettings[key] = value;

    localStorage.setItem(
      "guardian_ai_settings",
      JSON.stringify(currentSettings)
    );

    toast.success("Setting updated.");
  };

  const clearHistory = async () => {
    let shouldDelete = true;

    if (confirmDelete) {
      shouldDelete = window.confirm(
        "Are you sure you want to delete all scan history?"
      );
    }

    if (!shouldDelete) return;

    try {
      await api.delete("/history/");

      toast.success(
        "Scan history cleared successfully."
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.detail ||
          "Failed to clear scan history."
      );
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
      notifications: true,
      confirmDelete: true,
      showConfidence: true,
      showRiskScore: true,
    };

    setNotifications(true);
    setConfirmDelete(true);
    setShowConfidence(true);
    setShowRiskScore(true);

    localStorage.setItem(
      "guardian_ai_settings",
      JSON.stringify(defaultSettings)
    );

    toast.success(
      "Settings restored to default."
    );
  };

  const Toggle = ({
    enabled,
    onChange,
  }) => {
    return (
      <button
        type="button"
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition ${
          enabled
            ? "bg-emerald-500"
            : "bg-slate-600"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
            enabled
              ? "left-7"
              : "left-1"
          }`}
        />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <Navbar />

      <main className="px-6 py-10">

        <div className="max-w-5xl mx-auto">

          {/* Header */}

          <div className="flex items-center gap-4 mb-10">

            <div className="p-4 bg-emerald-500/10 rounded-2xl">

              <SettingsIcon
                size={36}
                className="text-emerald-400"
              />

            </div>

            <div>

              <h1 className="text-4xl font-bold">
                Settings
              </h1>

              <p className="text-gray-400 mt-2">
                Manage your Guardian AI preferences.
              </p>

            </div>

          </div>

          {/* Notification Settings */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8">

            <div className="flex items-center gap-3 mb-6">

              <Bell
                size={26}
                className="text-yellow-400"
              />

              <h2 className="text-2xl font-bold">
                Notifications
              </h2>

            </div>

            <div className="flex items-center justify-between py-4">

              <div>

                <h3 className="font-semibold">
                  Scan Notifications
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Show notifications after completing
                  security scans.
                </p>

              </div>

              <Toggle
                enabled={notifications}
                onChange={() =>
                  saveSettings(
                    "notifications",
                    !notifications,
                    setNotifications
                  )
                }
              />

            </div>

          </section>

          {/* Scan Settings */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8">

            <div className="flex items-center gap-3 mb-6">

              <Shield
                size={26}
                className="text-emerald-400"
              />

              <h2 className="text-2xl font-bold">
                Scan Preferences
              </h2>

            </div>

            <div className="space-y-2">

              <div className="flex items-center justify-between py-4">

                <div>

                  <h3 className="font-semibold">
                    Show Confidence
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Display the AI confidence percentage
                    in scan results.
                  </p>

                </div>

                <Toggle
                  enabled={showConfidence}
                  onChange={() =>
                    saveSettings(
                      "showConfidence",
                      !showConfidence,
                      setShowConfidence
                    )
                  }
                />

              </div>

              <div className="flex items-center justify-between py-4">

                <div>

                  <h3 className="font-semibold">
                    Show Risk Score
                  </h3>

                  <p className="text-sm text-gray-400 mt-1">
                    Display the calculated security risk
                    score.
                  </p>

                </div>

                <Toggle
                  enabled={showRiskScore}
                  onChange={() =>
                    saveSettings(
                      "showRiskScore",
                      !showRiskScore,
                      setShowRiskScore
                    )
                  }
                />

              </div>

            </div>

          </section>

          {/* History Settings */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8">

            <div className="flex items-center gap-3 mb-6">

              <Database
                size={26}
                className="text-cyan-400"
              />

              <h2 className="text-2xl font-bold">
                History
              </h2>

            </div>

            <div className="flex items-center justify-between py-4">

              <div>

                <h3 className="font-semibold">
                  Confirm Before Deleting
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Ask for confirmation before deleting
                  scan history.
                </p>

              </div>

              <Toggle
                enabled={confirmDelete}
                onChange={() =>
                  saveSettings(
                    "confirmDelete",
                    !confirmDelete,
                    setConfirmDelete
                  )
                }
              />

            </div>

            <div className="border-t border-slate-800 mt-4 pt-6">

              <h3 className="font-semibold">
                Clear Scan History
              </h3>

              <p className="text-sm text-gray-400 mt-1 mb-4">
                Permanently remove all saved scan results
                from Guardian AI.
              </p>

              <button
                type="button"
                onClick={clearHistory}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl font-semibold transition"
              >

                <Trash2 size={18} />

                Clear All History

              </button>

            </div>

          </section>

          {/* Appearance */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 mb-8">

            <div className="flex items-center gap-3 mb-6">

              <Moon
                size={26}
                className="text-purple-400"
              />

              <h2 className="text-2xl font-bold">
                Appearance
              </h2>

            </div>

            <div className="bg-slate-800 rounded-xl p-5 flex items-center justify-between">

              <div>

                <h3 className="font-semibold">
                  Dark Mode
                </h3>

                <p className="text-sm text-gray-400 mt-1">
                  Guardian AI currently uses its secure
                  dark interface.
                </p>

              </div>

              <div className="flex items-center gap-2 text-emerald-400">

                <CheckCircle size={20} />

                <span className="font-semibold">
                  Active
                </span>

              </div>

            </div>

          </section>

          {/* Reset */}

          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

              <div>

                <h2 className="text-xl font-bold">
                  Reset Settings
                </h2>

                <p className="text-sm text-gray-400 mt-1">
                  Restore all Guardian AI settings to
                  their default values.
                </p>

              </div>

              <button
                type="button"
                onClick={resetSettings}
                className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 px-5 py-3 rounded-xl font-semibold transition"
              >

                <RotateCcw size={18} />

                Reset Settings

              </button>

            </div>

          </section>

          <footer className="text-center text-gray-600 text-sm mt-10 pb-6">
            Guardian AI v1.0.0
          </footer>

        </div>

      </main>

    </div>
  );
}

export default Settings;