import React from "react";
import styles from "../assets/styles/Bestsellers.module.css";
import img5 from "../assets/images/5.jpg";
import img17 from "../assets/images/17.jpg";
import img19 from "../assets/images/19.jpg";
import { useColorModeValue } from "@chakra-ui/react";

const products = [
  {
    id: 1,
    name: "Nautical Nymph Bikini",
    price: "$149.00",
    image: img5,
    colors: [img17, img19],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Seaside Sensation One-piece Monokini",
    price: "$119.00",
    image: img17,
    badge: "Pre-order",
    colors: [img17, img19],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: 3,
    name: "Island Escape Bikini",
    price: "$189.00",
    image: img19,
    badge: "Pre-order",
    colors: [img17, img19],
    sizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    id: 4,
    name: "Sunburst Bikini",
    price: "$199.00",
    image: img5,
    badge: "Pre-order",
    colors: [img17, img19],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: 5,
    name: "Wave Rider Rash Guard Bikini",
    price: "$79.00",
    image: img17,
    badge: "Pre-order",
    colors: [img17, img19],
    sizes: ["XS", "S", "M", "L", "2XL"],
  },
  {
    id: 6,
    name: "Sand Dune One-piece Tankini",
    price: "$112.00",
    image: img19,
    colors: [img17, img19],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
  {
    id: 7,
    name: "Island Escape Bikini",
    price: "$189.00",
    image: img5,
    badge: "Pre-order",
    colors: [img17, img19],
    sizes: ["S", "M", "L", "XL", "2XL"],
  },
  {
    id: 8,
    name: "Sunburst Bikini",
    price: "$199.00",
    image: img17,
    badge: "Pre-order",
    colors: [img17, img19],
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
  },
];

const Bestsellers = () => {
  // 🌗 Chakra color-mode aware values
  const sectionBg = useColorModeValue("#ffffff", 'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');
  const sectionText = useColorModeValue("#0f172a", "#0c0c0cff");
  const headingColor = useColorModeValue("#111827", "#0f0f0fff");

  const cardBg = useColorModeValue("#f9fafb", 'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');
  const cardBorder = useColorModeValue("#e5e7eb",'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');

  const productNameColor = useColorModeValue("#111827", "#030303ff");
  const productPriceColor = useColorModeValue("#111827", "#080808ff");

  const badgeBg = useColorModeValue("#111827", "#f9fafb");
  const badgeText = useColorModeValue("#f9fafb", "#020617");

  const sizeBtnBg = useColorModeValue("#ffffff", "#020617");
  const sizeBtnText = useColorModeValue("#111827", "#e5e7eb");
  const sizeBtnBorder = useColorModeValue("#e5e7eb", "#1f2937");

  const navBtnBorder = useColorModeValue("#d1d5db", "#4b5563");
  const navBtnColor = useColorModeValue("#4b5563", "#070708ff");

  return (
    <section
      className={styles.bestsellers}
      style={{ background: sectionBg, color: sectionText }}
    >
      <div className="container">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0" style={{ color: headingColor }}>
            Bestsellers
          </h2>

          <div className="btn-group d-flex gap-4" role="group" aria-label="carousel nav">
            <button
              className={`btn btn-outline-secondary ${styles.navBtn}`}
              type="button"
              style={{
                borderColor: navBtnBorder,
                color: navBtnColor,
              }}
            >
              ←
            </button>
            <button
              className={`btn btn-outline-secondary ${styles.navBtn}`}
              type="button"
              style={{
                borderColor: navBtnBorder,
                color: navBtnColor,
              }}
            >
              →
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="row gx-4 gy-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="col-12 col-sm-6 col-md-4 col-lg-3"
            >
              <div
                className={`${styles.productCard} card h-100 border-0`}
                style={{
                  background: cardBg,
                  borderColor: cardBorder,
                }}
              >
                <div className={`${styles.imageWrapper} position-relative`}>
                  {product.badge && (
                    <span
                      className={`${styles.badgeCustom} position-absolute`}
                      style={{
                        background: badgeBg,
                        color: badgeText,
                      }}
                    >
                      {product.badge}
                    </span>
                  )}

                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                  />
                </div>

                <div className="card-body pt-3 pb-3">
                  <h6
                    className={`${styles.productName} mb-1`}
                    style={{ color: productNameColor }}
                  >
                    {product.name}
                  </h6>
                  <p
                    className={`${styles.productPrice} mb-2`}
                    style={{ color: productPriceColor }}
                  >
                    {product.price}
                  </p>

                  {product.colors && (
                    <div className={`${styles.colorSwatches} mb-2`}>
                      {product.colors.map((c, idx) => (
                        <img
                          key={idx}
                          src={c}
                          alt={`color-${idx}`}
                          className={`${styles.colorThumb} me-2`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="sizes d-flex flex-wrap gap-2">
                    {product.sizes.map((size, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`btn ${styles.sizeBtn}`}
                        style={{
                          background: sizeBtnBg,
                          color: sizeBtnText,
                          borderColor: sizeBtnBorder,
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Bestsellers;
