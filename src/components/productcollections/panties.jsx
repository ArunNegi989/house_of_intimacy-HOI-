// src/components/PantiesListing/PantiesListing.jsx
import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import styles from '../../assets/styles/productcollection/BraListing.module.css';

// 🔁 Replace these with your real image imports
import bikiniImg from '../../assets/images/17.jpg';
import hipsterImg from '../../assets/images/19.jpg';
import fullBriefImg from '../../assets/images/5.jpg';
import boyShortsImg from '../../assets/images/17.jpg';
import thongImg from '../../assets/images/19.jpg';
import seamlessImg from '../../assets/images/5.jpg';
import boylegImg from '../../assets/images/17.jpg';

// ================== CONFIG ==================
const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');

// 👉 must match your DB category for panties
const PANTIES_CATEGORY = 'Panty';

const SORT_OPTIONS = [
  { id: 'featured', label: 'Featured' },
  { id: 'priceLow', label: 'Price: Low to High' },
  { id: 'priceHigh', label: 'Price: High to Low' },
];

const PRODUCTS_PER_PAGE = 12;

// ----- TOP FILTER TYPES (Panties Types) -----
// ⚠️ "id" should match tags/subcategory values in DB: "bikini", "hipster", etc.
const PANTY_TYPES = [
  { id: 'bikini', label: 'Bikini', image: bikiniImg },
  { id: 'hipster', label: 'Hipster', image: hipsterImg },
  { id: 'fullbrief', label: 'Full Brief', image: fullBriefImg },
  { id: 'boyshorts', label: 'Boy-shorts', image: boyShortsImg },
  { id: 'thong', label: 'Thong', image: thongImg },
  { id: 'seamless', label: 'Vanish Seamless', image: seamlessImg },
  { id: 'boyleg', label: 'Boyleg', image: boylegImg },
];

// ---------- HELPERS ----------
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${apiRoot}${url}`;
};

// color name → hex map
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

// Decode color value coming from backend
// supports: "#hex", "Black", {label, value}, {hex}, etc.
const decodeColor = (value) => {
  if (!value) return '#e5e7eb'; // fallback grey

  if (typeof value === 'string') {
    const v = value.trim();
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v)) return v;
    if (COLOR_MAP[v]) return COLOR_MAP[v];
    return '#e5e7eb';
  }

  if (typeof value === 'object') {
    if (value.hex && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.hex)) {
      return value.hex;
    }
    if (value.value && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value.value)) {
      return value.value;
    }
    if (value.label && COLOR_MAP[value.label]) {
      return COLOR_MAP[value.label];
    }
  }

  return '#e5e7eb';
};

// Check if product matches selected type (using product.tags or subcategory)
const matchesSelectedType = (product, selectedType) => {
  if (selectedType === 'all') return true;

  // tags array
  if (product.tags && Array.isArray(product.tags)) {
    return product.tags
      .map((t) => String(t).toLowerCase())
      .includes(selectedType.toLowerCase());
  }

  // subcategory as fallback
  if (product.subcategory) {
    return (
      String(product.subcategory).toLowerCase() === selectedType.toLowerCase()
    );
  }

  return false;
};

const PantiesListing = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);

  // ⭐ Scroll to top whenever page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // ---------- FETCH PANTIES FROM BACKEND ----------
  useEffect(() => {
    const fetchPanties = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await axios.get(`${baseUrl}/products`, {
          params: {
            category: PANTIES_CATEGORY,
            page: 1,
            limit: 200,
          },
        });

        const apiProducts = res.data?.data || [];
        setProducts(apiProducts);
      } catch (err) {
        console.error('Error fetching panties:', err);
        setError('Failed to load panties. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPanties();
  }, []);

  // ---------- FILTER + SORT ----------
  const filteredProducts = useMemo(() => {
    let filtered = products.filter((p) => matchesSelectedType(p, selectedType));

    filtered.sort((a, b) => {
      const aMrp = Number(a.price?.mrp || 0);
      const aSale = Number(a.price?.sale ?? aMrp);
      const bMrp = Number(b.price?.mrp || 0);
      const bSale = Number(b.price?.sale ?? bMrp);

      if (sortBy === 'priceLow') return aSale - bSale;
      if (sortBy === 'priceHigh') return bSale - aSale;

      return 0; // featured
    });

    return filtered;
  }, [products, selectedType, sortBy]);

  // ---------- PAGINATION ----------
  const totalPages = Math.ceil(
    (filteredProducts.length || 0) / PRODUCTS_PER_PAGE,
  );

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // handlers
  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  const handleCardClick = (product) => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToBag = (event, product) => {
    event.stopPropagation();
    // 👉 integrate CartContext later if needed
    console.log('ADD TO BAG (Panty):', product.name);
  };

  const handleWishlist = (event, product) => {
    event.stopPropagation();
    // 👉 integrate WishlistContext later if needed
    console.log('WISHLIST (Panty):', product.name);
  };

  // ---------- RENDER ----------
  return (
    <div className={styles.page}>
      {/* -------- BREADCRUMB -------- */}
      <div className={`container ${styles.breadcrumb}`}>
        <span className={styles.breadcrumbLink} onClick={() => navigate('/')}>
          Home
        </span>
        <span className={styles.breadcrumbSeparator}>&gt;</span>
        <span>Panties</span>
      </div>

      {/* -------- PAGE HEADER (same style as Bras) -------- */}
      <div className={`container ${styles.pageHeader}`}>
        <div>
          <h1 className={styles.pageTitle}>Panties Collection</h1>
          <p className={styles.pageSubtitle}>
            Explore {filteredProducts.length} styles · Bikini, Hipster, Full
            Brief & more.
          </p>
        </div>
        <div className={styles.badgeStrip}>
          <span className={styles.badgeChip}>All Day Comfort</span>
          <span className={styles.badgeChip}>No Visible Lines</span>
          <span className={styles.badgeChip}>Soft Cotton</span>
        </div>
      </div>

      {/* -------- TOP TYPE FILTER (IMAGE CHIPS) -------- */}
      <div className={`container-fluid ${styles.typeFilterWrapper}`}>
        <button
          type="button"
          className={`${styles.typeChip} ${
            selectedType === 'all' ? styles.typeChipActive : ''
          }`}
          onClick={() => handleTypeChange('all')}
        >
          <div className={styles.typeChipImgWrapper}>
            <div className={styles.typeChipAllCircle}>All</div>
          </div>
          <span className={styles.typeChipLabel}>All Panties</span>
        </button>

        {PANTY_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`${styles.typeChip} ${
              selectedType === type.id ? styles.typeChipActive : ''
            }`}
            onClick={() => handleTypeChange(type.id)}
          >
            <div className={styles.typeChipImgWrapper}>
              <img
                src={type.image}
                alt={type.label}
                className={styles.typeChipImg}
              />
            </div>
            <span className={styles.typeChipLabel}>{type.label}</span>
          </button>
        ))}
      </div>

      {/* -------- FILTER & SORT ROW -------- */}
      <div className={`container-fluid ${styles.filterSortRow}`}>
        <div className={styles.filterLeft}>
          <span className={styles.filterLabel}>FILTER:</span>
          <button className={styles.filterPill}>Category</button>
          <button className={styles.filterPill}>Color</button>
          <button className={styles.filterPill}>Size</button>
          <button className={styles.filterPill}>Brand</button>
          <button className={styles.filterPill}>Preference</button>
          <button className={styles.filterPill}>Style</button>
          <button className={styles.filterPill}>Coverage</button>
          <button className={styles.filterPill}>Occasion</button>
          <button className={styles.filterPill}>Fabric</button>
          <button className={styles.filterPill}>Pack of</button>
          <button className={styles.filterPill}>Pattern</button>
          <button className={styles.filterPill}>Closure</button>
          <button className={styles.filterPill}>Strap</button>
          <button className={styles.filterPill}>Price</button>
          <button className={styles.filterPill}>Availability</button>
          <button className={styles.filterPill}>Discount</button>
        </div>

        <div className={styles.sortRight}>
          <span className={styles.sortLabel}>SORT BY:</span>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className={styles.sortSelect}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* -------- LOADING / ERROR -------- */}
      {loading && <div className={styles.loadingState}>Loading panties...</div>}
      {error && <div className={styles.errorState}>{error}</div>}

      {/* -------- PRODUCTS GRID -------- */}
      {!loading && !error && (
        <div className={`container-fluid ${styles.productsGridWrapper}`}>
          <div className={styles.collectionMeta}>
            <span className={styles.collectionCount}>
              Showing {paginatedProducts.length} of {filteredProducts.length}{' '}
              styles
            </span>
            <span className={styles.collectionInfo}>
              MRP inclusive of all taxes · Easy returns
            </span>
          </div>

          <div className={styles.productsGrid}>
            {paginatedProducts.map((product) => {
              const mrp = Number(product.price?.mrp || 0);
              const sale = Number(
                product.price?.sale != null ? product.price.sale : mrp,
              );
              const discountPercent =
                product.price?.discountPercent != null
                  ? Number(product.price.discountPercent)
                  : mrp > 0
                  ? Math.round(((mrp - sale) / mrp) * 100)
                  : 0;

              const mainImg =
                product.mainImage ||
                (product.galleryImages && product.galleryImages[0]) ||
                '';

              const colorDots = Array.isArray(product.colors)
                ? product.colors.map(decodeColor)
                : [];

              const shortDescription = product.description
                ? product.description.length > 90
                  ? product.description.slice(0, 90) + '...'
                  : product.description
                : '';

              return (
                <div
                  key={product._id}
                  className={styles.card}
                  onClick={() => handleCardClick(product)}
                >
                  {discountPercent > 0 && (
                    <div className={styles.discountTag}>
                      {discountPercent}% OFF
                    </div>
                  )}

                  {product.isFeatured && (
                    <div className={styles.tagNew}>New</div>
                  )}

                  <button
                    className={styles.wishlistBtn}
                    type="button"
                    onClick={(e) => handleWishlist(e, product)}
                  >
                    <FiHeart />
                  </button>

                  <div className={styles.cardImageWrapper}>
                    <img
                      src={getImageUrl(mainImg)}
                      alt={product.name}
                      className={styles.cardImage}
                    />
                  </div>

                  <div className={styles.cardBody}>
                    <div className={styles.brandRow}>
                      <span className={styles.brand}>{product.brand}</span>
                      {product.gender && (
                        <span className={styles.genderBadge}>
                          {product.gender}
                        </span>
                      )}
                    </div>

                    <div className={styles.name}>{product.name}</div>

                    {shortDescription && (
                      <p className={styles.description}>{shortDescription}</p>
                    )}

                    <div className={styles.priceRow}>
                      <span className={styles.salePrice}>
                        ₹ {sale.toFixed(0)}
                      </span>
                      {mrp > sale && (
                        <span className={styles.mrpStriked}>
                          MRP ₹ {mrp.toFixed(0)}
                        </span>
                      )}
                      {discountPercent > 0 && (
                        <span className={styles.discountText}>
                          ({discountPercent}% OFF)
                        </span>
                      )}
                    </div>

                    <div className={styles.taxText}>Inclusive of all taxes</div>

                    {/* meta pills: coverage, fabric, etc. */}
                    <div className={styles.metaRow}>
                      {product.coverage && (
                        <span className={styles.metaPill}>
                          {product.coverage} coverage
                        </span>
                      )}
                      {product.fabric && (
                        <span className={styles.metaPill}>
                          {product.fabric}
                        </span>
                      )}
                      {product.pattern && (
                        <span className={styles.metaPill}>
                          {product.pattern}
                        </span>
                      )}
                    </div>

                    {colorDots.length > 0 && (
                      <div className={styles.colorsRow}>
                        {colorDots.map((c, index) => (
                          <span
                            key={index}
                            className={styles.colorDot}
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    )}

                    {product.totalStock != null && (
                      <div className={styles.stockRow}>
                        {product.totalStock > 0 ? (
                          <span className={styles.inStock}>
                            In stock · {product.totalStock}
                          </span>
                        ) : (
                          <span className={styles.outOfStock}>
                            Out of stock
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      className={styles.addToBagBtn}
                      onClick={(e) => handleAddToBag(e, product)}
                    >
                      <FiShoppingBag className={styles.addToBagIcon} />
                      <span className={styles.addToBagText}>Add to bag</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {paginatedProducts.length === 0 && !loading && (
              <div className={styles.noResults}>No products found.</div>
            )}
          </div>
        </div>
      )}

      {/* -------- PAGINATION -------- */}
      {!loading && totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <button
            type="button"
            className={`${styles.pageBtn} ${styles.pagePrevNext}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                type="button"
                className={`${styles.pageBtn} ${
                  currentPage === page ? styles.pageBtnActive : ''
                }`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            );
          })}

          <button
            type="button"
            className={`${styles.pageBtn} ${styles.pagePrevNext}`}
            disabled={currentPage === totalPages}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PantiesListing;
