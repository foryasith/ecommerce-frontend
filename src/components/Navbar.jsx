import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuth, logout, user } = useAuth();

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
            <Link to="/cart" style={{ color: "#DDD9CE" }} className="text-sm tracking-wide hover:opacity-70 transition">
              Cart
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