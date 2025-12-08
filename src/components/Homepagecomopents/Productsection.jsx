import React from 'react';
import img5 from '../../assets/images/5.jpg';
import img17 from '../../assets/images/17.jpg';
import img19 from '../../assets/images/19.jpg';
import { Link } from 'react-router-dom';

const sampleData = {
  New: [
    {
      id: 1,
      brand: 'AquaFit',
      title: 'Island Escape Bikini',
      price: '$189.00',
      img: img5,
      arrow: '→',
    },
    {
      id: 2,
      brand: 'SwimStyle',
      title: 'Seaside Sensation One-piece Monokini',
      price: '$119.00',
      img: img17,
      arrow: '←',
    },
    {
      id: 3,
      brand: 'SwimStyle',
      title: 'Seaside Sensation One-piece Monokini',
      price: '$119.00',
      img: img19,
      arrow: '→',
    },
  ],
  Trendy: [
    {
      id: 4,
      brand: 'WaveWear',
      title: 'Sand Dune One-piece Tankini',
      price: '$112.00',
      img: img5,
    },
    {
      id: 5,
      brand: 'SwimStyle',
      title: 'Wave Rider Rash Guard Bikini',
      price: '$79.00',
      img: img17,
    },
    {
      id: 6,
      brand: 'SwimStyle',
      title: 'Tropicana Monokini',
      price: '$89.00',
      img: img19,
    },
  ],
  Sale: [
    {
      id: 7,
      brand: 'Coastal Clothing',
      title: 'Sunkissed Sands One-Piece Swimsuit',
      priceOld: '$160.00',
      price: '$127.00',
      img: img5,
    },
    {
      id: 8,
      brand: 'Coastal Clothing',
      title: 'Surfside Sunset Monokini',
      priceOld: '$299.00',
      price: '$229.00',
      img: img17,
    },
    {
      id: 9,
      brand: 'SeaSplash',
      title: 'Tidal Temptation Bikini',
      priceOld: '$149.00',
      price: '$112.00',
      img: img5,
    },
  ],
};

export default function ProductSection() {
  const sections = [
    { name: 'New', align: 'left', direction: 'rtl' },
    { name: 'Trendy', align: 'right', direction: 'ltr' },
    { name: 'Sale', align: 'left', direction: 'rtl' },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .product-section {
          background: linear-gradient(135deg, #fff5f7 0%, #ffe4ec 50%, #ffd4e5 100%);
          padding: 80px 40px;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          min-height: 100vh;
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .section-row {
          margin-bottom: 80px;
          display: flex;
          align-items: center;
          // gap: 60px;
        }
        
        .section-row:last-child {
          margin-bottom: 0;
        }
        
        /* Left aligned layout */
        .section-row.align-left {
          flex-direction: row;
        }
        
        /* Right aligned layout */
        .section-row.align-right {
          flex-direction: row-reverse;
        }
        
        .title-wrapper {
          flex-shrink: 0;
          width: 222px;
          animation: fadeIn 0.8s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .column-title {
          font-family: 'Playfair Display', serif;
          font-size: 64px;
          font-weight: 700;
          color: #1a1a1a;
          position: relative;
          line-height: 1.1;
        }
        
        .align-left .column-title {
          text-align: left;
        }
        
        .align-right .column-title {
          text-align: right;
        }
        
        .column-title::after {
          content: '';
          position: absolute;
          bottom: -12px;
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #ff6b9d 0%, #ffa8cc 100%);
          border-radius: 3px;
        }
        
        .align-left .column-title::after {
          left: 0;
        }
        
        .align-right .column-title::after {
          right: 0;
        }
        
        .products-container {
          flex: 1;
          overflow: hidden;
          position: relative;
        }
        
        .products-scroll {
          display: flex;
          gap: 24px;
          animation: scroll 30s linear infinite;
        }
        
        /* Right to Left animation */
        .direction-rtl .products-scroll {
          animation-name: scrollRTL;
        }
        
        /* Left to Right animation */
        .direction-ltr .products-scroll {
          animation-name: scrollLTR;
        }
        
        .products-scroll:hover {
          animation-play-state: paused;
        }
        
        @keyframes scrollRTL {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes scrollLTR {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .product-card {
          display: flex;
          flex-direction: column;
          width: 300px;
          height: 410px;
          flex-shrink: 0;
          background: white;
          border-radius: 20px;
          padding: 20px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
          position: relative;
          overflow: hidden;
        }
        
        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 107, 157, 0.08) 0%, rgba(255, 168, 204, 0.08) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }
        
        .product-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 16px 32px rgba(255, 107, 157, 0.2);
        }
        
        .product-card:hover::before {
          opacity: 1;
        }
        
        .product-image {
          width: 100%;
          height: 380px;
          border-radius: 16px;
          overflow: hidden;
          background: #f8f9fa;
          position: relative;
          margin-bottom: 16px;
        }
        
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .product-card:hover .product-image img {
          transform: scale(1.1);
        }
        
        .sale-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: linear-gradient(135deg, #ff6b9d 0%, #ff8fb3 100%);
          color: white;
          padding: 8px 16px;
          border-radius: 25px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          box-shadow: 0 6px 16px rgba(255, 107, 157, 0.4);
        }
        
        .product-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .product-brand {
          font-size: 13px;
          font-weight: 600;
          color: #ff6b9d;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .product-title {
          font-size: 18px;
          font-weight: 600;
          color: #2d3748;
          line-height: 1.4;
          min-height: 50px;
        }
        
        .product-price {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }
        
        .price-old {
          font-size: 16px;
          color: #9ca3af;
          text-decoration: line-through;
          font-weight: 400;
        }
        
        .price-current {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          letter-spacing: -0.5px;
        }
        
        .discount-percent {
          font-size: 13px;
          font-weight: 700;
          color: #10b981;
          background: #d1fae5;
          padding: 6px 10px;
          border-radius: 8px;
        }
        
        .view-all-wrapper {
          margin-top: 32px;
        }
        
        .align-left .view-all-wrapper {
          text-align: left;
        }
        
        .align-right .view-all-wrapper {
          text-align: right;
        }
        
        .view-all-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #1a1a1a;
          text-decoration: none;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          transition: all 0.3s ease;
          position: relative;
          padding-bottom: 4px;
        }
        
        .view-all-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, #ff6b9d 0%, #ffa8cc 100%);
          transition: width 0.3s ease;
        }
        
        .view-all-link:hover::after {
          width: 100%;
        }
        
        .view-all-link:hover {
          color: #ff6b9d;
          transform: translateX(4px);
        }
        
        .arrow-icon {
          font-size: 18px;
          transition: transform 0.3s ease;
        }
        
        .view-all-link:hover .arrow-icon {
          transform: translateX(4px);
        }
        
        @media (max-width: 1024px) {
          .section-row {
            flex-direction: column !important;
            gap: 40px;
            margin-bottom: 60px;
          }
          
          .title-wrapper {
            width: 100%;
          }
          
          .column-title {
            font-size: 48px;
            text-align: center !important;
          }
          
          .column-title::after {
            left: 50% !important;
            right: auto !important;
            transform: translateX(-50%);
          }
          
          .view-all-wrapper {
            text-align: center !important;
          }
          
          .product-card {
            width: 280px;
          }
          
          .product-image {
            height: 340px;
          }
        }
        
        @media (max-width: 768px) {
          .product-section {
            padding: 60px 16px;
          }
          
          .section-row {
            gap: 32px;
            margin-bottom: 50px;
          }
          
          .column-title {
            font-size: 40px;
          }
          
          .product-card {
            width: 240px;
          }
          
          .product-image {
            height: 300px;
          }
          
          .product-title {
            font-size: 16px;
            min-height: 44px;
          }
          
          .price-current {
            font-size: 20px;
          }
        }
      `}</style>

      <section className="product-section">
        <div className="container-fluid">
          {sections.map((section, index) => {
            const items = sampleData[section.name];
            // Duplicate items for seamless loop
            const duplicatedItems = [...items, ...items];

            return (
              <div
                key={section.name}
                className={`section-row align-${section.align}`}
              >
                <div className="title-wrapper">
                  <h3 className="column-title">{section.name}</h3>
                  <div className="view-all-wrapper">
                    <Link to="#" className="view-all-link">
                      View All
                      <span className="arrow-icon">{section.arrow}</span>
                    </Link>
                  </div>
                </div>

                <div
                  className={`products-container direction-${section.direction}`}
                >
                  <div className="products-scroll">
                    {duplicatedItems.map((item, idx) => {
                      const discount = item.priceOld
                        ? Math.round(
                            ((parseFloat(item.priceOld.replace('$', '')) -
                              parseFloat(item.price.replace('$', ''))) /
                              parseFloat(item.priceOld.replace('$', ''))) *
                              100,
                          )
                        : null;

                      return (
                        <article
                          key={`${item.id}-${idx}`}
                          className="product-card"
                        >
                          <div className="product-image">
                            <img src={item.img} alt={item.title} />
                            {section.name === 'Sale' && (
                              <div className="sale-badge">Sale</div>
                            )}
                          </div>

                          <div className="product-info">
                            <div className="product-brand">{item.brand}</div>
                            <div className="product-title">{item.title}</div>

                            <div className="product-price">
                              {item.priceOld && (
                                <span className="price-old">
                                  {item.priceOld}
                                </span>
                              )}
                              <span className="price-current">
                                {item.price}
                              </span>
                              {discount && (
                                <span className="discount-percent">
                                  -{discount}%
                                </span>
                              )}
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
