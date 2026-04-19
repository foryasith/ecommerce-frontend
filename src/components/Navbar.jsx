import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getCart } from "../services/cartService";

export default function Navbar() {
  const { isAuth, logout, user } = useAuth();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isAuth) {
      getCart()
        .then((res) => setCartCount(res?.data?.totalItems ?? 0))
        .catch(() => setCartCount(0));
    }
  }, [isAuth]);

  return (
    <nav style={{ backgroundColor: "#050505" }} className="px-6 py-4 flex items-center justify-between">
      <Link to="/" style={{ color: "#E3C1B4" }} className="text-xl font-bold tracking-widest uppercase">
        ShopEase
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/products" style={{ color: "#DDD9CE" }} className="text-sm tracking-wide hover:opacity-70 transition">
          Products
        </Link>

        {!isAuth ? (
          <>
            <Link to="/login" style={{ color: "#DDD9CE" }} className="text-sm tracking-wide hover:opacity-70 transition">
              Login
            </Link>
            <Link
              to="/signup"
              style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
              className="text-sm px-5 py-2 rounded-full tracking-wide hover:opacity-90 transition"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/wishlist" style={{ color: "#DDD9CE" }} className="text-sm tracking-wide hover:opacity-70 transition">
              Wishlist
            </Link>
            <Link to="/cart" className="relative text-sm tracking-wide hover:opacity-70 transition" style={{ color: "#DDD9CE" }}>
              Cart
              {cartCount > 0 && (
                <span
                  style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
                  className="absolute -top-2 -right-4 text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold"
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/orders" style={{ color: "#DDD9CE" }} className="text-sm tracking-wide hover:opacity-70 transition">
              Orders
            </Link>
            <Link to="/account" style={{ color: "#E3C1B4" }} className="text-sm tracking-wide hover:opacity-70 transition">
              {user?.firstName ?? "Account"}
            </Link>
            <button
              onClick={logout}
              style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
              className="text-sm px-5 py-2 rounded-full tracking-wide hover:opacity-90 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}