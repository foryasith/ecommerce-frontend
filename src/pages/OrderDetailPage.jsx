import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { getOrderById, cancelOrder } from "../services/orderService";

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data ?? res))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCancel() {
    if (!cancelReason.trim()) {
      setError("Please enter a reason for cancellation.");
      return;
    }
    setCancelling(true);
    setError("");
    try {
      await cancelOrder(id, cancelReason);
      const res = await getOrderById(id);
      setOrder(res.data ?? res);
      setShowCancelForm(false);
      setCancelReason("");
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto animate-pulse space-y-4">
          <div className="h-6 bg-gray-100 rounded w-1/3 mb-6" />
          <div
            style={{ borderColor: "#DDD9CE" }}
            className="bg-white rounded-2xl border p-6 h-40"
          />
          <div
            style={{ borderColor: "#DDD9CE" }}
            className="bg-white rounded-2xl border p-6 h-32"
          />
        </div>
      </Layout>
    );
  }

  if (error && !order) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <p className="text-4xl mb-3">⚠️</p>
          <p style={{ color: "#050505" }} className="text-lg font-semibold mb-2">
            Order not found
          </p>
          <p style={{ color: "#AC9C8D" }} className="text-sm mb-6">
            {error}
          </p>
          <Link
            to="/orders"
            style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
            className="px-6 py-2.5 rounded-full text-sm hover:opacity-90 transition"
          >
            Back to orders
          </Link>
        </div>
      </Layout>
    );
  }

  const canCancel = order?.status === "Pending" || order?.status === "Processing";

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/orders")}
            style={{ color: "#AC9C8D" }}
            className="text-sm hover:opacity-70 transition"
          >
            ← Back
          </button>
        </div>

        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1
              style={{ color: "#050505" }}
              className="text-2xl font-bold tracking-tight"
            >
              Order Details
            </h1>
            <p style={{ color: "#AC9C8D" }} className="text-sm mt-0.5">
              {order.externalOrderId}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {/* Order info */}
        <div
          style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
          className="rounded-2xl border p-6 mb-4"
        >
          <h2
            style={{ color: "#050505" }}
            className="text-sm font-semibold mb-4 tracking-wide uppercase"
          >
            Order Info
          </h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                Date placed
              </p>
              <p style={{ color: "#050505" }} className="font-medium">
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
            <div>
              <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                Payment
              </p>
              <p style={{ color: "#050505" }} className="font-medium">
                {order.paymentMethod}
              </p>
            </div>
            <div>
              <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                Currency
              </p>
              <p style={{ color: "#050505" }} className="font-medium">
                {order.currency}
              </p>
            </div>
            <div>
              <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                Total
              </p>
              <p style={{ color: "#610C27" }} className="font-bold text-base">
                ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
          {order.notes && (
            <div className="mt-4 pt-4" style={{ borderTopColor: "#DDD9CE", borderTopWidth: 1 }}>
              <p style={{ color: "#AC9C8D" }} className="text-xs mb-0.5">
                Notes
              </p>
              <p style={{ color: "#050505" }} className="text-sm">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Shipping address */}
        {order.shippingAddress && (
          <div
            style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
            className="rounded-2xl border p-6 mb-4"
          >
            <h2
              style={{ color: "#050505" }}
              className="text-sm font-semibold mb-3 tracking-wide uppercase"
            >
              Shipping Address
            </h2>
            <div style={{ color: "#AC9C8D" }} className="text-sm space-y-0.5">
              <p style={{ color: "#050505" }} className="font-medium">
                {order.shippingAddress.fullName}
              </p>
              <p>{order.shippingAddress.phone}</p>
              <p>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2
                  ? `, ${order.shippingAddress.addressLine2}`
                  : ""}
              </p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        )}

        {/* Items */}
        <div
          style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
          className="rounded-2xl border p-6 mb-4"
        >
          <h2
            style={{ color: "#050505" }}
            className="text-sm font-semibold mb-4 tracking-wide uppercase"
          >
            Items
          </h2>
          <div className="space-y-3">
            {order.items?.map((item) => (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-4"
              >
                <div
                  style={{ backgroundColor: "#EFECE9" }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                >
                  <span className="text-xl">🛍️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    style={{ color: "#050505" }}
                    className="text-sm font-medium truncate"
                  >
                    {item.productName}
                  </p>
                  <p style={{ color: "#AC9C8D" }} className="text-xs">
                    ${item.unitPrice.toFixed(2)} × {item.quantity}
                  </p>
                </div>
                <p style={{ color: "#610C27" }} className="font-bold text-sm">
                  ${item.totalPrice.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{ borderTopColor: "#DDD9CE" }}
            className="border-t mt-4 pt-4 flex justify-between"
          >
            <span style={{ color: "#050505" }} className="font-semibold text-sm">
              Total
            </span>
            <span style={{ color: "#610C27" }} className="font-bold text-lg">
              ${order.totalAmount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Cancel section */}
        {canCancel && (
          <div
            style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
            className="rounded-2xl border p-6"
          >
            {!showCancelForm ? (
              <button
                onClick={() => setShowCancelForm(true)}
                className="text-sm text-red-400 hover:text-red-600 border border-red-100 px-4 py-2 rounded-lg hover:bg-red-50 transition"
              >
                Cancel this order
              </button>
            ) : (
              <div>
                <h2
                  style={{ color: "#050505" }}
                  className="text-sm font-semibold mb-3"
                >
                  Reason for cancellation
                </h2>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Ordered by mistake"
                  rows={3}
                  style={{ borderColor: "#DDD9CE" }}
                  className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none resize-none mb-3"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelForm(false)}
                    style={{ borderColor: "#DDD9CE", color: "#AC9C8D" }}
                    className="flex-1 border py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Keep order
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={cancelling}
                    className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-sm hover:bg-red-600 transition disabled:opacity-50"
                  >
                    {cancelling ? "Cancelling..." : "Confirm cancel"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}