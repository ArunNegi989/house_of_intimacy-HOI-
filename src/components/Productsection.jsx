import React from 'react';
import styles from '../assets/styles/Productsection.module.css';
import img5 from '../assets/images/5.jpg';
import img17 from '../assets/images/17.jpg';
import img19 from '../assets/images/19.jpg';
import { useColorModeValue } from '@chakra-ui/react';

const sampleData = {
  New: [
    {
      id: 1,
      brand: 'AquaFit',
      title: 'Island Escape Bikini',
      price: '$189.00',
      img: img5,
    },
    {
      id: 2,
      brand: 'SwimStyle',
      title: 'Seaside Sensation One-piece Monokini',
      price: '$119.00',
      img: img17,
    },
    {
      id: 3,
      brand: 'SwimStyle',
      title: 'Seaside Sensation One-piece Monokini',
      price: '$119.00',
      img: img19,
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
  const columns = ['New', 'Trendy', 'Sale'];

  // 🌗 Chakra color-mode aware values
  const sectionBg = useColorModeValue(
    '#ffffff',
    'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)'
  );
  const sectionText = useColorModeValue('#0f172a', '#000000ff');
  const columnTitleColor = useColorModeValue('#111827', '#0c0c0cff');
  const brandColor = useColorModeValue('#6b7280', '#070707ff');
  const titleColor = useColorModeValue('#374151', '#040404ff');
  const priceNowColor = useColorModeValue('#111827', '#080808ff');
  const priceOldColor = useColorModeValue('#9ca3af', '#080808ff');
  const viewAllColor = useColorModeValue('#111827', '#070708ff');

  // 🔴 NEW: card background for light / dark
  const cardBg = useColorModeValue('#ffffff', 'linear-gradient(135deg, #ffdeefff 0%, #ffcbe4ff 50%, #ffd2e6ff 100%)');
  const cardBorder = useColorModeValue('#e5e7eb', 'rgba(0,0,0,0.08)');

  return (
    <section
      className={`${styles['product-section']} py-5`}
      style={{ background: sectionBg, color: sectionText }}
    >
      <div className="container">
        <div className="row">
          {columns.map((col) => (
            <div key={col} className="col-12 col-md-4">
              <h3
                className={`${styles['column-title']} text-center text-md-start mb-4`}
                style={{ color: columnTitleColor }}
              >
                {col}
              </h3>

              <div className="list-group">
                {sampleData[col].map((item) => (
                  <article
                    key={item.id}
                    className={`list-group-item border-0 px-0 py-3 d-flex align-items-start ${styles['product-item']}`}
                    style={{
                      background: cardBg,
                      borderRadius: '12px',
                      border: `1px solid ${cardBorder}`,
                    }}
                  >
                    <div className={`${styles.thumb} me-3 flex-shrink-0`}>
                      <img
                        src={item.img}
                        alt={item.title}
                        className="img-fluid rounded shadow-sm"
                      />
                    </div>

                    <div className={styles.meta}>
                      <div
                        className={`${styles.brand} small`}
                        style={{ color: brandColor }}
                      >
                        {item.brand}
                      </div>

                      <div
                        className={styles.title}
                        style={{ color: titleColor }}
                      >
                        {item.title}
                      </div>

                      <div className={styles.price}>
                        {item.priceOld && (
                          <span
                            className={`${styles.old} me-2`}
                            style={{ color: priceOldColor }}
                          >
                            {item.priceOld}
                          </span>
                        )}
                        <span
                          className={`${styles.now} fw-bold`}
                          style={{ color: priceNowColor }}
                        >
                          {item.price}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div
                className={`${styles['view-all']} text-center text-md-start mt-3`}
              >
                <a
                  href="#"
                  className="text-decoration-underline small"
                  style={{ color: viewAllColor }}
                >
                  VIEW ALL
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
