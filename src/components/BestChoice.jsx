// BestChoice.jsx
import React from "react";
import styles from "../assets/styles/BestChoice.module.css";
import img5 from "../assets/images/5.jpg";
import img17 from "../assets/images/17.jpg";
import img19 from "../assets/images/19.jpg";
import { useColorModeValue } from "@chakra-ui/react";

const items = [
  {
    id: 1,
    title: "Sand Dune One-piece Tankini",
    price: "$112.00",
    img: img5,
    thumb: img19,
  },
  {
    id: 2,
    title: "Sunburst Bikini",
    price: "$199.00",
    img: img17,
    thumb: img19,
  },
  {
    id: 3,
    title: "Tidal Temptation Bikini",
    priceOld: "$149.00",
    price: "$112.00",
    img: img19,
    thumb: img5,
  },
  {
    id: 4,
    title: "Tropicana Monokini",
    price: "$89.00",
    img: img5,
    thumb: img19,
  },
];

export default function BestChoice() {
  // 🌗 Chakra color-mode aware values
  const sectionBg = useColorModeValue("#ffffff", 'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');
  const sectionText = useColorModeValue("#0f172a", "#040505ff");
  const titleColor = useColorModeValue("#111827", "#060606ff");

  const cardOverlayBg = useColorModeValue(
    "rgba(255,255,255,0.9)",
    "rgba(15,23,42,0.9)"
  );
  const cardNameColor = useColorModeValue("#111827", "#e5e7eb");
  const priceNowColor = useColorModeValue("#111827", "#f9fafb");
  const priceOldColor = useColorModeValue("#9ca3af", "#6b7280");

  const arrowBg = useColorModeValue("#f3f4f6", "#111827");
  const arrowColor = useColorModeValue("#111827", "#e5e7eb");
  const arrowBorder = useColorModeValue("#e5e7eb", "#1f2937");

  const btnGhostBorder = useColorModeValue("#111827", "#e5e7eb");
  const btnGhostText = useColorModeValue("#111827", "#0d0d0dff");

  return (
    <section
      className={styles.bestChoiceSection}
      style={{ background: sectionBg, color: sectionText }}
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.bcHeader}>
          <h2 className={styles.bcTitle} style={{ color: titleColor }}>
            Best Choice
          </h2>

          <div className={styles.bcControls} aria-hidden>
            <button
              className={styles.bcArrow}
              title="previous"
              aria-label="previous"
              type="button"
              style={{
                background: arrowBg,
                color: arrowColor,
                borderColor: arrowBorder,
              }}
            >
              ‹
            </button>
            <button
              className={styles.bcArrow}
              title="next"
              aria-label="next"
              type="button"
              style={{
                background: arrowBg,
                color: arrowColor,
                borderColor: arrowBorder,
              }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className={styles.bcGrid}>
          {items.map((it) => (
            <article key={it.id} className={styles.bcCard}>
              <div
                className={styles.bcImage}
                style={{ backgroundImage: `url(${it.img})` }}
                role="img"
                aria-label={it.title}
              />

              <div
                className={styles.bcOverlay}
                style={{ background: cardOverlayBg }}
              >
                <img
                  className={styles.bcThumb}
                  src={it.thumb}
                  alt={`${it.title} thumbnail`}
                />

                <div className={styles.bcMeta}>
                  <div
                    className={styles.bcName}
                    style={{ color: cardNameColor }}
                  >
                    {it.title}
                  </div>

                  <div className={styles.bcPrice}>
                    {it.priceOld && (
                      <span
                        className={styles.old}
                        style={{ color: priceOldColor }}
                      >
                        {it.priceOld}
                      </span>
                    )}
                    <span
                      className={styles.now}
                      style={{ color: priceNowColor }}
                    >
                      {it.price || it.price}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.bcCta}>
          <a
            href="/products"
            className={styles.btnGhost}
            style={{
              borderColor: btnGhostBorder,
              color: btnGhostText,
            }}
          >
            SEE ALL PRODUCTS
          </a>
        </div>
      </div>
    </section>
  );
}
