// src/contexts/WishlistContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const WishlistContext = createContext({
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  toggleWishlist: () => {},
});

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Load from localStorage once
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wishlistItems");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWishlistItems(parsed);
        }
      }
    } catch (err) {
      console.error("Error reading wishlist from storage", err);
    }
  }, []);

  // Save to localStorage whenever wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    } catch (err) {
      console.error("Error saving wishlist to storage", err);
    }
  }, [wishlistItems]);

  const addToWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.includes(productId) ? prev : [...prev, productId]
    );
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((id) => id !== productId));
  };

  const toggleWishlist = (productId) => {
    setWishlistItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
