import { apiRequest } from "./api";

export function normalizeAuthResponse(payload) {
  return {
    success: payload?.success ?? payload?.Success ?? false,
    message: payload?.message ?? payload?.Message ?? "",
    token: payload?.token ?? payload?.Token ?? null,
    user: payload?.user ?? payload?.User ?? null,
  };
}

export async function loginUser(email, password) {
  return apiRequest("/api/commerce/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(data) {
  return apiRequest("/api/commerce/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getProfile() {
  return apiRequest("/api/commerce/auth/profile", {}, true);
}
