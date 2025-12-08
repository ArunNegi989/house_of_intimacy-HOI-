// src/components/Home/BlogCards.jsx
import React, { useEffect, useState } from 'react';
import Style from '../../assets/styles/blogscard.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');

const BlogCard = ({ image, heading, link }) => {
  return (
    <div className={Style.blogcard}>
      <div className={Style.blogcardimage}>
        <img src={image} alt={heading} />
      </div>
      <div className={Style.blogcardcontent}>
        <h3 className={Style.blogcardheading}>{heading}</h3>
        <Link to={link} className={Style.blogcardbutton}>
          Read More
        </Link>
      </div>
    </div>
  );
};

export default function BlogCards() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // GET /v1/myblogs/allblogs
        const res = await axios.get(`${baseUrl}/myblogs/allblogs`);

        const payload = res.data || {};
        const list = payload.blogs || [];

        // 1) only published blogs
        const published = list.filter((b) => b.status === 'published');

        // 2) sort by createdAt (latest first)
        const sorted = [...published].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        // 3) show latest 4
        setBlogs(sorted.slice(0, 4));
      } catch (err) {
        console.error('Error fetching blogs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return <p className="text-center py-3">Loading blogs...</p>;
  }

  if (blogs.length === 0) {
    return <p className="text-center py-3">No blogs found.</p>;
  }

  return (
    <div className={Style.blogcardscontainer}>
      {/* Section heading */}
      <div className={Style.blogSectionHeader}>
        <h2 className={Style.blogSectionTitle}>From our HOI Blog</h2>
        <p className={Style.blogSectionSubtitle}>
          Quick reads on comfort, styling, and everyday lingerie care — curated
          by the House of Intimacy team.
        </p>
      </div>

      <div className="row g-4">
        {blogs.map((blog) => {
          const blogImage = blog.featureImage
            ? `${apiRoot}${blog.featureImage}`
            : 'https://via.placeholder.com/400x300?text=No+Image';

          return (
            <div className="col-md-6 col-lg-3 col-12" key={blog._id}>
              <BlogCard
                image={blogImage}
                heading={blog.mainHeading}
                // ✅ Read more will open BlogDetails by slug
                link={`/blog/${blog.slug}`}
              />
            </div>
          );
        })}
      </div>

      {/* VIEW MORE BUTTON CENTERED */}
      <div className={Style.blogViewMoreWrapper}>
        <Link to="/Blog" className={Style.blogcardbutton1}>
          View all blogs
        </Link>
      </div>
    </div>
  );
}
