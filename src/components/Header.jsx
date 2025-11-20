import React, { useState, useEffect, useRef } from "react";
import styles from "../assets/styles/Header.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logoDark from "../assets/images/logo.png";
import logoLight from "../assets/images/logo.png";

const Caret = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
    <path
      d="M5 7l5 6 5-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    />
  </svg>
);

const IconSearch = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="11"
      cy="11"
      r="7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M20 20l-3.2-3.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <circle
      cx="12"
      cy="8"
      r="4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M4 20c0-4 4-6 8-6s8 2 8 6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const IconCart = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M6 6h15l-1.5 9H8L6 4H3"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <circle cx="9" cy="20" r="1.5" />
    <circle cx="18" cy="20" r="1.5" />
  </svg>
);

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M3 6h18M3 12h18M3 18h18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M6 6l12 12M18 6l-12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default function Header() {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const firstLinkRef = useRef(null);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === "/";

  // scrolled: true = solid, false = transparent
  const [scrolled, setScrolled] = useState(() => !isHomePage);

  // ====== AUTH INFO FROM STORAGE ======
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const isAuthenticated = !!token;
  const storedName = localStorage.getItem("userName");
  const userName = isAuthenticated
    ? storedName || "My Account"
    : "Login / Signup";

  // lock background scroll while drawer is open
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (open) {
      root.style.overflow = "hidden";
      body.style.overflow = "hidden";
    } else {
      root.style.overflow = "";
      body.style.overflow = "";
    }
    return () => {
      root.style.overflow = "";
      body.style.overflow = "";
    };
  }, [open]);

  // close with ESC
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setUserMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // focus first link when opening drawer
  useEffect(() => {
    if (open && firstLinkRef.current) firstLinkRef.current.focus();
  }, [open]);

  // 🔥 Handle transparent vs solid ONLY on home page
  useEffect(() => {
    // Non-home pages → ALWAYS solid
    if (!isHomePage) {
      setScrolled(true);
      return;
    }

    const hero = document.getElementById("hero");

    if (hero && "IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setScrolled(!entry.isIntersecting); // hero visible → transparent
          });
        },
        { root: null, threshold: 0.01 }
      );
      io.observe(hero);
      return () => io.disconnect();
    } else {
      const onScroll = () => setScrolled(window.scrollY > 80);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }
  }, [isHomePage]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const closeAnd =
    (fn) =>
    (e) => {
      if (typeof fn === "function") fn(e);
      setOpen(false);
    };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userName");
    sessionStorage.removeItem("authToken");
    setUserMenuOpen(false);
    navigate("/login");
  };

  const logoSrc = scrolled ? logoDark : logoLight || logoDark;

  return (
    <header
      className={`${styles.nav} ${
        scrolled ? styles["nav--solid"] : styles["nav--transparent"]
      }`}
    >
      <div className={styles.nav__inner}>
        {/* Left: Logo + menu */}
        <div className={styles.nav__left}>
          <Link to="/" className={styles.nav__logo} aria-label="FLUTE Home">
            <img
              src={logoSrc}
              alt="FLUTE Logo"
              className={styles["nav__logo-img"]}
            />
          </Link>

          <nav className={styles.nav__menu} aria-label="Primary">
            <div
              className={`${styles.nav__item} ${styles["nav__item--has-submenu"]}`}
            >
              <a href="#swimwear" className={styles.nav__link}>
                SWIMWEAR <Caret />
              </a>
              <div className={styles.nav__submenu} role="menu">
                <a
                  href="#onepiece"
                  role="menuitem"
                  className={styles["nav__submenu-link"]}
                >
                  One Pieces
                </a>
                <a
                  href="#bikinis"
                  role="menuitem"
                  className={styles["nav__submenu-link"]}
                >
                  Bikinis
                </a>
                <a
                  href="#coverups"
                  role="menuitem"
                  className={styles["nav__submenu-link"]}
                >
                  Cover-ups
                </a>
              </div>
            </div>

            <div className={styles.nav__item}>
              <a href="#beachwear" className={styles.nav__link}>
                BEACHWEAR
              </a>
            </div>

            <div
              className={`${styles.nav__item} ${styles["nav__item--has-submenu"]}`}
            >
              <a href="#lingerie" className={styles.nav__link}>
                LINGERIE SETS <Caret />
              </a>
              <div className={styles.nav__submenu} role="menu">
                <a
                  href="#bralettes"
                  role="menuitem"
                  className={styles["nav__submenu-link"]}
                >
                  Bralettes
                </a>
                <a
                  href="#pushup"
                  role="menuitem"
                  className={styles["nav__submenu-link"]}
                >
                  Push-up
                </a>
                <a
                  href="#lace"
                  role="menuitem"
                  className={styles["nav__submenu-link"]}
                >
                  Lace
                </a>
              </div>
            </div>

            <div className={styles.nav__item}>
              <a href="#our-story" className={styles.nav__link}>
                OUR STORY
              </a>
            </div>

            <div className={styles.nav__item}>
              <a
                href="#features"
                className={`${styles.nav__link} ${styles["nav__link--active"]}`}
              >
                FEATURES
              </a>
            </div>
          </nav>
        </div>

        {/* Right: Utilities (desktop) */}
        <div className={styles.nav__actions}>
          <a href="#search" className={styles.nav__action}>
            <IconSearch /> <span>SEARCH</span>
          </a>

          {/* USER MENU */}
          <div
            className={styles.nav__user}
            ref={userMenuRef}
            onMouseEnter={() => setUserMenuOpen(true)}
            onMouseLeave={() => setUserMenuOpen(false)}
          >
            <button
              type="button"
              className={styles["nav__user-btn"]}
              onClick={() => setUserMenuOpen((o) => !o)}
            >
              <IconUser />
              <span className={styles["nav__user-name"]}>{userName}</span>
              <Caret />
            </button>

            <div
              className={`${styles["nav__user-menu"]} ${
                userMenuOpen ? styles["is-open"] : ""
              }`}
            >
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className={styles["nav__user-menu-item"]}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    to="/auth/create_new_user"
                    className={styles["nav__user-menu-item"]}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/account/profile"
                    className={styles["nav__user-menu-item"]}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    My Profile
                  </Link>

                  <Link
                    to="/account/orders"
                    className={styles["nav__user-menu-item"]}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    My Orders
                  </Link>

                  <button
                    type="button"
                    className={styles["nav__user-menu-item"]}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>

          <a href="#cart" className={styles.nav__action}>
            <IconCart /> <span>CART</span>
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className={styles["nav__burger"]}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-drawer"
          onClick={() => setOpen((o) => !o)}
        >
          <IconMenu />
        </button>
      </div>

      {/* Backdrop */}
      <button
        type="button"
        className={`${styles["nav__backdrop"]} ${
          open ? styles["is-open"] : ""
        }`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
        tabIndex={open ? 0 : -1}
      />

      {/* Right drawer (mobile) */}
      <aside
        id="mobile-drawer"
        className={`${styles["nav__drawer"]} ${
          open ? styles["is-open"] : ""
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile menu"
      >
        <div className={styles["nav__drawer-head"]}>
          <span className={styles["nav__drawer-title"]}>Menu</span>
          <button
            type="button"
            className={styles["nav__drawer-close"]}
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          >
            <IconClose />
          </button>
        </div>

        <div className={styles["nav__drawer-body"]}>
          <a
            href="#swimwear"
            className={styles["nav__drawer-link"]}
            onClick={closeAnd()}
            ref={firstLinkRef}
          >
            SWIMWEAR
          </a>
          <a
            href="#beachwear"
            className={styles["nav__drawer-link"]}
            onClick={closeAnd()}
          >
            BEACHWEAR
          </a>
          <a
            href="#lingerie"
            className={styles["nav__drawer-link"]}
            onClick={closeAnd()}
          >
            LINGERIE SETS
          </a>
          <a
            href="#our-story"
            className={styles["nav__drawer-link"]}
            onClick={closeAnd()}
          >
            OUR STORY
          </a>
          <a
            href="#features"
            className={`${styles["nav__drawer-link"]} ${
              styles["is-active"]
            }`}
            onClick={closeAnd()}
          >
            FEATURES
          </a>

          <div className={styles["nav__drawer-sep"]} />

          <a
            href="#search"
            className={styles["nav__drawer-link"]}
            onClick={closeAnd()}
          >
            <IconSearch /> <span>SEARCH</span>
          </a>

          {/* Mobile auth section */}
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className={styles["nav__drawer-link"]}
                onClick={closeAnd()}
              >
                <IconUser /> <span>Login</span>
              </Link>
              <Link
                to="/auth/create_new_user"
                className={styles["nav__drawer-link"]}
                onClick={closeAnd()}
              >
                <span>Sign up</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/account/profile"
                className={styles["nav__drawer-link"]}
                onClick={closeAnd()}
              >
                My Profile
              </Link>
              <Link
                to="/account/orders"
                className={styles["nav__drawer-link"]}
                onClick={closeAnd()}
              >
                My Orders
              </Link>
              <button
                type="button"
                className={styles["nav__drawer-link"]}
                onClick={closeAnd(handleLogout)}
              >
                Logout
              </button>
            </>
          )}

          <a
            href="#cart"
            className={styles["nav__drawer-link"]}
            onClick={closeAnd()}
          >
            <IconCart /> <span>CART</span>
          </a>
        </div>
      </aside>
    </header>
  );
}
