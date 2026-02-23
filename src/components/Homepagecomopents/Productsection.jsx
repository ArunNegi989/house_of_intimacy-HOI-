import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import prodFallback from '../../assets/images/17.jpg';

const baseUrl = process.env.REACT_APP_APIURL;
const apiRoot = baseUrl.replace(/\/v1$/, '');

const sections = [
  { name: 'New',    type: 'new-arrival', align: 'left'  },
  { name: 'Trendy', type: 'trendy',      align: 'right' },
  { name: 'Sale',   type: 'sale',        align: 'left'  },
];

// ── useWindowWidth hook ──────────────────────────────────
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
  if (width <= 768)  return 1;
  if (width <= 991)  return 2;
  return 4;
};

export default function ProductSection() {
  const navigate    = useNavigate();
  const windowWidth = useWindowWidth();
  const slidesToShow = getSlidesToShow(windowWidth);

  const [products, setProducts] = useState({ New: [], Trendy: [], Sale: [] });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const requests = sections.map((s) =>
          axios.get(`${baseUrl}/products?type=${s.type}&status=active&limit=8`)
        );
        const responses = await Promise.all(requests);
        const updated = {};
        sections.forEach((s, i) => { updated[s.name] = responses[i].data.data; });
        setProducts(updated);
      } catch (err) {
        console.error('Error fetching products', err);
      }
    };
    fetchProducts();
  }, []);

  const getImageUrl = (path) => {
    if (!path) return prodFallback;
    if (path.startsWith('http')) return path;
    return `${apiRoot}${path}`;
  };

  const sliderSettings = {
    infinite: true,
    speed: 8000,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: 'linear',
    // NO responsive array
  };

  return (
    <>
      <style>{`
        .product-section {
          background: linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #ffd4e5 100%);
          padding: 80px 40px;
          overflow: hidden;
          font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
        }
        .section-row {
          display: flex;
          align-items: center;
          margin-bottom: 70px;
        }
        .align-left  { flex-direction: row; }
        .align-right { flex-direction: row-reverse; }

        .title-wrapper {
          min-width: 220px;
          flex-shrink: 0;
          padding: 0 30px;
        }
        .column-title {
          font-family: 'Playfair Display', serif;
          font-size: 60px;
          font-weight: 700;
          margin-bottom: 10px;
          color: #222;
        }
        .view-all-link {
          color: #333;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          transition: 0.3s;
        }
        .view-all-link:hover { color: #e91e63; }

        .product-card {
          margin: 10px;
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.06);
          transition: 0.3s;
          cursor: pointer;
        }
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
        }
        .product-image {
          width: 100%;
          height: 350px;
          overflow: hidden;
          position: relative;
        }
        .product-image img {
          width: 100%; height: 100%;
          object-fit: contain;
          transition: 0.5s;
        }
        .product-card:hover .product-image img { transform: scale(1.08); }

        .sale-badge {
          position: absolute;
          top: 15px; right: 15px;
          background: #e91e63;
          color: white;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 13px; font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .product-info { padding: 20px; }
        .product-brand { font-size: 13px; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-weight: 500; }
        .product-title { font-size: 18px; font-weight: 600; color: #333; margin-bottom: 12px; line-height: 1.3; }
        .product-price { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .price-old     { font-size: 15px; color: #999; text-decoration: line-through; }
        .price-current { font-size: 20px; font-weight: 700; color: #333; }
        .discount-percent { font-size: 13px; color: #e91e63; font-weight: 600; background: #ffe4ec; padding: 4px 8px; border-radius: 6px; }

        /* Slick padding per slide */
        .ps-slider .slick-slide > div { padding: 0 5px; }
        /* Ensure slick track is flex */
        .ps-slider .slick-track { display: flex !important; }
        .ps-slider .slick-slide { height: auto; }

        /* ── RESPONSIVE ── */
        @media (max-width: 1280px) {
          .product-section { padding: 60px 28px; }
          .column-title { font-size: 48px; }
        }
        @media (max-width: 1055px) {
          .column-title { font-size: 36px; }
          .product-image { height: 300px; }
        }
        @media (max-width: 991px) {
          .product-section { padding: 48px 20px; }
          .section-row {
            flex-direction: column !important;
            align-items: flex-start;
            gap: 20px;
            margin-bottom: 48px;
          }
          .title-wrapper { min-width: 100%; padding: 0; }
          .column-title  { font-size: 32px; }
          .product-image { height: 300px; }
          .product-card  { margin: 6px; }
        }
        @media (max-width: 767px) {
          .product-section { padding: 36px 16px; }
          .column-title    { font-size: 28px; }
          .product-image   { height: 260px; }
          .product-title   { font-size: 16px; }
          .price-current   { font-size: 18px; }
          .product-card    { border-radius: 16px; }
        }
        @media (max-width: 575px) {
          .product-section { padding: 28px 12px; }
          .column-title    { font-size: 24px; }
          .product-image   { height: 240px; }
          .product-card    { margin: 4px; border-radius: 14px; }
          .product-info    { padding: 14px; }
          .product-title   { font-size: 15px; margin-bottom: 8px; }
          .price-current   { font-size: 16px; }
          .section-row     { margin-bottom: 36px; }
        }
        @media (max-width: 480px) {
          .product-section { padding: 24px 10px; }
          .column-title    { font-size: 22px; }
          .product-image   { height: 220px; }
        }
        @media (max-width: 400px) {
          .column-title    { font-size: 20px; }
          .product-image   { height: 200px; }
          .product-card    { border-radius: 12px; }
          .product-brand   { font-size: 11px; }
          .product-title   { font-size: 14px; }
        }
        @media (max-width: 360px) {
          .column-title    { font-size: 18px; }
          .product-image   { height: 180px; }
          .product-info    { padding: 10px 12px; }
        }
      `}</style>

      <section className="product-section container-fluid">
        {sections.map((section) => (
          <div key={section.name} className={`section-row align-${section.align}`}>
            <div className="title-wrapper">
              <h3 className="column-title">{section.name}</h3>
              <Link to="#" className="view-all-link">View All →</Link>
            </div>

            <div style={{ flex: 1, minWidth: 0, paddingLeft: windowWidth > 991 ? 20 : 0 }}>
              <Slider {...sliderSettings} className="ps-slider">
                {products[section.name]?.map((item) => {
                  const mrp      = item.price?.mrp || 0;
                  const sale     = item.price?.sale || 0;
                  const discount = item.price?.discountPercent || 0;
                  return (
                    <div key={item._id}>
                      <article className="product-card" onClick={() => navigate(`/product/${item._id}`)}>
                        <div className="product-image">
                          <img src={getImageUrl(item.mainImage)} alt={item.name} />
                          {section.name === 'Sale' && <div className="sale-badge">Sale</div>}
                        </div>
                        <div className="product-info">
                          <div className="product-brand">{item.brand}</div>
                          <div className="product-title">{item.name}</div>
                          <div className="product-price">
                            {mrp > sale && <span className="price-old">₹{mrp}</span>}
                            <span className="price-current">₹{sale}</span>
                            {discount > 0 && <span className="discount-percent">-{discount}%</span>}
                          </div>
                        </div>
                      </article>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}