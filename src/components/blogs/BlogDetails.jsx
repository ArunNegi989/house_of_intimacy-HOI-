// src/pages/BlogDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Style from '../../assets/styles/BlogDetails.module.css';
import Photo from '../../assets/images/fake/DSC05179.JPG';

const baseUrl = process.env.REACT_APP_APIURL || 'http://localhost:8000/v1';
const apiRoot = baseUrl.replace(/\/v1$/, '');

export function BlogDetails() {
  const { slug } = useParams(); // URL: /blog/:slug

  const [blog, setBlog] = useState(null);
  const [recentBlogs, setRecentBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 🔹 Fetch single blog + recent blogs
  useEffect(() => {
    const fetchBlogAndRecent = async () => {
      try {
        setLoading(true);
        setError('');

        // 1️⃣ Single blog by slug → GET /v1/myblogs/slug/:slug
        const blogRes = await axios.get(`${baseUrl}/myblogs/slug/${slug}`);
        const blogData = blogRes.data;

        // 2️⃣ All blogs for sidebar
        const listRes = await axios.get(`${baseUrl}/myblogs/allblogs`);
        const listPayload = listRes.data || {};
        const listData = listPayload.blogs || [];

        // Only published and not the same slug
        const published = listData.filter(
          (b) => b.status === 'published' && b.slug !== slug,
        );

        // Sort latest first
        const sorted = [...published].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setBlog(blogData);
        setRecentBlogs(sorted.slice(0, 3)); // 3 recent blogs
      } catch (err) {
        console.error('Blog fetch error:', err);
        setError(
          err.response?.data?.message ||
            'Failed to load blog. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlogAndRecent();
  }, [slug]);

  // 🔹 Set page title (SEO) when blog changes
  useEffect(() => {
    if (!blog) return;
    document.title =
      blog.metaTitle || blog.seoTitle || blog.mainHeading || 'Blog Details';
  }, [blog]);

  // ----- Loading / Error -----
  if (loading) {
    return (
      <section className={Style.homePadding}>
        <div className="container py-5">
          <p>Loading blog...</p>
        </div>
      </section>
    );
  }

  if (error || !blog) {
    return (
      <section className={Style.homePadding}>
        <div className="container py-5">
          <p>{error || 'Blog not found.'}</p>
        </div>
      </section>
    );
  }

  // ----- Date & time formatting -----
  const created = blog.createdAt ? new Date(blog.createdAt) : null;
  const timeStr = created
    ? created.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
  const dateStr = created
    ? created.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  // ----- Feature image -----
  const featureImageUrl = blog.featureImage
    ? `${apiRoot}${blog.featureImage}`
    : Photo;

  // ----- Share URLs -----
  const encodedTitle = encodeURIComponent(blog.mainHeading || 'HOI Blog');
  const encodedUrl =
    typeof window !== 'undefined'
      ? encodeURIComponent(window.location.href)
      : '';

  const whatsappShare = `https://wa.me/?text=${encodedTitle}%20-%20${encodedUrl}`;
  const twitterShare = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const facebookShare = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

  return (
    <>
      {/* ========== MAIN SECTION ========== */}
      <section className={Style.homePadding}>
        <div className="container">
          {/* Breadcrumb + small meta ribbon */}
          <div className={Style.heroTopRow}>
            <div className={Style.breadcrumb}>
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/blogs">Blog</Link>
              <span>/</span>
              <span className={Style.breadcrumbCurrent}>
                {blog.mainHeading?.slice(0, 40) || 'Details'}...
              </span>
            </div>

            <div className={Style.heroRightBadges}>
              <span className={Style.pageBadge}>HOI Blog</span>
              {blog.category && (
                <span className={Style.pageCategory}>{blog.category}</span>
              )}
            </div>
          </div>

          <div className="row">
            {/* ========== MAIN BLOG CONTENT ========== */}
            <div className={`col-lg-7 ${Style.leftCol}`}>
              <article className={Style.blogCard}>
                {/* Decorative halo */}
                <div className={Style.blogHalo} />

                {/* Main Heading from DB */}
                <h1 className={Style.HeadHome}>{blog.mainHeading}</h1>

                {/* Meta row pills */}
                <div className={Style.blogmeta}>
                  {dateStr && (
                    <span className={Style.metaPill}>
                      <i className="bi bi-calendar me-1"></i>
                      {dateStr}
                    </span>
                  )}
                  {timeStr && (
                    <span className={Style.metaPill}>
                      <i className="bi bi-clock me-1"></i>
                      {timeStr}
                    </span>
                  )}
                  {blog.readTime && (
                    <span className={`${Style.metaPill} ${Style.readTimePill}`}>
                      <i className="bi bi-book me-1"></i>
                      {blog.readTime}
                    </span>
                  )}
                </div>

                {/* Tags */}
                {Array.isArray(blog.tags) && blog.tags.length > 0 && (
                  <div className={Style.tagRow}>
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className={Style.tagChip}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Share Row */}
                <div className={Style.shareRow}>
                  <span className={Style.shareLabel}>Share this article</span>
                  <div className={Style.shareIcons}>
                    <a
                      href={whatsappShare}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Share on WhatsApp"
                    >
                      <i className="bi bi-whatsapp"></i>
                    </a>
                    <a
                      href={twitterShare}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Share on Twitter"
                    >
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a
                      href={facebookShare}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Share on Facebook"
                    >
                      <i className="bi bi-facebook"></i>
                    </a>
                    <button
                      type="button"
                      className={Style.copyLinkBtn}
                      onClick={() => {
                        if (
                          typeof window !== 'undefined' &&
                          navigator?.clipboard
                        ) {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied!');
                        }
                      }}
                    >
                      <i className="bi bi-link-45deg"></i>
                    </button>
                  </div>
                </div>

                {/* Main Image */}
                <div className={Style.featureImageWrapper}>
                  <img
                    src={featureImageUrl}
                    alt={blog.mainHeading}
                    className={Style.featureImage}
                  />
                </div>

                {/* Intro Paragraph (HTML from DB) */}
                {blog.introParagraph && (
                  <div
                    className={Style.blogparagraph}
                    dangerouslySetInnerHTML={{ __html: blog.introParagraph }}
                  />
                )}

                {/* Section 2 */}
                {blog.heading2 && (
                  <h2 className={Style.blogheading2}>{blog.heading2}</h2>
                )}
                {blog.body2 && (
                  <div
                    className={Style.blogparagraph}
                    dangerouslySetInnerHTML={{ __html: blog.body2 }}
                  />
                )}

                {/* Section 3 */}
                {blog.heading3 && (
                  <h2 className={Style.blogheading2}>{blog.heading3}</h2>
                )}
                {blog.body3 && (
                  <div
                    className={Style.blogparagraph}
                    dangerouslySetInnerHTML={{ __html: blog.body3 }}
                  />
                )}

                {/* Section 4 */}
                {blog.heading4 && (
                  <h2 className={Style.blogheading2}>{blog.heading4}</h2>
                )}
                {blog.body4 && (
                  <div
                    className={Style.blogparagraph}
                    dangerouslySetInnerHTML={{ __html: blog.body4 }}
                  />
                )}

                {/* Section 5 */}
                {blog.heading5 && (
                  <h2 className={Style.blogheading2}>{blog.heading5}</h2>
                )}
                {blog.body5 && (
                  <div
                    className={Style.blogparagraph}
                    dangerouslySetInnerHTML={{ __html: blog.body5 }}
                  />
                )}

                {/* Optional gallery */}
                {Array.isArray(blog.galleryImages) &&
                  blog.galleryImages.length > 0 && (
                    <div className={Style.galleryWrapper}>
                      <h3 className={Style.blogheading2}>Gallery</h3>
                      <div className="row g-3">
                        {blog.galleryImages.map((img, idx) => (
                          <div className="col-md-6 col-12" key={idx}>
                            <div className={Style.galleryItem}>
                              <img
                                src={`${apiRoot}${img}`}
                                alt={`Gallery ${idx + 1}`}
                                className={Style.galleryImg}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </article>
            </div>

            {/* ========== SIDEBAR – RECENT BLOGS ========== */}
            <div className={`col-lg-5 ${Style.rightCol}`}>
              <aside className={Style.recentblogswrapper}>
                <div className={Style.recentblogsbox}>
                  <h3 className={Style.sidebartitle}>Recent Blogs</h3>

                  {recentBlogs.length === 0 && (
                    <p className="mb-0">No recent blogs found.</p>
                  )}

                  {recentBlogs.map((item) => {
                    const recentImg = item.featureImage
                      ? `${apiRoot}${item.featureImage}`
                      : Photo;

                    const recentCreated = item.createdAt
                      ? new Date(item.createdAt)
                      : null;
                    const recentDateStr = recentCreated
                      ? recentCreated.toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '';

                    return (
                      <React.Fragment key={item._id}>
                        <Link
                          to={`/blog/${item.slug}`}
                          className={Style.recentblogitemLink}
                        >
                          <div className={Style.recentblogitem}>
                            <div className={Style.recentThumb}>
                              <img
                                src={recentImg}
                                alt={item.mainHeading}
                                className="img-fluid"
                              />
                            </div>
                            <div className={Style.recentContent}>
  <h5 className={Style.recentblogtitle}>
    {item.mainHeading}
  </h5>

  {/* 👇 FIRST PARAGRAPH FROM body2 */}
  {item.body2 && (
    <p className={Style.recentPara}>
      {item.body2.replace(/<[^>]+>/g, "").substring(0, 100)}...
    </p>
  )}

  {recentDateStr && (
    <small className={Style.recentDate}>
      <i className="bi bi-calendar me-1"></i>
      {recentDateStr}
    </small>
  )}
</div>

                          </div>
                        </Link>
                        <hr className={Style.BlogHr} />
                      </React.Fragment>
                    );
                  })}

                  <div className={Style.backToList}>
                    <Link to="/Blog">← Back to all blogs</Link>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONCLUSION ========== */}
      <section className={Style.Conclusion}>
        <div className="container">
          <div className={Style.conclusionCard}>
            <div className={Style.conclusionBadge}>HOI Insider Tip</div>
            <h2 className={Style.conclusionTitle}>Conclusion</h2>
            {blog.conclusion ? (
              <div
                className={Style.conclusionBody}
                dangerouslySetInnerHTML={{ __html: blog.conclusion }}
              />
            ) : (
              <p className={Style.conclusionBody}>
                Choosing innerwear according to your daily lifestyle can improve
                comfort, freshness, and confidence throughout the day.
              </p>
            )}

            <div className={Style.conclusionCTA}>
              <p>
                Ready for more?{' '}
                <Link to="/Blog">Browse all HOI lingerie guides →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
