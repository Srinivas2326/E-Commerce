import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuthContext } from "./AuthContext";

const CartContext = createContext();

const getCartKey = (user) =>
  user && user._id ? `ecom-cart-${user._id}` : "ecom-cart-guest";

export const CartProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [cartItems, setCartItems] = useState([]);
  const hasLoadedFromStorage = useRef(false);

  useEffect(() => {
    const key = getCartKey(user);
    const stored = localStorage.getItem(key);
    setCartItems(stored ? JSON.parse(stored) : []);

    hasLoadedFromStorage.current = false;

    setTimeout(() => {
      hasLoadedFromStorage.current = true;
    }, 0);
  }, [user]);

  useEffect(() => {
    if (!hasLoadedFromStorage.current) return;

    const key = getCartKey(user);
    localStorage.setItem(key, JSON.stringify(cartItems));
  }, [cartItems, user]);

  const getId = (p) => p._id || p.id;

  // Add to cart
  const addToCart = (product, qty = 1) => {
    const id = getId(product);

    setCartItems((prev) => {
      const existing = prev.find((item) => getId(item.product) === id);

      if (existing) {
        return prev.map((item) =>
          getId(item.product) === id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { product, qty }];
    });
  };

  // Update quantity
  const updateQty = (productId, qty) => {
    setCartItems((prev) =>
      qty <= 0
        ? prev.filter((item) => getId(item.product) !== productId)
        : prev.map((item) =>
            getId(item.product) === productId ? { ...item, qty } : item
          )
    );
  };

  // Remove directly
  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter((item) => getId(item.product) !== id)
    );
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.qty,
        0
      ),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
