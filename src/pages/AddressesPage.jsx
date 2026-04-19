import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AddressForm from "../components/AddressForm";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "../services/addressService";

export default function AddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchAddresses();
  }, []);

  async function fetchAddresses() {
    setLoading(true);
    setError("");
    try {
      const res = await getAddresses();
      setAddresses(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData) {
    setFormLoading(true);
    setError("");
    try {
      await createAddress(formData);
      await fetchAddresses();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleUpdate(formData) {
    setFormLoading(true);
    setError("");
    try {
      await updateAddress(editingAddress.id, formData);
      await fetchAddresses();
      setEditingAddress(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this address?")) return;
    setDeletingId(id);
    try {
      await deleteAddress(id);
      await fetchAddresses();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Addresses</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage your shipping addresses
            </p>
          </div>
          {!showForm && !editingAddress && (
            <button
              onClick={() => setShowForm(true)}
              style={{ backgroundColor: "#610C27", color: "#EFECE9" }} className="px-4 py-2 rounded-lg text-sm hover:opacity-90 transition"
            >
              + Add address
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              New address
            </h2>
            <AddressForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              loading={formLoading}
            />
          </div>
        )}

        {editingAddress && (
          <div className="bg-white rounded-2xl border border-indigo-100 p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Edit address
            </h2>
            <AddressForm
              initial={editingAddress}
              onSubmit={handleUpdate}
              onCancel={() => setEditingAddress(null)}
              loading={formLoading}
            />
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
                <div className="h-4 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : addresses.length === 0 && !showForm ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-4xl mb-3">📍</p>
            <p className="text-lg font-medium text-gray-600">No addresses yet</p>
            <p className="text-sm mt-1 mb-6">Add an address to proceed to checkout</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition"
            >
              Add your first address
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-2xl border p-5 ${
                  address.isDefault
                    ? "border-[#AC9C8D] ring-1 ring-[#E3C1B4]"
                    : "border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-800 text-sm">
                        {address.fullName}
                      </span>
                      {address.isDefault && (
                        <span style={{ backgroundColor: "#E3C1B4", color: "#610C27" }} className="text-xs font-medium px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{address.phone}</p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                    </p>
                    <p className="text-sm text-gray-500">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-500">{address.country}</p>
                  </div>

                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setShowForm(false);
                      }}
                      className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(address.id)}
                      disabled={deletingId === address.id}
                      className="text-xs border border-red-100 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                    >
                      {deletingId === address.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {addresses.length > 0 && !showForm && !editingAddress && (
          <div className="mt-6">
            <button
              onClick={() => navigate("/checkout")}
              style={{ backgroundColor: "#610C27", color: "#EFECE9" }} className="w-full py-3 rounded-xl text-sm font-medium hover:opacity-90 transition"
            >
              Continue to checkout
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
}