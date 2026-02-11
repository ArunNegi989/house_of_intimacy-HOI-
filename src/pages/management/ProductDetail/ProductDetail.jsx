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
import { FaHeart } from 'react-icons/fa';

import styles from '../../../assets/styles/productcollection/ProductDetail.module.css';

// ✅ Wishlist context
import { WishlistContext } from '../../../contexts/WishlistContext';
// ✅ Cart context
import { CartContext } from '../../../contexts/CartContext';

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${apiRoot}${url}`;
};

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

const decodeColor = (value) => {
  if (!value) return '#e5e5e5';

  const str = String(value).trim();
  const hexRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;
  if (hexRegex.test(str)) return str;

  const lower = str.toLowerCase();
  const matchedKey = Object.keys(COLOR_MAP).find(
    (k) => k.toLowerCase() === lower,
  );
  if (matchedKey) return COLOR_MAP[matchedKey];

  return str || '#e5e5e5';
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ page open hote hi top se start hoga
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    });
  }, []);

  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const { addToCart, cartItems } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pin, setPin] = useState('');
  const [pinMessage, setPinMessage] = useState('');
  const [pinError, setPinError] = useState(false);

  const [isDehradunPincode, setIsDehradunPincode] = useState(null);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [sizeError, setSizeError] = useState(false);
  const [colorError, setColorError] = useState(false);

  const [wishlist, setWishlist] = useState(false);

  const [qty, setQty] = useState(1);
  const [actionMessage, setActionMessage] = useState('');

  const [activeAccordion, setActiveAccordion] = useState('description');

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // ⭐⭐ Color variants (same product different colors)
  const [colorVariants, setColorVariants] = useState([]);
  const [loadingVariants, setLoadingVariants] = useState(false);

  // ---------- FETCH COLOR VARIANTS ----------
 const fetchColorVariants = async (currentProduct) => {
  if (!currentProduct) return;

  try {
    setLoadingVariants(true);

    // ⭐⭐ EXTRACT BASE PRODUCT CODE
    const baseCode = currentProduct.productCode
      ? currentProduct.productCode.split('-').slice(0, -1).join('-')
      : null;

    if (!baseCode) {
      console.warn('⚠️ No product code found, skipping variants');
      setColorVariants([]);
      return;
    }

    const params = new URLSearchParams();
    
    // ⭐ Match by BASE product code (same design, different colors)
    params.append('productCode', baseCode);
    params.append('limit', '50');

    const res = await fetch(`${baseUrl}/products?${params.toString()}`);
    const data = await res.json();

    console.log('🎨 Color Variants Response:', data);

    if (data.data && Array.isArray(data.data)) {
      const variants = data.data.filter(
        (p) => String(p._id) !== String(currentProduct._id)
      );

      const colorMap = new Map();

      // Add current product's colors
      if (Array.isArray(currentProduct.colors)) {
        currentProduct.colors.forEach((color) => {
          if (color && !colorMap.has(color)) {
            colorMap.set(color, {
              color,
              productId: currentProduct._id,
              productCode: currentProduct.productCode,
              isCurrentProduct: true,
            });
          }
        });
      }

      // Add variant colors (SAME BASE CODE ONLY)
      variants.forEach((variant) => {
        if (Array.isArray(variant.colors)) {
          variant.colors.forEach((color) => {
            if (color && !colorMap.has(color)) {
              colorMap.set(color, {
                color,
                productId: variant._id,
                productCode: variant.productCode,
                isCurrentProduct: false,
              });
            }
          });
        }
      });

      const uniqueVariants = Array.from(colorMap.values());
      console.log('🎨 Unique Color Variants:', uniqueVariants);
      setColorVariants(uniqueVariants);
      
      // Auto-select first color
      if (Array.isArray(currentProduct.colors) && currentProduct.colors.length > 0) {
        setSelectedColor(currentProduct.colors[0]);
      }
    }
  } catch (error) {
    console.error('Error fetching color variants:', error);
    setColorVariants([]);
  } finally {
    setLoadingVariants(false);
  }
};

  // ---------- FETCH PRODUCT ----------
  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setProduct(null);
        setSelectedColor(null);
        setSelectedSize(null);
        setSizeError(false);
        setColorError(false);
        setPin('');
        setPinMessage('');
        setPinError(false);
        setIsDehradunPincode(null);
        setActionMessage('');
        setQty(1);
        setColorVariants([]);

        const res = await fetch(`${baseUrl}/products/${id}`);
        const data = await res.json();

        console.log('PRODUCT DATA 👉', data);
        setProduct(data);

        // Fetch color variants for this product (includes auto-select)
        await fetchColorVariants(data);

        const gallery = Array.isArray(data.galleryImages)
          ? data.galleryImages
          : [];
        const allImages = [data.mainImage, ...gallery].filter(Boolean);

        if (allImages.length > 0) {
          setActiveImage(allImages[0]);
        }

        if (data.brand) {
          const relRes = await fetch(
            `${baseUrl}/products/brand/${encodeURIComponent(
              data.brand,
            )}`,
          );
          const relData = await relRes.json();
          const filtered = relData.filter((p) => String(p._id) !== String(id));
          setRelatedProducts(filtered);
        }
      } catch (error) {
        console.error('Error fetching product', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // ✅ sync wishlist heart
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

  // helpful flags
  const hasColors = Array.isArray(product.colors) && product.colors.length > 0;
  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  // ---------- HANDLERS ----------
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    setSizeError(false);
  };

  // ⭐⭐ UNIFIED: Handle color variant click - select AND navigate
  const handleColorVariantClick = (variant) => {
    if (variant.isCurrentProduct) {
      // Same product, just select the color
      if (product.colors.includes(variant.color)) {
        setSelectedColor(variant.color);
        setColorError(false);
        console.log('🎨 Selected color (current product):', variant.color);
      }
    } else {
      // Different product - navigate to it (auto-select will happen on load)
      console.log('🎨 Switching to product:', variant.productId, 'with color:', variant.color);
      navigate(`/product/${variant.productId}`);
    }
  };

  const handleWishlistToggle = () => {
    if (!product || !product._id) return;

    setWishlist((prev) => {
      const newState = !prev;
      toggleWishlist(product._id);

      setActionMessage(
        newState ? 'Added to wishlist 💖' : 'Removed from wishlist',
      );
      setTimeout(() => setActionMessage(''), 2000);

      return newState;
    });
  };

  const handleCheckPin = async () => {
    setPinMessage('');
    setPinError(false);
    setIsDehradunPincode(null);

    const clean = pin.trim();
    const valid = /^[0-9]{6}$/.test(clean);

    if (!valid) {
      setPinError(true);
      setPinMessage('Please enter a valid 6-digit pincode.');
      return;
    }

    try {
      const res = await fetch(
        `${baseUrl}/shipping/check-pincode/${clean}`,
      );
      const data = await res.json();

      setIsDehradunPincode(data.codAllowed);

      if (!data.codAllowed) {
        setPinError(true);
      } else {
        setPinError(false);
      }

      setPinMessage(data.message || '');
    } catch (err) {
      console.error('Pincode check error', err);
      setPinError(true);
      setPinMessage(
        'Unable to check this pincode right now. Please try again.',
      );
      setIsDehradunPincode(null);
    }
  };

  const handleSizeGuide = () => {
    setIsSizeGuideOpen(true);
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

  // ✅ MAIN: Add to Bag – size & color (if available) are mandatory
  const handleAddToBag = () => {
    setSizeError(false);
    setColorError(false);

    if (hasColors && !selectedColor) {
      setColorError(true);
      setActionMessage('Please select a color to continue');
      setTimeout(() => setActionMessage(''), 2000);
      const el = document.getElementById('color-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (hasSizes && !selectedSize) {
      setSizeError(true);
      setActionMessage('Please select a size to continue');
      setTimeout(() => setActionMessage(''), 2000);
      const el = document.getElementById('size-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const alreadyInCart = cartItems.some(
      (item) =>
        item.productId === product._id &&
        item.size === selectedSize &&
        item.color === selectedColor,
    );

    if (alreadyInCart) {
      setActionMessage('This item is already in your bag');
      setTimeout(() => setActionMessage(''), 2000);
      return;
    }

    addToCart(product, {
      size: selectedSize,
      color: selectedColor,
      quantity: qty,
    });

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
    setSizeError(false);
    setColorError(false);

    if (hasColors && !selectedColor) {
      setColorError(true);
      setActionMessage('Please select a color to continue');
      setTimeout(() => setActionMessage(''), 2000);
      const el = document.getElementById('color-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (hasSizes && !selectedSize) {
      setSizeError(true);
      setActionMessage('Please select a size to continue');
      setTimeout(() => setActionMessage(''), 2000);
      const el = document.getElementById('size-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const alreadyInCart = cartItems.some(
      (item) =>
        item.productId === product._id &&
        item.size === selectedSize &&
        item.color === selectedColor,
    );

    if (!alreadyInCart) {
      addToCart(product, {
        size: selectedSize,
        color: selectedColor,
        quantity: qty,
      });

      console.log('BUY NOW (added to cart) 👉', {
        productId: product._id,
        size: selectedSize,
        color: selectedColor,
        qty,
      });
    } else {
      console.log('BUY NOW 👉 item already in bag, going to checkout');
    }

    navigate('/checkout');
  };

  const handleShareClick = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);

    setActionMessage('Product link copied to clipboard 🔗');
    setTimeout(() => setActionMessage(''), 2000);
  } catch (err) {
    console.error('Copy failed', err);
    setActionMessage('Failed to copy link');
    setTimeout(() => setActionMessage(''), 2000);
  }
};


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
    { label: 'Care', value: product.careInstructions },
  ].filter((item) => !!item.value);

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

  const shippingList =
    Array.isArray(product.shippingAndReturns) &&
    product.shippingAndReturns.length > 0
      ? product.shippingAndReturns
      : [
          'Orders are usually dispatched within 24 hours.',
          'Delivery time varies between 2–7 working days depending on your pincode.',
          'Easy 7-day return policy from the date of delivery. Products must be unused, unwashed and with all tags attached.',
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

      {/* 🔔 toast */}
      {actionMessage && (
        <div className={styles.actionToast}>{actionMessage}</div>
      )}

      <div className={styles.contentWrapper}>
        {/* ---------- LEFT: IMAGES ---------- */}
        <div className={styles.leftCol}>
          <div className={styles.galleryWrapper}>
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

            <div className={styles.mainImageWrapper}>
              {activeImage && (
                <img src={getImageUrl(activeImage)} alt={product.name} />
              )}
            </div>
          </div>

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
                {wishlist ? (
                  <FaHeart className={styles.heartFilled} />
                ) : (
                  <FiHeart />
                )}
              </button>
             <button
  className={styles.iconBtn}
  onClick={handleShareClick}
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

          {/* ⭐⭐ UNIFIED COLOR SECTION - Only "Available Colors" (combines both current + variants) */}
          {colorVariants.length > 0 && (
            <div className={styles.section} id="color-section">
              <div className={styles.sectionLabelRow}>
                <div>
                  <span className={styles.sectionLabel}>
                    Available Colors
                  </span>
                  {selectedColor && (
                    <span className={styles.sectionSubLabel}>
                      {' '}
                      — {selectedColor}
                    </span>
                  )}
                  {colorError && (
                    <span className={styles.sizeErrorText}>
                      &nbsp;— Please select a color
                    </span>
                  )}
                  {loadingVariants && (
                    <span className={styles.sectionSubLabel}>
                      {' '}
                      — Loading...
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.colorDots}>
                {colorVariants.map((variant, idx) => {
                  const bg = decodeColor(variant.color);
                  const isActive = selectedColor === variant.color;

                  return (
                    <button
                      key={idx}
                      className={`${styles.colorDot} ${
                        isActive ? styles.colorDotActive : ''
                      } ${
                        variant.isCurrentProduct
                          ? styles.colorDotCurrentProduct
                          : styles.colorDotOtherProduct
                      }`}
                      title={`${variant.color}${
                        variant.isCurrentProduct ? '' : ' (switch product)'
                      }`}
                      style={{ backgroundColor: bg }}
                      onClick={() => handleColorVariantClick(variant)}
                    />
                  );
                })}
              </div>
              
              <div className={styles.colorVariantHint}>
                {colorVariants.some(v => !v.isCurrentProduct) 
                  ? 'Click to select or switch to different product color'
                  : 'Select your preferred color'}
              </div>
            </div>
          )}

          {/* SIZES */}
          {hasSizes && (
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

          {/* QTY + ACTION ROW */}
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
                  (hasSizes && !selectedSize) || (hasColors && !selectedColor)
                    ? styles.addToBagDisabled
                    : ''
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

          {/* PINCODE CHECK */}
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
                {isDehradunPincode && (
                  <span> COD is available for this pincode.</span>
                )}
              </div>
            )}
            {!pinMessage && (
              <div className={styles.dispatchText}>
                Usually dispatches within 24 hours.
              </div>
            )}
          </div>

          {/* META */}
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

      {/* BOTTOM: FEATURES + ACCORDION */}
      <div className={`container ${styles.bottomInfoWrapper}`}>
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

        <div className={styles.accordionCol}>
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
                {shippingList.map((point, idx) => (
                  <p key={idx}>{point}</p>
                ))}
              </div>
            )}
          </div>

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

      {/* RELATED PRODUCTS */}
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

      {/* MOBILE STICKY BAR */}
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

      {/* ⭐ SIZE GUIDE MODAL ⭐ */}
      {isSizeGuideOpen && (
        <div
          className={styles.sizeGuideOverlay}
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            className={styles.sizeGuideModal}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={styles.sizeGuideClose}
              onClick={() => setIsSizeGuideOpen(false)}
            >
              ×
            </button>

            <h2 className={styles.sizeGuideTitle}>Size Guide</h2>
            <p className={styles.sizeGuideSubtitle}>
              Use this chart to find your perfect fit.
            </p>

            <div className={styles.sizeGuideContent}>
              <div className={styles.sizeGuideBlock}>
                <h3>Bras / Tops</h3>
                <table className={styles.sizeGuideTable}>
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Bust (inches)</th>
                      <th>Underbust (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>32B</td>
                      <td>32–33</td>
                      <td>26–27</td>
                    </tr>
                    <tr>
                      <td>34B</td>
                      <td>34–35</td>
                      <td>28–29</td>
                    </tr>
                    <tr>
                      <td>36B</td>
                      <td>36–37</td>
                      <td>30–31</td>
                    </tr>
                    <tr>
                      <td>38B</td>
                      <td>38–39</td>
                      <td>32–33</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className={styles.sizeGuideBlock}>
                <h3>Bottoms / Panties</h3>
                <table className={styles.sizeGuideTable}>
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Waist (inches)</th>
                      <th>Hip (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>XS</td>
                      <td>24–26</td>
                      <td>32–34</td>
                    </tr>
                    <tr>
                      <td>S</td>
                      <td>26–28</td>
                      <td>34–36</td>
                    </tr>
                    <tr>
                      <td>M</td>
                      <td>28–30</td>
                      <td>36–38</td>
                    </tr>
                    <tr>
                      <td>L</td>
                      <td>30–32</td>
                      <td>38–40</td>
                    </tr>
                    <tr>
                      <td>XL</td>
                      <td>32–34</td>
                      <td>40–42</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <p className={styles.sizeGuideNote}>
              Tip: If you fall between two sizes, choose the larger size for
              more comfort.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;