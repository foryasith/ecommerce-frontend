import { apiRequest } from "./api";

export async function getAccount() {
  return apiRequest("/api/commerce/account", {}, true);
}

export async function updateAccount(data) {
  return apiRequest(
    "/api/commerce/account",
    {
      method: "PUT",
      body: JSON.stringify(data),
    },
    true
  );
}

export async function deleteAccount() {
  return apiRequest(
    "/api/commerce/account",
    { method: "DELETE" },
    true
  );
}