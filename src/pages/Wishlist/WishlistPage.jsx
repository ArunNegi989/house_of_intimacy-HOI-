// src/pages/Wishlist/WishlistPage.jsx
import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { WishlistContext } from "../../contexts/WishlistContext";
import styles from "../../assets/styles/wishlistpage/WishlistPage.module.css";

import { FiHeart, FiTrash2, FiArrowLeft } from "react-icons/fi";

const API_BASE_URL = "http://localhost:8000";

// helper: convert "/uploads/..." → full URL
const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

function WishlistPage() {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 👉 Fetch products list once & then filter by wishlist IDs
  useEffect(() => {
    if (!wishlistItems || wishlistItems.length === 0) {
      setAllProducts([]);
      return;
    }

    let cancelled = false;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${API_BASE_URL}/v1/products`, {
          params: {
            page: 1,
            limit: 200, // adjust as per your expected max
          },
        });

        if (cancelled) return;

        const backendProducts = res.data?.data || [];
        setAllProducts(backendProducts);
      } catch (err) {
        console.error("Error fetching wishlist products", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      cancelled = true;
    };
  }, [wishlistItems]);

  // 👉 Only keep products whose _id is in wishlistItems
  const products = useMemo(() => {
    if (!wishlistItems || wishlistItems.length === 0) return [];
    return allProducts.filter((p) => wishlistItems.includes(p._id));
  }, [allProducts, wishlistItems]);

  const handleRemove = (e, id) => {
    e.stopPropagation();
    removeFromWishlist(id);
  };

  // always go to /product/:id (matches ProductDetail.jsx)
  const handleCardClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const hasItems = !loading && products.length > 0;

  return (
    <div className={styles.page}>
      {/* Soft gradient strip */}
      <div className={styles.heroStrip} />

      <div className={`container ${styles.inner}`}>
        {/* ---- Top Header ---- */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => navigate(-1)}
            >
              <FiArrowLeft />
              <span>Back</span>
            </button>

            <div>
              <div className={styles.breadcrumb}>
                <span
                  onClick={() => navigate("/")}
                  className={styles.breadcrumbLink}
                >
                  Home
                </span>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbCurrent}>Wishlist</span>
              </div>

              <div className={styles.titleRow}>
                <h1 className={styles.title}>My Wishlist</h1>
                <span className={styles.countBadge}>
                  <FiHeart className={styles.countIcon} />
                  {wishlistItems?.length || 0} item
                  {wishlistItems?.length === 1 ? "" : "s"}
                </span>
              </div>

              <p className={styles.subtitle}>
                Wishlist is not saved permanently yet. Please
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => navigate("/login")}
                >
                  {" "}
                  log in{" "}
                </button>
                or
                <button
                  type="button"
                  className={styles.linkButton}
                  onClick={() => navigate("/auth/create_new_user")}
                >
                  {" "}
                  create an account{" "}
                </button>
                to save it across devices.
              </p>
            </div>
          </div>
        </header>

        {/* ---- Toolbar ---- */}
        {hasItems && (
          <div className={styles.toolbar}>
            <div className={styles.toolbarLeft}>
              <span className={styles.toolbarLabel}>
                You have <strong>{products.length}</strong> favourite
                {products.length === 1 ? "" : "s"}.
              </span>
            </div>
            <div className={styles.toolbarRight}>
              <button
                type="button"
                className={styles.ctaButton}
                onClick={() => navigate("/")}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}

        {/* ---- Loading ---- */}
        {loading && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <FiHeart className={styles.emptyIcon} />
            </div>
            <p className={styles.emptyTitle}>Loading your wishlist…</p>
            <p className={styles.emptyText}>
              We are fetching your saved favourites. This will only take a
              moment.
            </p>
          </div>
        )}

        {/* ---- Empty State ---- */}
        {!loading && !hasItems && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIconWrapper}>
              <FiHeart className={styles.emptyIcon} />
            </div>
            <p className={styles.emptyTitle}>Your wishlist is empty</p>
            <p className={styles.emptyText}>
              Browse our latest collections and tap the heart icon to add items
              to your wishlist.
            </p>
            <button
              type="button"
              className={styles.shopButton}
              onClick={() => navigate("/")}
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* ---- Wishlist Grid ---- */}
        {hasItems && (
          <div className={styles.grid}>
            {products.map((product) => {
              const imgSrc =
                getImageUrl(product.mainImage) ||
                (product.galleryImages &&
                  product.galleryImages.length > 0 &&
                  getImageUrl(product.galleryImages[0])) ||
                "";

              // ---------- PRICE LOGIC (MRP + SALE + DISCOUNT) ----------
              const priceObj = product.price || {};

              const mrp = priceObj.mrp ?? 0; // main MRP
              const salePrice = priceObj.sale ?? mrp; // sale ya mrp
              const discountPercent =
                priceObj.discountPercent ??
                (mrp && salePrice && mrp > salePrice
                  ? Math.round(((mrp - salePrice) / mrp) * 100)
                  : 0);

              const isOnSale =
                salePrice !== undefined &&
                mrp !== undefined &&
                salePrice !== null &&
                mrp !== null &&
                salePrice !== mrp;

              // ---------- SIZE / COLOR / DESC ----------
              const sizeText = product.defaultSize || product.size || "";
              const colorText = product.defaultColor || product.color || "";
              const brandText = product.brand || "";
              const description =
                product.shortDescription || product.description || "";

              return (
                <div
                  key={product._id}
                  className={styles.card}
                  onClick={() => handleCardClick(product)}
                >
                  {/* Badge */}
                  <div className={styles.ribbon}>
                    <span>Wishlist</span>
                  </div>

                  <div className={styles.imageWrapper}>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={product.name}
                        className={styles.image}
                      />
                    ) : (
                      <div className={styles.imagePlaceholder}>No Image</div>
                    )}

                    {/* Hover overlay */}
                    <div className={styles.overlay}>
                      <span className={styles.overlayText}>View Details</span>
                    </div>

                    {/* Remove icon in corner */}
                    <button
                      type="button"
                      className={styles.iconRemove}
                      onClick={(e) => handleRemove(e, product._id)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  <div className={styles.cardBody}>
                    {brandText && (
                      <div className={styles.brand}>{brandText}</div>
                    )}

                    <div className={styles.productName} title={product.name}>
                      {product.name}
                    </div>

                    {description && (
                      <p className={styles.description}>{description}</p>
                    )}

                    <div className={styles.variantRow}>
                      {sizeText && (
                        <span className={styles.variantText}>
                          Size: {sizeText}
                        </span>
                      )}

                      {colorText && (
                        <span className={styles.variantText}>
                          <span
                            className={styles.colorDot}
                            style={{ backgroundColor: colorText }}
                          />
                          <span>{colorText}</span>
                        </span>
                      )}
                    </div>

                    {/* PRICE BLOCK: MRP + SALE + DISCOUNT */}
                    <div className={styles.priceRow}>
                      {/* SALE PRICE */}
                      {isOnSale && salePrice > 0 && (
                        <span className={styles.price}>
                          ₹ {Number(salePrice).toLocaleString("en-IN")}
                        </span>
                      )}

                      {/* MRP (strike if on sale) */}
                      {mrp > 0 && (
                        <span
                          className={isOnSale ? styles.mrp : styles.price}
                        >
                          ₹ {Number(mrp).toLocaleString("en-IN")}
                        </span>
                      )}

                      {/* DISCOUNT TAG */}
                      {discountPercent > 0 && (
                        <span className={styles.discountTag}>
                          {discountPercent}% OFF
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={(e) => handleRemove(e, product._id)}
                    >
                      <FiTrash2 />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---- Popular Search (bottom) ---- */}
        <div className={styles.popularWrapper}>
          <div className={styles.popularTitle}>Popular searches</div>
          <div className={styles.popularLinks}>
            <button type="button" className={styles.popularChip}>
              Skins Bra
            </button>
            <button type="button" className={styles.popularChip}>
              Bra ExpertEase
            </button>
            <button type="button" className={styles.popularChip}>
              T-Shirt Bras
            </button>
            <button type="button" className={styles.popularChip}>
              Cotton Bra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
