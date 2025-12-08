// src/pages/Vamikadetails.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Styles from '../../assets/styles/vamikadetails.module.css';

import Banner1 from '../../assets/images/HomeBanner/Banner1.webp';
import nightwearImg from '../../assets/images/5.jpg';

export const Vamikadetails = () => {
  return (
    <>
      {/* HERO BANNER */}
      <section className="">
        <img src={Banner1} className="d-block w-100" alt="Banner" />
      </section>
      <section className={Styles.homePadding}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <h1 className={Styles.HeadHomes}>
                Vamika (house Of Intimacy)in Sahastradhara Road, Dehradun
              </h1>
              <p className={Styles.ParaHome}>
                Vamika (house Of Intimacy) in Dehradun is one of the leading
                businesses in the Readymade Garment Retailers. Also known for
                Readymade Garment Retailers, Bra Retailers, Women Undergarment
                Retailers, Undergarment Retailers-Jockey, Men Undergarment
                Retailers-Calvin Klein, Bra Retailers-Enamor, Men Undergarment
                Retailers-Jockey, Men Undergarment Retailers and much more. Find
                Address, Contact Number, Reviews & Ratings, Photos, Maps of
                Vamika (house Of Intimacy), Dehradun.
              </p>
              <br />
              <p className={Styles.ParaHome}>
                Vamika (house Of Intimacy) in Dehradun is one of the leading
                businesses in the Readymade Garment Retailers. Also known for
                Readymade Garment Retailers, Bra Retailers, Women Undergarment
                Retailers, Undergarment Retailers-Jockey, Men Undergarment
                Retailers-Calvin Klein, Bra Retailers-Enamor, Men Undergarment
                Retailers-Jockey, Men Undergarment Retailers and much more. Find
                Address, Contact Number, Reviews & Ratings, Photos, Maps of
                Vamika (house Of Intimacy), Dehradun.
              </p>
              <Link to="/about-us" className={Styles.blogcardbutton1}>
                Read More
              </Link>
            </div>
            <div className="col-md-6">
              <div className={Styles.HomeImg}>
                <img src={nightwearImg} alt="image1" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
