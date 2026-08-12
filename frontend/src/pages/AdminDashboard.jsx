import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Users,
  ScanLine,
  AlertTriangle,
  UserCheck,
  UserX,
  Activity,
  LogOut,
  RefreshCw,
  Trash2,
  Search,
  Shield,
  Filter,
  Link2,
  QrCode,
  MessageSquare,
  UserCog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import api from "../api/api";
import { useAuth } from "../context/AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [data, setData] = useState(null);
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);

  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [scansLoading, setScansLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [scanSearchTerm, setScanSearchTerm] = useState("");

  const [scanTypeFilter, setScanTypeFilter] = useState("All");
  const [predictionFilter, setPredictionFilter] = useState("All");
  const [riskFilter, setRiskFilter] = useState("All");

  const [deletingId, setDeletingId] = useState(null);
  const [deletingScanId, setDeletingScanId] = useState(null);
  const [changingRoleId, setChangingRoleId] = useState(null);

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      toast.error("Your session has expired.");
      logout();
      navigate("/login", { replace: true });
      return true;
    }

    if (error.response?.status === 403) {
      toast.error("Admin access required.");
      navigate("/", { replace: true });
      return true;
    }

    return false;
  };

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await api.get("/admin/dashboard");

      setData(response.data);
    } catch (error) {
      console.error("Failed to load admin dashboard:", error);

      if (handleAuthError(error)) {
        return;
      }

      toast.error(
        error.response?.data?.detail ||
          "Unable to load admin dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setUsersLoading(true);

      const response = await api.get("/admin/users");

      setUsers(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Failed to load users:", error);

      if (handleAuthError(error)) {
        return;
      }

      toast.error(
        error.response?.data?.detail ||
          "Unable to load users."
      );
    } finally {
      setUsersLoading(false);
    }
  };

  const loadScans = async () => {
    try {
      setScansLoading(true);

      const response = await api.get("/admin/scans");

      setScans(
        Array.isArray(response.data)
          ? response.data
          : []
      );
    } catch (error) {
      console.error("Failed to load scans:", error);

      if (handleAuthError(error)) {
        return;
      }

      toast.error(
        error.response?.data?.detail ||
          "Unable to load scans."
      );
    } finally {
      setScansLoading(false);
    }
  };

  const loadAll = async () => {
    await Promise.all([
      loadDashboard(),
      loadUsers(),
      loadScans(),
    ]);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const deleteUser = async (userId, userName) => {
    if (userId === user?.id) {
      toast.warning(
        "You cannot delete your own admin account."
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete user "${userName}"? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(userId);

      await api.delete(`/admin/users/${userId}`);

      toast.success("User deleted successfully.");

      await loadAll();
    } catch (error) {
      console.error("Failed to delete user:", error);

      if (handleAuthError(error)) {
        return;
      }

      toast.error(
        error.response?.data?.detail ||
          "Failed to delete user."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const changeUserRole = async (userId, userName, currentRole) => {
    if (userId === user?.id) {
      toast.warning("You cannot change your own admin role.");
      return;
    }

    const isAdmin = currentRole === "admin";
    const newRole = isAdmin ? "user" : "admin";

    const confirmed = window.confirm(
      isAdmin
        ? `Demote "${userName}" from admin to user?`
        : `Promote "${userName}" to admin?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setChangingRoleId(userId);

      const response = await api.patch(
        `/admin/users/${userId}/role`
      );

      toast.success(
        response.data?.message ||
          `User role changed to ${newRole}.`
      );

      await Promise.all([
        loadUsers(),
        loadDashboard(),
      ]);
    } catch (error) {
      console.error("Failed to change user role:", error);

      if (handleAuthError(error)) {
        return;
      }

      toast.error(
        error.response?.data?.detail ||
          "Failed to change user role."
      );
    } finally {
      setChangingRoleId(null);
    }
  };

  const deleteScan = async (scanId) => {
    const confirmed = window.confirm(
      `Delete scan #${scanId}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingScanId(scanId);

      await api.delete(`/admin/scans/${scanId}`);

      toast.success("Scan deleted successfully.");

      setScans((previous) =>
        previous.filter((scan) => scan.id !== scanId)
      );

      await loadDashboard();
    } catch (error) {
      console.error("Failed to delete scan:", error);

      if (handleAuthError(error)) {
        return;
      }

      toast.error(
        error.response?.data?.detail ||
          "Failed to delete scan."
      );
    } finally {
      setDeletingScanId(null);
    }
  };

  const statistics = data?.statistics || {};

  const filteredUsers = users.filter((item) => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) {
      return true;
    }

    return (
      String(item.name || "")
        .toLowerCase()
        .includes(search) ||
      String(item.email || "")
        .toLowerCase()
        .includes(search) ||
      String(item.role || "")
        .toLowerCase()
        .includes(search)
    );
  });

  const filteredScans = scans.filter((item) => {
    const search = scanSearchTerm.toLowerCase().trim();

    const matchesSearch =
      !search ||
      String(item.content || "")
        .toLowerCase()
        .includes(search) ||
      String(item.scan_type || "")
        .toLowerCase()
        .includes(search) ||
      String(item.prediction || "")
        .toLowerCase()
        .includes(search) ||
      String(item.risk_level || "")
        .toLowerCase()
        .includes(search) ||
      String(item.user_id || "")
        .toLowerCase()
        .includes(search);

    const matchesType =
      scanTypeFilter === "All" ||
      String(item.scan_type || "").toLowerCase() ===
        scanTypeFilter.toLowerCase();

    const matchesPrediction =
      predictionFilter === "All" ||
      String(item.prediction || "").toLowerCase() ===
        predictionFilter.toLowerCase();

    const matchesRisk =
      riskFilter === "All" ||
      String(item.risk_level || "").toLowerCase() ===
        riskFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesType &&
      matchesPrediction &&
      matchesRisk
    );
  });

  const statCards = [
    {
      title: "Total Users",
      value: statistics.total_users ?? 0,
      icon: Users,
      className: "text-cyan-400",
      background: "bg-cyan-500/10",
    },
    {
      title: "Verified Users",
      value: statistics.verified_users ?? 0,
      icon: UserCheck,
      className: "text-emerald-400",
      background: "bg-emerald-500/10",
    },
    {
      title: "Total Scans",
      value: statistics.total_scans ?? 0,
      icon: ScanLine,
      className: "text-purple-400",
      background: "bg-purple-500/10",
    },
    {
      title: "Threats Detected",
      value: statistics.phishing_scans ?? 0,
      icon: AlertTriangle,
      className: "text-red-400",
      background: "bg-red-500/10",
    },
  ];

  const getScanIcon = (scanType) => {
    const type = String(scanType || "").toLowerCase();

    if (type === "qr") {
      return QrCode;
    }

    if (type === "sms") {
      return MessageSquare;
    }

    return Link2;
  };

  const getScanIconStyle = (scanType) => {
    const type = String(scanType || "").toLowerCase();

    if (type === "qr") {
      return "text-purple-400 bg-purple-500/10";
    }

    if (type === "sms") {
      return "text-yellow-400 bg-yellow-500/10";
    }

    return "text-cyan-400 bg-cyan-500/10";
  };

  const getPredictionStyle = (prediction) => {
    return String(prediction || "").toLowerCase() ===
      "legitimate"
      ? "bg-emerald-500/10 text-emerald-400"
      : "bg-red-500/10 text-red-400";
  };

  const getRiskStyle = (riskLevel) => {
    const risk = String(riskLevel || "").toLowerCase();

    if (risk === "high") {
      return "bg-red-500/10 text-red-400";
    }

    if (risk === "medium") {
      return "bg-yellow-500/10 text-yellow-400";
    }

    if (risk === "low") {
      return "bg-emerald-500/10 text-emerald-400";
    }

    return "bg-slate-700 text-gray-300";
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <RefreshCw
            size={42}
            className="mx-auto text-emerald-400 animate-spin"
          />

          <p className="mt-4 text-gray-400">
            Loading Admin Dashboard...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 sm:px-6 py-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <ShieldCheck
                size={32}
                className="text-emerald-400"
              />
            </div>

            <div>
              <p className="text-sm text-emerald-400 font-semibold">
                ADMIN PANEL
              </p>

              <h1 className="text-3xl md:text-4xl font-bold text-white">
                Guardian AI Dashboard
              </h1>

              <p className="text-gray-400 mt-1">
                Manage users and monitor cybersecurity activity.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={loadAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-gray-300 hover:text-white hover:border-emerald-500/40 transition"
            >
              <RefreshCw size={17} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => {
                logout();
                navigate("/login", { replace: true });
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-3">
            <Activity
              size={20}
              className="text-emerald-400"
            />

            <div>
              <p className="text-sm text-gray-500">
                Administrator
              </p>

              <p className="font-semibold text-white">
                {data?.admin?.name ||
                  user?.name ||
                  "Administrator"}
              </p>

              <p className="text-sm text-gray-400">
                {data?.admin?.email || user?.email}
              </p>
            </div>

            <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase">
              {data?.admin?.role || "admin"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          {statCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      {card.title}
                    </p>

                    <p
                      className={`text-3xl font-bold mt-2 ${card.className}`}
                    >
                      {card.value}
                    </p>
                  </div>

                  <div
                    className={`p-3 rounded-xl ${card.background}`}
                  >
                    <Icon
                      size={25}
                      className={card.className}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <UserCheck
                size={22}
                className="text-emerald-400"
              />

              <h2 className="font-semibold">
                Verified Users
              </h2>
            </div>

            <p className="text-2xl font-bold text-emerald-400 mt-4">
              {statistics.verified_users ?? 0}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <UserX
                size={22}
                className="text-yellow-400"
              />

              <h2 className="font-semibold">
                Unverified Users
              </h2>
            </div>

            <p className="text-2xl font-bold text-yellow-400 mt-4">
              {statistics.unverified_users ?? 0}
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle
                size={22}
                className="text-red-400"
              />

              <h2 className="font-semibold">
                High Risk Scans
              </h2>
            </div>

            <p className="text-2xl font-bold text-red-400 mt-4">
              {statistics.high_risk_scans ?? 0}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Users
                size={23}
                className="text-emerald-400"
              />

              <div>
                <h2 className="text-xl font-bold">
                  User Management
                </h2>

                <p className="text-sm text-gray-500">
                  Manage registered Guardian AI users
                </p>
              </div>
            </div>

            <div className="relative w-full md:w-72">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search users..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-gray-500 outline-none focus:border-emerald-500 transition"
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw
                size={30}
                className="text-emerald-400 animate-spin"
              />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {searchTerm
                ? "No users match your search."
                : "No users found."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      User
                    </th>

                    <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Role
                    </th>

                    <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Verification
                    </th>

                    <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Joined
                    </th>

                    <th className="px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((item) => {
                    const isCurrentAdmin =
                      item.id === user?.id;

                    const isAdmin = item.role === "admin";

                    const isChangingRole =
                      changingRoleId === item.id;

                    const isDeleting =
                      deletingId === item.id;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-slate-800/70 hover:bg-slate-800/40 transition"
                      >
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
                              <span className="font-bold text-emerald-400">
                                {String(
                                  item.name || "U"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>

                            <div>
                              <p className="font-semibold text-white">
                                {item.name}
                              </p>

                              <p className="text-sm text-gray-500 break-all">
                                {item.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase ${
                              isAdmin
                                ? "bg-purple-500/10 text-purple-400"
                                : "bg-slate-700 text-gray-300"
                            }`}
                          >
                            {isAdmin && (
                              <Shield size={13} />
                            )}

                            {item.role || "user"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                              item.email_verified
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {item.email_verified
                              ? "Verified"
                              : "Unverified"}
                          </span>
                        </td>

                        <td className="px-4 py-4 text-sm text-gray-400">
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleDateString()
                            : "Unavailable"}
                        </td>

                        <td className="px-4 py-4">
                          {isCurrentAdmin ? (
                            <div className="flex justify-end">
                              <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                                <Shield size={14} />
                                Current Admin
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  changeUserRole(
                                    item.id,
                                    item.name,
                                    item.role
                                  )
                                }
                                disabled={
                                  isChangingRole ||
                                  isDeleting
                                }
                                className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold ${
                                  isAdmin
                                    ? "bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500 hover:text-slate-950"
                                    : "bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white"
                                }`}
                              >
                                {isChangingRole ? (
                                  <RefreshCw
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <UserCog size={14} />
                                )}

                                {isChangingRole
                                  ? "Updating..."
                                  : isAdmin
                                  ? "Demote"
                                  : "Make Admin"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  deleteUser(
                                    item.id,
                                    item.name
                                  )
                                }
                                disabled={
                                  isDeleting ||
                                  isChangingRole
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                              >
                                {isDeleting ? (
                                  <RefreshCw
                                    size={15}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={15} />
                                )}

                                {isDeleting
                                  ? "Deleting..."
                                  : "Delete"}
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 mb-6">
            <div className="flex items-center gap-3">
              <ScanLine
                size={23}
                className="text-cyan-400"
              />

              <div>
                <h2 className="text-xl font-bold">
                  Security Scan Management
                </h2>

                <p className="text-sm text-gray-500">
                  Monitor all URL, QR and SMS security scans
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Filter size={16} />
              {filteredScans.length} of {scans.length} scans
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-6">
            <div className="relative md:col-span-2 xl:col-span-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={scanSearchTerm}
                onChange={(event) =>
                  setScanSearchTerm(event.target.value)
                }
                placeholder="Search scans..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-gray-500 outline-none focus:border-cyan-500 transition"
              />
            </div>

            <select
              value={scanTypeFilter}
              onChange={(event) =>
                setScanTypeFilter(event.target.value)
              }
              className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition"
            >
              <option value="All">All Scan Types</option>
              <option value="URL">URL</option>
              <option value="QR">QR</option>
              <option value="SMS">SMS</option>
            </select>

            <select
              value={predictionFilter}
              onChange={(event) =>
                setPredictionFilter(event.target.value)
              }
              className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition"
            >
              <option value="All">All Predictions</option>
              <option value="Phishing">Phishing</option>
              <option value="Legitimate">
                Legitimate
              </option>
            </select>

            <select
              value={riskFilter}
              onChange={(event) =>
                setRiskFilter(event.target.value)
              }
              className="px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white outline-none focus:border-cyan-500 transition"
            >
              <option value="All">All Risk Levels</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          {scansLoading ? (
            <div className="flex items-center justify-center py-14">
              <RefreshCw
                size={32}
                className="text-cyan-400 animate-spin"
              />
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="text-center py-14">
              <ScanLine
                size={38}
                className="mx-auto text-gray-600"
              />

              <p className="mt-4 text-gray-400">
                {scans.length === 0
                  ? "No security scans found."
                  : "No scans match your filters."}
              </p>

              {scans.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setScanSearchTerm("");
                    setScanTypeFilter("All");
                    setPredictionFilter("All");
                    setRiskFilter("All");
                  }}
                  className="mt-4 text-sm text-cyan-400 hover:text-cyan-300"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredScans.map((item) => {
                const ScanIcon = getScanIcon(
                  item.scan_type
                );

                return (
                  <div
                    key={item.id}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-slate-600 transition"
                  >
                    <div className="flex flex-col xl:flex-row xl:items-center gap-5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${getScanIconStyle(
                              item.scan_type
                            )}`}
                          >
                            <ScanIcon size={19} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-white font-medium break-all">
                              {item.content ||
                                "Unknown content"}
                            </p>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-gray-500">
                              <span>
                                Scan ID: #{item.id}
                              </span>

                              <span>
                                User ID:{" "}
                                {item.user_id ?? "N/A"}
                              </span>

                              <span>
                                {item.scanned_at
                                  ? new Date(
                                      item.scanned_at
                                    ).toLocaleString()
                                  : "Date unavailable"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1.5 rounded-full bg-slate-700 text-gray-300 text-xs font-semibold uppercase">
                          {item.scan_type || "Unknown"}
                        </span>

                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getPredictionStyle(
                            item.prediction
                          )}`}
                        >
                          {item.prediction || "Unknown"}
                        </span>

                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold ${getRiskStyle(
                            item.risk_level
                          )}`}
                        >
                          {item.risk_level || "Unknown"}
                        </span>

                        <span className="px-3 py-1.5 rounded-full bg-slate-700 text-gray-300 text-xs">
                          {item.confidence ?? 0}% confidence
                        </span>

                        <span className="px-3 py-1.5 rounded-full bg-slate-700 text-gray-300 text-xs">
                          Score: {item.final_score ?? 0}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            deleteScan(item.id)
                          }
                          disabled={
                            deletingScanId === item.id
                          }
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold"
                        >
                          {deletingScanId === item.id ? (
                            <RefreshCw
                              size={14}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={14} />
                          )}

                          {deletingScanId === item.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>

                    {item.reasons && (
                      <div className="mt-4 pt-4 border-t border-slate-700">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                          Detection Reasons
                        </p>

                        <p className="text-sm text-gray-400 break-words">
                          {item.reasons}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;