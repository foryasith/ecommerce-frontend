import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import {
  clearCustomerToken,
  getCustomerToken,
  setCustomerToken,
} from "../services/api";
import { getProfile, normalizeAuthResponse } from "../services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(() => !!getCustomerToken());

  useEffect(() => {
    const token = getCustomerToken();
    if (!token) {
      return undefined;
    }

    let cancelled = false;

    async function loadProfile() {
      try {
        const res = await getProfile();
        if (!cancelled) {
          const normalizedAuth = normalizeAuthResponse(res);
          setUser(normalizedAuth.user ?? res?.data ?? null);
        }
      } catch {
        clearCustomerToken();
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  function login(token, userData) {
    const normalizedAuth = normalizeAuthResponse({ token, user: userData });
    setCustomerToken(normalizedAuth.token);
    setUser(normalizedAuth.user);
    setLoading(false);
  }

  function logout() {
    clearCustomerToken();
    setUser(null);
    window.location.assign("/login");
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, isAuth: !!user }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}
