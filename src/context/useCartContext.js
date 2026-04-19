import { useContext } from "react";
import { CartContext } from "./cart-context";

export function useCartContext() {
  return useContext(CartContext);
}
