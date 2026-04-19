import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerToken } from "../services/api";
import { addCartItem } from "../services/cartService";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleAddToCart() {
    if (!getCustomerToken()) {
      navigate("/login");
      return;
    }
    setAdding(true);
    setError("");
    setSuccess(false);
    try {
      await addCartItem(product.id, qty);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div
      style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
      className="rounded-2xl border p-5 flex flex-col gap-3 hover:shadow-md transition"
    >
      <div
        style={{ backgroundColor: "#EFECE9" }}
        className="rounded-xl h-40 flex items-center justify-center"
      >
        <span className="text-4xl">🛍️</span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span
            style={{ backgroundColor: "#E3C1B4", color: "#610C27" }}
            className="text-xs font-medium px-2 py-0.5 rounded-full"
          >
            {product.categoryName}
          </span>
          {product.isLowStock && (
            <span className="text-xs text-orange-500 font-medium">Low stock</span>
          )}
        </div>
        <h3 style={{ color: "#050505" }} className="font-semibold text-sm mt-1">
          {product.name}
        </h3>
        <p style={{ color: "#AC9C8D" }} className="text-xs mt-0.5 line-clamp-2">
          {product.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span style={{ color: "#610C27" }} className="text-lg font-bold">
          ${product.price.toFixed(2)}
        </span>
        <span style={{ color: "#AC9C8D" }} className="text-xs">
          {product.quantityAvailable} left
        </span>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
      {success && (
        <p style={{ color: "#610C27" }} className="text-xs font-medium">
          Added to cart!
        </p>
      )}

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max={product.quantityAvailable}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          style={{ borderColor: "#DDD9CE" }}
          className="w-16 border rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none"
        />
        <button
          onClick={handleAddToCart}
          disabled={adding || product.quantityAvailable === 0}
          style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
          className="flex-1 text-sm py-1.5 rounded-lg hover:opacity-90 transition disabled:opacity-50"
        >
          {adding ? "Adding..." : product.quantityAvailable === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}