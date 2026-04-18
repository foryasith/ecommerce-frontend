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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition">
      <div className="bg-indigo-50 rounded-xl h-40 flex items-center justify-center">
        <span className="text-4xl">🛍️</span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-full">
            {product.categoryName}
          </span>
          {product.isLowStock && (
            <span className="text-xs text-orange-500 font-medium">
              Low stock
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-800 text-sm mt-1">{product.name}</h3>
        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{product.description}</p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-lg font-bold text-indigo-600">
          ${product.price.toFixed(2)}
        </span>
        <span className="text-xs text-gray-400">
          {product.quantityAvailable} left
        </span>
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {success && (
        <p className="text-xs text-green-600 font-medium">Added to cart!</p>
      )}

      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max={product.quantityAvailable}
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={handleAddToCart}
          disabled={adding || product.quantityAvailable === 0}
          className="flex-1 bg-indigo-600 text-white text-sm py-1.5 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {adding ? "Adding..." : product.quantityAvailable === 0 ? "Out of stock" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}