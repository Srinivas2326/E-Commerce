import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import {
  fetchWishlist,
  addToWishlist as apiAdd,
  removeFromWishlist as apiRemove,
} from "../services/api";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuthContext();
  const [items, setItems] = useState([]); // array of Product objects
  const [loading, setLoading] = useState(false);

  // Load wishlist when user logs in / changes
  useEffect(() => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const { data } = await fetchWishlist();
        setItems(data);
      } catch {
        // ignore for now
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated, user?._id]);

  const isInWishlist = (productId) =>
    items.some((p) => p._id === productId);

  const add = async (product) => {
    try {
      const { data } = await apiAdd(product._id);
      setItems(data);
    } catch {
      alert("Failed to add to wishlist");
    }
  };

  const remove = async (productId) => {
    try {
      const { data } = await apiRemove(productId);
      setItems(data);
    } catch {
      alert("Failed to remove from wishlist");
    }
  };

  const toggle = async (product) => {
    if (!product?._id) return;
    if (isInWishlist(product._id)) {
      await remove(product._id);
    } else {
      await add(product);
    }
  };

  const value = {
    items,
    loading,
    isInWishlist,
    addToWishlist: add,
    removeFromWishlist: remove,
    toggleWishlist: toggle,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => useContext(WishlistContext);
