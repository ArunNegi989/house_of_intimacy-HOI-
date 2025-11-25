// src/components/.../ProductDetail.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiHeart,
  FiShare2,
  FiTruck,
  FiRotateCcw,
  FiShield,
  FiPlus,
  FiMinus,
  FiShoppingBag,
} from 'react-icons/fi';
// ✅ NEW: filled heart icon
import { FaHeart } from 'react-icons/fa';

import styles from '../../../assets/styles/productcollection/ProductDetail.module.css';

// ✅ NEW: import WishlistContext
import { WishlistContext } from '../../../contexts/WishlistContext';

const API_BASE_URL = 'http://localhost:8000';

// helper: convert "/uploads/..." → "http://localhost:8000/uploads/..."
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

// optional color map (known names → hex)
const COLOR_MAP = {
  Black: '#000000',
  Purple: '#800080',
  White: '#ffffff',
  Red: '#ef4444',
  Blue: '#3b82f6',
  Green: '#22c55e',
  Nude: '#F5D0C5',
  Pink: '#ec4899',
  Yellow: '#facc15',
};

// 🔎 helper: decode any color string (hex or name) into a usable CSS color
const decodeColor = (value) => {
  if (!value) return '#e5e5e5';

  const str = String(value).trim();

  // 1) if already hex (#rgb or #rrggbb)
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (hexRegex.test(str)) {
    return str;
  }

  // 2) try map (case-insensitive match)
  const lower = str.toLowerCase();
  const matchedKey = Object.keys(COLOR_MAP).find(
    (k) => k.toLowerCase() === lower
  );
  if (matchedKey) {
    return COLOR_MAP[matchedKey];
  }

  // 3) otherwise return the string itself – browser named color ho sakta hai
  return str || '#e5e5e5';
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ use wishlist context
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pin, setPin] = useState('');
  const [pinMessage, setPinMessage] = useState('');
  const [pinError, setPinError] = useState(false);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);

  const [wishlist, setWishlist] = useState(false);

  // ✅ qty + toast-like feedback
  const [qty, setQty] = useState(1);
  const [actionMessage, setActionMessage] = useState('');

  // ✅ which accordion is open?
  const [activeAccordion, setActiveAccordion] = useState('description');

  // ---------- FETCH PRODUCT ----------
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setProduct(null);
        setSelectedColor(null);
        setSelectedSize(null);
        setSizeError(false);
        setPin('');
        setPinMessage('');
        setActionMessage('');
        setQty(1);

        const res = await fetch(`${API_BASE_URL}/v1/products/${id}`);
        const data = await res.json();

        console.log('PRODUCT DATA 👉', data);
        setProduct(data);

        // build image list from mainImage + galleryImages
        const gallery = Array.isArray(data.galleryImages)
          ? data.galleryImages
          : [];
        const allImages = [data.mainImage, ...gallery].filter(Boolean);

        if (allImages.length > 0) {
          setActiveImage(allImages[0]);
        }

        // related by brand
        if (data.brand) {
          const relRes = await fetch(
            `${API_BASE_URL}/v1/products/brand/${encodeURIComponent(
              data.brand
            )}`
          );
          const relData = await relRes.json();
          const filtered = relData.filter((p) => String(p._id) !== String(id));
          setRelatedProducts(filtered);
        }

        // scroll to top when product changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // ✅ sync local `wishlist` boolean with global context whenever product or wishlistItems changes
  useEffect(() => {
    if (product && product._id) {
      setWishlist(wishlistItems.includes(product._id));
    }
  }, [product, wishlistItems]);

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loaderWrapper}>
          <div className={styles.loaderCircle} />
          <p>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.pageWrapper}>
        <p>Product not found.</p>
      </div>
    );
  }

  // ---------- PRICE ----------
  const priceObj = product.price || {};
  const mrp = priceObj.mrp;
  const salePrice = priceObj.sale ?? mrp;
  const discountPercent =
    priceObj.discountPercent ??
    (mrp && salePrice && mrp > salePrice
      ? Math.round(((mrp - salePrice) / mrp) * 100)
      : 0);
  const isOnSale = salePrice && salePrice !== mrp;

  // ---------- IMAGES ----------
  const gallery = Array.isArray(product.galleryImages)
    ? product.galleryImages
    : [];
  const imageList = [product.mainImage, ...gallery].filter(Boolean);

  // ---------- HANDLERS ----------
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // ✅ UPDATED: also updates global wishlist + better message logic
  const handleWishlistToggle = () => {
    if (!product || !product._id) return;

    setWishlist((prev) => {
      const newState = !prev;

      // update global wishlist
      toggleWishlist(product._id);

      setActionMessage(
        newState ? 'Added to wishlist 💖' : 'Removed from wishlist'
      );
      setTimeout(() => setActionMessage(''), 2000);

      return newState;
    });

    // yaha wishlist ke liye API call bhi kar sakte ho
  };

  const handleCheckPin = () => {
    setPinMessage('');
    setPinError(false);

    const clean = pin.trim();
    const valid = /^[0-9]{6}$/.test(clean);

    if (!valid) {
      setPinError(true);
      setPinMessage('Please enter a valid 6-digit pincode.');
      return;
    }

    // Frontend demo: always deliverable 😄
    setPinError(false);
    setPinMessage(`Good news! Delivery is available to ${clean}.`);
  };

  const handleSizeGuide = () => {
    if (product.sizeGuideUrl) {
      window.open(product.sizeGuideUrl, '_blank');
    }
  };

  const handleRelatedClick = (rpId) => {
    navigate(`/product/${rpId}`);
  };

  const toggleAccordion = (key) => {
    setActiveAccordion((prev) => (prev === key ? null : key));
  };

  const incrementQty = () => {
    setQty((prev) => (prev < 10 ? prev + 1 : prev));
  };

  const decrementQty = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleAddToBag = () => {
    if (!selectedSize) {
      setSizeError(true);
      setActionMessage('Please select a size to continue');
      setTimeout(() => setActionMessage(''), 2000);
      const el = document.getElementById('size-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // yaha cart me add karne ki API call kar sakte ho
    console.log('ADD TO BAG 👉', {
      productId: product._id,
      size: selectedSize,
      color: selectedColor,
      qty,
    });

    setActionMessage('Added to bag 🛍️');
    setTimeout(() => setActionMessage(''), 2000);
  };

  const handleBuyNow = () => {
    // same validation
    if (!selectedSize) {
      setSizeError(true);
      setActionMessage('Please select a size to continue');
      setTimeout(() => setActionMessage(''), 2000);
      const el = document.getElementById('size-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // yaha direct checkout page pe navigate kar sakte ho
    console.log('BUY NOW 👉', {
      productId: product._id,
      size: selectedSize,
      color: selectedColor,
      qty,
    });
    // example:
    // navigate('/checkout');
  };

  // ---------- META INFO FROM PRODUCT ----------
  const metaFields = [
    { label: 'Fabric', value: product.fabric },
    { label: 'Composition', value: product.composition },
    { label: 'Coverage', value: product.coverage },
    { label: 'Padding', value: product.padding },
    { label: 'Underwire', value: product.underwire },
    { label: 'Strap Type', value: product.strapType },
    { label: 'Closure', value: product.closureType },
    { label: 'Pattern', value: product.pattern },
    { label: 'Occasion', value: product.occasion },
    { label: 'Care', value: product.care },
  ].filter((item) => !!item.value);

  // ---------- FEATURE LIST (LEFT COLUMN) ----------
  const featureList =
    Array.isArray(product.features) && product.features.length > 0
      ? product.features
      : [
          'Dual tone lace for vibrant and feminine touch',
          'Front open bralette styling for a playful feel',
          'Satin trims for a luxurious elegant look',
          'Decorative gold trim detailing',
          'Extended side lace detailing for a sensual coverage',
        ];

  return (
    <div className={styles.pageWrapper}>
      {/* ---------- BREADCRUMB ---------- */}
      <div className={styles.breadcrumb}>
        <span className={styles.breadcrumbLink} onClick={() => navigate('/')}>
          Home
        </span>
        <span className={styles.separator}>&gt;</span>
        {product.category && (
          <>
            <span
              className={styles.breadcrumbLink}
              onClick={() => navigate(`/${product.category}`)}
            >
              {product.category}
            </span>
            <span className={styles.separator}>&gt;</span>
          </>
        )}
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </div>

      {/* 🔔 small toast for actions */}
      {actionMessage && (
        <div className={styles.actionToast}>{actionMessage}</div>
      )}

      <div className={styles.contentWrapper}>
        {/* ---------- LEFT: IMAGES ---------- */}
        <div className={styles.leftCol}>
          <div className={styles.galleryWrapper}>
            {/* thumbnails */}
            <div className={styles.thumbsWrapper}>
              {imageList.map((img, index) => (
                <button
                  key={index}
                  className={`${styles.thumb} ${
                    activeImage === img ? styles.thumbActive : ''
                  }`}
                  onMouseEnter={() => setActiveImage(img)}
                  onClick={() => setActiveImage(img)}
                >
                  <img src={getImageUrl(img)} alt={product.name} />
                </button>
              ))}
            </div>

            {/* main image */}
            <div className={styles.mainImageWrapper}>
              {activeImage && (
                <img src={getImageUrl(activeImage)} alt={product.name} />
              )}
            </div>
          </div>

          {/* small trust badges under image */}
          <div className={styles.trustRow}>
            <div className={styles.trustItem}>
              <FiTruck />
              <span>Fast & Safe Delivery</span>
            </div>
            <div className={styles.trustItem}>
              <FiRotateCcw />
              <span>Easy 7-Day Returns</span>
            </div>
            <div className={styles.trustItem}>
              <FiShield />
              <span>Secure Checkout</span>
            </div>
          </div>
        </div>

        {/* ---------- RIGHT: DETAILS ---------- */}
        <div className={styles.rightCol}>
          <div className={styles.headerRow}>
            <div>
              {product.brand && (
                <div className={styles.brand}>{product.brand}</div>
              )}
              <h1 className={styles.title}>{product.name}</h1>
              {product.sku && (
                <div className={styles.sku}>Style Code: {product.sku}</div>
              )}
            </div>
            <div className={styles.iconActions}>
              <button
                className={`${styles.iconBtn} ${
                  wishlist ? styles.iconBtnActive : ''
                }`}
                onClick={handleWishlistToggle}
                title={wishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                {/* ✅ Heart switches to filled red when in wishlist */}
                {wishlist ? (
                  <FaHeart className={styles.heartFilled} />
                ) : (
                  <FiHeart />
                )}
              </button>
              <button
                className={styles.iconBtn}
                onClick={() =>
                  navigator.clipboard.writeText(window.location.href)
                }
                title="Copy product link"
              >
                <FiShare2 />
              </button>
            </div>
          </div>

          {/* PRICE BLOCK */}
          <div className={styles.priceWrapper}>
            <div className={styles.priceRow}>
              {isOnSale && (
                <span className={styles.salePrice}>₹ {Number(salePrice)}</span>
              )}
              {mrp && (
                <span
                  className={
                    isOnSale ? styles.mrpValueStrike : styles.mrpValueBold
                  }
                >
                  ₹ {Number(mrp)}
                </span>
              )}
              {discountPercent > 0 && (
                <span className={styles.discountTag}>
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <div className={styles.taxNote}>Inclusive of all taxes.</div>
          </div>

          {/* small line showing selections */}
          <div className={styles.chipRow}>
            {selectedColor && (
              <span className={styles.infoChip}>
                Color chosen: <strong>{selectedColor}</strong>
              </span>
            )}
            {selectedSize && (
              <span className={styles.infoChip}>
                Size chosen: <strong>{selectedSize}</strong>
              </span>
            )}
          </div>

          {/* ---------- COLORS (array of strings) ---------- */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                Color
                {selectedColor && (
                  <span className={styles.sectionSubLabel}>
                    {' '}
                    — {selectedColor}
                  </span>
                )}
              </div>
              <div className={styles.colorDots}>
                {product.colors.map((c, idx) => {
                  const colorValue = String(c).trim(); // e.g. "#F97316" or "Black"
                  const bg = decodeColor(colorValue);
                  const isActive = selectedColor === colorValue;

                  return (
                    <button
                      key={idx}
                      className={`${styles.colorDot} ${
                        isActive ? styles.colorDotActive : ''
                      }`}
                      title={colorValue}
                      style={{ backgroundColor: bg }}
                      onClick={() => handleColorSelect(colorValue)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------- SIZES (strings OR objects) ---------- */}
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className={styles.section} id="size-section">
              <div className={styles.sectionLabelRow}>
                <div>
                  <span className={styles.sectionLabel}>Select Size</span>
                  {sizeError && (
                    <span className={styles.sizeErrorText}>
                      &nbsp;— Please select a size
                    </span>
                  )}
                </div>
                {product.sizeGuideUrl && (
                  <button
                    className={styles.sizeGuideBtn}
                    type="button"
                    onClick={handleSizeGuide}
                  >
                    Size Guide
                  </button>
                )}
              </div>

              <div className={styles.sizeList}>
                {product.sizes.map((size, idx) => {
                  // handle string OR {label, stock}
                  const label =
                    typeof size === 'string'
                      ? size
                      : size.label || size.size || '';
                  const stock =
                    typeof size === 'string'
                      ? null
                      : typeof size.stock === 'number'
                      ? size.stock
                      : null;

                  const isDisabled = stock === 0;
                  const isActive = selectedSize === label;

                  return (
                    <button
                      key={idx}
                      type="button"
                      className={`${styles.sizeBtn} ${
                        isActive ? styles.sizeBtnActive : ''
                      }`}
                      disabled={isDisabled}
                      onClick={() => handleSizeSelect(label)}
                    >
                      <span>{label || `Size ${idx + 1}`}</span>
                      {isDisabled && (
                        <span className={styles.outOfStock}>Out of stock</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------- QTY + ACTION ROW ---------- */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>Quantity</div>
            <div className={styles.qtyRow}>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={decrementQty}
              >
                <FiMinus />
              </button>
              <span className={styles.qtyValue}>{qty}</span>
              <button
                type="button"
                className={styles.qtyBtn}
                onClick={incrementQty}
              >
                <FiPlus />
              </button>
            </div>

            <div className={styles.actionRow}>
              <button
                type="button"
                className={`${styles.addToBag} ${
                  !selectedSize ? styles.addToBagDisabled : ''
                }`}
                onClick={handleAddToBag}
              >
                <FiShoppingBag className={styles.addToBagIcon} />
                Add to Bag
              </button>
              <button
                type="button"
                className={styles.buyNowBtn}
                onClick={handleBuyNow}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* ---------- PINCODE CHECK ---------- */}
          <div className={styles.section}>
            <div className={styles.sectionLabel}>
              Check Delivery Availability
            </div>
            <div className={styles.pinRow}>
              <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 6-digit Pincode"
                maxLength={6}
              />
              <button type="button" onClick={handleCheckPin}>
                Check
              </button>
            </div>
            {pinMessage && (
              <div
                className={
                  pinError ? styles.pinMessageError : styles.pinMessageSuccess
                }
              >
                {pinMessage}
              </div>
            )}
            {!pinMessage && (
              <div className={styles.dispatchText}>
                Usually dispatches within 24 hours.
              </div>
            )}
          </div>

          {/* ---------- META DETAILS ---------- */}
          {metaFields.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>Product Details</div>
              <div className={styles.metaGrid}>
                {metaFields.map((item, idx) => (
                  <div key={idx} className={styles.metaItem}>
                    <div className={styles.metaLabel}>{item.label}</div>
                    <div className={styles.metaValue}>{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ---------- ✅ BOTTOM: FEATURES + FAQ ACCORDION ---------- */}
      <div className={`container ${styles.bottomInfoWrapper}`}>
        {/* LEFT: Product Feature */}
        <div className={styles.featuresCol}>
          <h2 className={styles.infoHeading}>Product Feature</h2>
          <div className={styles.featureList}>
            {featureList.map((f, idx) => (
              <div key={idx} className={styles.featureItem}>
                <span className={styles.featureBar} />
                <span className={styles.featureText}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Accordion */}
        <div className={styles.accordionCol}>
          {/* Product Description */}
          <div className={styles.accordionItem}>
            <button
              type="button"
              className={styles.accordionHeader}
              onClick={() => toggleAccordion('description')}
            >
              <span>Product Description</span>
              <span className={styles.accordionIcon}>
                {activeAccordion === 'description' ? '−' : '+'}
              </span>
            </button>
            {activeAccordion === 'description' && (
              <div className={styles.accordionBody}>
                <p>
                  {product.description ||
                    'Add a playful twist to your lingerie drawer with this product. Its vibrant dual tone lace and satin trims create an elegant look while providing the comfort and support you desire.'}
                </p>
              </div>
            )}
          </div>

          {/* Shipping & Returns */}
          <div className={styles.accordionItem}>
            <button
              type="button"
              className={styles.accordionHeader}
              onClick={() => toggleAccordion('shipping')}
            >
              <span>Shipping &amp; Returns</span>
              <span className={styles.accordionIcon}>
                {activeAccordion === 'shipping' ? '−' : '+'}
              </span>
            </button>
            {activeAccordion === 'shipping' && (
              <div className={styles.accordionBody}>
                <p>
                  Orders are usually dispatched within 24 hours. Delivery time
                  varies between 2–7 working days depending on your pincode.
                </p>
                <p>
                  Easy 7-day return policy from the date of delivery. Products
                  must be unused, unwashed and with all tags attached.
                </p>
              </div>
            )}
          </div>

          {/* Manufacturing Details */}
          <div className={styles.accordionItem}>
            <button
              type="button"
              className={styles.accordionHeader}
              onClick={() => toggleAccordion('manufacturing')}
            >
              <span>Manufacturing Details</span>
              <span className={styles.accordionIcon}>
                {activeAccordion === 'manufacturing' ? '−' : '+'}
              </span>
            </button>
            {activeAccordion === 'manufacturing' && (
              <div className={styles.accordionBody}>
                <p>
                  Manufactured and marketed by House of Intimacy Pvt. Ltd.
                  Country of origin: India.
                </p>
                <p>
                  For any product related queries, please reach out to our
                  customer care at care@example.com.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- PAIRS WELL WITH ---------- */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className={styles.relatedWrapper}>
          <div className={styles.relatedHeader}>
            <h2>Pairs well with</h2>
          </div>

          <div className={styles.relatedList}>
            {relatedProducts.slice(0, 4).map((rp) => {
              const relGallery = Array.isArray(rp.galleryImages)
                ? rp.galleryImages
                : [];
              const img =
                rp.mainImage || (relGallery.length > 0 ? relGallery[0] : null);

              const rPrice = rp.price || {};
              const rMrp = rPrice.mrp;
              const rSale = rPrice.sale ?? rMrp;
              const rOnSale = rSale && rSale !== rMrp;

              return (
                <div
                  key={rp._id}
                  className={styles.relatedCard}
                  onClick={() => handleRelatedClick(rp._id)}
                >
                  <div className={styles.relatedImgWrapper}>
                    {img && <img src={getImageUrl(img)} alt={rp.name} />}
                  </div>
                  <div className={styles.relatedInfo}>
                    <div className={styles.relatedBrand}>{rp.brand}</div>
                    <div className={styles.relatedTitle}>{rp.name}</div>
                    <div className={styles.relatedPriceRow}>
                      {rOnSale && (
                        <span className={styles.relatedPriceMain}>
                          ₹ {Number(rSale)}
                        </span>
                      )}
                      {rMrp && (
                        <span
                          className={
                            rOnSale
                              ? styles.relatedMrpStrike
                              : styles.relatedPriceMain
                          }
                        >
                          ₹ {Number(rMrp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ STICKY MOBILE BOTTOM BAR */}
      <div className={styles.mobileStickyBar}>
        <div className={styles.mobilePriceBlock}>
          {isOnSale && (
            <span className={styles.mobileSalePrice}>
              ₹ {Number(salePrice)}
            </span>
          )}
          {mrp && (
            <span
              className={
                isOnSale ? styles.mobileMrpStrike : styles.mobilePriceMain
              }
            >
              ₹ {Number(mrp)}
            </span>
          )}
        </div>
        <button
          type="button"
          className={styles.mobileAddBtn}
          onClick={handleAddToBag}
        >
          <FiShoppingBag />
          <span>Add to Bag</span>
        </button>
      </div>
    </div>
  );
}

export default ProductDetail;
