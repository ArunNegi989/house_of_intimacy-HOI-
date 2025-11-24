// src/components/ShopByCategory/ShopByCategory.jsx
import React, { useState } from "react";
import Slider from "react-slick";
import styles from "../assets/styles/ShopByCategory.module.css";

// Import slick CSS (global)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Icons (PNG)
import brasIcon from "../assets/icons/sport-bra.png";
import pantyIcon from "../assets/icons/underwear.png";
import sleepIcon from "../assets/icons/clothes.png";
import activeIcon from "../assets/icons/trouser.png";
import layeringIcon from "../assets/icons/dress.png";

// Images
import brasImg1 from "../assets/images/17.jpg";
import brasImg2 from "../assets/images/19.jpg";
import brasImg3 from "../assets/images/5.jpg";
import brasImg4 from "../assets/images/17.jpg";
import brasImg5 from "../assets/images/19.jpg";

import pantyImg1 from "../assets/images/17.jpg";
import pantyImg2 from "../assets/images/19.jpg";
import pantyImg3 from "../assets/images/5.jpg";
import pantyImg4 from "../assets/images/17.jpg";

// Tabs config (icon = image path)
const TABS = [
  { id: "bras", label: "BRAS", icon: brasIcon },
  { id: "panty", label: "PANTY", icon: pantyIcon },
  { id: "sleep", label: "SLEEP", icon: sleepIcon },
  { id: "active", label: "ACTIVE", icon: activeIcon },
  { id: "layering", label: "LAYERING", icon: layeringIcon },
];

// data
const PRODUCTS = {
  bras: [
    { id: 1, title: "T-Shirt Bras", image: brasImg1 },
    { id: 2, title: "SKINS Bras", image: brasImg2 },
    { id: 3, title: "Fashion Bras", image: brasImg3 },
    { id: 4, title: "Full Figure Bras", image: brasImg4 },
    { id: 5, title: "Push-Up Bras", image: brasImg5 },
  ],
  panty: [
    { id: 1, title: "Bikini Panties", image: pantyImg1 },
    { id: 2, title: "Hipster Panties", image: pantyImg2 },
    { id: 3, title: "Boyshorts", image: pantyImg3 },
    { id: 4, title: "High Waist", image: pantyImg4 },
  ],
  sleep: [
    { id: 1, title: "Night Dresses", image: brasImg1 },
    { id: 2, title: "Pajama Sets", image: brasImg2 },
    { id: 3, title: "Robes", image: brasImg3 },
  ],
  active: [
    { id: 1, title: "Sports Bras", image: brasImg2 },
    { id: 2, title: "Tights", image: brasImg3 },
    { id: 3, title: "Shorts", image: brasImg4 },
  ],
  layering: [
    { id: 1, title: "Camisoles", image: brasImg3 },
    { id: 2, title: "Slips", image: brasImg4 },
    { id: 3, title: "Tanks", image: brasImg5 },
  ],
};

// Custom arrow components
const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      type="button"
      className={`${styles.navArrow} ${styles.navPrev}`}
      onClick={onClick}
      aria-label="Previous"
    >
      ‹
    </button>
  );
};

const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button
      type="button"
      className={`${styles.navArrow} ${styles.navNext}`}
      onClick={onClick}
      aria-label="Next"
    >
      ›
    </button>
  );
};

const ShopByCategory = () => {
  const [activeTab, setActiveTab] = useState("bras");

  const items = PRODUCTS[activeTab] || [];

  // react-slick settings
  const sliderSettings = {
  dots: false,
  infinite: items.length > 4, // or true if you prefer
  speed: 1000,
  slidesToShow: 4,
  slidesToScroll: 1,
  swipeToSlide: true,
  autoplay: true, // ⛔ desktop: no autoplay
  nextArrow: <NextArrow />,
  prevArrow: <PrevArrow />,
  responsive: [
    {
      breakpoint: 993, // < 993px
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        autoplay: true,        // ✅ autoplay ON
        autoplaySpeed: 4500,
        // optional: hide arrows on small screens
        // arrows: false,
      },
    },
    {
      breakpoint: 600, // < 600px
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,        // ✅ autoplay ON
        autoplaySpeed: 4500,
        // arrows: false,
      },
    },
  ],
};

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    // react-slick will handle position; no manual reset needed here
  };

  return (
    <section className={styles.sectionWrapper}>
        <h2 className={styles.heading}>Shop by Category</h2>

      <div className={styles.innerContainer}>

        {/* Tabs */}
        <div className={styles.tabsRow}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tabBtn} ${
                activeTab === tab.id ? styles.tabBtnActive : ""
              }`}
              onClick={() => handleTabClick(tab.id)}
            >
              <img
                src={tab.icon}
                alt={tab.label}
                className={`${styles.tabIcon} ${
                  activeTab === tab.id ? styles.tabIconActive : ""
                }`}
              />
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className={styles.sliderWrapper}>
          <Slider {...sliderSettings} className={styles.cardsTrack}>
            {items.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.cardImageWrap}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={styles.cardImage}
                  />
                </div>
                <button className={styles.cardLink}>
                  {item.title}
                  <span className={styles.cardArrow}>↗</span>
                </button>
              </div>
            ))}
          </Slider>
        </div>

        {/* View all button */}
        <div className={styles.viewAllWrap}>
          <button type="button" className={styles.viewAllBtn}>
            View All
            <span className={styles.viewAllArrow}>↗</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
