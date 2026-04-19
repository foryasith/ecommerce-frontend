const API_BASE_URL = normalizeBaseUrl(
  import.meta.env.VITE_CUSTOMER_API_BASE_URL ?? ""
);

const TOKEN_KEY = "customer_jwt";

function normalizeBaseUrl(baseUrl) {
  return baseUrl.trim().replace(/\/+$/, "");
}

function normalizeStoredToken(token) {
  if (typeof token !== "string") {
    return null;
  }

  const normalized = token.trim();
  if (
    !normalized ||
    normalized === "undefined" ||
    normalized === "null"
  ) {
    return null;
  }

  return normalized;
}

export function getCustomerToken() {
  const token = normalizeStoredToken(localStorage.getItem(TOKEN_KEY));
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }

  return token;
}

export function setCustomerToken(token) {
  const normalized = normalizeStoredToken(token);
  if (!normalized) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }

  localStorage.setItem(TOKEN_KEY, normalized);
}

export function clearCustomerToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  window.location.assign("/login");
}

function extractResponseMessage(body, textBody) {
  return (
    body?.message ??
    body?.Message ??
    (typeof textBody === "string" && textBody.trim() ? textBody.trim() : "")
  );
}

function shouldTreatAsSessionExpiry(message, authHeader) {
  const normalized = `${message ?? ""} ${authHeader ?? ""}`.toLowerCase().trim();

  if (!normalized) {
    return true;
  }

  if (
    normalized.includes("internal service credentials") ||
    normalized.includes("integration failed") ||
    normalized.includes("temporarily unavailable")
  ) {
    return false;
  }

  return [
    "session expired",
    "token expired",
    "invalid customer token",
    "invalid token",
    "invalid_token",
    "authentication",
    "bearer",
    "not authenticated",
  ].some((keyword) => normalized.includes(keyword));
}

export async function apiRequest(path, options = {}, requiresAuth = false) {
  const headers = new Headers(options.headers ?? {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth) {
    const token = getCustomerToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") ?? "";
  let body = null;
  let textBody = "";

  if (contentType.includes("application/json")) {
    body = await response.json();
  } else {
    textBody = await response.text();
  }

  const message = extractResponseMessage(body, textBody);
  const authenticateHeader = response.headers.get("www-authenticate");

  if (
    response.status === 401 &&
    requiresAuth &&
    shouldTreatAsSessionExpiry(message, authenticateHeader)
  ) {
    clearCustomerToken();
    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }

    throw new Error(message || "Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(
      message || `Request failed with status ${response.status}.`
    );
  }

  return body;
}
