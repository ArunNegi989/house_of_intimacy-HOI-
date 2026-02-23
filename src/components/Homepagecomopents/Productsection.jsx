import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import prodFallback from '../../assets/images/17.jpg';
import styles from '../../assets/styles/Productsection.module.css';

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl ? baseUrl.replace(/\/v1$/, '') : '';

const sections = [
  { name: 'New',    type: 'new-arrival', align: 'left'  },
  { name: 'Trendy', type: 'trendy',      align: 'right' },
  { name: 'Sale',   type: 'sale',        align: 'left'  },
];

/* ── useWindowWidth hook ─────────────────────────────── */
const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
};

const getSlidesToShow = (width) => {
  if (width <= 575) return 1;
  if (width <= 991) return 2;
  return 4;
};

/* ── Custom Arrows ──────────────────────────────────── */
const PrevArrow = ({ onClick }) => (
  <button type="button" className={styles.arrowPrev} onClick={onClick} aria-label="Previous">
    &#8249;
  </button>
);
const NextArrow = ({ onClick }) => (
  <button type="button" className={styles.arrowNext} onClick={onClick} aria-label="Next">
    &#8250;
  </button>
);

/* ── Component ──────────────────────────────────────── */
export default function ProductSection() {
  const navigate     = useNavigate();
  const windowWidth  = useWindowWidth();
  const slidesToShow = getSlidesToShow(windowWidth);

  const [products, setProducts] = useState({ New: [], Trendy: [], Sale: [] });
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const reqs = sections.map((s) =>
          axios.get(`${baseUrl}/products?type=${s.type}&status=active&limit=10`)
        );
        const resps = await Promise.all(reqs);
        const out = {};
        sections.forEach((s, i) => {
          const raw = resps[i].data;
          out[s.name] = Array.isArray(raw) ? raw : (raw?.data ?? []);
        });
        setProducts(out);
      } catch (e) {
        console.error('ProductSection fetch error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const imgUrl = (path) => {
    if (!path) return prodFallback;
    return path.startsWith('http') ? path : `${apiRoot}${path}`;
  };

  /* NO responsive array — hook handles slidesToShow */
  const sliderConfig = {
    dots: false,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    slidesToShow,
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3500,
    cssEase: 'ease-in-out',
    pauseOnHover: true,
    swipeToSlide: true,
  };

  return (
    <section className={styles.section}>
      {sections.map((section) => {
        const items = products[section.name] ?? [];
        return (
          <div
            key={section.name}
            className={`${styles.row} ${section.align === 'right' ? styles.rowRight : styles.rowLeft}`}
          >
            {/* Title block */}
            <div className={styles.titleBlock}>
              <h3 className={styles.title}>{section.name}</h3>
              <Link to="/products" className={styles.viewAll}>View All →</Link>
            </div>

            {/* Slider */}
            <div
              className={styles.sliderBox}
              style={{ paddingLeft: windowWidth > 991 ? 20 : 0 }}
            >
              {loading ? (
                <p className={styles.stateText}>Loading…</p>
              ) : items.length === 0 ? (
                <p className={styles.stateText}>No products found.</p>
              ) : (
                <Slider
                  {...sliderConfig}
                  className={styles.slider}
                  infinite={items.length > slidesToShow}
                >
                  {items.map((item) => {
                    const mrp  = item.price?.mrp || 0;
                    const sale = item.price?.sale
                      || item.price?.sellingPrice
                      || item.price?.finalPrice
                      || mrp;
                    const disc = item.price?.discountPercent || 0;

                    return (
                      <div key={item._id} className={styles.slideOuter}>
                        <article
                          className={styles.card}
                          onClick={() => navigate(`/product/${item._id}`)}
                        >
                          <div className={styles.imgWrap}>
                            <img
                              src={imgUrl(item.mainImage || item.galleryImages?.[0])}
                              alt={item.name}
                              className={styles.img}
                              loading="lazy"
                            />
                            {section.name === 'Sale' && (
                              <span className={styles.saleBadge}>Sale</span>
                            )}
                          </div>
                          <div className={styles.info}>
                            <div className={styles.brand}>{item.brand}</div>
                            <div className={styles.name}>{item.name}</div>
                            <div className={styles.priceRow}>
                              {mrp > sale && (
                                <span className={styles.priceOld}>&#8377;{mrp}</span>
                              )}
                              <span className={styles.priceNow}>&#8377;{sale}</span>
                              {disc > 0 && (
                                <span className={styles.disc}>-{disc}%</span>
                              )}
                            </div>
                          </div>
                        </article>
                      </div>
                    );
                  })}
                </Slider>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}