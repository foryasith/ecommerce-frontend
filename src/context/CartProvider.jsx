import { useEffect, useState } from "react";
import { getCart } from "../services/cartService";
import { CartContext } from "./cart-context";
import { useAuth } from "./useAuth";

function normalizeCart(cart) {
  return (
    cart ?? {
      cartId: null,
      totalItems: 0,
      estimatedTotal: 0,
      updatedAt: null,
      items: [],
    }
  );
}

export function CartProvider({ children }) {
  const { isAuth } = useAuth();
  const [cart, setCart] = useState(() => normalizeCart(null));

  useEffect(() => {
    if (!isAuth) {
      return undefined;
    }

    let cancelled = false;

    async function loadCart() {
      try {
        const response = await getCart();
        if (!cancelled) {
          setCart(normalizeCart(response?.data));
        }
      } catch {
        if (!cancelled) {
          setCart(normalizeCart(null));
        }
      }
    }

    loadCart();

    return () => {
      cancelled = true;
    };
  }, [isAuth]);

  function syncCart(nextCart) {
    setCart(normalizeCart(nextCart));
  }

  async function refreshCart() {
    if (!isAuth) {
      const emptyCart = normalizeCart(null);
      setCart(emptyCart);
      return emptyCart;
    }

    const response = await getCart();
    const nextCart = normalizeCart(response?.data);
    setCart(nextCart);
    return nextCart;
  }

  function clearCartState() {
    setCart(normalizeCart(null));
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.totalItems ?? 0,
        syncCart,
        refreshCart,
        clearCartState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
