// src/components/cart/CartDrawer.jsx
import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiX,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiChevronRight,
} from 'react-icons/fi';

import styles from '../../assets/styles/cart/CartDrawer.module.css';
import { CartContext } from '../../contexts/CartContext';
import { WishlistContext } from '../../contexts/WishlistContext';

const API_BASE_URL = 'http://localhost:8000';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

const FREE_SHIPPING_THRESHOLD = 999;

// ---------- HELPERS ----------

const getDiscountPercent = (mrp, price) => {
  if (!mrp || !price || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

/**
 * Normalize different price shapes into:
 *  { unitMrp, unitPrice, discountPercent }
 */
const getUnitPriceInfo = (item) => {
  let unitMrp = 0;
  let unitPrice = 0;
  let discountPercent = 0;

  // 1) If price is an object (most likely your case)
  if (item.price && typeof item.price === 'object') {
    unitMrp =
      item.price.mrp ||
      item.price.mrpPrice ||
      item.mrp ||
      0;

    unitPrice =
      item.price.sellingPrice ||
      item.price.salePrice ||
      item.price.finalPrice ||
      item.price.price ||
      item.salePrice ||
      item.sellingPrice ||
      item.priceValue ||
      0;

    // prefer backend discount if present
    if (typeof item.price.discountPercent === 'number') {
      discountPercent = item.price.discountPercent;
    } else {
      discountPercent = getDiscountPercent(unitMrp, unitPrice);
    }
  } else {
    // 2) price is a number at top-level
    unitMrp =
      item.mrp ||
      item.mrpPrice ||
      item.priceMrp ||
      0;

    unitPrice =
      item.salePrice ||
      item.sellingPrice ||
      item.price ||
      0;

    discountPercent = getDiscountPercent(unitMrp, unitPrice);
  }

  // avoid NaN
  if (!unitMrp && unitPrice) unitMrp = unitPrice;
  if (!unitPrice && unitMrp) unitPrice = unitMrp;

  if (!discountPercent) {
    discountPercent = getDiscountPercent(unitMrp, unitPrice);
  }

  return { unitMrp, unitPrice, discountPercent };
};

/**
 * Render color:
 * - if hex code (#xxxxxx) → show dot + optional label
 * - if normal text → show text
 */
const renderColorInfo = (colorValue, colorLabel) => {
  const value = colorValue || colorLabel;

  if (!value) return 'Color not selected';

  if (typeof value === 'string' && value.startsWith('#')) {
    return (
      <span className={styles.colorWrap}>
        <span
          className={styles.colorDot}
          style={{ backgroundColor: value }}
        />
        <span className={styles.colorText}>
          {colorLabel || 'Selected color'}
        </span>
      </span>
    );
  }

  return value;
};

// ---------- COMPONENT ----------

function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();

  const {
    cartItems = [],
    incrementQty,
    decrementQty,
    removeFromCart,
    addToCart,
  } = useContext(CartContext);

  const { wishlistItems = [] } = useContext(WishlistContext);

  const [couponCode, setCouponCode] = useState('');

  // subtotal using normalized price
  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => {
        const { unitPrice } = getUnitPriceInfo(item);
        const qty = item.quantity || 1;
        return sum + unitPrice * qty;
      }, 0),
    [cartItems],
  );

  const totalItems = cartItems.length;

  const remainingForFreeShipping =
    FREE_SHIPPING_THRESHOLD - cartSubtotal > 0
      ? FREE_SHIPPING_THRESHOLD - cartSubtotal
      : 0;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleAddWishlistItem = (product) => {
    if (addToCart) addToCart(product, 1);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
      onClick={handleOverlayClick}
    >
      <aside className={styles.drawer}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={styles.cartTitle}>Cart</span>
            <span className={styles.itemCount}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
            <span className={styles.headerDivider}>|</span>
            <span className={styles.headerAmount}>₹ {cartSubtotal}</span>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <FiX />
          </button>
        </div>

        {/* BODY */}
        <div className={styles.body}>
          {/* CART ITEMS */}
          <div className={styles.cartItemsWrapper}>
            {cartItems.length === 0 ? (
              <div className={styles.emptyState}>
                Your bag is empty. Start shopping!
              </div>
            ) : (
              cartItems.map((item) => {
                const qty = item.quantity || 1;
                const { unitMrp, unitPrice, discountPercent } =
                  getUnitPriceInfo(item);

                const lineMrp = unitMrp * qty;
                const linePrice = unitPrice * qty;

                const colorLabel =
                  item.colorLabel ||
                  item.colorName ||
                  item.shadeLabel;
                const colorValue =
                  item.color ||
                  item.shade ||
                  item.colorValue;

                return (
                  <div
                    key={item._id || item.id}
                    className={styles.cartItem}
                  >
                    <div className={styles.itemImageWrap}>
                      <img
                        src={getImageUrl(item.mainImage || item.image)}
                        alt={item.name}
                        className={styles.itemImage}
                      />
                    </div>

                    <div className={styles.itemContent}>
                      <div className={styles.itemTopRow}>
                        <div>
                          {/* name */}
                          <p className={styles.itemName}>{item.name}</p>

                          {/* brand · category · subcategory */}
                          <p className={styles.itemMetaLine}>
                            {item.brand && <span>{item.brand}</span>}
                            {item.category && (
                              <span>
                                {item.brand ? ' · ' : ''}
                                {item.category}
                              </span>
                            )}
                            {item.subcategory && (
                              <span> · {item.subcategory}</span>
                            )}
                          </p>

                          {/* color | size | gender */}
                          <p className={styles.itemMeta}>
                            {renderColorInfo(colorValue, colorLabel)}
                            {item.size && <> | {item.size}</>}
                            {item.gender && <> | {item.gender}</>}
                          </p>
                        </div>

                        {/* remove */}
                        <button
                          className={styles.removeBtn}
                          onClick={() =>
                            removeFromCart &&
                            removeFromCart(item._id || item.id)
                          }
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      {/* price + qty */}
                      <div className={styles.itemPriceRow}>
                        <div className={styles.priceBlock}>
                          {lineMrp && lineMrp > linePrice ? (
                            <>
                              <span className={styles.mrp}>
                                ₹ {lineMrp}
                              </span>
                              <span className={styles.price}>
                                ₹ {linePrice}
                              </span>
                            </>
                          ) : (
                            <span className={styles.price}>
                              ₹ {linePrice}
                            </span>
                          )}

                          {discountPercent > 0 && (
                            <span className={styles.discountTag}>
                              {discountPercent}% OFF
                            </span>
                          )}

                          {qty > 1 && (
                            <span className={styles.perUnit}>
                              (₹ {unitPrice} each)
                            </span>
                          )}
                        </div>

                        <div className={styles.qtyControls}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() =>
                              decrementQty &&
                              decrementQty(item._id || item.id)
                            }
                            disabled={qty <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span className={styles.qtyValue}>{qty}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() =>
                              incrementQty &&
                              incrementQty(item._id || item.id)
                            }
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>

                      <p className={styles.returnInfo}>
                        {item.returnInfo ||
                          (item.isNonReturnable
                            ? 'Non Returnable'
                            : '14 days return available')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* COUPON */}
          <div className={styles.couponCard}>
            <button className={styles.viewOffersBtn}>
              <span>View available offers</span>
              <FiChevronRight />
            </button>

            <div className={styles.couponInputRow}>
              <input
                type="text"
                placeholder="Enter Discount Code"
                className={styles.couponInput}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className={styles.couponApplyBtn}>APPLY</button>
            </div>

            <p className={styles.couponHint}>
              Please apply giftcard in the next step
            </p>
          </div>

          {/* WISHLIST SECTION */}
          {wishlistItems && wishlistItems.length > 0 && (
            <div className={styles.wishlistSection}>
              <h3 className={styles.wishlistTitle}>Add from Wishlist</h3>

              <div className={styles.wishlistGrid}>
                {wishlistItems.map((prod) => {
                  const {
                    unitMrp,
                    unitPrice,
                    discountPercent,
                  } = getUnitPriceInfo(prod);

                  const colorLabel =
                    prod.colorLabel ||
                    prod.colorName ||
                    prod.shadeLabel;
                  const colorValue =
                    prod.color ||
                    prod.shade ||
                    prod.colorValue;

                  return (
                    <div
                      key={prod._id || prod.id}
                      className={styles.wishlistCard}
                    >
                      <div className={styles.wishlistImgWrap}>
                        <img
                          src={getImageUrl(prod.mainImage || prod.image)}
                          alt={prod.name}
                          className={styles.wishlistImg}
                        />
                      </div>

                      <div className={styles.wishlistBody}>
                        <p className={styles.wishlistName}>{prod.name}</p>

                        <p className={styles.wishlistMeta}>
                          {prod.brand && <span>{prod.brand}</span>}
                          {prod.category && (
                            <span>
                              {prod.brand ? ' · ' : ''}
                              {prod.category}
                            </span>
                          )}
                          {prod.subcategory && (
                            <span> · {prod.subcategory}</span>
                          )}
                        </p>

                        <p className={styles.wishlistMetaSmall}>
                          {renderColorInfo(colorValue, colorLabel)}
                          {prod.size && <> | {prod.size}</>}
                          {prod.gender && <> | {prod.gender}</>}
                        </p>

                        <div className={styles.wishlistPriceRow}>
                          {unitMrp && unitMrp > unitPrice ? (
                            <>
                              <span className={styles.wishlistMrp}>
                                ₹ {unitMrp}
                              </span>
                              <span className={styles.wishlistPrice}>
                                ₹ {unitPrice}
                              </span>
                            </>
                          ) : (
                            <span className={styles.wishlistPrice}>
                              ₹ {unitPrice}
                            </span>
                          )}

                          {discountPercent > 0 && (
                            <span className={styles.wishlistDiscount}>
                              {discountPercent}% OFF
                            </span>
                          )}
                        </div>

                        <button
                          className={styles.wishlistAddBtn}
                          onClick={() => handleAddWishlistItem(prod)}
                        >
                          ADD TO BAG
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ height: '80px' }} />
        </div>

        {/* FREE SHIPPING BAR */}
        <div className={styles.shippingBar}>
          {remainingForFreeShipping > 0 ? (
            <span>
              Add ₹ {remainingForFreeShipping} more for free shipping !!
            </span>
          ) : (
            <span>Eligible for free shipping !!</span>
          )}
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            <span>CHECK OUT</span>
            <span>₹ {cartSubtotal}</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default CartDrawer;
