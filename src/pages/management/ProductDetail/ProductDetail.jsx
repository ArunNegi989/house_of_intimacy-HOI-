// src/components/.../ProductDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../../../assets/styles/productcollection/ProductDetail.module.css';

const API_BASE_URL = 'http://localhost:8000';

// helper: convert "/uploads/..." → "http://localhost:8000/uploads/..."
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

// optional color map
const COLOR_MAP = {
  Black: '#000000',
  Purple: '#800080',
  White: '#ffffff',
  Red: '#ef4444',
  Blue: '#3b82f6',
  Green: '#22c55e',
};

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/v1/products/${id}`);
        const data = await res.json();

        console.log('PRODUCT DATA 👉', data); // 👈 check in console
        setProduct(data);

        // build image list from mainImage + galleryImages
        const gallery = Array.isArray(data.galleryImages)
          ? data.galleryImages
          : [];
        const allImages = [data.mainImage, ...gallery].filter(Boolean);

        if (allImages.length > 0) {
          setActiveImage(allImages[0]);
        }

        if (data.brand) {
          const relRes = await fetch(
            `${API_BASE_URL}/v1/products/brand/${encodeURIComponent(
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

  if (loading) {
    return (
      <div className={styles.pageWrapper}>
        <p>Loading...</p>
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

  // ---------- IMAGES ----------
  const gallery = Array.isArray(product.galleryImages)
    ? product.galleryImages
    : [];
  const imageList = [product.mainImage, ...gallery].filter(Boolean);

  return (
    <div className={styles.pageWrapper}>
      {/* ---------- BREADCRUMB ---------- */}
      <div className={styles.breadcrumb}>
        <span
          className={styles.breadcrumbLink}
          onClick={() => navigate('/')}
        >
          Home
        </span>
        <span className={styles.separator}>&gt;</span>
        <span>{product.name}</span>
      </div>

      <div className={styles.contentWrapper}>
        {/* ---------- LEFT: IMAGES ---------- */}
        <div className={styles.leftCol}>
          {/* thumbnails */}
          <div className={styles.thumbsWrapper}>
            {imageList.map((img, index) => (
              <button
                key={index}
                className={`${styles.thumb} ${
                  activeImage === img ? styles.thumbActive : ''
                }`}
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

        {/* ---------- RIGHT: DETAILS ---------- */}
        <div className={styles.rightCol}>
          {product.brand && <div className={styles.brand}>{product.brand}</div>}
          <h1 className={styles.title}>{product.name}</h1>

          {product.sku && <div className={styles.sku}>{product.sku}</div>}

          {/* PRICE BLOCK */}
          <div className={styles.priceWrapper}>
            <div className={styles.mrpLine}>
              <span className={styles.mrpLabel}>MRP</span>
              {mrp && (
                <span className={styles.mrpValue}>₹ {Number(mrp)}</span>
              )}
              {discountPercent > 0 && (
                <span className={styles.discount}>
                  ({discountPercent}% OFF)
                </span>
              )}
            </div>
            {salePrice && salePrice !== mrp && (
              <div className={styles.salePrice}>₹ {Number(salePrice)}</div>
            )}
            <div className={styles.taxNote}>Inclusive of all taxes.</div>
          </div>

          {/* ---------- COLORS (array of strings) ---------- */}
          {Array.isArray(product.colors) && product.colors.length > 0 && (
  <div className={styles.section}>
    <div className={styles.sectionLabel}>
      Color :
    </div>
    <div className={styles.colorDots}>
      {product.colors.map((c, idx) => {
        const colorName = String(c);
        const bg =
          COLOR_MAP[colorName] ||
          COLOR_MAP[colorName.toLowerCase?.()] ||
          '#e5e5e5';
        return (
          <button
            key={idx}
            className={styles.colorDot}
            title={colorName} // tooltip ke liye, chahe to hata bhi sakta hai
            style={{ backgroundColor: bg, border: '1px solid #ccc' }}
          />
        );
      })}
    </div>
  </div>
)}


          {/* ---------- SIZES (strings OR objects) ---------- */}
          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionLabel}>
                Select Size :{' '}
                <span className={styles.sizeError}>
                  Select Size To Continue
                </span>
                {product.sizeGuideUrl && (
                  <button className={styles.sizeGuideBtn}>
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

                  return (
                    <button
                      key={idx}
                      className={styles.sizeBtn}
                      disabled={stock === 0}
                    >
                      {label || `Size ${idx + 1}`}
                      {stock === 0 && (
                        <span className={styles.outOfStock}>Out</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

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
                placeholder="Enter Pincode"
              />
              <button>Check</button>
            </div>
            <div className={styles.dispatchText}>Dispatch in 24 hours.</div>
          </div>

          {/* ---------- MAIN CTAs ---------- */}
          <div className={styles.actionRow}>
            <button className={styles.addToBag}>Add to Bag</button>
            <button className={styles.wishlist}>♡</button>
          </div>
        </div>
      </div>

      {/* ---------- PAIRS WELL WITH ---------- */}
      {relatedProducts && relatedProducts.length > 0 && (
        <div className={styles.relatedWrapper}>
          <h2>Pairs well with</h2>

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

              return (
                <div key={rp._id} className={styles.relatedCard}>
                  <div className={styles.relatedImgWrapper}>
                    {img && (
                      <img src={getImageUrl(img)} alt={rp.name} />
                    )}
                  </div>
                  <div className={styles.relatedInfo}>
                    <div className={styles.relatedTitle}>{rp.name}</div>
                    {rSale && rSale !== rMrp ? (
                      <div className={styles.relatedPrice}>
                        ₹ {Number(rSale)}{' '}
                        {rMrp && (
                          <span className={styles.relatedMrpStrike}>
                            ₹ {Number(rMrp)}
                          </span>
                        )}
                      </div>
                    ) : (
                      rMrp && (
                        <div className={styles.relatedPrice}>
                          ₹ {Number(rMrp)}
                        </div>
                      )
                    )}
                  </div>
                  <button className={styles.relatedAddBtn}>🛍</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
