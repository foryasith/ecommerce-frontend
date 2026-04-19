import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div
      style={{ backgroundColor: "#EFECE9" }}
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
    >
      <p
        style={{ color: "#610C27" }}
        className="text-8xl font-bold tracking-tight mb-4"
      >
        404
      </p>
      <h1
        style={{ color: "#050505" }}
        className="text-2xl font-bold mb-2"
      >
        Page not found
      </h1>
      <p style={{ color: "#AC9C8D" }} className="text-sm mb-8 max-w-xs">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        style={{ backgroundColor: "#610C27", color: "#EFECE9" }}
        className="px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition"
      >
        Go home
      </Link>
    </div>
  );
}