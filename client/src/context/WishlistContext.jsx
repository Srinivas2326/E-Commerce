import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./AuthContext";
import {
  fetchWishlist,
  addToWishlist as apiAdd,
  removeFromWishlist as apiRemove,
} from "../services/api";
import { toast } from "react-toastify";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

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
      } catch {}
      finally {
        setLoading(false);
      }
    };

    load();
  }, [isAuthenticated]);

  const isInWishlist = (id) => items.some((p) => p._id === id);

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.info("Login to add to wishlist ✨");
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        const { data } = await apiRemove(product._id);
        setItems(data);
        toast.warn("Removed from wishlist 💔");
      } else {
        const { data } = await apiAdd(product._id);
        setItems(data);
        toast.success("Added to wishlist ❤️");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <WishlistContext.Provider
      value={{ items, loading, isInWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlistContext = () => useContext(WishlistContext);
