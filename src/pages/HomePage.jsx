import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { useAuth } from "../context/useAuth";

const FEATURES = [
  { icon: "🛍️", title: "Curated Products", desc: "Hand-picked catalog updated regularly." },
  { icon: "🚚", title: "Fast Delivery", desc: "We deliver to your door, fast and safe." },
  { icon: "🔒", title: "Secure Checkout", desc: "Your data is safe with us, always." },
  { icon: "↩️", title: "Easy Returns", desc: "Hassle-free returns within 30 days." },
];

export default function HomePage() {
  const { isAuth } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#EFECE9" }}>

      {/* Navbar is inside Layout but we need full-width hero so we use a custom wrapper */}
      <div style={{ backgroundColor: "#050505" }}>
        <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" style={{ color: "#E3C1B4" }} className="text-xl font-bold tracking-widest uppercase">
            ShopEase
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/products" style={{ color: "#DDD9CE" }} className="text-sm tracking-wide hover:opacity-70 transition">Products</Link>
            {!isAuth ? (
              <>
                <Link to="/login" style={{ color: "#DDD9CE" }} className="text-sm tracking-wide hover:opacity-70 transition">Login</Link>
                <Link to="/signup" style={{ backgroundColor: "#610C27", color: "#EFECE9" }} className="text-sm px-5 py-2 rounded-full tracking-wide hover:opacity-90 transition">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/cart" style={{ color: "#DDD9CE" }} className="text-sm tracking-wide hover:opacity-70 transition">Cart</Link>
                <Link to="/orders" style={{ color: "#DDD9CE" }} className="text-sm tracking-wide hover:opacity-70 transition">Orders</Link>
                <Link to="/account" style={{ color: "#E3C1B4" }} className="text-sm tracking-wide hover:opacity-70 transition">Account</Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
          <span
            style={{ backgroundColor: "#610C27", color: "#E3C1B4" }}
            className="text-xs tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
          >
            New collection available
          </span>
          <h1 style={{ color: "#EFECE9" }} className="text-5xl font-bold tracking-tight leading-tight mb-4 max-w-2xl">
            Discover Products You'll Love
          </h1>
          <p style={{ color: "#AC9C8D" }} className="text-lg mb-10 max-w-lg leading-relaxed">
            Shop our curated catalog of quality products delivered straight to your door.
          </p>
          <div className="flex gap-4">
            <Link
              to="/products"
              style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
              className="px-8 py-3 rounded-full text-sm font-medium tracking-wide hover:opacity-90 transition"
            >
              Shop now
            </Link>
            {!isAuth && (
              <Link
                to="/signup"
                style={{ borderColor: "#AC9C8D", color: "#DDD9CE" }}
                className="px-8 py-3 rounded-full text-sm font-medium tracking-wide border hover:opacity-70 transition"
              >
                Create account
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-16 w-full">
        <h2 style={{ color: "#050505" }} className="text-2xl font-bold tracking-tight text-center mb-10">
          Why shop with us
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              style={{ backgroundColor: "#fff", borderColor: "#DDD9CE" }}
              className="rounded-2xl border p-6 text-center"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 style={{ color: "#050505" }} className="font-semibold text-sm mb-1">{f.title}</h3>
              <p style={{ color: "#AC9C8D" }} className="text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ backgroundColor: "#610C27" }} className="py-16 text-center">
        <h2 style={{ color: "#EFECE9" }} className="text-3xl font-bold mb-3">Ready to start shopping?</h2>
        <p style={{ color: "#E3C1B4" }} className="text-sm mb-8 opacity-80">Join thousands of happy customers today.</p>
        <Link
          to="/products"
          style={{ backgroundColor: "#EFECE9", color: "#610C27" }}
          className="px-8 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition"
        >
          Browse catalog
        </Link>
      </div>

      {/* Footer */}
      <footer style={{ backgroundColor: "#050505", color: "#AC9C8D" }}>
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-xs opacity-50">
          <p>© 2026 ShopEase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
