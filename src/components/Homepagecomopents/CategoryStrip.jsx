// src/components/CategoryStrip.jsx
import React from 'react';
import styles from '../../assets/styles/CategoryStrip.module.css';

// 👉 import your images
import braImg from '../../assets/images/17.jpg';
import pantiesImg from '../../assets/images/17.jpg';
import nightwearImg from '../../assets/images/5.jpg';
import activewearImg from '../../assets/images/17.jpg';
import swimwearImg from '../../assets/images/5.jpg';
import shapewearImg from '../../assets/images/17.jpg';
import layeringImg from '../../assets/images/19.jpg';
import accessoriesImg from '../../assets/images/5.jpg';
import saleImg from '../../assets/images/17.jpg';
import { Link } from 'react-router-dom';

const categories = [
  { label: 'Bra', image: braImg, slug: '/bras' },
  { label: 'Panties', image: pantiesImg, slug: '/panties' },
  { label: 'Nightwear', image: nightwearImg, slug: '/nightwear' },
  { label: 'Activewear', image: activewearImg, slug: '/activewear' },
  { label: 'Swimwear', image: swimwearImg, slug: '/swimwear' },
  { label: 'Shapewear', image: shapewearImg, slug: '/shapewear' },
  { label: 'Layering', image: layeringImg, slug: '/layering' },
  { label: 'Accessories', image: accessoriesImg, slug: '/accessories' },
  { label: 'Sale', image: saleImg, slug: '/sale' },
];

const CategoryStrip = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.inner}>
        {categories.map((cat) => (
          <Link key={cat.label} to={cat.slug} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={cat.image} alt={cat.label} className={styles.image} />
            </div>
            <span className={styles.label}>{cat.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryStrip;
