// src/components/ShopByCategory/ShopByCategory.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import styles from "../../assets/styles/ShopByCategory.module.css";

// Import slick CSS (global)
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Icons (PNG)
import brasIcon from "../../assets/icons/sport-bra.png";
import pantyIcon from "../../assets/icons/underwear.png";
import sleepIcon from "../../assets/icons/clothes.png";
import activeIcon from "../../assets/icons/trouser.png";
import layeringIcon from "../../assets/icons/dress.png";

// ---------- CONFIG ----------
const baseUrl = process.env.REACT_APP_APIURL || "http://localhost:8000/v1";
const apiRoot = baseUrl.replace(/\/v1$/, ""); // ✅ for /uploads/...
const PRODUCTS_ENDPOINT = `${baseUrl}/products`;

// Helper: resolve image URL from backend
const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${apiRoot}${url}`; // ✅ use apiRoot instead of baseUrl
};

// Tabs config (also map to category & listing route)
const TABS = [
  {
    id: "bras",
    label: "BRAS",
    icon: brasIcon,
    category: "Bra",
    route: "/bras",
  },
  {
    id: "panty",
    label: "PANTY",
    icon: pantyIcon,
    category: "Panty",
    route: "/panties",
  },
  {
    id: "sleep",
    label: "SLEEP",
    icon: sleepIcon,
    category: "Nightwear",
    route: "/nightwear",
  },
  {
    id: "active",
    label: "ACTIVE",
    icon: activeIcon,
    category: "Active",
    route: "/activewear",
  },
  {
    id: "layering",
    label: "LAYERING",
    icon: layeringIcon,
    category: "Layering",
    route: "/layering",
  },
];

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
  const [itemsByTab, setItemsByTab] = useState({});
  const [loadingTab, setLoadingTab] = useState(null);
  const [errorTab, setErrorTab] = useState(null);

  const navigate = useNavigate();

  // current tab object
  const currentTab = TABS.find((t) => t.id === activeTab);
  const items = itemsByTab[activeTab] || [];

  // ----- API: fetch products for a tab (category) -----
  const fetchTabProducts = async (tabObj) => {
    if (!tabObj) return;

    // if already loaded, don't refetch
    if (itemsByTab[tabObj.id]?.length) return;

    try {
      setLoadingTab(tabObj.id);
      setErrorTab(null);

      const params = {
        page: 1,
        limit: 10,
        category: tabObj.category,
      };

      const res = await axios.get(PRODUCTS_ENDPOINT, { params });
      const rawProducts = res?.data?.data || [];

      const mapped = rawProducts.map((p) => ({
        id: p._id, // unique id from backend
        title: p.name,
        image: getImageUrl(p.mainImage || p.galleryImages?.[0]),
        slug: p.slug,
      }));

      setItemsByTab((prev) => ({
        ...prev,
        [tabObj.id]: mapped,
      }));
    } catch (err) {
      console.error("ShopByCategory fetch error:", err);
      setErrorTab(tabObj.id);
    } finally {
      setLoadingTab(null);
    }
  };

  // initial load for default tab
  useEffect(() => {
    const defaultTab = TABS.find((t) => t.id === "bras");
    fetchTabProducts(defaultTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    const tabObj = TABS.find((t) => t.id === tabId);
    fetchTabProducts(tabObj);
  };

  // OPEN SINGLE PRODUCT PAGE BY UNIQUE ID
  const handleCardClick = (item) => {
    navigate(`/product/${item.id}`);
    // or slug: navigate(`/product/${item.slug}`);
  };

  const handleViewAll = () => {
    if (currentTab?.route) {
      navigate(currentTab.route);
    }
  };

  // react-slick settings – desktop: NO autoplay, mobile: autoplay
  const sliderSettings = {
    dots: false,
    infinite: items.length > 4,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: false, // ✅ desktop autoplay OFF
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 993,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 4500,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 4500,
        },
      },
    ],
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

        {/* Slider / state */}
        <div className={styles.sliderWrapper}>
          {loadingTab === activeTab && (
            <div className={styles.loadingText}>
              Loading {currentTab?.label}…
            </div>
          )}

          {errorTab === activeTab && (
            <div className={styles.errorText}>
              Failed to load {currentTab?.label}. Please try again.
            </div>
          )}

          {!loadingTab && !errorTab && items.length === 0 && (
            <div className={styles.emptyText}>
              No products found in {currentTab?.label}.
            </div>
          )}

          {!loadingTab && !errorTab && items.length > 0 && (
            <Slider {...sliderSettings} className={styles.cardsTrack}>
              {items.map((item) => (
                <div
                  key={item.id}
                  className={styles.card}
                  onClick={() => handleCardClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  <div className={styles.cardImageWrap}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.cardImage}
                    />
                  </div>

                  <button type="button" className={styles.cardLink}>
                    {item.title}
                    <span className={styles.cardArrow}>↗</span>
                  </button>
                </div>
              ))}
            </Slider>
          )}
        </div>

        {/* View all button */}
        <div className={styles.viewAllWrap}>
          <button
            type="button"
            className={styles.viewAllBtn}
            onClick={handleViewAll}
          >
            View All
            <span className={styles.viewAllArrow}>↗</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
