import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/styles/Footer.module.css';
import logo from '../assets/images/logo.png';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'Twitter', icon: '🐦', url: '#' },
    { name: 'Pinterest', icon: '📌', url: '#' }
  ];

  return (
    <footer className={styles.footer}>
      <div className="container">
        {/* Main Content Row */}
        <div className={`row ${styles.mainContent}`}>
          {/* Brand Section */}
          <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0">
            <div className={styles.brandSection}>
              <img src={logo} alt="House Of Intimacy" className={styles.logo} />
              <p className={styles.tagline}>
                Your trusted destination for premium lingerie and comfort wear.
              </p>
              
              {/* Social Links */}
              <div className={styles.socialLinks}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={styles.socialIcon}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="col-lg-2 col-md-6 col-6 mb-4 mb-lg-0">
            <h5 className={styles.sectionTitle}>
              <span className={styles.icon}>✉</span>
              CONTACT US
            </h5>
            <div className={styles.contactInfo}>
              <div className={styles.infoItem}>
                <span className={styles.label}>EMAIL:</span>
                <a href="mailto:clientcare@linger.com">clientcare@linger.com</a>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>PHONE:</span>
                <a href="tel:0123456789">0123-456-789</a>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.label}>HOURS:</span>
                <span className={styles.hourLine}>• Mon–Thu: 9 AM - 7 PM</span>
                <span className={styles.hourLine}>• Fri: 6 AM - 2 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6 col-6 mb-4 mb-lg-0">
            <h5 className={styles.sectionTitle}>
              <span className={styles.icon}>⚡</span>
              QUICK LINKS
            </h5>
            <ul className={styles.linkList}>
              <li><Link to="/about-us">→ About Us</Link></li>
              <li><Link to="/Blog">→ Blogs</Link></li>
              <li><Link to="/FAQ">→ FAQs</Link></li>
              <li><Link to="/terms">→ Terms & Conditions</Link></li>
              <li><Link to="/privacy-policy">→ Privacy Policy</Link></li>
              <li><Link to="/refund-policy">→ Return & Refund</Link></li>
              <li><Link to="/Contact-Us">→ Contact Us</Link></li>
            </ul>
          </div>

          {/* Shop Section */}
          <div className="col-lg-2 col-md-6 col-12 mb-4 mb-lg-0">
            <h5 className={styles.sectionTitle}>
              <span className={styles.icon}>🛍</span>
              SHOP
            </h5>
            <ul className={styles.shopList}>
              <li><Link to="/bra">BRA →</Link></li>
              <li><Link to="/panties">PANTIES</Link></li>
              <li><Link to="/athleisure">ATHLEISURE</Link></li>
              <li><Link to="/lounge">LOUNGE/SLEEP</Link></li>
              <li><Link to="/layering">LAYERING</Link></li>
              <li><Link to="/shapewear">SHAPEWEAR</Link></li>
              <li><Link to="/swimwear">SWIMWEAR</Link></li>
              <li><Link to="/accessories">ACCESSORIES</Link></li>
            </ul>
          </div>
           <div className="col-lg-3 col-md-6 col-12 mb-4 mb-lg-0">
            <div className={styles.newsletterCard}>
          <div className={styles.newsletterHeader}>
            <span className={styles.discountBadge}>15% OFF</span>
            <h3 className={styles.newsletterTitle}>Get Your First Order Discount</h3>
          </div>
          <p className={styles.newsletterSubtitle}>
            Be the first to know about new collections, exclusive offers, and style tips.
          </p>
          <form onSubmit={handleSubscribe} className={styles.newsletterForm}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className={styles.emailInput}
            />
            <button type="submit" className={styles.subscribeBtn}>
              Subscribe →
            </button>
          </form>
        </div>
          </div>
        </div>

        {/* Newsletter Card */}
       

        {/* Trust Badges */}
        <div className={styles.trustBadges}>
          <div className={styles.badge}>
            <span>🔒</span>
            <span>Secure Payment</span>
          </div>
          <div className={styles.badge}>
            <span>📦</span>
            <span>Free Shipping</span>
          </div>
          <div className={styles.badge}>
            <span>↩️</span>
            <span>Easy Returns</span>
          </div>
          <div className={styles.badge}>
            <span>💯</span>
            <span>Quality Guaranteed</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} House Of Intimacy. All rights reserved.
          </p>
          <div className={styles.bottomLinks}>
            <Link to="/privacy">Privacy</Link>
            <span>•</span>
            <Link to="/refund">Refund</Link>
            <span>•</span>
            <Link to="/terms">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}