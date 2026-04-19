import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { getAccount, updateAccount, deleteAccount } from "../services/accountService";

export default function AccountPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  });

  useEffect(() => {
    getAccount()
      .then((res) => {
        const data = res.data ?? res;
        setProfile(data);
        setForm({
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          phone: data.phone ?? "",
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setFormLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await updateAccount(form);
      setProfile({ ...profile, ...form });
      setEditing(false);
      setSuccessMsg("Profile updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    try {
      await deleteAccount();
      logout();
    } catch (err) {
      setError(err.message);
      setDeleting(false);
    }
  }

  const inputClass =
    "w-full border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2";

  if (loading) {
    return (
      <Layout>
        <div className="max-w-xl mx-auto animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/3 mb-6" />
          <div
            style={{ borderColor: "#DDD9CE" }}
            className="bg-white rounded-2xl border p-6 h-48"
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <h1
            style={{ color: "#050505" }}
            className="text-2xl font-bold tracking-tight"
          >
            My Profile
          </h1>
          <p style={{ color: "#AC9C8D" }} className="text-sm mt-0.5">
            Manage your account details
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {successMsg && (
          <div
            style={{ backgroundColor: "#E3C1B4", color: "#610C27", borderColor: "#AC9C8D" }}
            className="border text-sm rounded-lg px-4 py-3 mb-4"
          >
            {successMsg}
          </div>
        )}

        {/* Profile card */}
        <div
          style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
          className="rounded-2xl border p-6 mb-4"
        >
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div
              style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
              className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold"
            >
              {profile?.firstName?.[0]?.toUpperCase() ?? "?"}
            </div>
            <div>
              <p style={{ color: "#050505" }} className="font-semibold">
                {profile?.firstName} {profile?.lastName}
              </p>
              <p style={{ color: "#AC9C8D" }} className="text-sm">
                {profile?.email}
              </p>
            </div>
          </div>

          {!editing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                    First name
                  </p>
                  <p style={{ color: "#050505" }} className="text-sm font-medium">
                    {profile?.firstName}
                  </p>
                </div>
                <div>
                  <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                    Last name
                  </p>
                  <p style={{ color: "#050505" }} className="text-sm font-medium">
                    {profile?.lastName}
                  </p>
                </div>
              </div>
              <div>
                <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                  Email
                </p>
                <p style={{ color: "#050505" }} className="text-sm font-medium">
                  {profile?.email}
                </p>
              </div>
              <div>
                <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                  Phone
                </p>
                <p style={{ color: "#050505" }} className="text-sm font-medium">
                  {profile?.phone || "—"}
                </p>
              </div>
              <div>
                <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                  Member since
                </p>
                <p style={{ color: "#050505" }} className="text-sm font-medium">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "—"}
                </p>
              </div>

              <button
                onClick={() => setEditing(true)}
                style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
                className="mt-2 px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
              >
                Edit profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ color: "#050505" }} className="block text-sm font-medium mb-1">
                    First name
                  </label>
                  <input
                    name="firstName"
                    required
                    value={form.firstName}
                    onChange={handleChange}
                    style={{ borderColor: "#DDD9CE" }}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label style={{ color: "#050505" }} className="block text-sm font-medium mb-1">
                    Last name
                  </label>
                  <input
                    name="lastName"
                    required
                    value={form.lastName}
                    onChange={handleChange}
                    style={{ borderColor: "#DDD9CE" }}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label style={{ color: "#050505" }} className="block text-sm font-medium mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  style={{ borderColor: "#DDD9CE" }}
                  className={inputClass}
                  placeholder="0771234567"
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  style={{ borderColor: "#DDD9CE", color: "#AC9C8D" }}
                  className="flex-1 border py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                >
                  {formLoading ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick links */}
        <div
          style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
          className="rounded-2xl border p-6 mb-4"
        >
          <h2
            style={{ color: "#050505" }}
            className="text-sm font-semibold mb-4 tracking-wide uppercase"
          >
            Quick Links
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "My Orders", path: "/orders", icon: "📦" },
              { label: "Addresses", path: "/addresses", icon: "📍" },
              { label: "Cart", path: "/cart", icon: "🛒" },
              { label: "Wishlist", path: "/wishlist", icon: "🤍" },
            ].map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                style={{ backgroundColor: "#EFECE9", color: "#050505" }}
                className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium hover:opacity-80 transition text-left"
              >
                <span>{link.icon}</span>
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logout and delete */}
        <div
          style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
          className="rounded-2xl border p-6"
        >
          <button
            onClick={logout}
            style={{ borderColor: "#DDD9CE", color: "#050505" }}
            className="w-full border py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition mb-3"
          >
            Logout
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full border border-red-100 text-red-400 py-2.5 rounded-lg text-sm hover:bg-red-50 transition"
            >
              Delete account
            </button>
          ) : (
            <div
              style={{ backgroundColor: "#FEE2E2", borderColor: "#FECACA" }}
              className="border rounded-xl p-4"
            >
              <p className="text-sm text-red-700 font-medium mb-1">
                Are you sure?
              </p>
              <p className="text-xs text-red-500 mb-3">
                Your account will be anonymized. Order history will be preserved.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ borderColor: "#DDD9CE", color: "#AC9C8D" }}
                  className="flex-1 border bg-white py-2 rounded-lg text-sm transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}