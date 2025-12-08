// src/pages/AllBlogs.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Style from '../../assets/styles/AllBlogs.module.css';
import Photo from '../../assets/images/fake/DSC05179.JPG'; // fallback image

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');
const BLOGS_PER_PAGE = 12;

export function AllBlogs() {
  const [blogs, setBlogs] = useState([]); // current page blogs
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [totalBlogs, setTotalBlogs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // 🔹 helper: strip HTML from introParagraph to show clean text snippet
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // 🔹 fetch blogs from backend (server-side pagination)
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await axios.get(
          `${baseUrl}/myblogs/allblogs?page=${currentPage}&limit=${BLOGS_PER_PAGE}`,
        );

        const payload = res.data || {};
        const list = payload.blogs || [];

        // only published blogs on frontend
        const published = list.filter((b) => b.status === 'published');

        setBlogs(published);
        setTotalBlogs(payload.total || published.length);
        setTotalPages(
          payload.pagination?.totalPages ||
            payload.pages ||
            Math.max(1, Math.ceil((payload.total || 0) / BLOGS_PER_PAGE)),
        );
      } catch (err) {
        console.error('AllBlogs fetch error:', err);
        setError(
          err.response?.data?.message ||
            'Failed to load blogs. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className={Style.pageWrapper}>
      <div className="container">
        {/* HERO / INTRO */}
        <div className={Style.hero}>
          <div className={Style.heroBadge}>HOI Lingerie Journal</div>
          <h1 className={Style.heroTitle}>All Blogs & Styling Guides</h1>
          <p className={Style.heroSubtitle}>
            Explore comfort, confidence, and everyday lingerie tips curated by
            the House of Intimacy team.
          </p>
        </div>

        {/* LOADING / ERROR */}
        {loading && (
          <div className={Style.centerBox}>
            <p>Loading blogs...</p>
          </div>
        )}

        {!loading && error && (
          <div className={Style.centerBox}>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* STATS ROW */}
            <div className={Style.statsRow}>
              <span className={Style.statItem}>
                <span className={Style.statLabel}>Total Blogs</span>
                <span className={Style.statValue}>{totalBlogs}</span>
              </span>
              <span className={Style.statItem}>
                <span className={Style.statLabel}>Page</span>
                <span className={Style.statValue}>
                  {totalPages === 0 ? 0 : currentPage} / {totalPages || 1}
                </span>
              </span>
            </div>

            {/* BLOG CARDS GRID */}
            {blogs.length === 0 ? (
              <div className={Style.centerBox}>
                <p>No blogs found.</p>
              </div>
            ) : (
              <div className="row">
                {blogs.map((blog) => {
                  const created = blog.createdAt
                    ? new Date(blog.createdAt)
                    : null;

                  const dateStr = created
                    ? created.toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '';

                  const timeStr = created
                    ? created.toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '';

                  const featureImageUrl = blog.featureImage
                    ? `${apiRoot}${blog.featureImage}`
                    : Photo;

                  const rawSnippet =
                    blog.metaDescription || stripHtml(blog.introParagraph);
                  const snippet =
                    rawSnippet && rawSnippet.length > 170
                      ? rawSnippet.slice(0, 170) + '...'
                      : rawSnippet;

                  const day = created
                    ? created.toLocaleDateString('en-IN', {
                        day: '2-digit',
                      })
                    : '';
                  const month = created
                    ? created.toLocaleDateString('en-IN', {
                        month: 'short',
                      })
                    : '';

                  return (
                    <div
                      className="col-lg-4 col-md-6 mb-4"
                      key={blog._id || blog.slug}
                    >
                      {/* 🔹 whole card clickable */}
                      <Link
                        to={`/blog/${blog.slug}`}
                        className={Style.cardLink}
                      >
                        <article className={Style.blogCard}>
                          <div className={Style.cardImageWrapper}>
                            <img
                              src={featureImageUrl}
                              alt={blog.mainHeading}
                              className={Style.cardImage}
                            />
                            {dateStr && (
                              <div className={Style.dateBadge}>
                                <span className={Style.dateDay}>{day}</span>
                                <span className={Style.dateMonth}>{month}</span>
                              </div>
                            )}
                            <div className={Style.cardImageOverlay}>
                              <span>View details →</span>
                            </div>
                          </div>

                          <div className={Style.cardBody}>
                            <div className={Style.cardTopMeta}>
                              {blog.category && (
                                <span className={Style.categoryChip}>
                                  {blog.category}
                                </span>
                              )}
                              {timeStr && (
                                <span className={Style.timeMeta}>
                                  {timeStr}
                                </span>
                              )}
                            </div>

                            <h2 className={Style.cardTitle}>
                              {blog.mainHeading}
                            </h2>

                            {snippet && (
                              <p className={Style.cardDescription}>{snippet}</p>
                            )}

                            <div className={Style.cardFooter}>
                              <span className={Style.readMoreBtn}>
                                Read article <span>→</span>
                              </span>
                            </div>
                          </div>
                        </article>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}

            {/* PAGINATION */}
            {totalBlogs > BLOGS_PER_PAGE && (
              <div className={Style.paginationWrapper}>
                <button
                  type="button"
                  className={Style.pageNavBtn}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>

                <div className={Style.pageNumbers}>
                  {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        type="button"
                        className={`${Style.pageNumberBtn} ${
                          page === currentPage ? Style.activePage : ''
                        }`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>

                <button
                  type="button"
                  className={Style.pageNavBtn}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
