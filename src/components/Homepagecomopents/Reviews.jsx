import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import Styles from '../../assets/styles/review.module.css';

// ⚠️ REQUIRED in index.js or App.js:
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

const reviews = [
  {
    text: "Vamika – House of Intimacy is one of the best innerwear stores I've visited! They have a premium collection from brands like Jockey, Amanté, Enamor, and Bodycare, and the quality is truly impressive.",
    author: "ARUN NEGI",
  },
  {
    text: "Clean shop, polite staff and great brands. I went to buy for my sister and they guided me very well. Also have a small but nice men's section with Jockey products. Very trustworthy and customer-friendly store.",
    author: "POOJA TARIYAL",
  },
  {
    text: "Loved the variety here! From everyday innerwear to premium collection, everything is neatly arranged. The fitting guidance was very helpful. Perfect place for women's innerwear in the area.",
    author: "JYOTI PANDEY",
  },
  {
    text: "House of Intimacy is now my go-to lingerie store. Quality is genuine, prices are fair and the staff is extremely respectful. They have all sizes in Enamor, Amanté and Bodycare.",
    author: "ASTHA",
  },
  {
    text: "The products of Vamika itself is truly a blessing for all girls — where your innerwear makes you feel more beautiful.",
    author: "ROSTIKA KHADGI",
  },
  {
    text: "Best innerwear store for women! Stylish designs, everyday essentials, and premium ranges too. Also noticed a men's section with Jockey. Overall a great store.",
    author: "PRACHI PANT",
  },
  {
    text: "Superb quality and genuine products. I bought Amanté and Bodycare items — both were authentic and reasonably priced. The store is well-organized and the staff is very polite.",
    author: "SHRIOSHI DOBHAL",
  },
  {
    text: "Really impressed with the collection and service. The staff helped me find the perfect fit without any awkwardness. Definitely coming back for more!",
    author: "MANSHA NEGI",
  },
];

// ─── Pure JS breakpoint helper ───────────────────────────────────────────────
function getSlidesToShow(width) {
  if (width <= 768) return 1;
  if (width <= 992) return 2;
  if (width <= 1280) return 3;
  return 4;
}

// ─── Sub-components ──────────────────────────────────────────────────────────
const StarRating = () => (
  <div className={Styles.stars}>
    {[1, 2, 3, 4, 5].map((i) => (
      <span key={i} className={Styles.star}>&#9733;</span>
    ))}
  </div>
);

const ReviewCard = ({ text, author }) => (
  <div className={Styles.reviewCard}>
    <span className={Styles.quoteOpen}>&ldquo;</span>
    <StarRating />
    <p className={Styles.reviewText}>{text}</p>
    <div className={Styles.authorBlock}>
      <span className={Styles.authorLine} />
      <span className={Styles.authorName}>{author}</span>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const Reviewssection = () => {
  const [slidesToShow, setSlidesToShow] = useState(() =>
    typeof window !== 'undefined' ? getSlidesToShow(window.innerWidth) : 4
  );
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setSlidesToShow(getSlidesToShow(window.innerWidth));
    };

    // Set correctly on mount (handles SSR hydration too)
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── Slick settings — NO responsive prop ────────────────────────────────
  const settings = {
    infinite: true,
    slidesToShow: slidesToShow,   // ← controlled by JS state, always correct
    slidesToScroll: 1,
    autoplay: true,
    speed: slidesToShow === 1 ? 500 : 700,
    autoplaySpeed: slidesToShow === 1 ? 4000 : 3500,
    arrows: false,
    dots: false,
    // responsive: []  ← intentionally removed; JS state handles this
    beforeChange: (_, next) => setActiveSlide(next),
  };

  return (
    <section className={Styles.sectionWrapper}>
      <div className={Styles.inner}>

        {/* ── Heading ── */}
        <div className={Styles.headingBlock}>
          <span className={Styles.eyebrow}>What Our Clients Say</span>
          <h2 className={Styles.mainHeading}>
            Words of <span>Love</span>
          </h2>
          <div className={Styles.dividerLine}>
            <span className={Styles.dividerDiamond} />
          </div>
        </div>

        {/* ── Slider ── */}
        <div className={Styles.sliderWrapper}>
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <div key={index} className={Styles.slideOuter}>
                <ReviewCard text={review.text} author={review.author} />
              </div>
            ))}
          </Slider>
        </div>

        {/* ── Progress Dots ── */}
        <div className={Styles.dotsWrapper}>
          {reviews.map((_, i) => (
            <span
              key={i}
              className={`${Styles.dot} ${i === activeSlide % reviews.length ? Styles.dotActive : ''}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default Reviewssection;