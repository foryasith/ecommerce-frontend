import { apiRequest } from "./api";

export async function submitCheckout(data) {
  return apiRequest(
    "/api/commerce/checkout",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    true
  );
}