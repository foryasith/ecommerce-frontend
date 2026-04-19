import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#050505", color: "#AC9C8D" }} className="mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">

          <div>
            <h3 style={{ color: "#E3C1B4" }} className="text-lg font-bold tracking-widest uppercase mb-3">
              ShopEase
            </h3>
            <p className="text-sm leading-relaxed opacity-70">
              A curated shopping experience built for modern customers.
            </p>
          </div>

          <div>
            <h4 style={{ color: "#DDD9CE" }} className="text-sm font-semibold tracking-widest uppercase mb-3">
              Shop
            </h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/products" className="hover:opacity-100 transition">All Products</Link></li>
              <li><Link to="/cart" className="hover:opacity-100 transition">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:opacity-100 transition">Wishlist</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: "#DDD9CE" }} className="text-sm font-semibold tracking-widest uppercase mb-3">
              Account
            </h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><Link to="/account" className="hover:opacity-100 transition">My Profile</Link></li>
              <li><Link to="/orders" className="hover:opacity-100 transition">My Orders</Link></li>
              <li><Link to="/addresses" className="hover:opacity-100 transition">Addresses</Link></li>
            </ul>
          </div>

        </div>

        <div
          style={{ borderTopColor: "#AC9C8D" }}
          className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs opacity-50"
        >
          <p>© 2026 ShopEase. All rights reserved.</p>
          <p>Built with React + Vite</p>
        </div>
      </div>
    </footer>
  );
}