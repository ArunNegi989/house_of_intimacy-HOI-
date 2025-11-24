// src/components/CoolCasualsSection.jsx
import React, { useState } from "react";
import Slider from "react-slick";
import { FiHeart, FiShoppingBag } from "react-icons/fi";

import styles from "../assets/styles/CoolCasualsSection.module.css";

// 🔔 Make sure in your main entry (index.js or App.js) you have:
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// ---------- IMAGES (change paths according to your project) ----------
import heroImg from "../assets/images/17.jpg";

import men1 from "../assets/images/17.jpg";
import men2 from "../assets/images/19.jpg";
import men3 from "../assets/images/5.jpg";
import men4 from "../assets/images/17.jpg";

import women1 from "../assets/images/19.jpg";
import women2 from "../assets/images/5.jpg";
import women3 from "../assets/images/17.jpg";
import women4 from "../assets/images/19.jpg";

// ---------- PRODUCT DATA ----------
const MEN_PRODUCTS = [
  {
    id: 1,
    styleCode: "#MZ01",
    name: "Cotton Rich Oversized Printed T Shirt",
    price: 999,
    image: men1,
    colors: 5,
  },
  {
    id: 2,
    styleCode: "#MZ02",
    name: "100% Cotton Woven Seven Pocket Cargo",
    price: 1819,
    image: men2,
    colors: 3,
  },
  {
    id: 3,
    styleCode: "#MZ03",
    name: "100% Cotton Oversized Hoodie",
    price: 1499,
    image: men3,
    colors: 4,
  },
  {
    id: 4,
    styleCode: "#MZ04",
    name: "Twill Relaxed Fit Joggers",
    price: 1299,
    image: men4,
    colors: 2,
  },
];

const WOMEN_PRODUCTS = [
  {
    id: 5,
    styleCode: "#WZ01",
    name: "Cotton Relaxed Fit Co-Ord Set",
    price: 1599,
    image: women1,
    colors: 6,
  },
  {
    id: 6,
    styleCode: "#WZ02",
    name: "Relaxed Fit Joggers with Pockets",
    price: 1399,
    image: women2,
    colors: 3,
  },
  {
    id: 7,
    styleCode: "#WZ03",
    name: "Oversized Drop Shoulder Tee",
    price: 899,
    image: women3,
    colors: 5,
  },
  {
    id: 8,
    styleCode: "#WZ04",
    name: "Soft Cotton Lounge Set",
    price: 1799,
    image: women4,
    colors: 4,
  },
];

const CoolCasualsSection = () => {
  const [activeTab, setActiveTab] = useState("men");

  const sliderSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  const products = activeTab === "men" ? MEN_PRODUCTS : WOMEN_PRODUCTS;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        {/* LEFT: HERO IMAGE + TEXT */}
        <div className={styles.leftHero}>
          <img src={heroImg} alt="Cool Coded Casuals" className={styles.heroImg} />

          <div className={styles.heroOverlay}>
            <span className={styles.heroSmall}>COOL CODED</span>
            <h2 className={styles.heroTitle}>CASUALS</h2>
          </div>
        </div>

        {/* RIGHT: TABS + SLIDER */}
        <div className={styles.rightPanel}>
          {/* Tabs */}
          <div className={styles.tabsWrapper}>
            <button
              type="button"
              className={`${styles.tabBtn} ${
                activeTab === "men" ? styles.tabBtnActive : ""
              }`}
              onClick={() => setActiveTab("men")}
            >
              Men
            </button>
            <button
              type="button"
              className={`${styles.tabBtn} ${
                activeTab === "women" ? styles.tabBtnActive : ""
              }`}
              onClick={() => setActiveTab("women")}
            >
              Women
            </button>
          </div>

          {/* Slider */}
          <div className={styles.sliderWrapper}>
            <Slider {...sliderSettings}>
              {products.map((product) => (
                <div key={product.id} className={styles.slideItem}>
                  <div className={styles.card}>
                    {/* Heart icon (wishlist) */}
                    <button className={styles.wishlistBtn}>
                      <FiHeart />
                    </button>

                    {/* Product image */}
                    <div className={styles.imgWrap}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className={styles.productImg}
                      />
                    </div>

                    {/* Card content */}
                    <div className={styles.cardBody}>
                      <div className={styles.topRow}>
                        <span className={styles.colorBadge}>{product.colors}</span>
                        <span className={styles.styleCode}>{product.styleCode}</span>
                      </div>

                      <h3 className={styles.productName}>{product.name}</h3>

                      <div className={styles.bottomRow}>
                        <span className={styles.price}>₹{product.price}.00</span>

                        <button className={styles.addBtn}>
                          <FiShoppingBag className={styles.bagIcon} />
                          <span>ADD TO BAG</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoolCasualsSection;
