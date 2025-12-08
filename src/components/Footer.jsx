import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/styles/Footer.module.css';
import logo from '../assets/images/logo.png';

export default function Footer() {
  return (
    <footer className={`${styles.footer}`}>
      <div className="container">
        {/* TOP SECTION */}
        <div className="row gy-4">
          {/* Logo */}
          <div className="col-lg-3 col-md-6 text-center text-md-start">
            <img src={logo} alt="Logo" className={styles.logo} />
            <p className={styles.desc}>
              Your trusted destination for premium lingerie and comfort wear.
            </p>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 col-6">
            <h5 className={styles.heading}>Contact Us</h5>
            <ul className={styles.list}>
              <li>Email: clientcare@linger.com</li>
              <li>Phone: 0123-456-789</li>
              <li>Mon–Thu: 9 AM - 7 PM</li>
              <li>Fri: 6 AM - 2 PM</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-lg-3 col-md-6 col-6">
            <h5 className={styles.heading}>Quick Links</h5>
            <ul className={styles.list}>
              <li>
                <Link to="/about-us">About Us</Link>
              </li>
              <li>
                <Link to="/Blog">Blogs</Link>
              </li>
              <li>
                <Link to="/FAQ">FAQs</Link>
              </li>
              <li>
                <Link to="/terms">Terms and Condition</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy and Policy</Link>
              </li>
              <li>
                <Link to="/refund-policy">Return and Refund policy</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          {/* Categories */}
          <div className="col-lg-3 col-md-6">
            <h5 className={styles.heading}>Shop</h5>
            <ul className={styles.list}>
              <li className={styles.dropdownItem}>
                <Link to="/bra">Bra</Link>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Preference</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/preference/padded">Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/non-padded">Non-Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wired">Wired</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wireless">Wireless</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Style</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/style/push-up">Push-Up</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/balconette">Balconette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/bralette">Bralette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/sports">Sports Bra</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Pattern</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/pattern/lace">Lace</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/mesh">Mesh</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/satin">Satin</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/cotton">Cotton</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/bodysuit">PANTIES</Link>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Preference</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/preference/padded">Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/non-padded">Non-Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wired">Wired</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wireless">Wireless</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Style</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/style/push-up">Push-Up</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/balconette">Balconette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/bralette">Bralette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/sports">Sports Bra</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Pattern</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/pattern/lace">Lace</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/mesh">Mesh</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/satin">Satin</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/cotton">Cotton</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/sets">ATHLEISURE</Link>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Preference</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/preference/padded">Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/non-padded">Non-Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wired">Wired</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wireless">Wireless</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Style</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/style/push-up">Push-Up</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/balconette">Balconette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/bralette">Bralette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/sports">Sports Bra</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Pattern</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/pattern/lace">Lace</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/mesh">Mesh</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/satin">Satin</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/cotton">Cotton</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/swim">LOUNGE/SLEEP</Link>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Preference</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/preference/padded">Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/non-padded">Non-Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wired">Wired</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wireless">Wireless</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Style</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/style/push-up">Push-Up</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/balconette">Balconette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/bralette">Bralette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/sports">Sports Bra</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Pattern</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/pattern/lace">Lace</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/mesh">Mesh</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/satin">Satin</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/cotton">Cotton</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/one-piece">LAYERING</Link>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Preference</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/preference/padded">Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/non-padded">Non-Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wired">Wired</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wireless">Wireless</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Style</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/style/push-up">Push-Up</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/balconette">Balconette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/bralette">Bralette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/sports">Sports Bra</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Pattern</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/pattern/lace">Lace</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/mesh">Mesh</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/satin">Satin</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/cotton">Cotton</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/one-piece">SHAPEWEAR</Link>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Preference</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/preference/padded">Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/non-padded">Non-Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wired">Wired</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wireless">Wireless</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Style</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/style/push-up">Push-Up</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/balconette">Balconette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/bralette">Bralette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/sports">Sports Bra</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Pattern</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/pattern/lace">Lace</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/mesh">Mesh</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/satin">Satin</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/cotton">Cotton</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/one-piece">SWIMWEAR</Link>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Preference</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/preference/padded">Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/non-padded">Non-Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wired">Wired</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wireless">Wireless</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Style</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/style/push-up">Push-Up</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/balconette">Balconette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/bralette">Bralette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/sports">Sports Bra</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Pattern</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/pattern/lace">Lace</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/mesh">Mesh</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/satin">Satin</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/cotton">Cotton</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/one-piece">ACCESSORIES</Link>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Preference</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/preference/padded">Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/non-padded">Non-Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wired">Wired</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wireless">Wireless</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Style</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/style/push-up">Push-Up</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/balconette">Balconette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/bralette">Bralette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/sports">Sports Bra</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Pattern</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/pattern/lace">Lace</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/mesh">Mesh</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/satin">Satin</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/cotton">Cotton</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li className={styles.dropdownItem}>
                <Link to="/one-piece">AMANTE SPECIALS</Link>
                <ul className={styles.dropdownMenu}>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Preference</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/preference/padded">Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/non-padded">Non-Padded</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wired">Wired</Link>
                      </li>
                      <li>
                        <Link to="/bra/preference/wireless">Wireless</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Style</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/style/push-up">Push-Up</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/balconette">Balconette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/bralette">Bralette</Link>
                      </li>
                      <li>
                        <Link to="/bra/style/sports">Sports Bra</Link>
                      </li>
                    </ul>
                  </li>
                  <li className={styles.nestedDropdownItem}>
                    <span className={styles.categoryTitle}>Pattern</span>
                    <ul className={styles.nestedDropdownMenu}>
                      <li>
                        <Link to="/bra/pattern/lace">Lace</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/mesh">Mesh</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/satin">Satin</Link>
                      </li>
                      <li>
                        <Link to="/bra/pattern/cotton">Cotton</Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>

        {/* NEWSLETTER */}
        <div className={`${styles.newsletterSection} py-4`}>
          <h5 className="mb-2">Get 15% Off Your First Order</h5>
          <p className={styles.desc}>
            Be the first to know about new collections and offers.
          </p>

          <div className="input-group mt-3">
            <input
              type="email"
              className="form-control"
              placeholder="Your email"
            />
            <button className="btn btnSubscribe">Subscribe →</button>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center mt-4 pt-3 border-top">
          <p className={styles.bottomText}>
            © {new Date().getFullYear()} House Of Intimacy. All rights reserved.
          </p>

          <div>
            <Link to="/privacy" className={styles.bottomLink}>
              Privacy
            </Link>
            <Link to="/refund" className={styles.bottomLink}>
              Refund
            </Link>
            <Link to="/terms" className={styles.bottomLink}>
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
