import React, { useState } from "react";
import styles from "../assets/styles/ColorsSelector.module.css";
import { useColorModeValue } from "@chakra-ui/react";

const defaultColors = [
  { id: "blush", name: "BLUSH RUSH", hex: "#ff6fb6" },
  { id: "desert", name: "DESERT MOSS", hex: "#c9c27a" },
  { id: "midnight", name: "MIDNIGHT", hex: "#000000" },
  { id: "scarlet", name: "SCARLET HEAT", hex: "#c43b28" },
  { id: "pearl", name: "SOFT PEARL", hex: "#f5f2ef" },
  { id: "tropic", name: "TROPIC MIX", hex: "#2fb24a" },
  { id: "coastal", name: "COASTAL SKY", hex: "#2060ff" },
  { id: "lemon", name: "LEMON BLUSH", hex: "#ffc84b" },
  { id: "cocoa", name: "COCOA CLAY", hex: "#7a3f12" },
  { id: "ink", name: "INK STRIPE", hex: "pattern" }, // special pattern
];

const ColorsSelector = ({ items = defaultColors, onChange }) => {
  const [selected, setSelected] = useState(items[0]?.id ?? null);

  // 🎨 Chakra color-mode aware values
  const sectionBg = useColorModeValue("#f9fafb", 'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)'); // light / dark bg
  const titleColor = useColorModeValue("#0f172a", "#090909ff");
  const labelColor = useColorModeValue("#111827", "#e5e7eb");
  const pillBg = useColorModeValue("#ffffff", "rgba(83, 88, 100, 0.85)");
  const pillBorder = useColorModeValue("#e5e7eb", "#78808cff");
  const pillSelectedBg = useColorModeValue("#0f172a", "#f9fafb");
  const pillSelectedText = useColorModeValue("#f9fafb", "#020617");
  const dotBorder = useColorModeValue("#e5e7eb", "#858d9aff");

  const handleSelect = (id) => {
    setSelected(id);
    if (typeof onChange === "function") onChange(id);
  };

  const handleKeyDown = (e, id, idx) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelect(id);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = items[(idx + 1) % items.length];
      document.getElementById(`pill-${next.id}`)?.focus();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prev = items[(idx - 1 + items.length) % items.length];
      document.getElementById(`pill-${prev.id}`)?.focus();
    }
  };

  return (
    <section
      className={styles["colors-section"]}
      aria-label="Color selector"
      style={{ background: sectionBg, color: labelColor }}
    >
      <div className={styles["colors-container"]}>
        <div className={styles["colors-left"]}>
          <h2
            className={styles["colors-title"]}
            style={{ color: titleColor }}
          >
            Your Color, Your Mood
          </h2>
        </div>

        <div
          className={styles["colors-right"]}
          role="list"
          aria-label="Available colors"
        >
          {items.map((c, idx) => {
            const isSelected = selected === c.id;
            const pillId = `pill-${c.id}`;

            return (
              <button
                key={c.id}
                id={pillId}
                role="listitem"
                type="button"
                className={`${styles["color-pill"]} ${
                  isSelected ? styles.selected : ""
                }`}
                style={{
                  background: isSelected ? pillSelectedBg : pillBg,
                  borderColor: pillBorder,
                  color: isSelected ? pillSelectedText : labelColor,
                }}
                aria-pressed={isSelected}
                onClick={() => handleSelect(c.id)}
                onKeyDown={(e) => handleKeyDown(e, c.id, idx)}
              >
                {c.hex === "pattern" ? (
                  <span
                    className={`${styles.dot} ${styles["dot-pattern"]}`}
                    aria-hidden="true"
                    style={{
                      borderColor: dotBorder,
                    }}
                  />
                ) : (
                  <span
                    className={styles.dot}
                    style={{
                      background: c.hex,
                      borderColor: dotBorder,
                    }}
                    aria-hidden="true"
                  />
                )}
                <span className={styles.label}>
                  {c.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ColorsSelector;
