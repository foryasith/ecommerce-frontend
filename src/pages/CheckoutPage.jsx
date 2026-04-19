import { useEffect, useEffectEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getAddresses } from "../services/addressService";
import { getCart } from "../services/cartService";
import { submitCheckout } from "../services/checkoutService";
import { useCartContext } from "../context/useCartContext";

const PAYMENT_METHODS = [
  { value: "CashOnDelivery", label: "Cash on Delivery" },
  { value: "BankTransfer", label: "Bank Transfer" },
  { value: "Card", label: "Card" },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { syncCart, clearCartState } = useCartContext();

  const [addresses, setAddresses] = useState([]);
  const [cart, setCart] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState("");

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const syncCartEvent = useEffectEvent((nextCart) => {
    syncCart(nextCart);
  });

  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      try {
        const [addrRes, cartRes] = await Promise.all([
          getAddresses(),
          getCart(),
        ]);
        const addrList = addrRes.data ?? [];
        setAddresses(addrList);
        setCart(cartRes.data);
        syncCartEvent(cartRes.data);

        const defaultAddr = addrList.find((a) => a.isDefault) ?? addrList[0];
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingData(false);
      }
    }
    loadData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }

    if (!cart || cart.items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    if (cart.items.some((item) => !item.productAvailable)) {
      setError("Your cart contains unavailable items. Update the cart before checkout.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const res = await submitCheckout({
        addressId: selectedAddressId,
        paymentMethod,
        notes: notes.trim() || undefined,
      });
      clearCartState();
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loadingData) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto space-y-4 animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-1/3 mb-6" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-48" />
          <div className="bg-white rounded-2xl border border-gray-100 p-6 h-32" />
        </div>
      </Layout>
    );
  }

  const hasNoAddresses = addresses.length === 0;
  const hasEmptyCart = !cart || !cart.items || cart.items.length === 0;
  const hasUnavailableItems =
    cart?.items?.some((item) => !item.productAvailable) ?? false;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {hasNoAddresses && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">
            You need to add a shipping address before checking out.{" "}
            <button
              onClick={() => navigate("/addresses")}
              className="underline font-medium hover:text-amber-800"
            >
              Add address
            </button>
          </div>
        )}

        {hasEmptyCart && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">
            Your cart is empty.{" "}
            <button
              onClick={() => navigate("/products")}
              className="underline font-medium hover:text-amber-800"
            >
              Browse products
            </button>
          </div>
        )}

        {hasUnavailableItems && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">
            Some cart items are unavailable. Go back to your cart and resolve them before checkout.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Address selector */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Shipping address
            </h2>
            {hasNoAddresses ? (
              <p className="text-sm text-gray-400">No addresses saved.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${
                      selectedAddressId === address.id
                        ? "border-[#AC9C8D] bg-[#EFECE9]"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={() => setSelectedAddressId(address.id)}
                      className="mt-0.5 accent-indigo-600"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-800">
                          {address.fullName}
                        </span>
                        {address.isDefault && (
                          <span style={{ backgroundColor: "#E3C1B4", color: "#610C27" }} className="text-xs px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {address.phone}
                      </p>
                      <p className="text-xs text-gray-500">
                        {address.addressLine1}
                        {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                      </p>
                      <p className="text-xs text-gray-500">
                        {address.city}, {address.state} {address.postalCode},{" "}
                        {address.country}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Payment method
            </h2>
            <div className="space-y-2">
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition ${
                    paymentMethod === method.value
                      ? "border-[#AC9C8D] bg-[#EFECE9]"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={() => setPaymentMethod(method.value)}
                    className="accent-indigo-600"
                  />
                  <span className="text-sm text-gray-700">{method.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              Notes{" "}
              <span className="text-gray-400 font-normal text-sm">
                (optional)
              </span>
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Please deliver after 5 PM"
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Order summary */}
          {cart && cart.items && cart.items.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-4">
                Order summary
              </h2>
              <div className="space-y-2 mb-4">
                {cart.items.map((item) => (
                  <div
                    key={item.itemId}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600">
                      {item.product?.name ?? "Unavailable product"}{" "}
                      <span className="text-gray-400">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-800">
                      {item.lineTotal != null ? `$${item.lineTotal.toFixed(2)}` : "—"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">
                  Total
                </span>
                <span style={{ color: "#610C27" }} className="text-lg font-bold">
                  ${cart.estimatedTotal.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || hasNoAddresses || hasEmptyCart || hasUnavailableItems}
            style={{ backgroundColor: "#610C27", color: "#EFECE9" }} className="w-full py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {submitting ? "Placing order..." : "Confirm order"}
          </button>
        </form>
      </div>
    </Layout>
  );
}
