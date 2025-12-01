import React from "react";
import styles from "../assets/styles/Footer.module.css";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useColorModeValue } from "@chakra-ui/react";

export default function Footer() {
  // Chakra color mode values
  const bg = useColorModeValue("#ffffffff",'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');
  const text = useColorModeValue("#123", "#000000ff");
  const linkColor = useColorModeValue("#334", "#000000ff");
  const mutedText = useColorModeValue("#556", "#000000ff");

  return (
    <footer
      className={`${styles["site-footer"]} pt-5`}
      style={{ background: bg, color: text }}
    >
      <div className={`${styles.footerContainer} container-fluid `}>

        {/* FOOTER TOP */}
        <div className={`row gy-4 ${styles["footer-top"]}`}>

          <div className="col-lg-2 col-md-6 text-center">
            <img src={logo} alt="FLUTE" className={styles["footer-logo"]} />
          </div>

          <div className="col-lg-4 col-md-6">
            <h5 className="mb-3">Contact Us</h5>
            <p className="mb-1" style={{ color: mutedText }}>Email: clientcare@linger.com</p>
            <p className="mb-1" style={{ color: mutedText }}>Phone: 0123-456-789</p>
            <p className="mb-1" style={{ color: mutedText }}>Hours: Mon–Thu: 9 AM - 7 PM ET</p>
            <p className="mb-3" style={{ color: mutedText }}>Friday: 6 AM - 2 PM ET</p>

           
          </div>

          {/* COLUMN LINKS */}
          <div className="col-lg-2 col-md-6">
            <h5 className="mb-3">Quick links</h5>
            <ul className={`list-unstyled ${styles["footer-links"]}`}>
              <li><Link to="/about-us" style={{ color: linkColor }}>About Us</Link></li>
              <li><Link to="/faq" style={{ color: linkColor }}>FAQs</Link></li>
              <li><Link to="/blogs" style={{ color: linkColor }}>Blogs</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="mb-3">Extras</h5>
            <ul className={`list-unstyled ${styles["footer-links"]}`}>
              <li><Link to="/bodysuit" style={{ color: linkColor }}>Bodysuit</Link></li>
              <li><Link to="/sets" style={{ color: linkColor }}>Lingerie Sets</Link></li>
              <li><Link to="/swim" style={{ color: linkColor }}>Swimwear</Link></li>
              <li><Link to="/one-piece" style={{ color: linkColor }}>One Piece</Link></li>
            </ul>
          </div>

          <div className="col-lg-2 col-md-6">
            <h5 className="mb-3">Our Service</h5>
            <ul className={`list-unstyled ${styles["footer-links"]}`}>
              <li><Link to="/ContactUs" style={{ color: linkColor }}>Contact Us</Link></li>
              <li><Link to="/privacy-policy" style={{ color: linkColor }}>Privacy Policy</Link></li>
              <li><Link to="/refund-policy" style={{ color: linkColor }}>Refund Policy</Link></li>
              <li><Link to="/terms" style={{ color: linkColor }}>Terms Of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* FOOTER MID */}
        <div className={`${styles["footer-mid"]} border-top border-bottom py-4 mt-4`}>
          <div className="row align-items-center">
            <div className="col-lg-3 col-md-5">
              <h5 className="mb-3">Get 15% Off Your First Order</h5>
              <p className="small mb-2" style={{ color: mutedText }}>
                Be the first to know about new collections and offers.
              </p>

              <div className={`input-group ${styles.newsletter}`}>
                <input type="email" className="form-control" placeholder="Your email" />
                <button className={`btn btn-dark  ${styles["subscribe-btn"]}`}>
                  Subscribe →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER BOTTOM */}
        <div className={`py-3 d-flex flex-column flex-sm-row justify-content-between align-items-center ${styles["footer-bottom"]}`}>
          <div className="small" style={{ color: mutedText }}>
            © {new Date().getFullYear()}, House Of Intimacy. All rights reserved.
          </div>

          <div className={styles["bottom-links"]}>
            <Link to="/privacy" style={{ color: mutedText }} className="me-3 small">Privacy policy</Link>
            <Link to="/refund" style={{ color: mutedText }} className="me-3 small">Refund policy</Link>
            <Link to="/terms" style={{ color: mutedText }} className="small">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
