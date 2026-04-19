import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function WishlistPage() {
  const [wishlist] = useState([]);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 style={{ color: "#050505" }} className="text-2xl font-bold tracking-tight">
            Wishlist
          </h1>
          <p style={{ color: "#AC9C8D" }} className="text-sm mt-0.5">
            Items you've saved for later
          </p>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🤍</p>
            <p style={{ color: "#050505" }} className="text-lg font-semibold mb-1">
              Your wishlist is empty
            </p>
            <p style={{ color: "#AC9C8D" }} className="text-sm mb-6">
              Save items you love while browsing
            </p>
            <Link
              to="/products"
              style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
              className="px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlist.map((item) => (
              <div
                key={item.id}
                style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
                className="rounded-2xl border p-5"
              >
                <p style={{ color: "#050505" }} className="font-medium text-sm">
                  {item.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}