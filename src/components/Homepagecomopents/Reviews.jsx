import React from 'react';
import Styles from '../../assets/styles/review.module.css';
import Slider from 'react-slick';

export const Reviewssection = () => {
  const settings = {
    className: 'center',
    infinite: true,
    centerMode: false,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    autoplay: true,
    speed: 4000,
    autoplaySpeed: 4000,
    arrows: false,
    dots: false,

    responsive: [
  {
    breakpoint: 1600,
    settings: {
      slidesToShow: 4,
    },
  },
  {
    breakpoint: 1200,
    settings: {
      slidesToShow: 3,
    },
  },
  {
    breakpoint: 992,
    settings: {
      slidesToShow: 2,
    },
  },
  {
    breakpoint: 768,
    settings: {
      slidesToShow: 1,
      centerMode: false,
    },
  },
  {
    breakpoint: 576,
    settings: {
      slidesToShow: 1,
      centerMode: false,
    },
  }
],

    afterChange: function (index) {
      console.log(`Slider Changed to: ${index + 1}`);
    },
  };

  return (
    <>
      <section className={Styles.homePadding}>
        <div className={`slider-container ${Styles.sliderWrapper}`}>
          <h1 className={Styles.HeadHome}>Customer Love</h1>
          <Slider {...settings}>
            <div className={Styles.Reviews}>
              <div className={Styles.reviewcard}>
                <span className={Styles.quoteleft}>❝</span>
                <p className={Styles.reviewtext}>
                  Vamika – House of Intimacy is one of the best innerwear stores
                  I've visited! They have a premium collection from brands like
                  Jockey, Amanté, Enamor, and Bodycare, and the quality is truly
                  impressive.
                </p>
                <p className={Styles.author}>- ARUN NEGI</p>
                <span className={Styles.quoteright}>❞</span>
              </div>
            </div>
            <div className={Styles.Reviews}>
              <div className={Styles.reviewcard}>
                <span className={Styles.quoteleft}>❝</span>
                <p className={Styles.reviewtext}>
                  Clean shop, polite staff and great brands. I went to buy for
                  my sister and they guided me very well. They also have a small
                  but nice men's section with Jockey products. Overall, very
                  trustworthy and customer-friendly store.
                </p>
                <p className={Styles.author}>- POOJA TARIYAL</p>
                <span className={Styles.quoteright}>❞</span>
              </div>
            </div>
            <div className={Styles.Reviews}>
              <div className={Styles.reviewcard}>
                <span className={Styles.quoteleft}>❝</span>
                <p className={Styles.reviewtext}>
                  Loved the variety here! From everyday innerwear to premium
                  collection, everything is neatly arranged. The fitting
                  guidance was very helpful. Perfect place for women's innerwear
                  in the area.
                </p>
                <p className={Styles.author}>- JYOTI PANDEY</p>
                <span className={Styles.quoteright}>❞</span>
              </div>
            </div>
            <div className={Styles.Reviews}>
              <div className={Styles.reviewcard}>
                <span className={Styles.quoteleft}>❝</span>
                <p className={Styles.reviewtext}>
                  House of Intimacy is now my go-to lingerie store. Quality is
                  genuine, prices are fair and the staff is extremely
                  respectful. They have all sizes available in Enamor, Amanté
                  and Bodycare. Shopping here feels comfortable and hassle-free.
                </p>
                <p className={Styles.author}>- ASTHA</p>
                <span className={Styles.quoteright}>❞</span>
              </div>
            </div>
            <div className={Styles.Reviews}>
              <div className={Styles.reviewcard}>
                <span className={Styles.quoteleft}>❝</span>
                <p className={Styles.reviewtext}>
                  The products of vamika itself is truly blessings for all girls
                  where your inner make you feel more beautiful
                </p>
                <p className={Styles.author}>- ROSTIKA KHADGI</p>
                <span className={Styles.quoteright}>❞</span>
              </div>
            </div>
            <div className={Styles.Reviews}>
              <div className={Styles.reviewcard}>
                <span className={Styles.quoteleft}>❝</span>
                <p className={Styles.reviewtext}>
                  Best innerwear store for women! They have stylish designs,
                  everyday essentials, and premium ranges too. Also noticed a
                  men's section with Jockey. Overall a great store.
                </p>
                <p className={Styles.author}>- PRACHI PANT</p>
                <span className={Styles.quoteright}>❞</span>
              </div>
            </div>
            <div className={Styles.Reviews}>
              <div className={Styles.reviewcard}>
                <span className={Styles.quoteleft}>❝</span>
                <p className={Styles.reviewtext}>
                  Superb quality and genuine products. I bought Amanté and
                  Bodycare items from here — both were authentic and reasonably
                  priced. The store is well-organized and the staff is very
                  polite.
                </p>
                <p className={Styles.author}>- SHRIOSHI DOBHAL</p>
                <span className={Styles.quoteright}>❞</span>
              </div>
            </div>
            <div className={Styles.Reviews}>
              <div className={Styles.reviewcard}>
                <span className={Styles.quoteleft}>❝</span>
                <p className={Styles.reviewtext}>
                  Superb quality and genuine products. I bought Amanté and
                  Bodycare items from here — both were authentic and reasonably
                  priced. The store is well-organized and the staff is very
                  polite.
                </p>
                <p className={Styles.author}>- MANSHA NEGI</p>
                <span className={Styles.quoteright}>❞</span>
              </div>
            </div>
          </Slider>
        </div>
      </section>
    </>
  );
};