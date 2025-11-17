import React from "react";
import styles from "../assets/styles/Offermarquee.module.css";
import { useColorModeValue } from "@chakra-ui/react";

const Offermarquee = () => {
  // 🎨 Theme-aware colors
  const bg = useColorModeValue("#ffffffff", 'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');   // light / dark
  const text = useColorModeValue("#f5f5f5ff", 'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)'); // light / dark neon pink

  return (
    <section
      className={styles.offerMarquee}
      style={{ background: bg, color: text }}
    >
      <div className={styles.marquee}>
        <span className={styles.marqueeText}>
          BUY 2 GET 1 FREE&nbsp; BUY 2 GET 1 FREE&nbsp; BUY 2 GET 1 FREE&nbsp;
          BUY 2 GET 1 FREE&nbsp; BUY 2 GET 1 FREE&nbsp; BUY 2 GET 1 FREE&nbsp;
        </span>

        <span className={styles.marqueeText}>
          BUY 2 GET 1 FREE&nbsp; BUY 2 GET 1 FREE&nbsp; BUY 2 GET 1 FREE&nbsp;
          BUY 2 GET 1 FREE&nbsp; BUY 2 GET 1 FREE&nbsp; BUY 2 GET 1 FREE&nbsp;
        </span>
      </div>
    </section>
  );
};

export default Offermarquee;
