// src/components/NewArrival/NewArrival.jsx
import React from "react";
import Slider from "react-slick";
import { FiHeart, FiShoppingBag } from "react-icons/fi";

import styles from "../assets/styles/LingerieSection.module.css";

// 🔔 make sure somewhere in your app (e.g. index.js or App.js)
// you have imported slick css:
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// ---------- ASSETS (change paths as per your setup) ----------
import heroVideoPoster from "../assets/videos/IMG_3698.MP4"; // fallback poster
// If you have video:
import heroVideo from "../assets/videos/IMG_3698.MP4";

import prod1 from "../assets/images/17.jpg";
import prod2 from "../assets/images/19.jpg";
import prod3 from "../assets/images/5.jpg";
import prod4 from "../assets/images/17.jpg";
import prod5 from "../assets/images/19.jpg";

// ---------- DATA ----------
const PRODUCTS = [
  {
    id: 1,
    brand: "AMANTE",
    name: "Femme Lace Padded Non-Wired Demi Bra - Green Heron",
    mrp: "₹ 1769",
    image: prod1,
    colors: ["#0e4b4a", "#000000", "#c9b1a5"],
    moreColors: 2,
  },
  {
    id: 2,
    brand: "AMANTE",
    name: "Femme Lace Bikini Panty - Green Heron",
    mrp: "₹ 695",
    image: prod2,
    colors: ["#0e4b4a", "#3b3b98", "#7a1e6a"],
    moreColors: 1,
  },
  {
    id: 3,
    brand: "AMANTE",
    name: "Femme Lace Padded Non-Wired Demi Bra - Blackberry Cordial",
    mrp: "₹ 1769",
    image: prod3,
    colors: ["#4b235b", "#000000", "#d1b9d6"],
    moreColors: 2,
  },
  {
    id: 4,
    brand: "AMANTE",
    name: "Femme Lace Bikini Panty - Blackberry Cordial",
    mrp: "₹ 695",
    image: prod4,
    colors: ["#4b235b", "#000000", "#d1b9d6"],
    moreColors: 0,
  },
  {
    id: 5,
    brand: "AMANTE",
    name: "Soft Touch Non-Wired T-Shirt Bra",
    mrp: "₹ 1499",
    image: prod5,
    colors: ["#d88c93", "#000000", "#f5d2c6"],
    moreColors: 3,
  },
];

// ---------- CUSTOM ARROWS ----------
const NextArrow = (props) => {
  const { style, onClick } = props;
  return (
    <button
      type="button"
      className={`${styles.arrowBtn} ${styles.nextArrow}`}
      style={{ ...style }}
      onClick={onClick}
    >
      &gt;
    </button>
  );
};

const PrevArrow = (props) => {
  const { style, onClick } = props;
  return (
    <button
      type="button"
      className={`${styles.arrowBtn} ${styles.prevArrow}`}
      style={{ ...style }}
      onClick={onClick}
    >
      &lt;
    </button>
  );
};

const NewArrival = () => {
  const settings = {
    infinite: true,        // 🔁 now it loops infinitely
    speed: 500,
    slidesToShow: 4,       // 🟣 show 4 cards on desktop
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280,  // tablets / small laptops
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 992,   // large mobiles / tablets
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768,   // small mobiles
        settings: {
          slidesToShow: 1.2, // thoda sa partial card effect
        },
      },
    ],
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.title}>New Arrival</h2>

        <div className={styles.contentRow}>
          {/* LEFT FIXED VIDEO CARD */}
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

              <button type="button" className={styles.heroBtn}>
                Show Now
              </button>
            </div>
          </div>

          {/* RIGHT SLIDER */}
          <div className={styles.sliderWrapper}>
            <Slider {...settings}>
              {PRODUCTS.map((item) => (
                <div key={item.id} className={styles.slideOuter}>
                  <div className={styles.productCard}>
                    {/* top wishlist icon */}
                    <button className={styles.wishBtn} type="button">
                      <FiHeart />
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

                      <div className={styles.priceRow}>
                        <span className={styles.mrpLabel}>MRP</span>
                        <span className={styles.mrpValue}>{item.mrp}</span>
                      </div>

                      <div className={styles.bottomRow}>
                        <div className={styles.colorRow}>
                          {item.colors.map((c, idx) => (
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

                        <button className={styles.cartBtn} type="button">
                          <FiShoppingBag />
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

export default NewArrival;
