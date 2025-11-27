// src/components/NewArrival/NewArrival.jsx
import React, { useEffect, useState, useContext } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa'; // ✅ filled heart
import { useNavigate } from 'react-router-dom';

import styles from '../../assets/styles/LingerieSection.module.css';

// ✅ Wishlist context
import { WishlistContext } from '../../contexts/WishlistContext';

// ---------- ASSETS ----------
import heroVideoPoster from '../../assets/videos/IMG_3698.MP4';
import heroVideo from '../../assets/videos/IMG_3698.MP4';

// fallback image if none available
import prodFallback from '../../assets/images/17.jpg';

// ---------- CONFIG ----------
const BRAND_NAME = 'Vamika';
const API_BASE_URL = 'http://localhost:8000';

const PRODUCTS_ENDPOINT = `${API_BASE_URL}/v1/products/brand/${encodeURIComponent(
  BRAND_NAME,
)}`;

// ---------- HELPERS ----------
const getDiscountPercent = (mrp, price) => {
  if (!mrp || !price || mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
};

const getImageUrl = (path) => {
  if (!path) return prodFallback;
  if (path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

// ---------- CUSTOM ARROWS ----------
const NextArrow = ({ style, onClick }) => (
  <button
    type="button"
    className={`${styles.arrowBtn} ${styles.nextArrow}`}
    style={{ ...style }}
    onClick={onClick}
  >
    &gt;
  </button>
);

const PrevArrow = ({ style, onClick }) => (
  <button
    type="button"
    className={`${styles.arrowBtn} ${styles.prevArrow}`}
    style={{ ...style }}
    onClick={onClick}
  >
    &lt;
  </button>
);

const NewArrival = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  // ✅ get wishlist from context
  const { wishlistItems, toggleWishlist } = useContext(WishlistContext);

  // ---------- SLIDER SETTINGS ----------
  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: false, // ⛔ desktop autoplay on
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1.2 } },
    ],
  };

  // ---------- FETCH PRODUCTS ----------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await axios.get(PRODUCTS_ENDPOINT);
        const backendProducts = res.data?.data || [];

        const mapped = backendProducts.map((prod) => {
          const mrp = prod.price?.mrp || 0;
          const salePrice = prod.price?.sale || mrp;
          const colorsArray = Array.isArray(prod.colors) ? prod.colors : [];

          // stock calculator
          let totalStock = 0;
          if (typeof prod.totalStock === 'number') {
            totalStock = prod.totalStock;
          } else if (typeof prod.stock === 'number') {
            totalStock = prod.stock;
          } else if (Array.isArray(prod.sizes)) {
            totalStock = prod.sizes.reduce(
              (sum, s) => sum + (s.stock || 0),
              0,
            );
          }

          const genderType = prod.gender || prod.genderType || 'Unisex';

          return {
            id: prod._id,
            brand: prod.brand || BRAND_NAME,
            name: prod.name,
            description: prod.description || '',
            mrp,
            price: salePrice,
            image: getImageUrl(
              prod.mainImage || (prod.galleryImages && prod.galleryImages[0]),
            ),
            colors: colorsArray,
            moreColors: colorsArray.length > 3 ? colorsArray.length - 3 : 0,
            stock: totalStock,
            gender: genderType,
          };
        });

        setProducts(mapped);
      } catch (err) {
        console.error('Error fetching Vamika products:', err);
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{BRAND_NAME}</h2>

        <div className={styles.contentRow}>
          {/* LEFT VIDEO SECTION */}
           <div className={styles.leftPanel}>
            <div className={styles.heroCard}>
              <video
                className={styles.heroVideo}
                autoPlay
                muted
                loop
                playsInline
                poster={heroVideoPoster}
              >
                <source src={heroVideo} type="video/mp4" />
              </video>

              <div className={styles.heroOverlay}></div>

              {/* 🔥 SHOP NOW NAVIGATES TO BRAND LISTING PAGE */}
             <button
  type="button"
  className={styles.heroBtn}
  onClick={() => navigate("/products")}  // 👈 OPEN ALL PRODUCTS PAGE
>
  Shop Now
</button>
            </div>
          </div>

          {/* RIGHT SLIDER */}
          <div className={styles.sliderWrapper}>
            {loading && <p className={styles.infoText}>Loading products...</p>}
            {error && !loading && (
              <p className={styles.errorText}>{error}</p>
            )}
            {!loading && !error && products.length === 0 && (
              <p className={styles.infoText}>No products found.</p>
            )}

            {!loading && !error && products.length > 0 && (
              <Slider {...settings}>
                {products.map((item) => {
                  const discount = getDiscountPercent(item.mrp, item.price);
                  const isInWishlist = wishlistItems.includes(item.id); // ✅ check global wishlist

                  return (
                    <div key={item.id} className={styles.slideOuter}>
                      {/* 👇 FULL CARD CLICKABLE */}
                      <div
                        className={styles.productCard}
                        onClick={() => navigate(`/product/${item.id}`)}
                        role="button"
                      >
                        {/* ✅ WISHLIST BUTTON (stops card click) */}
                        <button
                          className={`${styles.wishBtn} ${
                            isInWishlist ? styles.wishBtnActive : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(item.id);
                          }}
                        >
                          {isInWishlist ? <FaHeart /> : <FiHeart />}
                        </button>

                        <div className={styles.productImageWrap}>
                          <img
                            src={item.image}
                            alt={item.name}
                            className={styles.productImage}
                          />
                        </div>

                        <div className={styles.productBody}>
                          <div className={styles.brand}>{item.brand}</div>
                          <div className={styles.productName}>{item.name}</div>

                          {/* price row */}
                          <div className={styles.priceRow}>
                            <span className={styles.currentPrice}>
                              ₹ {item.price}
                            </span>

                            {item.mrp > 0 && (
                              <span className={styles.originalPrice}>
                                ₹ {item.mrp}
                              </span>
                            )}

                            {discount > 0 && (
                              <span className={styles.discountTag}>
                                {discount}% OFF
                              </span>
                            )}
                          </div>

                          {/* stock + gender row */}
                          <div className={styles.metaRow}>
                            <span
                              className={`${styles.stockBadge} ${
                                item.stock > 0
                                  ? styles.inStock
                                  : styles.outOfStock
                              }`}
                            >
                              {item.stock > 0
                                ? `Available Stock: ${item.stock}`
                                : 'Out of stock'}
                            </span>

                            <span className={styles.genderTag}>
                              {item.gender}
                            </span>
                          </div>

                          {/* colors + cart */}
                          <div className={styles.bottomRow}>
                            <div className={styles.colorRow}>
                              {item.colors.slice(0, 3).map((c, idx) => (
                                <span
                                  key={idx}
                                  className={styles.colorDot}
                                  style={{ backgroundColor: c }}
                                />
                              ))}

                              {item.moreColors > 0 && (
                                <span className={styles.moreColors}>
                                  +{item.moreColors}
                                </span>
                              )}
                            </div>

                            <button
                              className={styles.cartBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                // yaha add-to-cart logic daalna
                              }}
                            >
                              <FiShoppingBag />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewArrival;
