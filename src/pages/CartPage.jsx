import { useEffect, useEffectEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../services/cartService";
import { useCartContext } from "../context/useCartContext";

export default function CartPage() {
  const navigate = useNavigate();
  const { syncCart } = useCartContext();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingItem, setUpdatingItem] = useState(null);
  const [clearing, setClearing] = useState(false);
  const syncCartEvent = useEffectEvent((nextCart) => {
    syncCart(nextCart);
  });

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      setLoading(true);
      setError("");
      try {
        const res = await getCart();
        if (!cancelled) {
          setCart(res.data);
          syncCartEvent(res.data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  async function fetchCart() {
    setLoading(true);
    setError("");
    try {
      const res = await getCart();
      setCart(res.data);
      syncCart(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleQuantityChange(itemId, newQty) {
    if (newQty < 1) return;
    setUpdatingItem(itemId);
    try {
      await updateCartItem(itemId, newQty);
      await fetchCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingItem(null);
    }
  }

  async function handleRemoveItem(itemId) {
    setUpdatingItem(itemId);
    try {
      await removeCartItem(itemId);
      await fetchCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdatingItem(null);
    }
  }

  async function handleClearCart() {
    if (!confirm("Clear all items from your cart?")) return;
    setClearing(true);
    try {
      await clearCart();
      const emptyCart = {
        cartId: null,
        totalItems: 0,
        estimatedTotal: 0,
        updatedAt: null,
        items: [],
      };
      setCart(emptyCart);
      syncCart(emptyCart);
    } catch (err) {
      setError(err.message);
    } finally {
      setClearing(false);
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse flex gap-4">
              <div className="bg-gray-100 rounded-xl w-20 h-20" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </Layout>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;
  const hasUnavailableItems =
    cart?.items?.some((item) => !item.productAvailable) ?? false;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Your Cart</h1>
            {!isEmpty && (
              <p className="text-sm text-gray-500 mt-0.5">
                {cart.totalItems} item{cart.totalItems !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {!isEmpty && (
            <button
              onClick={handleClearCart}
              disabled={clearing}
              className="text-sm text-red-500 hover:text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
            >
              {clearing ? "Clearing..." : "Clear cart"}
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        {isEmpty ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-5xl mb-4">🛒</p>
            <p className="text-lg font-medium text-gray-600">Your cart is empty</p>
            <p className="text-sm mt-1 mb-6">Add some products to get started</p>
            <Link
              to="/products"
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm hover:bg-indigo-700 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {cart.items.map((item) => (
                (() => {
                  const productName = item.product?.name ?? "Unavailable product";
                  const productMeta = item.product
                    ? `${item.product.categoryName ?? "Uncategorized"} · SKU: ${
                        item.product.sku ?? "N/A"
                      }`
                    : "This item needs attention before checkout.";
                  const lineTotalLabel =
                    item.lineTotal != null ? `$${item.lineTotal.toFixed(2)}` : "—";
                  const unitPriceLabel =
                    item.product?.price != null
                      ? `$${item.product.price.toFixed(2)} each`
                      : "Price unavailable";
                  const canIncreaseQuantity =
                    !!item.product &&
                    item.productAvailable &&
                    item.quantity < item.product.quantityAvailable;

                  return (
                    <div
                      key={item.itemId}
                      className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 items-start"
                    >
                      <div style={{ backgroundColor: "#EFECE9" }} className="rounded-xl w-20 h-20 flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">🛍️</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-gray-800 text-sm">
                              {productName}
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {productMeta}
                            </p>
                          </div>
                          <span style={{ color: "#610C27" }} className="font-bold text-sm whitespace-nowrap">
                            {lineTotalLabel}
                          </span>
                        </div>

                        {!item.productAvailable && item.availabilityMessage && (
                          <p className="text-xs text-orange-500 mt-1">
                            ⚠️ {item.availabilityMessage}
                          </p>
                        )}

                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                handleQuantityChange(item.itemId, item.quantity - 1)
                              }
                              disabled={updatingItem === item.itemId || item.quantity <= 1}
                              className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition text-sm"
                            >
                              −
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {updatingItem === item.itemId ? "..." : item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                handleQuantityChange(item.itemId, item.quantity + 1)
                              }
                              disabled={
                                updatingItem === item.itemId || !canIncreaseQuantity
                              }
                              className="w-7 h-7 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition text-sm"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-gray-300">|</span>

                          <button
                            onClick={() => handleRemoveItem(item.itemId)}
                            disabled={updatingItem === item.itemId}
                            className="text-xs text-red-400 hover:text-red-600 transition disabled:opacity-50"
                          >
                            Remove
                          </button>

                          <span className="text-xs text-gray-400 ml-auto">
                            {unitPriceLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              {hasUnavailableItems && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 text-sm rounded-lg px-4 py-3 mb-4">
                  Some items are unavailable or out of stock. Update your cart before checkout.
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Estimated total</span>
                <span className="text-xl font-bold text-gray-800">
                  ${cart.estimatedTotal.toFixed(2)}
                </span>
              </div>
              <div className="flex gap-3">
                <Link
                  to="/products"
                  className="flex-1 text-center border border-gray-200 text-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 transition"
                >
                  Continue shopping
                </Link>
                <button
                  onClick={() => navigate("/checkout")}
                  disabled={hasUnavailableItems}
                  style={{ backgroundColor: "#610C27", color: "#EFECE9" }} className="flex-1 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition"
                >
                  Proceed to checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
