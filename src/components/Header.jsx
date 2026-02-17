// src/components/Header.jsx
import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  FiSearch,
  FiHeart,
  FiUser,
  FiShoppingBag,
  FiMenu,
  FiX,
  FiChevronDown,
} from 'react-icons/fi';
import { useNavigate, Link } from 'react-router-dom'; // ✅ imported Link

import logo from '../assets/images/House_of_intimacy_logo.webp';
import authSideImg from '../assets/images/auth_login.png';

import styles from '../assets/styles/Header.module.css';

import { WishlistContext } from '../contexts/WishlistContext';
import { CartContext } from '../contexts/CartContext';

import CartDrawer from './cart/CartDrawer';

const BRAS_MEGA = {
  columns: [
    {
      title: 'PREFERENCE',
      items: ['PADDED', 'WIRED', 'NON-WIRED', 'SPORTS BRA', 'STRAPLESS'],
      paths: ['/bras/padded', '/bras/wired', '/bras/non-wired', '/bras/sports', '/bras/strapless'],
    },
    {
      title: 'STYLE',
      items: [
        'T-SHIRT', 'PUSH UP', 'STRAPLESS/MULTIWAY',
        'MINIMISER', 'BRALETTES', 'SPORTS BRAS',
        'FULL FIGURE BRAS', 'SLIP ON BRA / LOUNGE',
      ],
      paths: [
        '/bras/t-shirt', '/bras/push-up', '/bras/strapless-multiway',
        '/bras/minimiser', '/bras/bralettes', '/bras/sports-bras',
        '/bras/full-figure', '/bras/slip-on',
      ],
    },
    {
      title: 'FABRIC',
      items: ['COTTON', 'LACE', 'MICRO-FIBER', 'SEAMLESS', 'SATIN'],
      paths: ['/bras/cotton', '/bras/lace', '/bras/microfiber', '/bras/seamless', '/bras/satin'],
    },
    {
      title: 'PATTERN',
      items: ['PRINTS', 'SOLID', 'NEW ARRIVALS', 'BEST SELLERS', 'ALL BRAS'],
      paths: ['/bras/prints', '/bras/solid', '/bras/new-arrivals', '/bras/best-sellers', '/bras'],
    },
  ],
};

const pantiesMega = {
  columns: [
    {
      title: 'PREFERENCE',
      items: [
        'BIKINI', 'HIPSTER', 'BOY SHORTS', 'THONG',
        'SEAMLESS', 'BRAZILLIAN', 'OCCASION', 'BRIDAL PANTIES',
      ],
      paths: [
        '/panties/bikini', '/panties/hipster', '/panties/boy-shorts', '/panties/thong',
        '/panties/seamless', '/panties/brazilian', '/panties/occasion', '/panties/bridal',
      ],
    },
    {
      title: 'PANTY PACK',
      items: [
        'PACK OF 2', 'PACK OF 3', 'PACK OF 5',
        'ALL PANTY PACKS', 'FABRIC', 'COTTON', 'LACE', 'MICRO-FIBER',
      ],
      paths: [
        '/panties/pack-2', '/panties/pack-3', '/panties/pack-5',
        '/panties/packs', '/panties', '/panties/cotton', '/panties/lace', '/panties/microfiber',
      ],
    },
    {
      title: 'PATTERN',
      items: ['PRINTS', 'SOLID', 'NEW ARRIVALS', 'BEST SELLERS', 'ALL PANTIES'],
      paths: ['/panties/prints', '/panties/solid', '/panties/new-arrivals', '/panties/best-sellers', '/panties'],
    },
  ],
};

const navItems = [
  { label: 'NEW SEASON', path: '/new-season' },
  { label: 'VAMIKA SPECIALS', path: '/vamika-special' },
  { label: 'BRAS', path: '/bras', mega: BRAS_MEGA },
  { label: 'PANTIES', path: '/panties', mega: pantiesMega },
  { label: 'ATHLEISURE', path: '/athleisure' },
  { label: 'LOUNGE/SLEEP', path: '/lounge-sleep' },
  { label: 'LAYERING', path: '/layering' },
  { label: 'SHAPEWEAR', path: '/shapewear' },
  { label: 'SWIMWEAR', path: '/swimwear' },
  { label: 'SALE', path: '/sale' },
  { label: 'ACCESSORIES', path: '/accessories' },
  { label: 'VAMIKA GALLERY', path: '/gallery' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [mobileMegaOpen, setMobileMegaOpen] = useState(null);

  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const megaTimeoutRef = useRef(null);

  const { cartCount } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const wishlistCount = wishlistItems.length;

  const authToken =
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  const rawName =
    localStorage.getItem('userName') ||
    sessionStorage.getItem('userName') ||
    localStorage.getItem('name') ||
    sessionStorage.getItem('name') ||
    '';

  const isLoggedIn = !!authToken;
  const displayName = rawName || 'Account';

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
    if (mobileOpen) setMobileMegaOpen(null);
  };

  // ✅ Debounced mega menu – prevents flicker when moving mouse between nav items
  const handleEnter = (item) => {
    clearTimeout(megaTimeoutRef.current);
    if (item.mega) setMegaOpen(item.label);
  };

  const handleLeave = () => {
    megaTimeoutRef.current = setTimeout(() => setMegaOpen(null), 120);
  };

  const openAuthModal = () => {
    setAuthModalOpen(true);
    setUserMenuOpen(false);
  };
  const closeAuthModal = () => setAuthModalOpen(false);

  const handleLogout = () => {
    ['authToken', 'userRole', 'userName', 'name'].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    setUserMenuOpen(false);
    setLogoutConfirmOpen(false);
    navigate('/');
  };

  // ✅ Close mobile nav on resize to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 992) {
        setMobileOpen(false);
        setMobileMegaOpen(null);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ✅ Close user dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ Lock body scroll when mobile nav is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header className={styles.header}>
        {/* ===== Top row ===== */}
        <div className={styles.topRow}>
          <button
            className={styles.menuBtn}
            onClick={toggleMobile}
            aria-label="Open navigation"
            aria-expanded={mobileOpen}
          >
            <FiMenu />
          </button>

          {/* ✅ Logo – Link, no page reload */}
          <Link to="/" className={styles.logo} aria-label="House Of Intimacy – Home">
            <img src={logo} alt="House Of Intimacy" className={styles.logoImg} />
          </Link>

          <div className={styles.iconGroup}>
            <button className={styles.iconBtn} aria-label="Search">
              <FiSearch />
            </button>

            {/* ✅ Wishlist – Link */}
            <Link to="/wishlist" className={styles.wishlistButton} aria-label="Wishlist">
              <FiHeart className={styles.wishlistIcon} />
              {wishlistCount > 0 && (
                <span className={styles.wishlistCount}>{wishlistCount}</span>
              )}
            </Link>

            {!isLoggedIn ? (
              <button className={styles.iconBtn} aria-label="Account" onClick={openAuthModal}>
                <FiUser />
              </button>
            ) : (
              <div className={styles.userMenuWrapper} ref={userMenuRef}>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.userBtn}`}
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-label="User menu"
                  aria-expanded={userMenuOpen}
                >
                  <span className={styles.userNameText}>{displayName}</span>
                  <FiChevronDown
                    className={`${styles.userArrow} ${userMenuOpen ? styles.userArrowOpen : ''}`}
                  />
                </button>

                {userMenuOpen && (
                  <div className={styles.userDropdown}>
                    {/* ✅ Link in dropdown */}
                    <Link
                      to="/account/profile"
                      className={styles.userDropdownItem}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/account/orders"
                      className={styles.userDropdownItem}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      type="button"
                      className={styles.userDropdownItem}
                      onClick={() => { setUserMenuOpen(false); setLogoutConfirmOpen(true); }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              className={`${styles.iconBtn} ${styles.iconBag}`}
              aria-label="Bag"
              onClick={() => setIsCartOpen(true)}
            >
              <FiShoppingBag />
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </button>
          </div>
        </div>

        {/* ===== Desktop nav row ===== */}
        <div className={styles.bottomRow}>
          <nav className={styles.navDesktop} aria-label="Main navigation">
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className={styles.navItem}
                  onMouseEnter={() => handleEnter(item)}
                  onMouseLeave={handleLeave}
                >
                  {/* ✅ Link instead of <a> */}
                  <Link to={item.path} className={styles.navLink}>
                    {item.label}
                    {item.mega && (
                      <FiChevronDown
                        className={`${styles.navChevron} ${megaOpen === item.label ? styles.navChevronOpen : ''}`}
                      />
                    )}
                  </Link>

                  {item.mega && megaOpen === item.label && (
                    <div
                      className={styles.megaMenu}
                      onMouseEnter={() => clearTimeout(megaTimeoutRef.current)}
                      onMouseLeave={handleLeave}
                    >
                      <div className={styles.megaInner}>
                        {item.mega.columns.map((col, colIdx) => (
                          <div className={styles.megaColumn} key={`${col.title}-${colIdx}`}>
                            <h4 className={styles.megaTitle}>{col.title}</h4>
                            <ul className={styles.megaList}>
                              {col.items.map((entry, i) => (
                                <li key={entry}>
                                  {/* ✅ Link inside mega menu */}
                                  <Link
                                    to={col.paths?.[i] || item.path}
                                    className={styles.megaLink}
                                    onClick={() => setMegaOpen(null)}
                                  >
                                    {entry}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        <div className={styles.megaPromo}>
                          <img src={authSideImg} alt="Bestsellers" className={styles.megaPromoImg} />
                          <Link
                            to={`${item.path}/best-sellers`}
                            className={styles.promoBtn}
                            onClick={() => setMegaOpen(null)}
                          >
                            Bestsellers →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ===== Mobile overlay ===== */}
        {mobileOpen && (
          <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />
        )}

        {/* ===== Mobile nav ===== */}
        <div
          className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ''}`}
          aria-hidden={!mobileOpen}
        >
          {/* ✅ Drawer header — logo + close button */}
          <div className={styles.drawerHeader}>
            <Link to="/" className={styles.drawerLogo} onClick={() => setMobileOpen(false)}>
              <img src={logo} alt="House Of Intimacy" className={styles.drawerLogoImg} />
            </Link>
            <button
              type="button"
              className={styles.drawerCloseBtn}
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <FiX />
            </button>
          </div>

          <div className={styles.mobileActions}>
            <button
              type="button"
              className={styles.mobileActionBtn}
              aria-label="Search"
              onClick={() => setMobileOpen(false)}
            >
              <FiSearch />
              <span>Search</span>
            </button>

            {/* ✅ Link in mobile actions */}
            <Link
              to="/wishlist"
              className={styles.mobileActionBtn}
              onClick={() => setMobileOpen(false)}
            >
              <FiHeart />
              <span>Wishlist</span>
              {wishlistCount > 0 && <span className={styles.mobileBadge}>{wishlistCount}</span>}
            </Link>

            {!isLoggedIn ? (
              <button
                type="button"
                className={styles.mobileActionBtn}
                onClick={() => { setMobileOpen(false); setAuthModalOpen(true); }}
              >
                <FiUser />
                <span>Login / Signup</span>
              </button>
            ) : (
              <Link
                to="/account/profile"
                className={styles.mobileActionBtn}
                onClick={() => setMobileOpen(false)}
              >
                <FiUser />
                <span>{displayName}</span>
              </Link>
            )}

            <button
              type="button"
              className={styles.mobileActionBtn}
              onClick={() => { setMobileOpen(false); setIsCartOpen(true); }}
            >
              <FiShoppingBag />
              <span>Bag</span>
              {cartCount > 0 && <span className={styles.mobileBadge}>{cartCount}</span>}
            </button>
          </div>

          <ul className={styles.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.label} className={styles.mobileNavItem}>
                {item.mega ? (
                  <>
                    <button
                      type="button"
                      className={styles.mobileNavLinkButton}
                      onClick={() =>
                        setMobileMegaOpen((prev) =>
                          prev === item.label ? null : item.label
                        )
                      }
                      aria-expanded={mobileMegaOpen === item.label}
                    >
                      <span>{item.label}</span>
                      <FiChevronDown
                        className={`${styles.mobileChevron} ${
                          mobileMegaOpen === item.label ? styles.mobileChevronOpen : ''
                        }`}
                      />
                    </button>

                    {mobileMegaOpen === item.label && (
                      <div className={styles.mobileMega}>
                        {/* ✅ Link to main category at top */}
                        <Link
                          to={item.path}
                          className={styles.mobileMegaViewAll}
                          onClick={() => setMobileOpen(false)}
                        >
                          View All {item.label} →
                        </Link>
                        {item.mega.columns.map((col, colIdx) => (
                          <div key={`${col.title}-${colIdx}`} className={styles.mobileMegaColumn}>
                            <div className={styles.mobileMegaTitle}>{col.title}</div>
                            <ul className={styles.mobileMegaList}>
                              {col.items.map((entry, i) => (
                                <li key={entry}>
                                  {/* ✅ Link in mobile mega */}
                                  <Link
                                    to={col.paths?.[i] || item.path}
                                    className={styles.mobileSubLink}
                                    onClick={() => setMobileOpen(false)}
                                  >
                                    {entry}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  /* ✅ Link for regular nav items */
                  <Link
                    to={item.path}
                    className={styles.mobileNavLinkButton}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div className={styles.mobileFooterLinks}>
            <Link to="/terms" onClick={() => setMobileOpen(false)}>Terms &amp; Conditions</Link>
            <Link to="/privacy" onClick={() => setMobileOpen(false)}>Privacy Policy</Link>
          </div>
        </div>

        {/* ===== Auth Modal ===== */}
        {authModalOpen && (
          <div
            className={styles.authOverlay}
            onClick={closeAuthModal}
            aria-modal="true"
            role="dialog"
          >
            <div className={styles.authModal} onClick={(e) => e.stopPropagation()}>
              <button className={styles.authCloseBtn} onClick={closeAuthModal} aria-label="Close">
                <FiX />
              </button>
              <div className={styles.authContent}>
                <div className={styles.authLeft}>
                  <img src={authSideImg} alt="Welcome to House Of Intimacy" className={styles.authLeftImg} />
                </div>
                <div className={styles.authRight}>
                  <div className={styles.authLogo}>House Of Intimacy</div>
                  <h2 className={styles.authHeading}>Welcome</h2>
                  <p className={styles.authSubheading}>Choose how you want to continue.</p>
                  <div className={styles.authButtonGroup}>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={() => { closeAuthModal(); navigate('/login'); }}
                    >
                      Already have an account? Login
                    </button>
                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => { closeAuthModal(); navigate('/auth/create_new_user'); }}
                    >
                      New to House Of Intimacy? Create account
                    </button>
                  </div>
                  <p className={styles.termsText}>
                    By continuing, you agree to our{' '}
                    <Link to="/terms" className={styles.termsLink} onClick={closeAuthModal}>
                      Terms &amp; Conditions
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className={styles.termsLink} onClick={closeAuthModal}>
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== Logout Confirm Modal ===== */}
        {logoutConfirmOpen && (
          <div
            className={styles.authOverlay}
            onClick={() => setLogoutConfirmOpen(false)}
            aria-modal="true"
            role="dialog"
          >
            <div className={styles.logoutModal} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.authCloseBtn}
                onClick={() => setLogoutConfirmOpen(false)}
                aria-label="Close"
              >
                <FiX />
              </button>
              <div className={styles.logoutContent}>
                <div className={styles.logoutIconCircle}>!</div>
                <h3 className={styles.logoutTitle}>Are you sure you want to logout?</h3>
                <p className={styles.logoutText}>
                  You&apos;ll be logged out from House Of Intimacy and will need to sign in again.
                </p>
                <div className={styles.logoutActions}>
                  <button type="button" className={styles.logoutYesBtn} onClick={handleLogout}>
                    Yes, Logout
                  </button>
                  <button
                    type="button"
                    className={styles.logoutNoBtn}
                    onClick={() => setLogoutConfirmOpen(false)}
                  >
                    No, Stay Logged In
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;