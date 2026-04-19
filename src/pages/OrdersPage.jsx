import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import OrderStatusBadge from "../components/OrderStatusBadge";
import { getOrders } from "../services/orderService";
import { formatCurrency } from "../utils/formatters";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data ?? []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1
            style={{ color: "#050505" }}
            className="text-2xl font-bold tracking-tight"
          >
            My Orders
          </h1>
          <p style={{ color: "#AC9C8D" }} className="text-sm mt-0.5">
            Your full order history
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
                className="rounded-2xl border p-5 animate-pulse"
              >
                <div className="flex justify-between mb-3">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-16" />
                </div>
                <div className="h-3 bg-gray-100 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📦</p>
            <p
              style={{ color: "#050505" }}
              className="text-lg font-semibold mb-1"
            >
              No orders yet
            </p>
            <p style={{ color: "#AC9C8D" }} className="text-sm mb-6">
              Your orders will appear here after you checkout
            </p>
            <Link
              to="/products"
              style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
              className="px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {[...orders]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
                  className="rounded-2xl border p-5 flex items-start justify-between gap-4 hover:shadow-md transition block"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span
                        style={{ color: "#050505" }}
                        className="font-semibold text-sm"
                      >
                        {order.externalOrderId}
                      </span>
                      <OrderStatusBadge status={order.status} />
                    </div>
                    <p style={{ color: "#AC9C8D" }} className="text-xs mb-2">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p style={{ color: "#AC9C8D" }} className="text-xs">
                      {order.items?.length ?? 0} item
                      {(order.items?.length ?? 0) !== 1 ? "s" : ""} ·{" "}
                      {order.paymentMethod}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      style={{ color: "#610C27" }}
                      className="font-bold text-base"
                    >
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <p style={{ color: "#AC9C8D" }} className="text-xs mt-1">
                      View details →
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
