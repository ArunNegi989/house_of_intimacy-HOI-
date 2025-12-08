import React from 'react';
import '../../assets/styles/about.module.css';
import Banner1 from '../../assets/images/HomeBanner/Banner1.webp';

export default function Herosection() {
  return (
    <div className="carousel-section">
      {/* <h2>Image Gallery Carousel</h2> */}

      <div
        id="imageCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#imageCarousel"
            data-bs-slide-to="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#imageCarousel"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#imageCarousel"
            data-bs-slide-to="2"
          ></button>
          <button
            type="button"
            data-bs-target="#imageCarousel"
            data-bs-slide-to="3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src={Banner1} className="d-block w-100" alt="Banner" />
          </div>
          <div className="carousel-item">
            <img src={Banner1} className="d-block w-100" alt="Banner" />
          </div>
          <div className="carousel-item">
            <img src={Banner1} className="d-block w-100" alt="Banner" />
          </div>
          <div className="carousel-item">
            <img src={Banner1} className="d-block w-100" alt="Banner" />
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#imageCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#imageCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
}
