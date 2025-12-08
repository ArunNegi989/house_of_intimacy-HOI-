import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'What size should I order?',
      answer:
        "We recommend checking our detailed size guide before ordering. Measure your waist and hips, then compare with our size chart. If you're between sizes, we suggest sizing up for comfort. Remember, different styles may fit differently - briefs tend to run true to size while thongs may run slightly small.",
    },
    {
      question: 'What materials are your underwear made from?',
      answer:
        'Our collection features premium materials including organic cotton, breathable modal, moisture-wicking microfiber, and luxurious silk blends. Each product page lists specific fabric compositions. We prioritize soft, hypoallergenic materials that are gentle on sensitive skin and designed for all-day comfort.',
    },
    {
      question: 'How do I care for my underwear?',
      answer:
        'For longest-lasting quality, we recommend hand washing in cold water with mild detergent. If machine washing, use a delicate cycle in a mesh laundry bag. Avoid bleach and fabric softeners. Air dry when possible - heat from dryers can break down elastic fibers. Store folded in a drawer away from direct sunlight.',
    },
    {
      question: 'What is your return and exchange policy?',
      answer:
        'We accept returns and exchanges within 30 days of purchase. For hygiene reasons, underwear must be unworn, unwashed, and in original packaging with tags attached. Simply initiate a return through your account dashboard or contact our customer service team. Refunds are processed within 5-7 business days of receiving your return.',
    },
    {
      question: 'Do you offer subscription or bundle discounts?',
      answer:
        'Yes! Subscribe to our monthly delivery service and save 15% on every order. We also offer multi-pack bundles with savings up to 20%. Join our loyalty program to earn points on every purchase, which can be redeemed for discounts. Sign up for our newsletter to receive exclusive offers and early access to sales.',
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #ffeef8 0%, #fff5f7 50%, #ffe8f0 100%)',
      padding: '40px 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    content: {
      maxWidth: '900px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px',
    },
    title: {
      fontSize: '2.8rem',
      color: '#d63384',
      marginBottom: '15px',
      fontWeight: '700',
      letterSpacing: '-0.5px',
    },
    subtitle: {
      fontSize: '1.1rem',
      color: '#666',
      fontWeight: '400',
    },
    faqList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginBottom: '60px',
    },
    faqItem: {
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 2px 8px rgba(214, 51, 132, 0.08)',
      transition: 'all 0.3s ease',
    },
    faqItemActive: {
      boxShadow: '0 6px 20px rgba(214, 51, 132, 0.2)',
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
      transition: 'all 0.3s ease',
    },
    questionButtonActive: {
      color: '#d63384',
      borderBottom: '1px solid #ffe8f0',
    },
    icon: {
      flexShrink: 0,
      transition: 'transform 0.3s ease',
      color: '#d63384',
    },
    iconRotated: {
      transform: 'rotate(180deg)',
    },
    answer: {
      maxHeight: '0',
      overflow: 'hidden',
      transition: 'all 0.4s ease',
    },
    answerOpen: {
      maxHeight: '500px',
      padding: '10px 30px 25px',
    },
    answerContent: {
      color: '#555',
      lineHeight: '1.7',
      fontSize: '1rem',
    },
    footer: {
      textAlign: 'center',
      padding: '50px 20px',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 16px rgba(214, 51, 132, 0.1)',
    },
    footerTitle: {
      fontSize: '1.8rem',
      color: '#333',
      marginBottom: '10px',
      fontWeight: '600',
    },
    footerText: {
      color: '#666',
      fontSize: '1rem',
      marginBottom: '25px',
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
      boxShadow: '0 4px 12px rgba(214, 51, 132, 0.3)',
    },
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
      <section className="FAQ">
        <div style={styles.container}>
          <div style={styles.content}>
            <div style={styles.header}>
              <h1 style={styles.title}>Frequently Asked Questions</h1>
              <p style={styles.subtitle}>
                Find answers to common questions about our products and services
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
                      ...(isOpen ? styles.faqItemActive : {}),
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 16px rgba(214, 51, 132, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isOpen) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow =
                          '0 2px 8px rgba(214, 51, 132, 0.08)';
                      }
                    }}
                  >
                    <button
                      style={{
                        ...styles.questionButton,
                        ...(isOpen ? styles.questionButtonActive : {}),
                      }}
                      onClick={() => toggleFAQ(index)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = '#d63384')
                      }
                      onMouseLeave={(e) => {
                        if (!isOpen) e.currentTarget.style.color = '#333';
                      }}
                    >
                      <span>{faq.question}</span>
                      <svg
                        style={{
                          ...styles.icon,
                          ...(isOpen ? styles.iconRotated : {}),
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
                    <div
                      style={{
                        ...styles.answer,
                        ...(isOpen ? styles.answerOpen : {}),
                      }}
                    >
                      <div style={styles.answerContent}>{faq.answer}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={styles.footer}>
              <h3 style={styles.footerTitle}>Still have questions?</h3>
              <p style={styles.footerText}>
                Our customer service team is here to help
              </p>
              <Link to="/contactUs" style={{ textDecoration: 'none' }}>
                <button
                  style={styles.contactBtn}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow =
                      '0 6px 20px rgba(214, 51, 132, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 12px rgba(214, 51, 132, 0.3)';
                  }}
                >
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
