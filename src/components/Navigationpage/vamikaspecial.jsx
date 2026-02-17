// src/components/Vamika/VamikaPage.jsx
import React, { useEffect, useState, useMemo, useContext } from 'react';
import axios from 'axios';
import { FiShoppingBag, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import styles from '../../assets/styles/Navigationpage/Vamikapage.module.css';

import { WishlistContext } from '../../contexts/WishlistContext';
import { SidebarContext }  from '../../contexts/SidebarContext';

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');

// ── helpers ───────────────────────────────────────────────────────────────────
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${apiRoot}${url}`;
};

const getDiscountPercent = (mrp, price) => {
  if (!mrp || !price || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

const COLOR_MAP = {
  Black: '#000000', Purple: '#800080', White: '#ffffff',
  Red:   '#ef4444', Blue:   '#3b82f6', Green: '#22c55e',
  Nude:  '#F5D0C5', Pink:   '#ec4899', Yellow:'#facc15',
};

const decodeColor = (value) => {
  if (!value) return '#e5e5e5';
  const str = String(value).trim();
  if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(str)) return str;
  const key = Object.keys(COLOR_MAP).find((k) => k.toLowerCase() === str.toLowerCase());
  return key ? COLOR_MAP[key] : str || '#e5e5e5';
};

// "SKU-001-BLK" → "SKU-001"
const getBaseCode = (code) => {
  if (!code) return null;
  const parts = code.split('-');
  return parts.length >= 2 ? `${parts[0]}-${parts[1]}` : code;
};

// return all color variants across products that share the same base-code
const getColorVariants = (currentProduct, allProductsList) => {
  if (!currentProduct?.productCode) return [];
  const baseCode = getBaseCode(currentProduct.productCode);

  const sameBase = allProductsList.filter(
    (p) => p.productCode && getBaseCode(p.productCode) === baseCode,
  );

  const colorMap = new Map();
  sameBase.forEach((product) => {
    (product.colors || []).forEach((color) => {
      if (color && !colorMap.has(color)) {
        colorMap.set(color, {
          color,
          productId: product._id,
          isCurrentProduct: String(product._id) === String(currentProduct._id),
        });
      }
    });
  });

  return Array.from(colorMap.values());
};

// ── filter constants ──────────────────────────────────────────────────────────
const TYPE_OPTIONS = [
  { label: 'All',         value: 'all' },
  { label: 'New Arrival', value: 'new-arrival' },
  { label: 'Trendy',      value: 'trendy' },
  { label: 'Sale',        value: 'sale' },
];

const SIZE_OPTIONS = ['XS','S','M','L','XL','XXL','32B','34B','36B','36C','38C'];

const CATEGORY_OPTIONS = [
  'Bra','Panty','Nightwear','Athleisure',
  'Layering','Shapewear','Swimwear','Accessories',
];

// ── component ─────────────────────────────────────────────────────────────────
const VamikaPage = () => {
  const navigate = useNavigate();
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);
  const sidebar = useContext(SidebarContext);

  const [products,      setProducts]      = useState([]);
  const [allProducts,   setAllProducts]   = useState([]); // raw backend list for color-variant lookup
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');

  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 16;

  const [sortBy,             setSortBy]             = useState('featured');
  const [selectedType,       setSelectedType]       = useState('all');
  const [selectedSizes,      setSelectedSizes]      = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // ── toggles ───────────────────────────────────────────────────────────────
  const toggleSize = (v) => {
    setPage(1);
    setSelectedSizes((p) => p.includes(v) ? p.filter((s) => s !== v) : [...p, v]);
  };
  const toggleCategory = (v) => {
    setPage(1);
    setSelectedCategories((p) => p.includes(v) ? p.filter((c) => c !== v) : [...p, v]);
  };
  const clearAllFilters = () => {
    setSelectedType('all'); setSelectedSizes([]); setSelectedCategories([]); setPage(1);
  };

  // ── fetch ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true); setError('');
        const params = { page, limit, brand: 'Vamika', status: 'active' };
        if (selectedType !== 'all')        params.type     = selectedType;
        if (selectedSizes.length)          params.size     = selectedSizes.join(',');
        if (selectedCategories.length)     params.category = selectedCategories.join(',');

        const res = await axios.get(`${baseUrl}/products`, { params });
        const raw   = res.data?.data || [];
        const total = res.data?.pagination?.total || 0;

        setTotalPages(Math.ceil(total / limit));
        setTotalProducts(total);
        setAllProducts(raw); // store raw for color-variant lookup

        const mapped = raw.map((prod) => {
          const mrp             = prod.price?.mrp || 0;
          const salePrice       = prod.price?.sale || mrp || 0;
          const discountPercent = getDiscountPercent(mrp, salePrice);
          const tags            = Array.isArray(prod.tags) ? prod.tags : [];

          let sizes = [];
          if (Array.isArray(prod.sizes)) {
            sizes = typeof prod.sizes[0] === 'string'
              ? prod.sizes : prod.sizes.map((s) => s.label);
          }

          let colors = [];
          if (Array.isArray(prod.colors)) colors = prod.colors;
          else if (prod.color)            colors = [prod.color];

          let totalStock = 0;
          if (typeof prod.totalStock === 'number')      totalStock = prod.totalStock;
          else if (typeof prod.stock === 'number')      totalStock = prod.stock;
          else if (Array.isArray(prod.sizes))           totalStock = prod.sizes.reduce((s, x) => s + (x.stock || 0), 0);

          return {
            id:          prod._id,
            _id:         prod._id,
            name:        prod.name,
            brand:       prod.brand,
            productCode: prod.productCode || null,
            mrp,
            price:       salePrice,
            // full price object so sidebar.openQuickAdd gets everything
            priceObj: { mrp, sale: salePrice, sellingPrice: salePrice, finalPrice: salePrice },
            discountPercent,
            image:       getImageUrl(prod.mainImage || prod.galleryImages?.[0]),
            mainImage:   prod.mainImage || prod.galleryImages?.[0],
            category:    prod.category,
            subcategory: prod.subcategory,
            primaryTag:  tags[0] || prod.category || prod.subcategory || 'Everyday Essential',
            isNew:       tags.some((t) => `${t}`.toLowerCase().includes('new')) || prod.isNew,
            isBestSeller:tags.join(' ').toLowerCase().includes('bestseller'),
            sizes,
            colors,
            stock:       totalStock,
            gender:      prod.gender || prod.genderType || 'Unisex',
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error('Failed to fetch Vamika products:', err);
        setError('Could not load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page, selectedType, selectedSizes, selectedCategories]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // ── sort ──────────────────────────────────────────────────────────────────
  const sortedProducts = useMemo(() => {
    const copy = [...products];
    if (sortBy === 'priceLowHigh') return copy.sort((a, b) => a.price - b.price);
    if (sortBy === 'priceHighLow') return copy.sort((a, b) => b.price - a.price);
    if (sortBy === 'discountHigh') return copy.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    return copy.sort((a, b) => {
      const aS = (a.isNew ? 2 : 0) + (a.isBestSeller ? 1 : 0);
      const bS = (b.isNew ? 2 : 0) + (b.isBestSeller ? 1 : 0);
      return bS - aS;
    });
  }, [products, sortBy]);

  const hasActiveFilters = selectedType !== 'all' || selectedSizes.length || selectedCategories.length;

  const handleColorVariantClick = (e, variant) => {
    e.stopPropagation();
    navigate(`/product/${variant.productId}`);
  };

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <section className={styles.section}>
      <div className={styles.inner}>

        {/* HEADER */}
        <div className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Vamika</h1>
            <p className={styles.subTitle}>
              Shop the complete Vamika collection — lingerie, lounge and
              everyday essentials crafted for every mood and every moment.
            </p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.countText}>
              Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong> products
            </div>
            <div className={styles.sortWrap}>
              <label className={styles.sortLabel} htmlFor="sort">Sort by</label>
              <select id="sort" className={styles.sortSelect} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="featured">Featured</option>
                <option value="priceLowHigh">Price: Low to High</option>
                <option value="priceHighLow">Price: High to Low</option>
                <option value="discountHigh">Best Discount</option>
              </select>
            </div>
          </div>
        </div>

        {/* FILTER BAR */}
        <div className={styles.filtersBar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Type</span>
            <div className={styles.chipRow}>
              {TYPE_OPTIONS.map((opt) => (
                <button key={opt.value} type="button"
                  className={`${styles.filterChip} ${selectedType === opt.value ? styles.filterChipActive : ''}`}
                  onClick={() => { setSelectedType(opt.value); setPage(1); }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Size</span>
            <div className={styles.chipRow}>
              {SIZE_OPTIONS.map((size) => (
                <button key={size} type="button"
                  className={`${styles.filterChip} ${selectedSizes.includes(size) ? styles.filterChipActive : ''}`}
                  onClick={() => toggleSize(size)}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Category</span>
            <div className={styles.chipRow}>
              {CATEGORY_OPTIONS.map((cat) => (
                <button key={cat} type="button"
                  className={`${styles.filterChip} ${selectedCategories.includes(cat) ? styles.filterChipActive : ''}`}
                  onClick={() => toggleCategory(cat)}>
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
                  selectedType !== 'all' ? TYPE_OPTIONS.find((t) => t.value === selectedType)?.label : null,
                  ...selectedSizes, ...selectedCategories,
                ].filter(Boolean).join(', ')}
              </span>
              <button type="button" className={styles.clearFiltersBtn} onClick={clearAllFilters}>
                Clear all
              </button>
            </div>
          )}
        </div>

        {loading && <p className={styles.infoText}>Loading Vamika products...</p>}
        {error   && <p className={styles.error}>{error}</p>}

        {/* GRID */}
        {!loading && !error && (
          <div className={styles.grid}>
            {sortedProducts.map((item) => {
              const discount      = item.discountPercent;
              const savings       = item.mrp > item.price ? item.mrp - item.price : 0;
              const inWishlist    = wishlistItems.includes(item.id);
              const colorVariants = getColorVariants(item, allProducts);

              return (
                <article key={item.id} className={styles.card} onClick={() => navigate(`/product/${item.id}`)}>

                  {/* Badges */}
                  <div className={styles.badgeRow}>
                    {item.isNew        && <span className={`${styles.badge} ${styles.badgeNew}`}>NEW</span>}
                    {item.isBestSeller && <span className={`${styles.badge} ${styles.badgeBestSeller}`}>Bestseller</span>}
                  </div>

                  {/* Image */}
                  <div className={styles.imageWrap}>
                    <img src={item.image} alt={item.name} className={styles.image} />

                    {discount > 0 && (
                      <span className={`${styles.badge} ${styles.discountInImage}`}>{discount}% OFF</span>
                    )}

                    <button type="button"
                      className={`${styles.wishlistBtn} ${inWishlist ? styles.wishlistActive : ''}`}
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(item.id); }}>
                      {inWishlist ? <FaHeart /> : <FiHeart />}
                    </button>

                    <button className={styles.quickViewBtn}
                      onClick={(e) => { e.stopPropagation(); navigate(`/product/${item.id}`); }}>
                      View details
                    </button>
                  </div>

                  {/* Body */}
                  <div className={styles.body}>
                    <div className={styles.topRow}>
                      <span className={styles.brand}>{item.brand}</span>
                      {item.primaryTag && <span className={styles.tagPill}>{item.primaryTag}</span>}
                    </div>

                    <div className={styles.name}>{item.name}</div>

                    {(item.category || item.subcategory) && (
                      <div className={styles.metaRow}>
                        {item.category    && <span className={styles.metaItem}>{item.category}</span>}
                        {item.category    && item.subcategory && <span className={styles.metaDot}>•</span>}
                        {item.subcategory && <span className={styles.metaItem}>{item.subcategory}</span>}
                      </div>
                    )}

                    {/* Price */}
                    <div className={styles.priceBlock}>
                      <div className={styles.priceRow}>
                        <span className={styles.price}>₹{item.price}</span>
                        {item.mrp > item.price && <span className={styles.mrp}>MRP ₹{item.mrp}</span>}
                      </div>
                      {discount > 0 && (
                        <div className={styles.savingsRow}>
                          <span className={styles.savingsBadge}>You save ₹{savings}</span>
                          <span className={styles.taxText}>Inclusive of all taxes</span>
                        </div>
                      )}
                    </div>

                    {/* Sizes */}
                    {item.sizes?.length > 0 && (
                      <div className={styles.sizeRow}>
                        {item.sizes.slice(0, 4).map((s) => (
                          <span key={s} className={styles.sizePill}>{s}</span>
                        ))}
                        {item.sizes.length > 4 && (
                          <span className={styles.moreSizes}>+{item.sizes.length - 4} more</span>
                        )}
                      </div>
                    )}

                    {/* ── Bottom row: color variants + cart button ── */}
                    <div className={styles.bottomRow}>

                      {/* Color dots — same base-code variants */}
                      <div className={styles.colorDots}>
                        {colorVariants.length > 0
                          ? colorVariants.map((variant, i) => (
                              <span
                                key={i}
                                className={`${styles.colorDot} ${
                                  variant.isCurrentProduct ? styles.colorDotActive : styles.colorDotOther
                                }`}
                                style={{ backgroundColor: decodeColor(variant.color) }}
                                title={variant.color}
                                onClick={(e) => handleColorVariantClick(e, variant)}
                              />
                            ))
                          : item.colors.slice(0, 5).map((c, i) => (
                              <span
                                key={i}
                                className={styles.colorDot}
                                style={{ backgroundColor: decodeColor(c) }}
                                title={c}
                              />
                            ))}
                        {!colorVariants.length && item.colors.length > 5 && (
                          <span className={styles.moreColors}>+{item.colors.length - 5}</span>
                        )}
                      </div>

                      {/* Cart / Quick Add */}
                      <button
                        className={styles.cartBtn}
                        title="Quick add to cart"
                        onClick={(e) => {
                          e.stopPropagation();
                          sidebar.openQuickAdd({ ...item, price: item.priceObj });
                        }}
                      >
                        <FiShoppingBag />
                      </button>

                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button disabled={page === 1} onClick={() => setPage(page - 1)}
              className={`${styles.pageBtn} ${page === 1 ? styles.disabled : ''}`}>
              Previous
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const n = i + 1;
              return (
                <button key={n} onClick={() => setPage(n)}
                  className={`${styles.pageBtn} ${page === n ? styles.activePage : ''}`}>
                  {n}
                </button>
              );
            })}
            <button disabled={page === totalPages} onClick={() => setPage(page + 1)}
              className={`${styles.pageBtn} ${page === totalPages ? styles.disabled : ''}`}>
              Next
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default VamikaPage;