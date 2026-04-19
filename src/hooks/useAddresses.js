import { useState, useEffect } from "react";
import { getAddresses } from "../services/addressService";

export function useAddresses() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function refetch() {
    setLoading(true);
    setError("");
    try {
      const res = await getAddresses();
      setAddresses(res.data ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function loadAddresses() {
      try {
        const res = await getAddresses();
        if (!cancelled) {
          setAddresses(res.data ?? []);
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

    loadAddresses();

    return () => {
      cancelled = true;
    };
  }, []);

  return { addresses, loading, error, refetch };
}
