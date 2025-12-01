import React from "react";
import styles from "../../assets/styles/RefundPolicy.module.css";

function RefundPolicy() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* ===== HEADER ===== */}
        <header className={styles.header}>
          <div className={styles.headerInner}>
            <p className={styles.badge}>House of Intimacy • Refunds & Cancellations</p>
            <h1 className={styles.title}>Refund & Cancellation Policy</h1>
            <p className={styles.subtitle}>
              This Refund &amp; Cancellation Policy explains when and how{" "}
              <strong>House of Intimacy</strong> (“HOI”, “we”, “us”, or “our”)
              will process cancellations and refunds for your orders.
            </p>
            <p className={styles.updated}>Last updated: DD Month YYYY</p>

            <div className={styles.metaRow}>
              <span className={styles.metaItem}>Applies to orders placed on hoi</span>
              <span className={styles.metaDot} />
              <span className={styles.metaItem}>COD (Dehradun) & Online payments (India)</span>
            </div>
          </div>
        </header>

        {/* ===== MAIN LAYOUT ===== */}
        <main className={styles.mainLayout}>
          {/* LEFT CONTENT */}
          <section className={styles.leftColumn}>
            {/* Section 1 */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>1. General Policy</h2>
              <p className={styles.text}>
                At <strong>House of Intimacy</strong>, we take hygiene and product safety very
                seriously. Because of the intimate nature of our products, we follow a{" "}
                <span className={styles.highlight}>strict no-refund policy after dispatch</span>,
                except in cases where you cancel your order before it is shipped.
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  You can <strong>cancel your order before dispatch</strong> and be eligible for a
                  refund (if already paid online).
                </li>
                <li className={styles.listItem}>
                  Once an order is <strong>dispatched/shipped</strong>,{" "}
                  <span className={styles.highlight}>refund is not applicable</span>.
                </li>
              </ul>
            </section>

            {/* Section 2 */}
<section className={styles.sectionCard}>
  <h2 className={styles.sectionTitle}>
    2. Cash on Delivery (COD) – Inside Dehradun
  </h2>
  <p className={styles.text}>
    We currently provide <strong>Cash on Delivery (COD)</strong> for 
    <span className={styles.highlight}> eligible areas inside Dehradun</span>.
  </p>

  {/* NEW RULE ADDED HERE */}
  <div className={styles.subSection}>
    <h3 className={styles.subTitle}>✨ NEW – Cancellation at the Time of Delivery (Dehradun Only)</h3>
    <ul className={styles.list}>
      <li className={styles.listItem}>
        If you placed a <strong>COD order inside Dehradun</strong>, you can also
        <span className={styles.highlight}> cancel the order when it reaches your location</span>.
      </li>
      <li className={styles.listItem}>
        This cancellation option is <strong>valid only for COD orders inside Dehradun</strong>.
      </li>
      <li className={styles.listItem}>
        Once cancelled at your doorstep, <strong>no refund is needed</strong> since payment was not collected.
      </li>
    </ul>
  </div>

  <div className={styles.subSection}>
    <h3 className={styles.subTitle}>2.1 Cancelling COD orders (before shipping)</h3>
    <ul className={styles.list}>
      <li className={styles.listItem}>
        You may <strong>cancel your COD order before it is shipped</strong>.
      </li>
      <li className={styles.listItem}>
        Since payment is not taken before delivery,{" "}
        <strong>no monetary refund is required</strong>; your order will simply be cancelled.
      </li>
    </ul>
  </div>

  <div className={styles.subSection}>
    <h3 className={styles.subTitle}>2.2 COD orders after dispatch</h3>
    <ul className={styles.list}>
      <li className={styles.listItem}>
        Once your COD order is <strong>dispatched</strong>, cancellation is normally not applicable.
      </li>
      <li className={styles.listItem}>
        However, <span className={styles.highlight}>inside Dehradun only</span>, 
        you may still cancel the order <strong>when our delivery partner reaches your address</strong>.
      </li>
    </ul>
  </div>
</section>


            {/* Section 3 */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>
                3. Online Payments – Orders from within India
              </h2>
              <p className={styles.text}>
                For customers placing <strong>online prepaid orders from anywhere in India</strong>,
                the refund rules are as follows:
              </p>

              <div className={styles.subSection}>
                <h3 className={styles.subTitle}>3.1 Cancellation before dispatch</h3>
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    If you <strong>cancel your order before dispatch</strong>, you are{" "}
                    <strong>eligible for a full refund</strong> of the amount paid online.
                  </li>
                  <li className={styles.listItem}>
                    Refund will be initiated to the{" "}
                    <strong>original payment method</strong> (UPI, card, wallet, netbanking, etc.).
                  </li>
                </ul>
              </div>

              <div className={styles.subSection}>
                <h3 className={styles.subTitle}>3.2 After dispatch</h3>
                <ul className={styles.list}>
                  <li className={styles.listItem}>
                    Once your order is <strong>dispatched/shipped</strong>,{" "}
                    <span className={styles.highlight}>refund is not applicable</span>.
                  </li>
                  <li className={styles.listItem}>
                    We do not accept returns or exchanges after dispatch due to hygiene and safety
                    reasons, except under special conditions mentioned by us in writing.
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>4. How to Cancel Your Order</h2>
              <p className={styles.text}>
                To cancel your order before dispatch, you can use any of the following options:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  Through your <strong>“My Orders”</strong> section on the website/app (if
                  available).
                </li>
                <li className={styles.listItem}>
                  By contacting our <strong>customer support</strong> with your order ID.
                </li>
              </ul>
              <p className={styles.note}>
                <strong>Note:</strong> An order is considered “dispatched” once a tracking ID or
                shipment status is generated by our courier partner.
              </p>
            </section>

            {/* Section 5 */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>5. Refund Processing Time</h2>
              <p className={styles.text}>
                Once your cancellation is confirmed and eligible for a refund:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  We usually <strong>initiate the refund within 3–7 working days</strong>.
                </li>
                <li className={styles.listItem}>
                  Actual credit to your bank account, card, or wallet may depend on your{" "}
                  <strong>payment provider’s policies</strong>.
                </li>
              </ul>
            </section>

            {/* Section 6 */}
            <section className={styles.sectionCard}>
              <h2 className={styles.sectionTitle}>6. Contact & Support</h2>
              <p className={styles.text}>
                If you have any questions about this Refund & Cancellation Policy, or need help with
                a specific order, you can reach us at:
              </p>
              <ul className={styles.list}>
                <li className={styles.listItem}>
                  <strong>Email:</strong> support@houseofintimacy.com
                </li>
                <li className={styles.listItem}>
                  <strong>Phone:</strong> +91-XXXXXXXXXX
                </li>
                <li className={styles.listItem}>
                  <strong>Support hours:</strong> 10:00 AM – 7:00 PM (IST), Monday to Saturday
                </li>
              </ul>
              <p className={styles.text}>
                By placing an order on our platform, you agree to this Refund & Cancellation Policy
                and our Terms & Conditions.
              </p>
            </section>
          </section>

          {/* RIGHT SIDEBAR */}
          <aside className={styles.rightColumn}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Quick Highlights</h3>
              <ul className={styles.sideList}>
                <li>COD available only inside Dehradun</li>
                <li>Refund only if cancelled before dispatch</li>
                <li>No refund after order is shipped</li>
                <li>Online payments refunded to original source</li>
              </ul>
              <div className={styles.chipRow}>
                <span className={styles.chip}>Hygiene First</span>
                <span className={styles.chip}>Secure Payments</span>
                <span className={styles.chip}>Clear Policy</span>
              </div>
            </div>

            <div className={styles.sideCard}>
              <h3 className={styles.sideTitle}>Need Help with an Order?</h3>
              <p className={styles.sideText}>
                Have questions about a recent purchase or want to cancel before dispatch? Our team
                is here to assist you.
              </p>
              <button
                type="button"
                className={styles.contactButton}
                onClick={() => {
                  // you can later connect this to your contact page or support modal
                  window.location.href = "mailto:support@houseofintimacy.com";
                }}
              >
                Contact Support
              </button>
              <p className={styles.sideNote}>
                Share your <strong>order ID</strong> and registered mobile number for faster
                support.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
}

export default RefundPolicy;
