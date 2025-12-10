// src/components/Home/BlogCards.jsx
import React, { useEffect, useState } from 'react';
import Style from '../../assets/styles/blogscard.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');


// =========================
// Blog Card Component
// =========================
const BlogCard = ({ image, heading, link, date, para }) => {
  // Format date
  const formattedDate = new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Clean HTML tags + shorten
  const cleanPara = para
    ? para.replace(/<[^>]+>/g, "").substring(0, 120) + "..."
    : "";

  return (
    <Link to={link} className={Style.blogcardWrapper}>
      <div className={Style.blogcard}>

        {/* IMAGE + OVERLAY DATE */}
        <div className={Style.blogcardimage}>
          <span className={Style.dateBadge}>{formattedDate}</span>
          <img src={image} alt={heading} />
        </div>

        {/* CONTENT BELOW IMAGE */}
        <div className={Style.blogcardcontent}>
          <h3 className={Style.blogcardheading}>{heading}</h3>

          {/* BLOG FIRST PARA FROM body2 */}
          <p className={Style.blogPara}>{cleanPara}</p>

          <span className={Style.blogcardbutton}>Read More</span>
        </div>
      </div>
    </Link>
  );
};


// =========================
// BlogCards Main Component
// =========================
export default function BlogCards() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${baseUrl}/myblogs/allblogs`);
        const list = res.data?.blogs || [];

        const published = list.filter((b) => b.status === "published");

        const sorted = published.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setBlogs(sorted.slice(0, 4)); // latest 4 blogs
      } catch (err) {
        console.error("Error fetching blogs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p className="text-center py-3">Loading blogs...</p>;
  if (blogs.length === 0) return <p className="text-center py-3">No blogs found.</p>;

  return (
    <div className={Style.blogcardscontainer}>

      {/* Section Header */}
      <div className={Style.blogSectionHeader}>
        <h2 className={Style.blogSectionTitle}>From our HOI Blog</h2>
        <p className={Style.blogSectionSubtitle}>
          Quick reads on comfort, styling, and everyday lingerie care —
          curated by the House of Intimacy team.
        </p>
      </div>

      {/* Blog Cards */}
      <div className="row g-4">
        {blogs.map((blog) => {
          const blogImage = blog.featureImage
            ? `${apiRoot}${blog.featureImage}`
            : "https://via.placeholder.com/400x300?text=No+Image";

          return (
            <div className="col-md-6 col-lg-3 col-12" key={blog._id}>
              <BlogCard
                image={blogImage}
                heading={blog.mainHeading}
                date={blog.createdAt}
                para={blog.body2}     // ✅ SHOW body2 FIRST PARAGRAPH
                link={`/blog/${blog.slug}`}
              />
            </div>
          );
        })}
      </div>

      {/* VIEW ALL BUTTON */}
      <div className={Style.blogViewMoreWrapper}>
        <Link to="/Blog" className={Style.blogcardbutton1}>
          View all blogs
        </Link>
      </div>
    </div>
  );
}
