// src/components/ShopByCategory/ShopByCategory.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../../assets/styles/ShopByCategory.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import brasIcon     from "../../assets/icons/sport-bra.png";
import pantyIcon    from "../../assets/icons/underwear.png";
import sleepIcon    from "../../assets/icons/clothes.png";
import activeIcon   from "../../assets/icons/trouser.png";
import layeringIcon from "../../assets/icons/dress.png";

const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";
const apiRoot = baseUrl.replace(/\/v1$/, "");
const PRODUCTS_ENDPOINT = `${baseUrl}/products`;

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${apiRoot}${url}`;
};

const TABS = [
  { id: "bras",     label: "BRAS",     icon: brasIcon,     category: "Bra",       route: "/bras" },
  { id: "panty",    label: "PANTY",    icon: pantyIcon,    category: "Panty",     route: "/panties" },
  { id: "sleep",    label: "SLEEP",    icon: sleepIcon,    category: "Nightwear", route: "/nightwear" },
  { id: "active",   label: "ACTIVE",   icon: activeIcon,   category: "Active",    route: "/activewear" },
  { id: "layering", label: "LAYERING", icon: layeringIcon, category: "Layering",  route: "/layering" },
];

const PrevArrow = ({ onClick }) => (
  <button type="button" className={`${styles.navArrow} ${styles.navPrev}`} onClick={onClick} aria-label="Previous">‹</button>
);
const NextArrow = ({ onClick }) => (
  <button type="button" className={`${styles.navArrow} ${styles.navNext}`} onClick={onClick} aria-label="Next">›</button>
);

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
  if (width <= 993)  return 2;
  return 4;
};

const ShopByCategory = () => {
  const [activeTab, setActiveTab]     = useState("bras");
  const [itemsByTab, setItemsByTab]   = useState({});
  const [loadingTab, setLoadingTab]   = useState(null);
  const [errorTab, setErrorTab]       = useState(null);

  const navigate      = useNavigate();
  const windowWidth   = useWindowWidth();
  const slidesToShow  = getSlidesToShow(windowWidth);

  const currentTab = TABS.find((t) => t.id === activeTab);
  const items      = itemsByTab[activeTab] || [];

  const fetchTabProducts = async (tabObj) => {
    if (!tabObj || itemsByTab[tabObj.id]?.length) return;
    try {
      setLoadingTab(tabObj.id);
      setErrorTab(null);
      const res = await axios.get(PRODUCTS_ENDPOINT, {
        params: { page: 1, limit: 10, category: tabObj.category },
      });
      const mapped = (res?.data?.data || []).map((p) => ({
        id: p._id,
        title: p.name,
        image: getImageUrl(p.mainImage || p.galleryImages?.[0]),
        slug: p.slug,
      }));
      setItemsByTab((prev) => ({ ...prev, [tabObj.id]: mapped }));
    } catch (err) {
      console.error("ShopByCategory fetch error:", err);
      setErrorTab(tabObj.id);
    } finally {
      setLoadingTab(null);
    }
  };

  useEffect(() => {
    fetchTabProducts(TABS.find((t) => t.id === "bras"));
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    fetchTabProducts(TABS.find((t) => t.id === tabId));
  };

  const sliderSettings = {
    dots: false,
    infinite: items.length > slidesToShow,
    speed: 1000,
    slidesToShow,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: windowWidth <= 993,
    autoplaySpeed: 4500,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    // NO responsive array
  };

  return (
    <section className={styles.sectionWrapper}>
      <h2 className={styles.heading}>Shop by Category</h2>
      <div className={styles.innerContainer}>

        <div className={styles.tabsRow}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              <img
                src={tab.icon}
                alt={tab.label}
                className={`${styles.tabIcon} ${activeTab === tab.id ? styles.tabIconActive : ""}`}
              />
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.sliderWrapper}>
          {loadingTab === activeTab && <div className={styles.loadingText}>Loading {currentTab?.label}…</div>}
          {errorTab   === activeTab && <div className={styles.errorText}>Failed to load {currentTab?.label}.</div>}
          {!loadingTab && !errorTab && items.length === 0 && (
            <div className={styles.emptyText}>No products found in {currentTab?.label}.</div>
          )}
          {!loadingTab && !errorTab && items.length > 0 && (
            <Slider {...sliderSettings} className={styles.cardsTrack}>
              {items.map((item) => (
                <div key={item.id} className={styles.card} onClick={() => navigate(`/product/${item.id}`)} style={{ cursor: "pointer" }}>
                  <div className={styles.cardImageWrap}>
                    <img src={item.image} alt={item.title} className={styles.cardImage} />
                  </div>
                  <button type="button" className={styles.cardLink}>
                    {item.title}<span className={styles.cardArrow}>↗</span>
                  </button>
                </div>
              ))}
            </Slider>
          )}
        </div>

        <div className={styles.viewAllWrap}>
          <button type="button" className={styles.viewAllBtn} onClick={() => currentTab?.route && navigate(currentTab.route)}>
            View All <span className={styles.viewAllArrow}>↗</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;