import React from "react";
import styles from "../assets/styles/Swimwear.module.css";
import img5 from "../assets/images/5.jpg";
import img17 from "../assets/images/17.jpg";
import img19 from "../assets/images/19.jpg";
import { useColorModeValue } from "@chakra-ui/react";

const products = [
  {
    id: 1,
    name: "Tropic Tides Ring Wrap Bikini Set",
    image: img5,
    price: "Rs. 1,649.99",
    originalPrice: "Rs. 1,699.99",
    colors: [img5, img19, img17, img5],
  },
  {
    id: 2,
    name: "Sunset Mirage Cut-Out Bikini Set",
    image: img17,
    price: "Rs. 2,249.00",
    originalPrice: "Rs. 2,399.00",
    colors: [img5, img19, img17, img5],
  },
  {
    id: 3,
    name: "Textured Square-Neck Bikini Set",
    image: img5,
    price: "Rs. 2,499.99",
    originalPrice: "Rs. 2,649.00",
    colors: [img5, img19, img17, img5],
  },
  {
    id: 4,
    name: "Textured Triangle Bikini Set",
    image: img19,
    price: "Rs. 1,799.99",
    originalPrice: "Rs. 1,999.99",
    colors: [img5, img19, img17, img5],
  },
];

const SwimwearSection = () => {
  // Chakra color-mode aware values
  const sectionBg = useColorModeValue("#ffffff", 'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');
  const sectionText = useColorModeValue("#0f172a", "#0c0c0cff");
  const cardBg = useColorModeValue("#f9fafb", 'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');
  const cardBorder = useColorModeValue("#e5e7eb", "#1f2937");
  const priceColor = useColorModeValue("#111827", "#080808ff");
  const originalPriceColor = useColorModeValue("#6b7280", "#9ca3af");
  const buttonBg = useColorModeValue("#111827", "#e5e7eb");
  const buttonText = useColorModeValue("#f9fafb", "#020617");
  const iconStroke = useColorModeValue("#111827", "#000000ff");

  return (
    <section
      className={styles.swimwearSection}
      style={{ background: sectionBg, color: sectionText }}
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{`Effortless Comfort, Bold Confidence`}</h2>

          <div className={styles.headerButtons}>
            <button
              className={styles.btnViewAll}
              style={{ background: buttonBg, color: buttonText }}
            >
              View All Newest Products
              <span className={styles.arrowIcon}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={iconStroke}
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </button>

            <div className={styles.navButtons}>
              <button className={styles.btnNav}>
                <svg viewBox="0 0 24 24" fill="none" stroke={iconStroke}>
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <button className={styles.btnNav}>
                <svg viewBox="0 0 24 24" fill="none" stroke={iconStroke}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className={styles.productGrid}>
          {products.map((product) => (
            <div
              key={product.id}
              className={styles.productCard}
              style={{
                background: cardBg,
                borderColor: cardBorder,
              }}
            >
              <div className={styles.productImageWrapper}>
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />

                <button
                  className={styles.quickViewBtn}
                  title="Quick View"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={iconStroke}
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
              </div>

              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>

                <div className={styles.productPricing}>
                  <span
                    className={styles.productPrice}
                    style={{ color: priceColor }}
                  >
                    From {product.price}
                  </span>
                  <span
                    className={styles.productOriginalPrice}
                    style={{ color: originalPriceColor }}
                  >
                    {product.originalPrice}
                  </span>
                </div>

                <div className={styles.colorSwatches}>
                  {product.colors.map((color, idx) => (
                    <img
                      key={idx}
                      src={color}
                      className={styles.colorThumb}
                      alt=""
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SwimwearSection;
