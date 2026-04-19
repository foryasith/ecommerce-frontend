import { useState, useEffect } from "react";
import { getCart } from "../services/cartService";

export function useCart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refetch() {
    setLoading(true);
    setError("");
    try {
      const res = await getCart();
      setCart(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadCart() {
      try {
        const res = await getCart();
        if (!cancelled) {
          setCart(res.data);
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

  return { cart, loading, error, refetch };
}
