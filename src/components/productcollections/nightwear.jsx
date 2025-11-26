// src/components/BrasListing/BrasListing.jsx
import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/styles/productcollection/BraListing.module.css";

// 🔁 Replace these with your real image imports
import paddedImg from "../../assets/images/17.jpg";
import nonPaddedImg from "../../assets/images/19.jpg";
import wiredImg from "../../assets/images/5.jpg";
import nonWiredImg from "../../assets/images/17.jpg";
import tshirtImg from "../../assets/images/19.jpg";
import pushupImg from "../../assets/images/5.jpg";
import multiwayImg from "../../assets/images/17.jpg";

// Product card fallback images (if API image missing)
import prod1Img from "../../assets/images/CSC_0015.jpg";
import prod2Img from "../../assets/images/IMG_4869.JPG";
import prod3Img from "../../assets/images/CSC_0015.jpg";
import prod4Img from "../../assets/images/IMG_4869.JPG";

// ================== CONFIG ==================
const API_BASE_URL = "http://localhost:8000";
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/v1/products`;

const BRA_TYPES = [
  // ⚠️ IMPORTANT:
  // "id" should match tags you save in backend (product.tags)
  // e.g. if you want to show products when "Binki" is clicked,
  // add "binki" in product.tags array in Mongo.
  { id: "binki", label: "Binki", image: paddedImg },
  { id: "hipster", label: "Hipster", image: nonPaddedImg },
  { id: "fullbrief", label: "FullBrief", image: wiredImg },
  { id: "boyshorts", label: "Boy-shorts", image: nonWiredImg },
  { id: "tong", label: "Tong", image: tshirtImg },
  { id: "vanishSeamless", label: "Vanish Seamless", image: pushupImg },
  { id: "boyleg", label: "Boyleg", image: multiwayImg },
];

const SORT_OPTIONS = [
  { id: "featured", label: "Featured" },
  { id: "priceLow", label: "Price: Low to High" },
  { id: "priceHigh", label: "Price: High to Low" },
];

const PRODUCTS_PER_PAGE = 12;

// ----- helpers -----
const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
};

// decode colors coming from DB (string | object)
const decodeColor = (c) => {
  if (!c) return "#e5e7eb";

  if (typeof c === "string") {
    // already a hex or css color name
    return c;
  }

  if (typeof c === "object") {
    // from your form: { label, value } or { label, hex }
    return c.value || c.hex || "#e5e7eb";
  }

  return "#e5e7eb";
};

const NightwearListing = () => {
  const [rawProducts, setRawProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  // ⭐ Scroll to top whenever page changes (Prev, Next, number)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // ====== FETCH ONLY NIGHTWEAR PRODUCTS FROM BACKEND ======
  useEffect(() => {
    const fetchNightwear = async () => {
      try {
        setLoading(true);

        // 👇 change "Nightwear" if your DB uses different category text
        const res = await axios.get(PRODUCTS_ENDPOINT, {
          params: {
            category: "Nightwear", // ONLY nightwear products
            limit: 200,
          },
        });

        const apiProducts = res.data?.data || [];
        setRawProducts(apiProducts);
      } catch (err) {
        console.error("Nightwear fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchNightwear();
  }, []);

  // ====== NORMALIZE API PRODUCTS INTO CARD DATA ======
  const allProducts = useMemo(() => {
    if (!Array.isArray(rawProducts)) return [];

    return rawProducts.map((p, index) => {
      const mrp = Number(p?.price?.mrp) || 0;
      const sale =
        Number(p?.price?.sale) && Number(p?.price?.sale) > 0
          ? Number(p?.price?.sale)
          : mrp;
      let discountPercent =
        typeof p?.price?.discountPercent === "number"
          ? p.price.discountPercent
          : 0;

      if (!discountPercent && mrp > 0 && sale > 0 && sale < mrp) {
        discountPercent = Math.round(((mrp - sale) / mrp) * 100);
      }

      // map backend tags -> "types" used in filter
      let types = [];
      if (Array.isArray(p.tags)) {
        const lowerTags = p.tags.map((t) => String(t).toLowerCase());

        if (lowerTags.includes("binki")) types.push("binki");
        if (lowerTags.includes("hipster")) types.push("hipster");
        if (lowerTags.includes("fullbrief")) types.push("fullbrief");
        if (lowerTags.includes("boyshorts")) types.push("boyshorts");
        if (lowerTags.includes("tong")) types.push("tong");
        if (lowerTags.includes("vanishseamless"))
          types.push("vanishSeamless");
        if (lowerTags.includes("boyleg")) types.push("boyleg");
      }

      // default type so that they appear under "All" even if tags missing
      if (!types.length) {
        types = ["default"];
      }

      const imageFromApi =
        p.mainImage ||
        (Array.isArray(p.galleryImages) ? p.galleryImages[0] : null);

      // fallback images if API has none
      const fallbackImages = [prod1Img, prod2Img, prod3Img, prod4Img];
      const fallback = fallbackImages[index % fallbackImages.length];

      const image = imageFromApi ? getImageUrl(imageFromApi) : fallback;

      const colors =
        Array.isArray(p.colors) && p.colors.length
          ? p.colors.map(decodeColor)
          : [];

      return {
        id: p._id || index + 1,
        slug: p.slug,
        brand: p.brand || "AMANTE",
        name: p.name || "Product Name",
        mrp,
        price: sale || mrp,
        discount: discountPercent || 0,
        image,
        types,
        colors,
      };
    });
  }, [rawProducts]);

  // ----- FILTER + SORT -----
  const filteredProducts = useMemo(() => {
    let products =
      selectedType === "all"
        ? [...allProducts]
        : allProducts.filter((p) => p.types.includes(selectedType));

    if (sortBy === "priceLow") {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      products.sort((a, b) => b.price - a.price);
    }
    return products;
  }, [allProducts, selectedType, sortBy]);

  // ----- PAGINATION -----
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // filter/sort → reset to page 1
  const handleTypeChange = (typeId) => {
    setSelectedType(typeId);
    setCurrentPage(1);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1);
  };

  // handle click to product detail (slug-based)
 const handleCardClick = (product) => {
  navigate(`/product/${product._id}`);
};


  return (
    <div className={styles.page}>
      {/* -------- BREADCRUMB -------- */}
      <div className={`container ${styles.breadcrumb}`}>
        <span className={styles.breadcrumbLink} onClick={() => navigate("/")}>
          Home
        </span>
        <span className={styles.breadcrumbSeparator}>&gt;</span>
        <span>Night Wear</span>
      </div>

      {/* -------- TOP TYPE FILTER (IMAGE CHIPS) -------- */}
      <div className={`container-fluid ${styles.typeFilterWrapper}`}>
        <button
          type="button"
          className={`${styles.typeChip} ${
            selectedType === "all" ? styles.typeChipActive : ""
          }`}
          onClick={() => handleTypeChange("all")}
        >
          <div className={styles.typeChipImgWrapper}>
            <div className={styles.typeChipAllCircle}>All</div>
          </div>
          <span className={styles.typeChipLabel}>All Nightwear</span>
        </button>

        {BRA_TYPES.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`${styles.typeChip} ${
              selectedType === type.id ? styles.typeChipActive : ""
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
          <button className={styles.filterPill}>CATEGORY</button>
          <button className={styles.filterPill}>COLOR</button>
          <button className={styles.filterPill}>SIZE</button>
          <button className={styles.filterPill}>BRAND</button>
          <button className={styles.filterPill}>PREFERENCE</button>
          <button className={styles.filterPill}>STYLES</button>
          <button className={styles.filterPill}>COVERAGE</button>
          <button className={styles.filterPill}>OCCASION</button>
          <button className={styles.filterPill}>FABRIC</button>
          <button className={styles.filterPill}>PACK OF</button>
          <button className={styles.filterPill}>PATTERN</button>
          <button className={styles.filterPill}>CLOSURE TYPE</button>
          <button className={styles.filterPill}>STRAP</button>
          <button className={styles.filterPill}>PRICE</button>
          <button className={styles.filterPill}>AVAILABILITY</button>
          <button className={styles.filterPill}>DISCOUNT</button>
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

      {/* -------- PRODUCTS GRID -------- */}
      <div className={styles.productsGrid}>
        {loading && (
          <div className={styles.noResults}>Loading nightwear products...</div>
        )}

        {!loading &&
          paginatedProducts.map((product) => (
            <div
              key={product.id}
              className={styles.card}
              onClick={() => handleCardClick(product)}
            >
              {product.discount > 0 && (
                <div className={styles.discountTag}>
                  {product.discount}% off
                </div>
              )}

              <button
                className={styles.wishlistBtn}
                type="button"
                onClick={(e) => e.stopPropagation()} // avoid navigating on heart click
              >
                <FiHeart />
              </button>

              <div className={styles.cardImageWrapper}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.cardImage}
                />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.brand}>{product.brand}</div>
                <div className={styles.name}>{product.name}</div>

                <div className={styles.priceRow}>
                  <span className={styles.price}>MRP ₹ {product.price}</span>
                  {product.discount > 0 && (
                    <span className={styles.mrpStriked}>
                      ₹ {product.mrp.toFixed(0)}
                    </span>
                  )}
                </div>

                {product.colors?.length > 0 && (
                  <div className={styles.colorsRow}>
                    {product.colors.map((c, index) => (
                      <span
                        key={index}
                        className={styles.colorDot}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className={styles.addToBagBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    // TODO: integrate CartContext addToCart here
                  }}
                >
                  <FiShoppingBag className={styles.addToBagIcon} />
                </button>
              </div>
            </div>
          ))}

        {!loading && paginatedProducts.length === 0 && (
          <div className={styles.noResults}>No nightwear products found.</div>
        )}
      </div>

      {/* -------- PAGINATION -------- */}
      {!loading && totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <button
            type="button"
            className={`${styles.pageBtn} ${styles.pagePrevNext}`}
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
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
                  currentPage === page ? styles.pageBtnActive : ""
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
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default NightwearListing;
