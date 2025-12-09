// src/components/AllProducts/AllProducts.jsx
import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import styles from '../../assets/styles/productcollection/AllProducts.module.css';

// ✅ import wishlist context
import { WishlistContext } from '../../contexts/WishlistContext';

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${apiRoot}${url}`;
};

const getDiscountPercent = (mrp, price) => {
  if (!mrp || !price || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

const BRAND_OPTIONS = ['Jockey', 'Vamika', 'Nike', 'Puma', 'Clovia', 'Zivame'];

const SIZE_OPTIONS = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  '32B',
  '34B',
  '36B',
  '36C',
  '38C',
];

const CATEGORY_OPTIONS = [
  'Bra',
  'Panty',
  'Nightwear',
  'Athleisure',
  'Layering',
  'Shapewear',
  'Swimwear',
  'Accessories',
];

const AllProducts = () => {
  const navigate = useNavigate();

  // ✅ get wishlist from context
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ⭐ PAGINATION STATE
  const [page, setPage] = useState(1);
  const limit = 16;
  const [totalPages, setTotalPages] = useState(1);

  // ⭐ SORT STATE
  const [sortBy, setSortBy] = useState('featured');

  // ⭐ FILTER STATES
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const toggleFilter = (type, value) => {
    setPage(1);

    if (type === 'brand') {
      setSelectedBrands((prev) =>
        prev.includes(value)
          ? prev.filter((b) => b !== value)
          : [...prev, value],
      );
    } else if (type === 'size') {
      setSelectedSizes((prev) =>
        prev.includes(value)
          ? prev.filter((s) => s !== value)
          : [...prev, value],
      );
    } else if (type === 'category') {
      setSelectedCategories((prev) =>
        prev.includes(value)
          ? prev.filter((c) => c !== value)
          : [...prev, value],
      );
    }
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setPage(1);
  };

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError('');

        const params = {
          page,
          limit,
        };

        if (selectedBrands.length > 0) {
          params.brand = selectedBrands.join(',');
        }
        if (selectedSizes.length > 0) {
          params.size = selectedSizes.join(',');
        }
        if (selectedCategories.length > 0) {
          params.category = selectedCategories.join(',');
        }

        const res = await axios.get(`${baseUrl}/products`, { params });

        const backendProducts = res.data?.data || [];
        const total = res.data?.pagination?.total || 0;

        setTotalPages(Math.ceil(total / limit));
        setTotalProducts(total);

        const mapped = backendProducts.map((prod) => {
          const mrp = prod.price?.mrp || 0;
          const salePrice = prod.price?.sale || mrp || 0;
          const discountPercent = getDiscountPercent(mrp, salePrice);

          const tags = Array.isArray(prod.tags) ? prod.tags : [];
          const isNew =
            tags.some((t) => `${t}`.toLowerCase().includes('new')) ||
            prod.isNew;
          const isBestSeller = tags
            .join(' ')
            .toLowerCase()
            .includes('bestseller');

          // flatten sizes if needed just to show in UI
          let sizes = [];
          if (Array.isArray(prod.sizes)) {
            if (typeof prod.sizes[0] === 'string') {
              sizes = prod.sizes;
            } else if (typeof prod.sizes[0] === 'object') {
              sizes = prod.sizes.map((s) => s.label);
            }
          }

          // colors row (if available)
          let colors = [];
          if (Array.isArray(prod.colors)) {
            colors = prod.colors;
          } else if (prod.color) {
            colors = [prod.color];
          }

          return {
            id: prod._id,
            name: prod.name,
            brand: prod.brand,
            mrp,
            price: salePrice,
            discountPercent,
            image: getImageUrl(
              prod.mainImage || (prod.galleryImages && prod.galleryImages[0]),
            ),
            category: prod.category,
            subcategory: prod.subcategory,
            primaryTag:
              tags[0] ||
              prod.category ||
              prod.subcategory ||
              'Everyday Essential',
            isNew,
            isBestSeller,
            rating: prod.rating || prod.averageRating || 0,
            totalReviews: prod.totalReviews || prod.reviewCount || 0,
            sizes,
            colors,
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Could not load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [page, selectedBrands, selectedSizes, selectedCategories, limit]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  // ⭐ SORTING
  const sortedProducts = useMemo(() => {
    const copy = [...products];

    if (sortBy === 'priceLowHigh') {
      return copy.sort((a, b) => a.price - b.price);
    }
    if (sortBy === 'priceHighLow') {
      return copy.sort((a, b) => b.price - a.price);
    }
    if (sortBy === 'discountHigh') {
      return copy.sort(
        (a, b) => (b.discountPercent || 0) - (a.discountPercent || 0),
      );
    }

    // featured
    return copy.sort((a, b) => {
      const aScore = (a.isNew ? 2 : 0) + (a.isBestSeller ? 1 : 0);
      const bScore = (b.isNew ? 2 : 0) + (b.isBestSeller ? 1 : 0);
      return bScore - aScore;
    });
  }, [products, sortBy]);

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const hasActiveFilters =
    selectedBrands.length || selectedSizes.length || selectedCategories.length;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* ================== HEADER ROW ================== */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>All Products</h1>
            <p className={styles.subTitle}>
              Discover lingerie, lounge and everyday essentials curated just for
              you. Filter by brand, size and category to find your perfect fit.
            </p>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.countText}>
              Showing <strong>{products.length}</strong> of{' '}
              <strong>{totalProducts}</strong> products
            </div>

            <div className={styles.sortWrap}>
              <label className={styles.sortLabel} htmlFor="sort">
                Sort by
              </label>
              <select
                id="sort"
                className={styles.sortSelect}
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="featured">Featured</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="discountHigh">Best Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================== FILTER BAR ================== */}
        <div className={styles.filtersBar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Brand</span>
            <div className={styles.chipRow}>
              {BRAND_OPTIONS.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  className={`${styles.filterChip} ${
                    selectedBrands.includes(brand)
                      ? styles.filterChipActive
                      : ''
                  }`}
                  onClick={() => toggleFilter('brand', brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Size</span>
            <div className={styles.chipRow}>
              {SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`${styles.filterChip} ${
                    selectedSizes.includes(size) ? styles.filterChipActive : ''
                  }`}
                  onClick={() => toggleFilter('size', size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Category</span>
            <div className={styles.chipRow}>
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`${styles.filterChip} ${
                    selectedCategories.includes(cat)
                      ? styles.filterChipActive
                      : ''
                  }`}
                  onClick={() => toggleFilter('category', cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <div className={styles.activeFiltersRow}>
              <span className={styles.activeFiltersText}>
                Filters applied:{' '}
                {[
                  ...selectedBrands,
                  ...selectedSizes,
                  ...selectedCategories,
                ].join(', ')}
              </span>
              <button
                type="button"
                className={styles.clearFiltersBtn}
                onClick={clearAllFilters}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {loading && <p className={styles.infoText}>Loading products...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {/* ================== GRID ================== */}
        {!loading && !error && (
          <div className={styles.grid}>
            {sortedProducts.map((item) => {
              const discount = item.discountPercent;
              const savings = item.mrp > item.price ? item.mrp - item.price : 0;

              // ✅ check if this product is in wishlist (assuming IDs array)
              const inWishlist = wishlistItems.includes(item.id);

              return (
                <article
                  key={item.id}
                  className={styles.card}
                  onClick={() => handleCardClick(item.id)}
                >
                  {/* Badges (NEW / Bestseller) - keep above image */}
                  <div className={styles.badgeRow}>
                    {item.isNew && (
                      <span className={`${styles.badge} ${styles.badgeNew}`}>
                        NEW
                      </span>
                    )}
                    {item.isBestSeller && (
                      <span
                        className={`${styles.badge} ${styles.badgeBestSeller}`}
                      >
                        Bestseller
                      </span>
                    )}
                  </div>

                  {/* Image with discount badge + wishlist + quick view */}
                  <div className={styles.imageWrap}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.image}
                    />

                    {/* 🔻 Discount badge in image top-left */}
                    {discount > 0 && (
                      <span
                        className={`${styles.badge} ${styles.discountInImage}`}
                      >
                        {discount}% OFF
                      </span>
                    )}

                    {/* ❤️ Wishlist icon - top right */}
                    <button
                      type="button"
                      className={`${styles.wishlistBtn} ${
                        inWishlist ? styles.wishlistActive : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(item.id);
                      }}
                    >
                      <FiHeart />
                    </button>

                    {/* Quick view / details button */}
                    <button
                      className={styles.quickViewBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCardClick(item.id);
                      }}
                    >
                      View details
                    </button>
                  </div>

                  <div className={styles.body}>
                    {/* Brand & tag */}
                    <div className={styles.topRow}>
                      <span className={styles.brand}>{item.brand}</span>
                      {item.primaryTag && (
                        <span className={styles.tagPill}>
                          {item.primaryTag}
                        </span>
                      )}
                    </div>

                    <div className={styles.name}>{item.name}</div>

                    {/* Category / Subcategory */}
                    {(item.category || item.subcategory) && (
                      <div className={styles.metaRow}>
                        {item.category && (
                          <span className={styles.metaItem}>
                            {item.category}
                          </span>
                        )}
                        {item.category && item.subcategory && (
                          <span className={styles.metaDot}>•</span>
                        )}
                        {item.subcategory && (
                          <span className={styles.metaItem}>
                            {item.subcategory}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Price Row */}
                    <div className={styles.priceBlock}>
                      <div className={styles.priceRow}>
                        <span className={styles.price}>₹{item.price}</span>
                        {item.mrp > item.price && (
                          <span className={styles.mrp}>MRP ₹{item.mrp}</span>
                        )}
                      </div>

                      {discount > 0 && (
                        <div className={styles.savingsRow}>
                          <span className={styles.savingsBadge}>
                            You save ₹{savings}
                          </span>
                          <span className={styles.taxText}>
                            Inclusive of all taxes
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Colors row */}
                    {item.colors && item.colors.length > 0 && (
                      <div className={styles.colorRow}>
                        <span className={styles.colorLabel}>Colors</span>
                        <div className={styles.colorDots}>
                          {item.colors.slice(0, 4).map((c, idx) => (
                            <span
                              key={`${c}-${idx}`}
                              className={styles.colorDot}
                              style={{ backgroundColor: c }}
                              title={c}
                            />
                          ))}
                          {item.colors.length > 4 && (
                            <span className={styles.moreColors}>
                              +{item.colors.length - 4}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Sizes row */}
                    {item.sizes && item.sizes.length > 0 && (
                      <div className={styles.sizeRow}>
                        {item.sizes.slice(0, 4).map((s) => (
                          <span key={s} className={styles.sizePill}>
                            {s}
                          </span>
                        ))}
                        {item.sizes.length > 4 && (
                          <span className={styles.moreSizes}>
                            +{item.sizes.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Cart button */}
                    <button
                      className={styles.cartBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: CartContext addToCart connect here
                      }}
                    >
                      <FiShoppingBag />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* ⭐ PAGINATION SECTION */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className={`${styles.pageBtn} ${
                page === 1 ? styles.disabled : ''
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  className={`${styles.pageBtn} ${
                    page === pageNum ? styles.activePage : ''
                  }`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className={`${styles.pageBtn} ${
                page === totalPages ? styles.disabled : ''
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProducts;
