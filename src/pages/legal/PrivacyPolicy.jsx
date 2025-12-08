// src/pages/legal/PrivacyPolicy.jsx
import React, { useEffect } from 'react';
import styles from '../../assets/styles/legal/PrivacyPolicy.module.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.page}>
      {/* Top Hero / Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          {/* Top Label */}
          <p className={styles.badge}>House of Intimacy • Privacy First</p>

          {/* Title */}
          <h1 className={styles.title}>Privacy Policy</h1>

          {/* Subtitle */}
          <p className={styles.subtitle}>
            This Privacy Policy explains how <strong>House of Intimacy</strong>{' '}
            (“HOI”, “we”, “us”, or “our”) collects, uses, shares, and protects
            your personal information when you use our website and services.
          </p>

          {/* Updated Date */}
          <p className={styles.updated}>Last updated: DD Month YYYY</p>

          {/* Meta Row */}
          <div className={styles.metaRow}>
            <span className={styles.metaItem}>
              Applies to: HOI website & app
            </span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>Users, customers & visitors</span>
            <span className={styles.metaDot} />
            <span className={styles.metaItem}>India & global users</span>
          </div>

          {/* --- NEW: TRUST BADGES ROW --- */}
          <div className={styles.trustRow}>
            <div className={styles.trustBox}>🔒 100% Secure</div>
            <div className={styles.trustBox}>🛡 No Data Selling</div>
            <div className={styles.trustBox}>📦 Private Packaging</div>
            <div className={styles.trustBox}>🇮🇳 India-based Servers</div>
          </div>

          {/* --- NEW: SHORT SUMMARY BOX --- */}
          <div className={styles.summaryCard}>
            <p className={styles.summaryTitle}>Quick Summary</p>
            <ul className={styles.summaryList}>
              <li>
                We collect only essential information to process your orders and
                improve your shopping experience.
              </li>
              <li>
                Your order, browsing, and account details are kept confidential
                and never shared with advertisers.
              </li>
              <li>
                Payment information is processed only by trusted, PCI-DSS
                compliant gateways like Razorpay / Stripe.
              </li>
              <li>
                You can request to delete or update your data at any time.
              </li>
              <li>
                We use encrypted connections (HTTPS) and secure storage to
                protect your personal information.
              </li>
            </ul>
          </div>

          {/* --- NEW: PACKAGING PRIVACY --- */}
          <div className={styles.packageNote}>
            📦 <strong>Discreet Packaging Guarantee:</strong>
            For all orders, the packaging will NOT reveal product type,
            category, or brand name. Your privacy is always protected at the
            delivery stage.
          </div>
        </div>
      </header>

      {/* Layout: Sidebar + Content */}
      <div className={styles.layout}>
        {/* Sidebar navigation */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <p className={styles.sidebarTitle}>On this page</p>
            <nav className={styles.nav}>
              <a href="#introduction" className={styles.navItem}>
                1. Introduction
              </a>
              <a href="#data-we-collect" className={styles.navItem}>
                2. Data We Collect
              </a>
              <a href="#how-we-use-data" className={styles.navItem}>
                3. How We Use Your Data
              </a>
              <a href="#cookies" className={styles.navItem}>
                4. Cookies & Tracking
              </a>
              <a href="#payments" className={styles.navItem}>
                5. Payments & Transactions
              </a>
              <a href="#marketing" className={styles.navItem}>
                6. Marketing & Communications
              </a>
              <a href="#sharing" className={styles.navItem}>
                7. Sharing Your Information
              </a>
              <a href="#retention" className={styles.navItem}>
                8. Data Retention
              </a>
              <a href="#rights" className={styles.navItem}>
                9. Your Rights & Choices
              </a>
              <a href="#children" className={styles.navItem}>
                10. Children’s Privacy
              </a>
              <a href="#third-parties" className={styles.navItem}>
                11. Third-Party Services
              </a>
              <a href="#security" className={styles.navItem}>
                12. Data Security
              </a>
              <a href="#international" className={styles.navItem}>
                13. International Transfers
              </a>
              <a href="#changes" className={styles.navItem}>
                14. Changes to This Policy
              </a>
              <a href="#contact" className={styles.navItem}>
                15. Contact Us
              </a>
            </nav>

            <div className={styles.noteBox}>
              <p className={styles.noteTitle}>Important</p>
              <p className={styles.noteText}>
                This page is a general template. Please update it with your real
                company details and get legal review before publishing.
              </p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className={styles.content}>
          {/* 1. Introduction */}
          <section id="introduction" className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Introduction</h2>
            <p className={styles.sectionText}>
              Welcome to <strong>House of Intimacy</strong> (“HOI”). We respect
              your privacy and are committed to protecting your personal data.
              This Privacy Policy describes how we handle your information when
              you visit our website, create an account, browse products, place
              orders, or interact with our services in any way.
            </p>
            <p className={styles.sectionText}>
              By using our website or services, you agree to the collection and
              use of information in accordance with this Privacy Policy. If you
              do not agree with any part of this policy, please do not use our
              website or services.
            </p>
          </section>

          {/* 2. Data we collect */}
          <section id="data-we-collect" className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Data We Collect</h2>
            <p className={styles.sectionText}>
              We collect different types of information in order to provide and
              improve our services to you.
            </p>

            <h3 className={styles.subTitle}>
              2.1. Information you provide directly
            </h3>
            <ul className={styles.list}>
              <li>
                <strong>Account details:</strong> name, email address, phone
                number, password, profile photo.
              </li>
              <li>
                <strong>Contact & shipping details:</strong> billing address,
                shipping addresses, alternate contact numbers.
              </li>
              <li>
                <strong>Order information:</strong> products you purchase,
                sizes, colors, quantities, preferences.
              </li>
              <li>
                <strong>Support communication:</strong> messages you send via
                email, chat, contact forms, or WhatsApp (if enabled).
              </li>
            </ul>

            <h3 className={styles.subTitle}>
              2.2. Information we collect automatically
            </h3>
            <ul className={styles.list}>
              <li>
                <strong>Usage data:</strong> pages visited, time spent on pages,
                clicks, scrolls, search queries, and interaction with features.
              </li>
              <li>
                <strong>Device & technical data:</strong> IP address, browser
                type and version, device type, operating system, approximate
                location (city/country).
              </li>
              <li>
                <strong>Log data:</strong> server logs, error logs, and other
                diagnostic data to help us improve stability and security.
              </li>
            </ul>

            <h3 className={styles.subTitle}>2.3. Optional data</h3>
            <ul className={styles.list}>
              <li>
                <strong>Marketing preferences:</strong> newsletter subscription,
                SMS/WhatsApp permissions, notification settings.
              </li>
              <li>
                <strong>Wishlist & browsing behaviour:</strong> products you
                wishlist or frequently view, which helps us personalize
                recommendations.
              </li>
            </ul>
          </section>

          {/* 3. How we use your data */}
          <section id="how-we-use-data" className={styles.section}>
            <h2 className={styles.sectionTitle}>3. How We Use Your Data</h2>
            <p className={styles.sectionText}>
              We use your personal information for the following purposes:
            </p>
            <ul className={styles.list}>
              <li>To create and manage your HOI account.</li>
              <li>
                To process your orders, payments, refunds, and customer service
                requests.
              </li>
              <li>
                To deliver your orders to the correct address and keep you
                updated on shipping status.
              </li>
              <li>
                To personalize your experience, including product
                recommendations, recently viewed items, wishlist, and offers.
              </li>
              <li>
                To send you transactional emails and SMS (e.g., order
                confirmations, shipping updates, account alerts).
              </li>
              <li>
                To send you marketing communications (only where permitted by
                law and your preferences).
              </li>
              <li>To improve our website, UX, and services using analytics.</li>
              <li>To detect, prevent, and address fraud or misuse.</li>
              <li>To comply with legal obligations and enforce our terms.</li>
            </ul>
          </section>

          {/* 4. Cookies */}
          <section id="cookies" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              4. Cookies & Tracking Technologies
            </h2>
            <p className={styles.sectionText}>
              We use cookies and similar technologies to operate and improve our
              website. Cookies are small text files stored on your device.
            </p>

            <h3 className={styles.subTitle}>4.1. Types of cookies we use</h3>
            <ul className={styles.list}>
              <li>
                <strong>Essential cookies:</strong> required for basic features
                like login, cart, and checkout.
              </li>
              <li>
                <strong>Performance & analytics cookies:</strong> help us
                understand how users interact with our website.
              </li>
              <li>
                <strong>Preference cookies:</strong> remember your choices such
                as language, currency, or saved addresses.
              </li>
              <li>
                <strong>Marketing cookies:</strong> used to show you relevant
                offers or retargeting ads (if enabled).
              </li>
            </ul>

            <p className={styles.sectionText}>
              You can control or delete cookies through your browser settings.
              However, disabling certain cookies may affect some features of the
              site, such as login or checkout.
            </p>
          </section>

          {/* 5. Payments */}
          <section id="payments" className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Payments & Transactions</h2>
            <p className={styles.sectionText}>
              We use trusted third-party payment gateways to process your
              payments (for example, Razorpay, Stripe, or other providers
              configured for HOI).
            </p>
            <ul className={styles.list}>
              <li>
                We <strong>do not store</strong> your full card details on our
                servers.
              </li>
              <li>
                Payment information is handled by the payment gateway in
                accordance with their own security standards and policies.
              </li>
              <li>
                We may store limited payment metadata (e.g., payment status,
                transaction ID, masked card number) to verify transactions and
                manage orders or refunds.
              </li>
            </ul>
          </section>

          {/* 6. Marketing */}
          <section id="marketing" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              6. Marketing & Communications
            </h2>
            <p className={styles.sectionText}>
              We may send you marketing communications about new launches,
              collections, discounts, and offers, only where permitted by law.
            </p>
            <ul className={styles.list}>
              <li>
                You can unsubscribe from email marketing using the “unsubscribe”
                link in our emails.
              </li>
              <li>
                For SMS or WhatsApp promotions (if used), we will obtain your
                consent where required, and you can opt out by following the
                instructions in the message.
              </li>
              <li>
                Even if you opt out of marketing, we may still send you
                important transactional messages (e.g., order updates).
              </li>
            </ul>
          </section>

          {/* 7. Sharing */}
          <section id="sharing" className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Sharing Your Information</h2>
            <p className={styles.sectionText}>
              We do not sell your personal data. We may share your information
              with:
            </p>
            <ul className={styles.list}>
              <li>
                <strong>Service providers:</strong> such as payment gateways,
                logistics partners, email/SMS providers, analytics services.
              </li>
              <li>
                <strong>Business partners:</strong> where they help deliver our
                services (for example, warehouse or fulfillment partners).
              </li>
              <li>
                <strong>Legal and regulatory authorities:</strong> when required
                to comply with applicable law, legal process, or government
                requests.
              </li>
              <li>
                <strong>Business transfers:</strong> in case of a merger,
                acquisition, or sale of assets, your data may be transferred as
                part of the transaction.
              </li>
            </ul>
            <p className={styles.sectionText}>
              All third parties are required to protect your data and use it
              only for the purposes for which it was shared.
            </p>
          </section>

          {/* 8. Retention */}
          <section id="retention" className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Data Retention</h2>
            <p className={styles.sectionText}>
              We retain your personal information only for as long as necessary
              to fulfill the purposes outlined in this policy, unless a longer
              retention period is required or permitted by law.
            </p>
            <ul className={styles.list}>
              <li>
                Account details and order history may be kept while your account
                is active and for a reasonable period afterwards.
              </li>
              <li>
                Transaction records may be retained to comply with tax,
                accounting, or regulatory requirements.
              </li>
              <li>
                If you request deletion of your account, we will remove or
                anonymize data that is no longer required.
              </li>
            </ul>
          </section>

          {/* 9. Rights */}
          <section id="rights" className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Your Rights & Choices</h2>
            <p className={styles.sectionText}>
              Depending on your location and applicable law, you may have some
              or all of the following rights:
            </p>
            <ul className={styles.list}>
              <li>Right to access the personal data we hold about you.</li>
              <li>Right to correct inaccurate or incomplete information.</li>
              <li>Right to request deletion of your personal data.</li>
              <li>Right to restrict or object to certain processing.</li>
              <li>
                Right to withdraw consent, where processing is based on consent.
              </li>
            </ul>
            <p className={styles.sectionText}>
              To exercise these rights, please contact us using the details in
              the{' '}
              <a href="#contact" className={styles.inlineLink}>
                Contact Us
              </a>{' '}
              section. We may need to verify your identity before responding to
              your request.
            </p>
          </section>

          {/* 10. Children */}
          <section id="children" className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Children’s Privacy</h2>
            <p className={styles.sectionText}>
              Our website and services are not intended for individuals under
              the age of 18. We do not knowingly collect personal information
              from children. If you believe that a child has provided us with
              personal data, please contact us and we will take steps to remove
              such information.
            </p>
          </section>

          {/* 11. Third Parties */}
          <section id="third-parties" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              11. Third-Party Websites & Services
            </h2>
            <p className={styles.sectionText}>
              Our website may contain links to third-party websites, apps, or
              services (such as social networks, payment gateways, or partner
              brands). We are not responsible for the privacy practices or
              content of those third parties.
            </p>
            <p className={styles.sectionText}>
              We recommend that you review the privacy policies of any third-
              party services you use.
            </p>
          </section>

          {/* 12. Security */}
          <section id="security" className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Data Security</h2>
            <p className={styles.sectionText}>
              We implement reasonable technical and organizational measures to
              protect your personal information from unauthorized access, loss,
              misuse, or alteration.
            </p>
            <ul className={styles.list}>
              <li>Secure connections (HTTPS) where applicable.</li>
              <li>Limited access to personal data within our team.</li>
              <li>Regular monitoring of our systems for vulnerabilities.</li>
            </ul>
            <p className={styles.sectionText}>
              However, no method of transmission over the internet or method of
              electronic storage is completely secure. We cannot guarantee
              absolute security.
            </p>
          </section>

          {/* 13. International transfers */}
          <section id="international" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              13. International Data Transfers
            </h2>
            <p className={styles.sectionText}>
              Our servers, service providers, or partners may be located in
              different countries. Your information may therefore be transferred
              and processed outside your country of residence.
            </p>
            <p className={styles.sectionText}>
              Where required by law, we will ensure that such transfers are
              subject to appropriate safeguards to protect your personal data.
            </p>
          </section>

          {/* 14. Changes */}
          <section id="changes" className={styles.section}>
            <h2 className={styles.sectionTitle}>
              14. Changes to This Privacy Policy
            </h2>
            <p className={styles.sectionText}>
              We may update this Privacy Policy from time to time to reflect
              changes in our practices, technologies, legal requirements, or for
              other operational reasons.
            </p>
            <p className={styles.sectionText}>
              When we make changes, we will update the “Last updated” date at
              the top of this page. In some cases, we may also notify you by
              email or show a prominent notice on our website.
            </p>
          </section>

          {/* 15. Contact */}
          <section id="contact" className={styles.section}>
            <h2 className={styles.sectionTitle}>15. Contact Us</h2>
            <p className={styles.sectionText}>
              If you have any questions, concerns, or requests regarding this
              Privacy Policy or our handling of your personal information, you
              can contact us at:
            </p>

            {/* TODO: Replace with your real contact details */}
            <div className={styles.contactCard}>
              <p className={styles.contactName}>House of Intimacy (HOI)</p>
              <p className={styles.contactLine}>
                [Your Registered Company Name]
              </p>
              <p className={styles.contactLine}>[Full Address Line 1]</p>
              <p className={styles.contactLine}>[City, State, PIN, Country]</p>
              <p className={styles.contactLine}>
                Email:{' '}
                <a href="mailto:support@houseofintimacy.com">
                  support@houseofintimacy.com
                </a>
              </p>
              <p className={styles.contactLine}>
                Phone/WhatsApp: +91-XXXXXXXXXX
              </p>
            </div>

            <p className={styles.sectionTextSmall}>
              This Privacy Policy is provided for general information purposes
              and does not constitute legal advice. Please consult a qualified
              legal professional to ensure compliance with applicable laws.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
