import React from 'react';
import Banner1 from '../assets/images/HomeBanner/Banner1.webp';
import Photo from '../assets/images/Banner-2-1400X1129.webp';
import styles from '../assets/styles/about.module.css';
import { FAQ } from './FAQ';
// or "../FAQ" based on folder

export function Aboutus() {
  const categories = [
    {
      id: 1,
      title: 'Layering',
      image:
        'https://image.clovia.com/media/images/dtbanner/Cart-DT-Banner-6-2348234.jpg',
      bgColor: '#f5f5f5',
    },
    {
      id: 2,
      title: 'Athleisure',
      image:
        'https://image.clovia.com/media/images/dtbanner/Cart-DT-Banner-3-234824.jpg',
      bgColor: '#e8f4f8',
    },
    {
      id: 3,
      title: 'Shapewear',
      image:
        'https://image.clovia.com/media/images/dtbanner/Cart-DT-Banner-1-984343.jpg',
      bgColor: '#fef3e8',
    },
    {
      id: 4,
      title: 'Sleepwear',
      image:
        'https://image.clovia.com/media/images/dtbanner/Cart-DT-Banner-4-2348234.jpg',
      bgColor: '#e8e9f3',
    },
  ];

  return (
    <>
      <section className={styles.bannerSection}>
        <div className={styles.bannerContainer}>
          <img src={Banner1} alt="Banner" className={styles.bannerImage} />
        </div>
      </section>

      <section className={styles.introSection}>
        <div className="container">
          <p className={styles.introText}>
            Our Ultimate Intimate Wear Destination
            <br />
            Welcome to amanté – where luxury meets comfort, and fashion meets
            function. Since 2007, amante has been redefining intimate wear for
            the modern woman, creating elegant, fashion-forward essentials
            designed to support her every mood, moment, and move.
            <br />
            Our curated portfolio features a versatile range of lingerie,
            sleepwear, activewear, swimwear, shapewear, and accessories – making
            us the ultimate destination for intimate wear that's as stylish as
            it is sensual. Every product is crafted with meticulous attention to
            detail, bringing together elevated design, high-quality fabrics, and
            thoughtful innovation. Whether it's for the everyday or something
            more indulgent, amante is made to celebrate all that she is –
            confident, graceful, and effortlessly bold.
            <br />
          </p>
        </div>
      </section>

      <section className={styles.photoSection}>
        <div className="container-fluid">
          <div className={styles.row}>
            <div className={styles.colMd6}>
              <img src={Photo} alt="img" className={styles.sectionImage} />
            </div>
            <div className={styles.colMd6}>
              <div className={styles.textContent}>
                <h1>House Of Intimacy | Made Like You</h1>
                <p className={styles.tagline}>
                  amanté bras are so comfortable that they feel like nothing,
                  they feel like air
                </p>
                <p>
                  The world doesn't decide when you move
                  <br />
                  You effortlessly navigate through life
                  <br />
                  And have a whale of a time doing it.
                  <br />
                  Through your hustle and your leisure
                  <br />
                  The many things you do
                  <br />
                  And all that you are
                  <br />
                  Playful, confident, bold, unapologetic
                  <br />
                  You manifest your essence into everything you do. There's only
                  one other like you
                  <br />
                  Cut from the same cloth
                  <br />
                  And your timeless grace.
                  <br />
                  You are unique and our bras are designed to be as unique as
                  you
                </p>
              </div>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.colMd6}>
              <div className={styles.textContent}>
                <h1>Vision & Mission</h1>
                <p className={styles.tagline}>
                  amanté bras are so comfortable that they feel like nothing,
                  they feel like air
                </p>
                <p>
                  The world doesn't decide when you move
                  <br />
                  You effortlessly navigate through life
                  <br />
                  And have a whale of a time doing it.
                  <br />
                  Through your hustle and your leisure
                  <br />
                  The many things you do
                  <br />
                  And all that you are
                  <br />
                  Playful, confident, bold, unapologetic
                  <br />
                  You manifest your essence into everything you do. There's only
                  one other like you
                  <br />
                  Cut from the same cloth
                  <br />
                  And your timeless grace.
                  <br />
                  You are unique and our bras are designed to be as unique as
                  you
                </p>
              </div>
            </div>
            <div className={styles.colMd6}>
              <img src={Photo} alt="img" className={styles.sectionImage} />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.colMd6}>
              <img src={Photo} alt="img" className={styles.sectionImage} />
            </div>
            <div className={styles.colMd6}>
              <div className={styles.textContent}>
                <h1>House Of Intimacy | Made Like You</h1>
                <p className={styles.tagline}>
                  amanté bras are so comfortable that they feel like nothing,
                  they feel like air
                </p>
                <p>
                  The world doesn't decide when you move
                  <br />
                  You effortlessly navigate through life
                  <br />
                  And have a whale of a time doing it.
                  <br />
                  Through your hustle and your leisure
                  <br />
                  The many things you do
                  <br />
                  And all that you are
                  <br />
                  Playful, confident, bold, unapologetic
                  <br />
                  You manifest your essence into everything you do. There's only
                  one other like you
                  <br />
                  Cut from the same cloth
                  <br />
                  And your timeless grace.
                  <br />
                  You are unique and our bras are designed to be as unique as
                  you
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="explore-section py-5">
          <div className="container-fluid">
            <h2 className={styles.ExploreHead}>Explore</h2>

            <div className="row g-4">
              {categories.map((category) => (
                <div key={category.id} className="col-12 col-md-6 col-lg-3">
                  <div className="category-card h-100">
                    <div
                      className="card border-0 h-100 overflow-hidden position-relative"
                      style={{
                        borderRadius: '20px',
                        cursor: 'pointer',
                        transition: 'transform 0.3s ease',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.transform = 'translateY(-8px)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.transform = 'translateY(0)')
                      }
                    >
                      <img
                        src={category.image}
                        alt={category.title}
                        className="card-img-top"
                        style={{
                          height: '670px',
                          objectFit: 'cover',
                        }}
                      />

                      <div
                        className="position-absolute bottom-0 start-0 w-100 p-4"
                        style={{
                          background:
                            'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                        }}
                      >
                        <h3 className="text-white fw-semibold mb-0 d-flex align-items-center">
                          {category.title}
                          <svg
                            className="ms-2"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            .explore-section {
              background-color: #ffffff;
              min-height: 100vh;
            }

            .category-card {
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              border-radius: 20px;
              overflow: hidden;
            }

            .category-card:hover {
              box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
            }

            @media (max-width: 768px) {
              .card-img-top {
                height: 300px !important;
              }
            }
          `}</style>
        </div>
      </section>
      <FAQ />
    </>
  );
}
