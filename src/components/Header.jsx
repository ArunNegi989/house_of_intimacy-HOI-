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
import { useNavigate } from 'react-router-dom';

import logo from '../assets/images/House_of_intimacy_logo.webp';
import authSideImg from '../assets/images/auth_login.png';

import styles from '../assets/styles/Header.module.css';

// ✅ contexts
import { WishlistContext } from '../contexts/WishlistContext';
import { CartContext } from '../contexts/CartContext';

// ✅ cart drawer
import CartDrawer from './cart/CartDrawer';

const BRAS_MEGA = {
  columns: [
    {
      title: 'PREFERENCE',
      items: ['PADDED', 'WIRED', 'NON-WIRED', 'SPORTS BRA', 'STRAPLESS'],
    },
    {
      title: 'STYLE',
      items: [
        'T-SHIRT',
        'PUSH UP',
        'STRAPLESS/MULTIWAY ',
        'MINIMISER',
        'BRALETTES',
        'SPORTS BRAS',
        'FULL FIGURE BRAS',
        'SLIP ON BRA / LOUNGE',
      ],
    },
    {
      title: 'STYLE',
      items: [
        'T-SHIRT',
        'PUSH UP',
        'STRAPLESS/MULTIWAY ',
        'MINIMISER',
        'BRALETTES',
        'SPORTS BRAS',
        'FULL FIGURE BRAS',
        'SLIP ON BRA / LOUNGE',
      ],
    },
    {
      title: 'STYLE',
      items: [
        'T-SHIRT',
        'PUSH UP',
        'STRAPLESS/MULTIWAY ',
        'MINIMISER',
        'BRALETTES',
        'SPORTS BRAS',
        'FULL FIGURE BRAS',
        'SLIP ON BRA / LOUNGE',
      ],
    },
    {
      title: 'PATTERN',
      items: ['PRINTS', 'SOLID', 'NEW ARRIVALS', 'BEST SELLERS', 'ALL PANTIES'],
    },
  ],
};

const pantiesMega = {
  columns: [
    {
      title: 'PREFERENCE',
      items: [
        'BIKINI',
        'HIPSTER',
        'BOY SHORTS',
        'THONG',
        'SEAMLESS',
        'BRAZILLIAN',
        'OCCASION',
        'BRIDAL PANTIES',
      ],
    },
    {
      title: 'PANTY PACK',
      items: [
        'PACK OF 2',
        'PACK OF 3',
        'PACK OF 5',
        'ALL PANTY PACKS',
        'LATEST PANTY PACK',
        'FABRIC',
        'COTTON',
        'LACE',
        'MICRO-FIBER',
      ],
    },
    {
      title: 'PATTERN',
      items: ['PRINTS', 'SOLID', 'NEW ARRIVALS', 'BEST SELLERS', 'ALL PANTIES'],
    },
  ],
};

const navItems = [
  { label: 'NEW SEASON', path: '/new-season' },
  { label: 'BRAS', path: '#', mega: BRAS_MEGA },
  { label: 'PANTIES', path: '#', mega: pantiesMega },
  { label: 'ATHLEISURE', path: '/athleisure' },
  { label: 'LOUNGE/SLEEP', path: '/lounge-sleep' },
  { label: 'LAYERING', path: '/layering' },
  { label: 'SHAPEWEAR', path: '/shapewear' },
  { label: 'SWIMWEAR', path: '/swimwear' },
  { label: 'SALE', path: '/sale' },
  { label: 'ACCESSORIES', path: '/accessories' },
  { label: 'AMANTÉ SPECIALS', path: '/specials' },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // ✅ cart drawer open/close
  const [isCartOpen, setIsCartOpen] = useState(false);

  // ⭐ NEW: which mega group is open in mobile dropdown
  const [mobileMegaOpen, setMobileMegaOpen] = useState(null);

  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const { cartCount } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const wishlistCount = wishlistItems.length;

  // ---- Auth state from storage ----
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

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const handleEnter = (item) => {
    if (item.mega) setMegaOpen(item.label);
  };

  const handleLeave = () => {
    setMegaOpen(null);
  };

  const openAuthModal = () => {
    setAuthModalOpen(true);
    setUserMenuOpen(false);
  };

  const closeAuthModal = () => setAuthModalOpen(false);

  const handleOverlayClick = () => {
    closeAuthModal();
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('name');

    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('userName');
    sessionStorage.removeItem('name');

    setUserMenuOpen(false);
    setLogoutConfirmOpen(false);
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className={styles.header}>
        {/* ===== Top row ===== */}
        <div className={styles.topRow}>
          <button
            className={styles.menuBtn}
            onClick={toggleMobile}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>

          <div
            className={styles.logo}
            onClick={handleLogoClick}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={logo}
              alt="House Of Intimacy"
              className={styles.logoImg}
            />
          </div>

          <div className={styles.iconGroup}>
            <button className={styles.iconBtn} aria-label="Search">
              <FiSearch />
            </button>

            {/* Wishlist */}
            <button
              type="button"
              className={styles.wishlistButton}
              onClick={() => navigate('/wishlist')}
            >
              <FiHeart className={styles.wishlistIcon} />
              {wishlistCount > 0 && (
                <span className={styles.wishlistCount}>{wishlistCount}</span>
              )}
            </button>

            {/* Auth / User */}
            {!isLoggedIn && (
              <button
                className={styles.iconBtn}
                aria-label="Account"
                onClick={openAuthModal}
              >
                <FiUser />
              </button>
            )}

            {isLoggedIn && (
              <div className={styles.userMenuWrapper} ref={userMenuRef}>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${styles.userBtn}`}
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  aria-label="User menu"
                >
                  <span className={styles.userNameText}>{displayName}</span>
                  <FiChevronDown className={styles.userArrow} />
                </button>

                {userMenuOpen && (
  <div className={styles.userDropdown}>
    <button
      type="button"
      className={styles.userDropdownItem}
      onClick={() => {
        setUserMenuOpen(false);
        navigate('/account/profile');
      }}
    >
      My Account
    </button>

    <button
      type="button"
      className={styles.userDropdownItem}
      onClick={() => {
        setUserMenuOpen(false);
        navigate('/account/orders'); // ⭐ NEW - My Orders page
      }}
    >
      My Orders
    </button>

    <button
      type="button"
      className={styles.userDropdownItem}
      onClick={() => {
        setUserMenuOpen(false);
        setLogoutConfirmOpen(true);
      }}
    >
      Logout
    </button>
  </div>
)}

              </div>
            )}

            {/* 🛍 Bag – opens cart drawer */}
            <button
              className={`${styles.iconBtn} ${styles.iconBag}`}
              aria-label="Bag"
              onClick={() => setIsCartOpen(true)}
            >
              <FiShoppingBag />
              {cartCount > 0 && (
                <span className={styles.badge}>{cartCount}</span>
              )}
            </button>
          </div>
        </div>

        {/* ===== Desktop nav row ===== */}
        <div className={styles.bottomRow}>
          <nav className={styles.navDesktop}>
            <ul className={styles.navList}>
              {navItems.map((item) => (
                <li
                  key={item.label}
                  className={styles.navItem}
                  onMouseEnter={() => handleEnter(item)}
                  onMouseLeave={handleLeave}
                >
                  <a href={item.path} className={styles.navLink}>
                    {item.label}
                  </a>

                  {item.mega && megaOpen === item.label && (
                    <div className={styles.megaMenu}>
                      <div className={styles.megaInner}>
                        {item.mega.columns.map((col) => (
                          <div className={styles.megaColumn} key={col.title}>
                            <h4 className={styles.megaTitle}>{col.title}</h4>
                            <ul className={styles.megaList}>
                              {col.items.map((entry) => (
                                <li key={entry}>
                                  <a href="/" className={styles.megaLink}>
                                    {entry}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}

                        <div className={styles.megaPromo}>
                          <img
                            src={authSideImg}
                            alt="Bestsellers"
                            className={styles.megaPromoImg}
                          />
                          <button className={styles.promoBtn}>
                            Bestsellers →
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ===== Mobile nav ===== */}
        <div
          className={`${styles.mobileNav} ${
            mobileOpen ? styles.mobileNavOpen : ''
          }`}
        >
          {/* 🔹 Top actions (search, wishlist, account, bag) */}
          <div className={styles.mobileActions}>
            <button
              type="button"
              className={styles.mobileActionBtn}
              aria-label="Search"
              onClick={() => {
                // later you can open a search modal here
                setMobileOpen(false);
              }}
            >
              <FiSearch />
              <span>Search</span>
            </button>

            <button
              type="button"
              className={styles.mobileActionBtn}
              onClick={() => {
                setMobileOpen(false);
                navigate('/wishlist');
              }}
            >
              <FiHeart />
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className={styles.mobileBadge}>{wishlistCount}</span>
              )}
            </button>

            {!isLoggedIn && (
              <button
                type="button"
                className={styles.mobileActionBtn}
                onClick={() => {
                  setMobileOpen(false);
                  setAuthModalOpen(true);
                }}
              >
                <FiUser />
                <span>Login / Signup</span>
              </button>
            )}

            {isLoggedIn && (
              <button
                type="button"
                className={styles.mobileActionBtn}
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/account/profile');
                }}
              >
                <FiUser />
                <span>{displayName}</span>
              </button>
            )}

            <button
              type="button"
              className={styles.mobileActionBtn}
              onClick={() => {
                setMobileOpen(false);
                setIsCartOpen(true);
              }}
            >
              <FiShoppingBag />
              <span>Bag</span>
              {cartCount > 0 && (
                <span className={styles.mobileBadge}>{cartCount}</span>
              )}
            </button>
          </div>

          {/* 🔹 Category list with expandable subcategories */}
          <ul className={styles.mobileNavList}>
            {navItems.map((item) => (
              <li key={item.label} className={styles.mobileNavItem}>
                {/* If item has mega menu → accordion style */}
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
                    >
                      <span>{item.label}</span>
                      <FiChevronDown
                        className={`${styles.mobileChevron} ${
                          mobileMegaOpen === item.label
                            ? styles.mobileChevronOpen
                            : ''
                        }`}
                      />
                    </button>

                    {mobileMegaOpen === item.label && (
                      <div className={styles.mobileMega}>
                        {item.mega.columns.map((col) => (
                          <div
                            key={col.title}
                            className={styles.mobileMegaColumn}
                          >
                            <div className={styles.mobileMegaTitle}>
                              {col.title}
                            </div>
                            <ul className={styles.mobileMegaList}>
                              {col.items.map((entry) => (
                                <li key={entry}>
                                  <button
                                    type="button"
                                    className={styles.mobileSubLink}
                                    onClick={() => {
                                      // TODO: hook up real routes/filters
                                      setMobileOpen(false);
                                      // Example: navigate('/bras');
                                    }}
                                  >
                                    {entry}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Normal non-mega items
                  <button
                    type="button"
                    className={styles.mobileNavLinkButton}
                    onClick={() => {
                      setMobileOpen(false);
                      navigate(item.path);
                    }}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ===== Auth Modal ===== */}
        {authModalOpen && (
          <div
            className={styles.authOverlay}
            onClick={handleOverlayClick}
            aria-modal="true"
            role="dialog"
          >
            <div className={styles.authModal} onClick={handleModalContentClick}>
              <button
                className={styles.authCloseBtn}
                onClick={closeAuthModal}
                aria-label="Close"
              >
                <FiX />
              </button>

              <div className={styles.authContent}>
                <div className={styles.authLeft}>
                  <img
                    src={authSideImg}
                    alt="Welcome to House Of Intimacy"
                    className={styles.authLeftImg}
                  />
                </div>

                <div className={styles.authRight}>
                  <div className={styles.authLogo}>House Of Intimacy</div>

                  <h2 className={styles.authHeading}>Welcome</h2>
                  <p className={styles.authSubheading}>
                    Choose how you want to continue.
                  </p>

                  <div className={styles.authButtonGroup}>
                    <button
                      type="button"
                      className={styles.primaryBtn}
                      onClick={() => {
                        closeAuthModal();
                        navigate('/login');
                      }}
                    >
                      Already have an account? Login
                    </button>

                    <button
                      type="button"
                      className={styles.secondaryBtn}
                      onClick={() => {
                        closeAuthModal();
                        navigate('/auth/create_new_user');
                      }}
                    >
                      New to House Of Intimacy? Create account
                    </button>
                  </div>

                  <p className={styles.termsText}>
                    By continuing, you agree to our{' '}
                    <a href="/terms" className={styles.termsLink}>
                      Terms &amp; Conditions
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" className={styles.termsLink}>
                      Privacy Policy
                    </a>
                    .
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
            <div
              className={styles.logoutModal}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.authCloseBtn}
                onClick={() => setLogoutConfirmOpen(false)}
                aria-label="Close"
              >
                <FiX />
              </button>

              <div className={styles.logoutContent}>
                <div className={styles.logoutIconCircle}>!</div>

                <h3 className={styles.logoutTitle}>
                  Are you sure you want to logout?
                </h3>
                <p className={styles.logoutText}>
                  You&apos;ll be logged out from House Of Intimacy and will need
                  to sign in again to access your account.
                </p>

                <div className={styles.logoutActions}>
                  <button
                    type="button"
                    className={styles.logoutYesBtn}
                    onClick={handleLogout}
                  >
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

      {/* 🛒 Right-side cart drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
