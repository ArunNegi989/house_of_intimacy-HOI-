// src/components/cart/CartDrawer.jsx
import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX, FiPlus, FiMinus, FiTrash2, FiChevronRight } from 'react-icons/fi';

import styles from '../../assets/styles/cart/CartDrawer.module.css';
import { CartContext } from '../../contexts/CartContext';
import { WishlistContext } from '../../contexts/WishlistContext';

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${apiRoot}${url}`;
};

const FREE_SHIPPING_THRESHOLD = 999;

const getDiscountPercent = (mrp, price) => {
  if (!mrp || !price || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

/**
 * Normalize product price into:
 *  { unitMrp, unitPrice, discountPercent }
 */
const getUnitPriceInfo = (prod) => {
  if (!prod) return { unitMrp: 0, unitPrice: 0, discountPercent: 0 };

  let unitMrp = 0;
  let unitPrice = 0;
  let discountPercent = 0;

  const price = prod.price;

  if (price && typeof price === 'object') {
    unitMrp = price.mrp || price.mrpPrice || prod.mrp || 0;
    unitPrice =
      price.sellingPrice ||
      price.sale ||
      price.salePrice ||
      price.finalPrice ||
      price.price ||
      prod.salePrice ||
      prod.sellingPrice ||
      prod.priceValue ||
      0;

    if (typeof price.discountPercent === 'number') {
      discountPercent = price.discountPercent;
    } else {
      discountPercent = getDiscountPercent(unitMrp, unitPrice);
    }
  } else {
    unitMrp = prod.mrp || prod.mrpPrice || prod.priceMrp || 0;
    unitPrice = prod.salePrice || prod.sellingPrice || price || 0;
    discountPercent = getDiscountPercent(unitMrp, unitPrice);
  }

  if (!unitMrp && unitPrice) unitMrp = unitPrice;
  if (!unitPrice && unitMrp) unitPrice = unitMrp;
  if (!discountPercent) {
    discountPercent = getDiscountPercent(unitMrp, unitPrice);
  }

  return { unitMrp, unitPrice, discountPercent };
};

const renderColorInfo = (colorValue, colorLabel) => {
  const value = colorValue || colorLabel;
  if (!value) return 'Color not selected';

  if (typeof value === 'string' && value.startsWith('#')) {
    return (
      <span className={styles.colorWrap}>
        <span className={styles.colorDot} style={{ backgroundColor: value }} />
        <span className={styles.colorText}>
          {colorLabel || 'Selected color'}
        </span>
      </span>
    );
  }

  return value;
};

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

  // ✅ subtotal from cart lines
  const cartSubtotal = useMemo(
    () =>
      cartItems.reduce((sum, line) => {
        const prod = line.product || line;
        const { unitPrice } = getUnitPriceInfo(prod);
        const qty = line.quantity || 1;
        return sum + unitPrice * qty;
      }, 0),
    [cartItems],
  );

  // ✅ total pieces (not just distinct lines)
  const totalItems = useMemo(
    () => cartItems.reduce((sum, line) => sum + (line.quantity || 1), 0),
    [cartItems],
  );

  const remainingForFreeShipping =
    FREE_SHIPPING_THRESHOLD - cartSubtotal > 0
      ? FREE_SHIPPING_THRESHOLD - cartSubtotal
      : 0;

  const freeShippingProgress = Math.min(
    (cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  const handleAddWishlistItem = (product) => {
    if (!product) return;
    addToCart(product, { quantity: 1 });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleContinueShopping = () => {
    onClose();
    navigate('/');
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
            <div className={styles.headerTitleRow}>
              <span className={styles.cartTitle}>Your Bag</span>
              <span className={styles.itemCount}>
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            <p className={styles.headerSubline}>
              Free shipping on orders above ₹{FREE_SHIPPING_THRESHOLD}
            </p>
          </div>
          <div className={styles.headerRight}>
            <span className={styles.headerAmountLabel}>Subtotal</span>
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
                <div className={styles.emptyIcon}>🛍️</div>
                <h3 className={styles.emptyTitle}>Your bag is empty</h3>
                <p className={styles.emptyText}>
                  Looks like you haven&apos;t added anything yet.
                </p>
                <button
                  className={styles.emptyCta}
                  onClick={handleContinueShopping}
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((line, index) => {
                const prod = line.product || line;
                const qty = line.quantity || 1;

                const { unitMrp, unitPrice, discountPercent } =
                  getUnitPriceInfo(prod);

                const lineMrp = unitMrp * qty;
                const linePrice = unitPrice * qty;

                const colorValue =
                  line.color || prod.color || prod.shade || prod.colorValue;
                const colorLabel =
                  line.colorLabel ||
                  prod.colorLabel ||
                  prod.colorName ||
                  prod.shadeLabel;

                return (
                  <div
                    key={`${line.productId || prod._id || index}-${
                      line.size || ''
                    }-${line.color || ''}`}
                    className={styles.cartItem}
                  >
                    <div className={styles.itemImageWrap}>
                      <img
                        src={getImageUrl(
                          prod.mainImage || prod.image || line.image,
                        )}
                        alt={prod.name}
                        className={styles.itemImage}
                      />
                    </div>

                    <div className={styles.itemContent}>
                      <div className={styles.itemTopRow}>
                        <div>
                          <p className={styles.itemName}>{prod.name}</p>

                          <p className={styles.itemMetaLine}>
                            {prod.brand && (
                              <span className={styles.itemBrand}>
                                {prod.brand}
                              </span>
                            )}
                            {prod.category && (
                              <span className={styles.itemCategory}>
                                {prod.brand ? ' · ' : ''}
                                {prod.category}
                              </span>
                            )}
                            {prod.subcategory && (
                              <span className={styles.itemSubcategory}>
                                {' '}
                                · {prod.subcategory}
                              </span>
                            )}
                          </p>

                          <p className={styles.itemMeta}>
                            {renderColorInfo(colorValue, colorLabel)}
                            {line.size && (
                              <span className={styles.metaDivider}>•</span>
                            )}
                            {line.size && (
                              <span className={styles.metaPill}>
                                Size: {line.size}
                              </span>
                            )}
                            {prod.gender && (
                              <>
                                <span className={styles.metaDivider}>•</span>
                                <span className={styles.metaGender}>
                                  {prod.gender}
                                </span>
                              </>
                            )}
                          </p>
                        </div>

                        <button
                          className={styles.removeBtn}
                          onClick={() => removeFromCart(index)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>

                      <div className={styles.itemPriceRow}>
                        <div className={styles.priceBlock}>
                          {lineMrp && lineMrp > linePrice ? (
                            <>
                              <span className={styles.mrp}>₹ {lineMrp}</span>
                              <span className={styles.price}>
                                ₹ {linePrice}
                              </span>
                            </>
                          ) : (
                            <span className={styles.price}>₹ {linePrice}</span>
                          )}

                          {discountPercent > 0 && (
                            <span className={styles.discountTag}>
                              {discountPercent}% OFF
                            </span>
                          )}

                          {qty > 1 && (
                            <span className={styles.perUnit}>
                              ₹ {unitPrice} / piece
                            </span>
                          )}
                        </div>

                        <div className={styles.qtyControls}>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => decrementQty(index)}
                            disabled={qty <= 1}
                          >
                            <FiMinus />
                          </button>
                          <span className={styles.qtyValue}>{qty}</span>
                          <button
                            className={styles.qtyBtn}
                            onClick={() => incrementQty(index)}
                          >
                            <FiPlus />
                          </button>
                        </div>
                      </div>

                      <p className={styles.returnInfo}>
                        {prod.returnInfo ||
                          (prod.isNonReturnable
                            ? 'Non returnable item'
                            : 'Easy 14-day returns')}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* COUPON */}
          <div className={styles.couponCard}>
            <div className={styles.couponHeader}>
              <span className={styles.couponLabel}>Offers & Benefits</span>
              <button className={styles.viewOffersBtn}>
                <span>View available offers</span>
                <FiChevronRight />
              </button>
            </div>

            <div className={styles.couponInputRow}>
              <input
                type="text"
                placeholder="Enter discount code"
                className={styles.couponInput}
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <button className={styles.couponApplyBtn}>Apply</button>
            </div>

            <p className={styles.couponHint}>
              Gift cards can be applied on the payment page.
            </p>
          </div>

          {/* WISHLIST SECTION */}
          {wishlistItems && wishlistItems.length > 0 && (
            <div className={styles.wishlistSection}>
              <div className={styles.wishlistHeader}>
                <h3 className={styles.wishlistTitle}>Add from Wishlist</h3>
                <span className={styles.wishlistCount}>
                  {wishlistItems.length} saved
                </span>
              </div>

              <div className={styles.wishlistGrid}>
                {wishlistItems.map((prod, idx) => {
                  if (!prod || typeof prod !== 'object') return null;

                  const { unitMrp, unitPrice, discountPercent } =
                    getUnitPriceInfo(prod);

                  const colorLabel =
                    prod.colorLabel || prod.colorName || prod.shadeLabel;
                  const colorValue =
                    prod.color || prod.shade || prod.colorValue;

                  return (
                    <div
                      key={prod._id || prod.id || idx}
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
                          {prod.brand && (
                            <span className={styles.wishlistBrand}>
                              {prod.brand}
                            </span>
                          )}
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
                          {prod.size && (
                            <span className={styles.metaDivider}>•</span>
                          )}
                          {prod.size && (
                            <span className={styles.metaPill}>
                              Size: {prod.size}
                            </span>
                          )}
                          {prod.gender && (
                            <>
                              <span className={styles.metaDivider}>•</span>
                              <span className={styles.metaGender}>
                                {prod.gender}
                              </span>
                            </>
                          )}
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
                          Add to bag
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
          <div className={styles.shippingText}>
            {remainingForFreeShipping > 0 ? (
              <span>
                Add <strong>₹ {remainingForFreeShipping}</strong> more for free
                shipping
              </span>
            ) : (
              <span>You&apos;re eligible for free shipping 🎉</span>
            )}
          </div>
          <div className={styles.shippingProgress}>
            <div
              className={styles.shippingProgressFill}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className={styles.footer}>
          <div className={styles.footerInfo}>
            <span className={styles.footerLabel}>Total</span>
            <span className={styles.footerAmount}>₹ {cartSubtotal}</span>
          </div>
          <button className={styles.checkoutBtn} onClick={handleCheckout}>
            <span>Proceed to Checkout</span>
          </button>
        </div>
      </aside>
    </div>
  );
}

export default CartDrawer;
