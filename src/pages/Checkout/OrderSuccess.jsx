// src/pages/Checkout/OrderSuccess.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';
import styles from '../../assets/styles/checkout/OrderSuccess.module.css';

// ---- CONFIG ----
const FILE_BASE_URL = 'http://localhost:8000';
const API_ROOT = 'http://localhost:8000/v1';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${FILE_BASE_URL}${url}`;
};

const getToken = () => localStorage.getItem('authToken');

function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ---------- FETCH ORDER DETAILS ----------
  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError('Invalid order ID.');
        setLoading(false);
        return;
      }

      const token = getToken();
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        setError('');

        const res = await axios.get(`${API_ROOT}/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(res.data);
      } catch (err) {
        console.error('OrderSuccess fetch error:', err);
        setError(
          err.response?.data?.message ||
            'Failed to load your order. Please try again.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, navigate]);

  // ---------- HELPERS ----------
  const items = useMemo(() => {
    if (!order) return [];
    return order.items || order.cartItems || [];
  }, [order]);

  const shippingAddress = useMemo(() => {
    if (!order) return null;
    return order.shippingAddress || order.address || null;
  }, [order]);

  const grandTotal = useMemo(() => {
    if (!order) return null;

    // 1) direct key from backend
    if (order.grandTotal != null) return order.grandTotal;

    // 2) if in nested objects (for future safety)
    if (order.totals?.grandTotal != null) return order.totals.grandTotal;
    if (order.paymentSummary?.grandTotal != null)
      return order.paymentSummary.grandTotal;
    if (order.totalAmount != null) return order.totalAmount;

    // 3) last fallback: calculate from itemsTotal + shippingFee
    if (order.itemsTotal != null && order.shippingFee != null) {
      return Number(order.itemsTotal) + Number(order.shippingFee);
    }

    return null;
  }, [order]);

  const paymentMethodLabel = useMemo(() => {
    if (!order) return '';
    const m = (order.paymentMethod || '').toUpperCase();
    if (m === 'COD') return 'Cash on Delivery';
    if (m === 'ONLINE') return 'Online Payment';
    return order.paymentMethod || '—';
  }, [order]);

  const statusLabel = useMemo(() => {
    if (!order) return 'Placed';
    const s = (order.status || '').toUpperCase();
    if (!s || s === 'PLACED' || s === 'PENDING') return 'Placed';
    if (s === 'CONFIRMED' || s === 'PROCESSING') return 'Processing';
    if (s === 'SHIPPED') return 'Shipped';
    if (s === 'OUT_FOR_DELIVERY') return 'Out for delivery';
    if (s === 'DELIVERED') return 'Delivered';
    if (s === 'CANCELLED') return 'Cancelled';
    return s;
  }, [order]);

  // ---------- LOADING / ERROR UI ----------
  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.loadingText}>Loading your order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.errorText}>{error}</p>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate('/account/orders')}
            >
              Go to my orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.card}>
            <p className={styles.errorText}>Order not found.</p>
            <button className={styles.primaryBtn} onClick={() => navigate('/')}>
              Back to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------- MAIN UI ----------
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          {/* ICON */}
          <div className={styles.iconWrap}>
            <FiCheckCircle className={styles.icon} />
          </div>

          <h1 className={styles.title}>Order placed successfully 🎉</h1>
          <p className={styles.subtitle}>
            Thank you for choosing <strong>House of Intimacy</strong>.
          </p>

          {/* TWO-COLUMN */}
          <div className={styles.contentRow}>
            {/* LEFT SIDE – ITEMS */}
            <div className={styles.leftCol}>
              <div className={styles.itemsCard}>
                <h2 className={styles.itemsTitle}>Items in this order</h2>

                {items.length === 0 ? (
                  <p className={styles.emptyItemsText}>No items found.</p>
                ) : (
                  <div className={styles.itemsList}>
                    {items.map((item, index) => {
                      const name =
                        item.productName ||
                        item.name ||
                        item.product?.name ||
                        item.productSnapshot?.name ||
                        'Product';

                      const brand =
                        item.brand ||
                        item.product?.brand ||
                        item.productSnapshot?.brand ||
                        '';

                      const img =
                        item.image ||
                        item.product?.mainImage ||
                        (Array.isArray(item.product?.images) &&
                          item.product.images[0]) ||
                        item.productSnapshot?.image ||
                        null;

                      const qty = item.quantity || 1;

                      const unitPrice =
                        item.unitPrice ||
                        item.price ||
                        item.salePrice ||
                        item.product?.price?.sale ||
                        item.product?.price?.mrp ||
                        0;

                      const size =
                        typeof item.size === 'string'
                          ? item.size
                          : item.size?.label || null;

                      const rawColor = item.color || item.selectedColor || null;

                      const colorName =
                        item.colorName ||
                        item.selectedColorName ||
                        (rawColor && !rawColor.startsWith('#')
                          ? rawColor
                          : null);

                      const colorHex =
                        item.colorHex ||
                        item.selectedColorHex ||
                        (rawColor && rawColor.startsWith('#')
                          ? rawColor
                          : null);

                      const lineTotal =
                        item.lineTotal || Number(unitPrice) * Number(qty || 1);

                      return (
                        <div key={index} className={styles.itemRow}>
                          <div className={styles.itemImgWrapper}>
                            {img && (
                              <img
                                src={getImageUrl(img)}
                                alt={name}
                                className={styles.itemImg}
                              />
                            )}
                          </div>

                          <div className={styles.itemInfo}>
                            {brand && (
                              <div className={styles.itemBrand}>{brand}</div>
                            )}
                            <div className={styles.itemName}>{name}</div>

                            <div className={styles.itemMeta}>
                              {size && <span>Size: {size}</span>}

                              {(colorName || colorHex) && (
                                <span className={styles.colorMeta}>
                                  Color:
                                  {colorHex && (
                                    <span
                                      className={styles.colorSwatch}
                                      style={{ backgroundColor: colorHex }}
                                    ></span>
                                  )}
                                  {colorName && (
                                    <span className={styles.colorLabel}>
                                      {colorName}
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>

                            <div className={styles.itemPriceRow}>
                              <span>
                                ₹{unitPrice} × {qty}
                              </span>
                              <span className={styles.itemLineTotal}>
                                ₹{lineTotal}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT SIDE – SUMMARY */}
            <div className={styles.rightCol}>
              <div className={styles.infoBox}>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Order ID</span>
                  <span className={styles.valueMono}>
                    {order._id || orderId}
                  </span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Total Amount</span>
                  <span className={styles.value}>₹{grandTotal}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Payment Method</span>
                  <span className={styles.value}>{paymentMethodLabel}</span>
                </div>

                <div className={styles.infoRow}>
                  <span className={styles.label}>Status</span>
                  <span className={styles.statusPill}>{statusLabel}</span>
                </div>

                {shippingAddress && (
                  <div className={styles.infoRowColumn}>
                    <span className={styles.label}>Shipping to</span>
                    <div className={styles.addressText}>
                      <strong>
                        {shippingAddress.name} • {shippingAddress.phone}
                      </strong>
                      <br />
                      {shippingAddress.addressLine1}
                      {shippingAddress.addressLine2 &&
                        `, ${shippingAddress.addressLine2}`}
                      <br />
                      {shippingAddress.city}, {shippingAddress.state} -{' '}
                      {shippingAddress.pincode}
                      {shippingAddress.landmark && (
                        <>
                          <br />
                          Landmark: {shippingAddress.landmark}
                        </>
                      )}
                    </div>
                  </div>
                )}

                <p className={styles.tipText}>
                  A confirmation email has been sent with full details.
                </p>
              </div>
            </div>
          </div>

          {/* BUTTONS */}
          <div className={styles.buttonsRow}>
            <button
              className={styles.primaryBtn}
              onClick={() => navigate('/account/orders')}
            >
              View my orders
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => navigate('/')}
            >
              Continue shopping
            </button>
          </div>

          <p className={styles.footerNote}>
            Need help?{' '}
            <button
              className={styles.inlineLink}
              onClick={() => navigate('/ContactUs')}
            >
              Contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
