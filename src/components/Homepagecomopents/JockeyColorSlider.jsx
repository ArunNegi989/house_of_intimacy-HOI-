// src/components/JockeyColorSlider/JockeyColorSlider.jsx
import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../assets/styles/JockeyColorSlider.module.css";

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";
const apiRoot = baseUrl.replace(/\/v1$/, "");

const COLORS = [
  { id: "black",  label: "Black",  hex: "#000000" },
  { id: "grey",   label: "Grey",   hex: "#4B5563" },
  { id: "navy",   label: "Navy",   hex: "#1F2937" },
  { id: "blue",   label: "Blue",   hex: "#2563EB" },
  { id: "teal",   label: "Teal",   hex: "#14B8A6" },
  { id: "green",  label: "Green",  hex: "#22C55E" },
  { id: "orange", label: "Orange", hex: "#F97316" },
  { id: "red",    label: "Red",    hex: "#EF4444" },
  { id: "pink",   label: "Pink",   hex: "#EC4899" },
  { id: "yellow", label: "Yellow", hex: "#FACC15" },
];

const getImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${apiRoot}${url}`;
};

function NextArrow({ onClick }) {
  return (
    <button type="button" className={`${styles.arrowBtn} ${styles.arrowRight}`} onClick={onClick}>❯</button>
  );
}
function PrevArrow({ onClick }) {
  return (
    <button type="button" className={`${styles.arrowBtn} ${styles.arrowLeft}`} onClick={onClick}>❮</button>
  );
}

// ── useWindowWidth hook ──────────────────────────────────
const useWindowWidth = () => {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return width;
};

const getSlidesToShow = (width) => {
  if (width <= 600)  return 1;
  if (width <= 900)  return 2;
  if (width <= 1200) return 3;
  return 4;
};

const JockeyColorSlider = () => {
  const [activeGender, setActiveGender] = useState("women");
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [allProducts, setAllProducts] = useState([]);
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const windowWidth  = useWindowWidth();
  const slidesToShow = getSlidesToShow(windowWidth);
  const activeColor  = COLORS[activeColorIndex];

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(`${baseUrl}/products`, { params: { limit: 500 } });
        setAllProducts(res.data?.data || []);
        if (sliderRef.current) sliderRef.current.slickGoTo(0);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchAllProducts();
  }, []);

  const genderFiltered = allProducts.filter(
    (p) => p.gender && p.gender.toLowerCase() === (activeGender === "men" ? "men" : "women")
  );

  const filteredByColor = genderFiltered.filter(
    (p) => p.similarColor && p.similarColor.toLowerCase() === activeColor.id.toLowerCase()
  );

  const productsToShow = filteredByColor.length > 0 ? filteredByColor : genderFiltered;

  const thumbPercent =
    COLORS.length === 1 ? 0 : (activeColorIndex / (COLORS.length - 1)) * 100;

  const settings = {
    infinite: productsToShow.length > slidesToShow,
    slidesToShow,
    slidesToScroll: 1,
    speed: 400,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    // NO responsive array — hook controls everything
  };

  const handleCardClick = (productId) => navigate(`/product/${productId}`);

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.topRow}>
          <h2 className={styles.title}>SLIDE INTO THE COLORS OF HOI</h2>
          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeGender === "women" ? styles.tabActive : ""}`}
              onClick={() => { setActiveGender("women"); setActiveColorIndex(0); sliderRef.current?.slickGoTo(0); }}
            >Women</button>
            <button
              type="button"
              className={`${styles.tabBtn} ${activeGender === "men" ? styles.tabActive : ""}`}
              onClick={() => { setActiveGender("men"); setActiveColorIndex(0); sliderRef.current?.slickGoTo(0); }}
            >Men</button>
          </div>
        </div>

        <div className={styles.sliderWrapper}>
          <Slider ref={sliderRef} {...settings}>
            {productsToShow.map((p) => (
              <div key={p._id} className={styles.cardOuter} onClick={() => handleCardClick(p._id)} style={{ cursor: "pointer" }}>
                <div className={styles.card}>
                  <div className={styles.cardImageWrap}>
                    {p.gender && <span className={styles.genderBadge}>{p.gender}</span>}
                    <img src={getImageUrl(p.mainImage || p.galleryImages?.[0])} alt={p.name} className={styles.cardImage} />
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <p className={styles.cardName}>{p.name}</p>
                  <p className={styles.cardSubtitle}>{p.brand || p.category || ""}</p>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <div className={styles.colorSection}>
          <div className={styles.colorSliderWrapper}>
            <div className={styles.colorNameBubble} style={{ left: `${thumbPercent}%`, borderColor: activeColor.hex }}>
              {activeColor.label}
            </div>
            <input
              type="range"
              min={0}
              max={COLORS.length - 1}
              step={1}
              value={activeColorIndex}
              onChange={(e) => {
                setActiveColorIndex(Number(e.target.value));
                sliderRef.current?.slickGoTo(0);
              }}
              className={styles.colorRange}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default JockeyColorSlider;