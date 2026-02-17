// src/contexts/CartContext.jsx
import React, { createContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import axios from 'axios';

export const CartContext = createContext();

const CART_STORAGE_KEY = 'hoi_cart';
const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';

// ─── LocalStorage helpers ────────────────────────────────────────────────────
const getLocalCart = () => {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const setLocalCart = (items) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save cart to storage:', err);
  }
};

const getToken = () =>
  localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

// ─── Convert cart line → DB format (sirf IDs save karo) ─────────────────────
const toDbItem = (line) => ({
  productId:  line.productId || line.product?._id,
  quantity:   line.quantity || 1,
  size:       line.size  || null,
  color:      line.color || null,
  colorLabel: line.colorLabel || line.product?.colorLabel || null,
});

export const CartProvider = ({ children }) => {
  // ---------- STATE ----------
  const [cartItems, setCartItems] = useState(getLocalCart);
  const saveTimerRef = useRef(null);

  // ---------- PERSIST TO LOCALSTORAGE (same as before) ----------
  useEffect(() => {
    setLocalCart(cartItems);
  }, [cartItems]);

  // ─── DB mein save karo (debounced 800ms) ────────────────────────────────
  const saveToDatabase = useCallback((items) => {
    if (!getToken()) return;
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      try {
        await axios.put(
          `${baseUrl}/cart`,
          { items: items.map(toDbItem) },
          { headers: { Authorization: `Bearer ${getToken()}` } },
        );
      } catch (err) {
        console.error('Save cart to DB error:', err);
      }
    }, 800);
  }, []);

  // ─── Product IDs → full product objects ─────────────────────────────────
  const enrichCartItems = useCallback(async (dbItems) => {
    if (!dbItems.length) return [];
    try {
      const ids = [...new Set(dbItems.map((i) => i.productId?.toString()).filter(Boolean))];
      const { data } = await axios.get(`${baseUrl}/products`, {
        params: { ids: ids.join(','), limit: ids.length },
      });
      const map = {};
      (data.data || []).forEach((p) => { map[p._id] = p; });

      return dbItems
        .map((item) => {
          const product = map[item.productId?.toString()];
          if (!product) return null;
          return {
            productId:  item.productId,
            product,
            quantity:   item.quantity,
            size:       item.size   || null,
            color:      item.color  || null,
            colorLabel: item.colorLabel || null,
          };
        })
        .filter(Boolean);
    } catch (err) {
      console.error('Enrich cart error:', err);
      return [];
    }
  }, []);

  // ─── Login ke baad DB se load karo ──────────────────────────────────────
  const loadFromDatabase = useCallback(async () => {
    if (!getToken()) return;
    try {
      const { data } = await axios.get(`${baseUrl}/cart`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (data.success && Array.isArray(data.items)) {
        const enriched = await enrichCartItems(data.items);
        setCartItems(enriched);
        setLocalCart(enriched);
      }
    } catch (err) {
      console.error('Load cart from DB error:', err);
    }
  }, [enrichCartItems]);

  // ─── Login ke waqt guest cart + DB merge karo ───────────────────────────
  const syncCartOnLogin = useCallback(async () => {
    if (!getToken()) return;
    const localItems = getLocalCart();
    try {
      const { data } = await axios.post(
        `${baseUrl}/cart/sync`,
        { guestItems: localItems.map(toDbItem) },
        { headers: { Authorization: `Bearer ${getToken()}` } },
      );
      if (data.success && Array.isArray(data.items)) {
        const enriched = await enrichCartItems(data.items);
        setCartItems(enriched);
        setLocalCart(enriched);
      }
    } catch (err) {
      console.error('Sync cart error:', err);
      // Sync fail ho toh local items safe rehte hain
    }
  }, [enrichCartItems]);

  // ---------- HELPERS ----------
  const findLineIndex = (items, productId, size, color) =>
    items.findIndex(
      (line) =>
        line.productId === productId &&
        line.size  === size &&
        line.color === color,
    );

  // ---------- ACTIONS (same API as before, sirf DB save add hua) ----------

  const addToCart = useCallback((product, options = {}) => {
    const { size = null, color = null, colorLabel = null, quantity = 1 } = options;

    if (!product || !product._id) {
      console.warn('addToCart called without product._id');
      return;
    }

    setCartItems((prev) => {
      const next = [...prev];
      const idx = findLineIndex(next, product._id, size, color);

      if (idx !== -1) {
        next[idx] = { ...next[idx], quantity };
      } else {
        next.push({ productId: product._id, product, size, color, colorLabel, quantity });
      }

      setLocalCart(next);
      saveToDatabase(next);
      return next;
    });
  }, [saveToDatabase]);

  const incrementQty = useCallback((lineIndex) => {
    setCartItems((prev) => {
      const updated = prev.map((item, idx) =>
        idx === lineIndex ? { ...item, quantity: (item.quantity || 1) + 1 } : item,
      );
      setLocalCart(updated);
      saveToDatabase(updated);
      return updated;
    });
  }, [saveToDatabase]);

  const decrementQty = useCallback((lineIndex) => {
    setCartItems((prev) => {
      const updated = prev.map((item, idx) =>
        idx === lineIndex
          ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) }
          : item,
      );
      setLocalCart(updated);
      saveToDatabase(updated);
      return updated;
    });
  }, [saveToDatabase]);

  const removeFromCart = useCallback((lineIndex) => {
    setCartItems((prev) => {
      const updated = prev.filter((_, idx) => idx !== lineIndex);
      setLocalCart(updated);
      saveToDatabase(updated);
      return updated;
    });
  }, [saveToDatabase]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setLocalCart([]);
    if (getToken()) {
      axios.delete(`${baseUrl}/cart`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }).catch(console.error);
    }
  }, []);

  // ---------- DERIVED VALUES (same as before) ----------
  const cartCount = useMemo(() => cartItems.length, [cartItems]);

  const cartTotalQty = useMemo(
    () => cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0),
    [cartItems],
  );

  const cartTotalAmount = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const unitPrice =
          item.product?.price?.sellingPrice ?? item.product?.price ?? 0;
        return sum + unitPrice * (item.quantity || 1);
      }, 0),
    [cartItems],
  );

  // ---------- CONTEXT VALUE ----------
  const value = {
    cartItems,
    addToCart,
    incrementQty,
    decrementQty,
    removeFromCart,
    clearCart,

    // DB sync (login handler mein call karo)
    loadFromDatabase,
    syncCartOnLogin,

    // same as before
    cartCount,
    cartTotalQty,
    cartTotalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};