// src/contexts/CartContext.jsx
import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
} from "react";

export const CartContext = createContext();

const CART_STORAGE_KEY = "hoi_cart";

export const CartProvider = ({ children }) => {
  // ---------- STATE ----------
  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to parse cart from storage:", err);
      return [];
    }
  });

  // ---------- PERSIST TO LOCALSTORAGE ----------
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch (err) {
      console.error("Failed to save cart to storage:", err);
    }
  }, [cartItems]);

  // ---------- HELPERS ----------
  /**
   * We treat a cart line as unique by:
   * - productId (product._id)
   * - size
   * - color
   */
  const findLineIndex = (items, productId, size, color) =>
    items.findIndex(
      (line) =>
        line.productId === productId &&
        line.size === size &&
        line.color === color
    );

  // ---------- ACTIONS ----------

  /**
   * addToCart(product, { size, color, quantity })
   *
   * - If same product + size + color exist → replace its quantity
   * - If different combo → push new line
   */
  const addToCart = (product, options = {}) => {
    const {
      size = null,
      color = null,
      quantity = 1,
    } = options;

    if (!product || !product._id) {
      console.warn("addToCart called without product._id");
      return;
    }

    setCartItems((prev) => {
      const next = [...prev];
      const idx = findLineIndex(next, product._id, size, color);

      if (idx !== -1) {
        // 🔁 Already in cart with same size/color → just update quantity
        next[idx] = {
          ...next[idx],
          quantity: quantity,
        };
        return next;
      }

      // ➕ New line
      next.push({
        productId: product._id,
        product, // keep full product for display (name, images, price)
        size,
        color,
        quantity,
      });
      return next;
    });
  };

  /**
   * incrementQty for a given line index or product/size/color.
   * Here we'll use an index-based API so it's easy from map().
   */
  const incrementQty = (lineIndex) => {
    setCartItems((prev) =>
      prev.map((item, idx) =>
        idx === lineIndex
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      )
    );
  };

  const decrementQty = (lineIndex) => {
    setCartItems((prev) =>
      prev
        .map((item, idx) =>
          idx === lineIndex
            ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
            : item
        )
    );
  };

  const removeFromCart = (lineIndex) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== lineIndex));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // ---------- DERIVED VALUES ----------

  // 🧮 distinct lines (what you want for the header badge)
  const cartCount = useMemo(
    () => cartItems.length,
    [cartItems]
  );

  // 🧮 total pieces, if needed anywhere (not used by Header)
  const cartTotalQty = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.quantity || 1),
        0
      ),
    [cartItems]
  );

  // 🧮 total amount, if your CartDrawer wants it
  const cartTotalAmount = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const unitPrice =
          item.product?.price?.sellingPrice ??
          item.product?.price ??
          0;
        const qty = item.quantity || 1;
        return sum + unitPrice * qty;
      }, 0),
    [cartItems]
  );

  // ---------- CONTEXT VALUE ----------
  const value = {
    cartItems,
    addToCart,
    incrementQty,
    decrementQty,
    removeFromCart,
    clearCart,

    // 🔑 for Header.jsx
    cartCount, // ✅ number of lines (3 products → 3)

    // other helpers if you want:
    cartTotalQty, // total quantity of pieces
    cartTotalAmount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
