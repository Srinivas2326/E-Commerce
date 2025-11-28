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

  const addToCart = (product, qty = 1) => {
    const productId = product._id || product.id;

    setCartItems((prev) => {
      const existing = prev.find(
        (item) =>
          (item.product._id || item.product.id) === productId
      );
      if (existing) {
        return prev.map((item) =>
          (item.product._id || item.product.id) === productId
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { product, qty }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          (item.product._id || item.product.id) !== id
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

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
        clearCart,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
