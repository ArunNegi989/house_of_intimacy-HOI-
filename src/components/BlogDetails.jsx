import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Style from '../assets/styles/BlogDetails.module.css';
import Photo from "../assets/images/fake/DSC05179.JPG";
import Photo2 from "../assets/images/fake/DSC05232.JPG";


export function BlogDetails() {
   const [openIndex, setOpenIndex] = useState(null);
  
    const faqs = [
      {
        question: "What size should I order?",
        answer: "We recommend checking our detailed size guide before ordering. Measure your waist and hips, then compare with our size chart. If you're between sizes, we suggest sizing up for comfort. Remember, different styles may fit differently - briefs tend to run true to size while thongs may run slightly small."
      },
      {
        question: "What materials are your underwear made from?",
        answer: "Our collection features premium materials including organic cotton, breathable modal, moisture-wicking microfiber, and luxurious silk blends. Each product page lists specific fabric compositions. We prioritize soft, hypoallergenic materials that are gentle on sensitive skin and designed for all-day comfort."
      },
      {
        question: "How do I care for my underwear?",
        answer: "For longest-lasting quality, we recommend hand washing in cold water with mild detergent. If machine washing, use a delicate cycle in a mesh laundry bag. Avoid bleach and fabric softeners. Air dry when possible - heat from dryers can break down elastic fibers. Store folded in a drawer away from direct sunlight."
      },
      {
        question: "What is your return and exchange policy?",
        answer: "We accept returns and exchanges within 30 days of purchase. For hygiene reasons, underwear must be unworn, unwashed, and in original packaging with tags attached. Simply initiate a return through your account dashboard or contact our customer service team. Refunds are processed within 5-7 business days of receiving your return."
      },
      {
        question: "Do you offer subscription or bundle discounts?",
        answer: "Yes! Subscribe to our monthly delivery service and save 15% on every order. We also offer multi-pack bundles with savings up to 20%. Join our loyalty program to earn points on every purchase, which can be redeemed for discounts. Sign up for our newsletter to receive exclusive offers and early access to sales."
      }
    ];
  
    const toggleFAQ = (index) => {
      setOpenIndex(openIndex === index ? null : index);
    };
  
    const styles = {
      FaqContainer: {
        background: 'linear-gradient(135deg, #ffeef8 0%, #fff5f7 50%, #ffe8f0 100%)',
        padding: '40px 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      },
       Conclusion: {
        background: '#fff',
        padding: '40px 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        textAlign: "center"
      },
      content: {
        maxWidth: '900px',
        margin: '0 auto'
      },
      header: {
        textAlign: 'center',
        marginBottom: '50px'
      },
      title: {
        fontSize: '2.8rem',
        color: 'black',
        marginBottom: '15px',
        fontWeight: '700',
        letterSpacing: '-0.5px'
      },
      subtitle: {
        fontSize: '1.1rem',
        color: '#666',
        fontWeight: '400'
      },
      faqList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        marginBottom: '60px'
      },
      faqItem: {
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(214, 51, 132, 0.08)',
        transition: 'all 0.3s ease'
      },
      faqItemActive: {
        boxShadow: '0 6px 20px rgba(214, 51, 132, 0.2)'
      },
      questionButton: {
        width: '100%',
        padding: '25px 30px',
        background: 'transparent',
        border: 'none',
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#333',
        transition: 'all 0.3s ease'
      },
      questionButtonActive: {
        color: '#d63384',
        borderBottom: '1px solid #ffe8f0'
      },
      icon: {
        flexShrink: 0,
        transition: 'transform 0.3s ease',
        color: '#d63384'
      },
      iconRotated: {
        transform: 'rotate(180deg)'
      },
      answer: {
        maxHeight: '0',
        overflow: 'hidden',
        transition: 'all 0.4s ease'
      },
      answerOpen: {
        maxHeight: '500px',
        padding: '10px 30px 25px'
      },
      answerContent: {
        color: '#555',
        lineHeight: '1.7',
        fontSize: '1rem'
      },
      footer: {
        textAlign: 'center',
        padding: '50px 20px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(214, 51, 132, 0.1)'
      },
      footerTitle: {
        fontSize: '1.8rem',
        color: '#333',
        marginBottom: '10px',
        fontWeight: '600'
      },
      footerText: {
        color: '#666',
        fontSize: '1rem',
        marginBottom: '25px'
      },
      contactBtn: {
        background: 'linear-gradient(135deg, #d63384 0%, #e91e63 100%)',
        color: 'white',
        border: 'none',
        padding: '15px 40px',
        fontSize: '1.05rem',
        fontWeight: '600',
        borderRadius: '30px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(214, 51, 132, 0.3)'
      }
    };
  
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const isMobile = mediaQuery.matches;
  
    if (isMobile) {
      styles.title.fontSize = '2rem';
      styles.subtitle.fontSize = '1rem';
      styles.questionButton.padding = '20px 20px';
      styles.questionButton.fontSize = '1rem';
    }
    
  return (
    <>
    <section className={Style.homePadding}>
        <div className="container py-5">
      <div className="row">
        {/* Main Blog Content */}
        <div className="col-lg-8">
          {/* Main Heading */}
          <h1 className={Style.HeadHome} mb-3>
            How to Choose Innerwear Based on Your Daily Lifestyle

          </h1>
          
          {/* Date and Time */}
          <div className={Style.blogmetA}>
            <span className="me-3">
              <i className="bi bi-clock me-1"></i>10:30 AM
            </span>
            <span className="me-3">
              <i className="bi bi-calendar me-1"></i>December 03, 2025
            </span>
          </div>

          {/* Main Image */}
          <img 
              src={Photo} 
            alt="Blog main" 
            className="img-fluid rounded mb-4 w-100"
          />
           <p className={Style.blogparagraph}>
            hoosing the right innerwear is not just about clothing—it’s about comfort, hygiene, 
            confidence, and daily performance. Every person has a different routine, and your innerwear should match your lifestyle. Whether you spend long hours at the office, travel frequently, or prefer relaxed home days, the right innerwear can improve your comfort throughout the day. At House of Intimacy, we help men and women select innerwear that fits their lifestyle perfectly
          </p>
          {/* Section 1 */}
          <h2 className={Style.blogheading2}>
            For Working Professionals
          </h2>
          <h3>Comfort That Supports Your Day</h3>
          <p className={Style.blogparagraph}>
            If your routine includes long hours at the office, commuting, or handling both desk and field work, innerwear that focuses on breathability and all-day comfort is essential. Soft, stretchable vests or camisoles, lightweight thermals (during winter), and seamless inner layers ensure that you stay comfortable even through long meetings or tight schedules.
          </p>
           <h3>Why It Matters</h3>
           <p className={Style.blogparagraph}>Seamless and breathable options prevent irritation, help maintain freshness, and keep your outfit smooth and presentable. This makes your workday more comfortable and stress-free.
           </p>

          {/* Image 2 */}
          <img 
            src='https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80' 
            alt="Section 2" 
            className="img-fluid rounded mb-4 w-100"
          />
          

          {/* Section 2 */}
          <h2 className={Style.blogheading2}>
            For Students & College-Goers
          </h2>
          <h3>Comfort for Active Daily Routines</h3>
          <p className={Style.blogparagraph}>
           Students need innerwear that can handle long schedules, travel, and movement. Breathable cotton vests, flexible undershirts, and soft homewear pieces are ideal for long college days, tuition sessions, and outings.
          </p>
           <h3>Why It Matters</h3>
           <p className={Style.blogparagraph}>These choices help control sweat, prevent discomfort, and support all-day movement—essential for active student life.
          </p>
         {/* Section 3 */}
          <h2 className={Style.blogheading2}>
           For Active & Fitness Lifestyles
          </h2>
          <h3>Support for Physical Activities</h3>
          <p className={Style.blogparagraph}>
             People who walk, run, exercise, or engage in sports should choose innerwear designed to support movement and manage sweat. Moisture-wicking vests, quick-dry layers, and active innerwear made with stretchable fabric provide comfort during workouts.
          </p>
           <h3>Why It Matters</h3>
           <p className={Style.blogparagraph}>These fabrics reduce sweat buildup, prevent friction, and help maintain body temperature, giving you a better workout experience.
           </p>
         {/* Section 4 */}
          <h2 className={Style.blogheading2}>
            For Weddings, Festivals & Occasions
          </h2>
          <h3>Smooth Foundation for Special Outfits</h3>
          <p className={Style.blogparagraph}>
           Students For ethnic wear, party outfits, and wedding clothes, innerwear should enhance the shape and comfort of your outfit. Seamless inner layers and shapewear give a smooth, clean silhouette under sarees, gowns, kurtas, and suits.
          </p>
           <h3>Why It Matters</h3>
           <p className={Style.blogparagraph}>The right innerwear improves posture, confidence, and the overall look of festive outfits.
           </p>
        </div>

        {/* Sidebar - Recent Blogs */}
        <div className="col-lg-4">
          <div className={Style.recentblogswrapper}>
            <div className={Style.recentblogsbox}>
              <h3 className={Style.sidebartitle}>Recent Blogs</h3>
              
              {/* Recent Blog 1 */}
              <div className={Style.recentblogitem}>
                <img 
                  src={Photo} 
                  alt="Recent blog 1" 
                  className="img-fluid rounded mb-2"
                />
                <h5 className={Style.recentblogtitle}>
                  Understanding React Server Components
                </h5>
              </div>
              <hr className={Style.BlogHr}/>

              {/* Recent Blog 2 */}
              <div className={Style.recentblogitem}>
                <img 
                    src={Photo} 
                  alt="Recent blog 2" 
                  className="img-fluid rounded mb-2"
                />
                <h5 className={Style.recentblogtitle}>
                  CSS Grid vs Flexbox: When to Use What
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </section>
    {/* ******FAQ******* */}
    {/* <section className='FAQ' >
         <div style={styles.FaqContainer}>
        <div style={styles.content}>
          <div style={styles.header}>
            <h1 style={styles.title}>Why Choose Lifestyle-Based Innerwear from House of Intimacy?</h1>
            <p style={styles.subtitle}>At House of Intimacy, you can find innerwear for every lifestyle—whether relaxing at home, working long hours, exercising, or traveling. Our collection includes breathable vests, 
              soft camisoles, active innerwear, stylish lounge sets, premium nightwear, thermals, and seasonal comfortwear. Each product is handpicked for comfort, durability, and daily usability.
</p>
          </div>
  
          <div style={styles.faqList}>
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  style={{
                    ...styles.faqItem,
                    ...(isOpen ? styles.faqItemActive : {})
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(214, 51, 132, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isOpen) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(214, 51, 132, 0.08)';
                    }
                  }}
                >
                  <button 
                    style={{
                      ...styles.questionButton,
                      ...(isOpen ? styles.questionButtonActive : {})
                    }}
                    onClick={() => toggleFAQ(index)}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d63384'}
                    onMouseLeave={(e) => {
                      if (!isOpen) e.currentTarget.style.color = '#333';
                    }}
                  >
                    <span>{faq.question}</span>
                    <svg 
                      style={{
                        ...styles.icon,
                        ...(isOpen ? styles.iconRotated : {})
                      }}
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>
                  <div style={{
                    ...styles.answer,
                    ...(isOpen ? styles.answerOpen : {})
                  }}>
                    <div style={styles.answerContent}>
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </section> */}

      {/* Conclusion */}
      <section className={Style.Conclusion}>
       <h2 className={Style.blogheading2}>
            Conclusion
          </h2>
          <p>Choosing innerwear according to your daily lifestyle can improve comfort, freshness, and confidence throughout the day. Instead of one-size-fits-all, selecting innerwear that matches your routine ensures better hygiene, better movement, and better well-being.
            Explore lifestyle-friendly comfortwear for men and women at House of Intimacy, where comfort meets everyday living.
          </p>
      </section>
    </>
    
  );
};