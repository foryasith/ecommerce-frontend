import { useState } from "react";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "Sri Lanka",
  isDefault: false,
};

export default function AddressForm({ initial = EMPTY_FORM, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const inputClass =
    "w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Full name</label>
          <input
            name="fullName"
            required
            value={form.fullName}
            onChange={handleChange}
            placeholder="Jane Doe"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            name="phone"
            required
            value={form.phone}
            onChange={handleChange}
            placeholder="0771234567"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Address line 1</label>
        <input
          name="addressLine1"
          required
          value={form.addressLine1}
          onChange={handleChange}
          placeholder="123 Main Street"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>
          Address line 2{" "}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          name="addressLine2"
          value={form.addressLine2}
          onChange={handleChange}
          placeholder="Apt 4B"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>City</label>
          <input
            name="city"
            required
            value={form.city}
            onChange={handleChange}
            placeholder="Colombo"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>State / Province</label>
          <input
            name="state"
            required
            value={form.state}
            onChange={handleChange}
            placeholder="Western Province"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Postal code</label>
          <input
            name="postalCode"
            required
            value={form.postalCode}
            onChange={handleChange}
            placeholder="00100"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Country</label>
        <input
          name="country"
          required
          value={form.country}
          onChange={handleChange}
          placeholder="Sri Lanka"
          className={inputClass}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isDefault"
          name="isDefault"
          checked={form.isDefault}
          onChange={handleChange}
          className="w-4 h-4 accent-indigo-600"
        />
        <label htmlFor="isDefault" className="text-sm text-gray-700">
          Set as default address
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save address"}
        </button>
      </div>
    </form>
  );
}