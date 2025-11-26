// src/components/JockeyColorSlider/JockeyColorSlider.jsx
import React, { useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import axios from "axios";
import styles from "../../assets/styles/JockeyColorSlider.module.css";

const API_BASE_URL = "http://localhost:8000";

// ----- UI COLORS (slider ke liye) -----
const COLORS = [
  { id: "black", label: "Black", hex: "#000000" },
  { id: "grey", label: "Grey", hex: "#4B5563" },
  { id: "navy", label: "Navy", hex: "#1F2937" },
  { id: "blue", label: "Blue", hex: "#2563EB" },
  { id: "teal", label: "Teal", hex: "#14B8A6" },
  { id: "green", label: "Green", hex: "#22C55E" },
  { id: "orange", label: "Orange", hex: "#F97316" },
  { id: "red", label: "Red", hex: "#EF4444" },
  { id: "pink", label: "Pink", hex: "#EC4899" },
  { id: "yellow", label: "Yellow", hex: "#FACC15" },
];

// 💡 master color map (name → hex)
const COLOR_MAP = {
  black: "#000000",
  grey: "#4B5563",
  navy: "#1F2937",
  blue: "#2563EB",
  teal: "#14B8A6",
  green: "#22C55E",
  orange: "#F97316",
  red: "#EF4444",
  pink: "#EC4899",
  yellow: "#FACC15",
};

// reverse map (hex → name)
const HEX_TO_NAME = Object.fromEntries(
  Object.entries(COLOR_MAP).map(([name, hex]) => [hex.toLowerCase(), name])
);

// ✅ universal color normalizer
// backend me jo bhi aaye: "#EF4444" / "Red" / "red" / {label:'Red'} → "red"
function normalizeColor(val) {
  if (!val) return null;

  // If object like {label:"Red"} ya {name:"Red"}
  if (typeof val === "object") {
    if (val.label) return String(val.label).toLowerCase();
    if (val.name) return String(val.name).toLowerCase();
  }

  // If hex string "#EF4444"
  if (typeof val === "string" && val.startsWith("#")) {
    const lowerHex = val.toLowerCase();
    const mappedName = HEX_TO_NAME[lowerHex];
    return mappedName ? mappedName.toLowerCase() : null;
  }

  // Simple string like "Red", "RED"
  if (typeof val === "string") {
    return val.toLowerCase();
  }

  return null;
}

// backend image helper
const getImageUrl = (url) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
};

// custom arrows
function NextArrow({ onClick }) {
  return (
    <button
      type="button"
      className={`${styles.arrowBtn} ${styles.arrowRight}`}
      onClick={onClick}
    >
      ❯
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button
      type="button"
      className={`${styles.arrowBtn} ${styles.arrowLeft}`}
      onClick={onClick}
    >
      ❮
    </button>
  );
}

const JockeyColorSlider = () => {
  const [activeGender, setActiveGender] = useState("men"); // "men" | "women"
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [allProducts, setAllProducts] = useState([]); // sab products (Men + Women)

  const sliderRef = useRef(null);

  const activeColor = COLORS[activeColorIndex];

  // ---------- API: ek hi baar sab products lao ----------
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/v1/products`, {
          params: {
            limit: 500,
          },
        });

        console.log("Jockey slider all products:", res.data);
        setAllProducts(res.data?.data || []);
        if (sliderRef.current) {
          sliderRef.current.slickGoTo(0);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchAllProducts();
  }, []);

  // ---------- GENDER FILTER FRONTEND PE ----------
  const currentGenderValue = activeGender === "men" ? "men" : "women";

  const genderFilteredProducts = allProducts.filter((p) => {
    if (!p.gender) return false;
    return p.gender.toLowerCase() === currentGenderValue;
  });

  // ---------- COLOR FILTER FRONTEND PE (universal logic) ----------
  const filteredByColor = genderFilteredProducts.filter((p) => {
    if (!p.colors || !Array.isArray(p.colors)) return false;

    const wantedColor = activeColor.label.toLowerCase(); // e.g. "red"

    return p.colors.some((c) => {
      const normalized = normalizeColor(c);
      return normalized === wantedColor;
    });
  });

  // agar is color me kuch nahi mila → fallback: sirf gender-based sab dikhana
  const productsToShow =
    filteredByColor.length > 0 ? filteredByColor : genderFilteredProducts;

  const thumbPercent =
    COLORS.length === 1
      ? 0
      : (activeColorIndex / (COLORS.length - 1)) * 100;

  const settings = {
  infinite: productsToShow.length > 4,  // 👈 auto-safe infinite
  slidesToShow: 4,
  slidesToScroll: 1,
  speed: 400,
  arrows: true,
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        infinite: productsToShow.length > 3, // 👈 responsive infinite fix
      },
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        infinite: productsToShow.length > 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        infinite: productsToShow.length > 1,
      },
    },
  ],
};

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* Top row: title + tabs */}
        <div className={styles.topRow}>
          <h2 className={styles.title}>SLIDE INTO THE COLORS OF HOI</h2>

          <div className={styles.tabs}>
            <button
              type="button"
              className={`${styles.tabBtn} ${
                activeGender === "men" ? styles.tabActive : ""
              }`}
              onClick={() => {
                setActiveGender("men");
                setActiveColorIndex(0);
                if (sliderRef.current) sliderRef.current.slickGoTo(0);
              }}
            >
              Men
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${
                activeGender === "women" ? styles.tabActive : ""
              }`}
              onClick={() => {
                setActiveGender("women");
                setActiveColorIndex(0);
                if (sliderRef.current) sliderRef.current.slickGoTo(0);
              }}
            >
              Women
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className={styles.sliderWrapper}>
          <Slider ref={sliderRef} {...settings}>
            {productsToShow.map((p) => {
              const genderLabel = p.gender || "";

              return (
                <div key={p._id} className={styles.cardOuter}>
                  <div className={styles.card}>
                    <div className={styles.cardImageWrap}>
                      {/* 🔥 Gender badge top-right */}
                      {genderLabel && (
                        <span className={styles.genderBadge}>
                          {genderLabel}
                        </span>
                      )}

                      <img
                        src={getImageUrl(p.mainImage || p.galleryImages?.[0])}
                        alt={p.name}
                        className={styles.cardImage}
                      />
                    </div>
                  </div>

                  <div className={styles.cardInfo}>
                    <p className={styles.cardName}>{p.name}</p>
                    <p className={styles.cardSubtitle}>
                      {p.brand || p.category || ""}
                    </p>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>

        {/* Color selector – line + moving label */}
        <div className={styles.colorSection}>
          <div className={styles.colorSliderWrapper}>
            {/* moving color name */}
            <div
              className={styles.colorNameBubble}
              style={{
                left: `${thumbPercent}%`,
                borderColor: activeColor.hex,
              }}
            >
              {activeColor.label}
            </div>

            <input
              type="range"
              min={0}
              max={COLORS.length - 1}
              step={1}
              value={activeColorIndex}
              onChange={(e) => {
                const newIndex = Number(e.target.value);
                setActiveColorIndex(newIndex);

                if (sliderRef.current) {
                  sliderRef.current.slickGoTo(0);
                }
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
