// src/pages/account/OrderDetails.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FiArrowLeft,
  FiTruck,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from 'react-icons/fi';
import axios from 'axios';

import styles from '../../assets/styles/account/OrderDetails.module.css';

const API_BASE_URL = 'http://localhost:8000';

// helper for image URL
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

// same status helper style as MyOrders
const formatStatus = (statusRaw = '') => {
  const s = statusRaw.toUpperCase();

  if (s === 'PLACED')
    return { label: 'Order Placed', key: 'placed', icon: <FiClock /> };
  if (s === 'PROCESSING' || s === 'CONFIRMED')
    return { label: 'Processing', key: 'processing', icon: <FiPackage /> };
  if (s === 'SHIPPED' || s === 'OUT_FOR_DELIVERY')
    return { label: 'Shipped', key: 'shipped', icon: <FiTruck /> };
  if (s === 'DELIVERED')
    return { label: 'Delivered', key: 'delivered', icon: <FiCheckCircle /> };
  if (s === 'CANCELLED')
    return { label: 'Cancelled', key: 'cancelled', icon: <FiXCircle /> };

  return { label: statusRaw || 'Unknown', key: 'other', icon: <FiClock /> };
};

// which statuses are allowed to cancel (request raise karna)
const CANCELLABLE_STATUSES = ['PLACED', 'CONFIRMED', 'PROCESSING'];

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  // modal + reason state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelReasonText, setCancelReasonText] = useState('');

  const authToken =
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }

    const fetchOrder = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await axios.get(`${API_BASE_URL}/v1/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const data = res.data;
        const fetchedOrder = data.order || data; // support both shapes
        setOrder(fetchedOrder);
      } catch (err) {
        console.error('Error fetching order details:', err);
        setError('Unable to load this order right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [authToken, navigate, orderId]);

  const items = useMemo(() => {
    if (!order) return [];
    return order.items || order.orderItems || [];
  }, [order]);

  const orderStatusInfo = useMemo(
    () => formatStatus(order?.status || ''),
    [order]
  );

  const getOrderIdDisplay = () => {
    if (!order) return '';
    return (
      order.orderNumber ||
      order.orderId ||
      (order._id ? `#${order._id.slice(-8)}` : '#N/A')
    );
  };

  const getOrderDate = () => {
    if (!order) return '';
    const raw = order.createdAt || order.orderDate;
    if (!raw) return '';
    const d = new Date(raw);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getPaymentMethod = () => {
    if (!order) return '';
    return (order.paymentMethod || '').toUpperCase();
  };

  // totals based on your schema
  const getTotals = () => {
    if (!order) {
      return {
        subtotal: 0,
        shipping: 0,
        discount: 0,
        grandTotal: 0,
      };
    }

    const subtotal =
      typeof order.itemsTotal === 'number' ? order.itemsTotal : 0;
    const discount =
      typeof order.discountTotal === 'number' ? order.discountTotal : 0;
    const shipping =
      typeof order.shippingFee === 'number' ? order.shippingFee : 0;
    const grandTotal =
      typeof order.grandTotal === 'number' ? order.grandTotal : subtotal + shipping;

    return {
      subtotal,
      shipping,
      discount,
      grandTotal,
    };
  };

  const totals = getTotals();

  // normalize shipping address for UI
  const shippingAddress = useMemo(() => {
    if (!order) return null;

    const addr =
      order.shippingAddress ||
      order.address ||
      order.deliveryAddress || null;

    if (!addr) return null;

    // tumhari schema: name, phone, addressLine1, addressLine2, city, state, pincode
    return {
      fullName: addr.name,
      phone: addr.phone,
      line1: addr.addressLine1,
      line2: addr.addressLine2,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    };
  }, [order]);

  const canCancel = useMemo(() => {
    if (!order) return false;
    const s = (order.status || '').toUpperCase();

    // agar already cancelRequested true hai ya status CANCELLED hai → button off
    if (order.cancelRequested) return false;
    if (s === 'CANCELLED') return false;

    return CANCELLABLE_STATUSES.includes(s);
  }, [order]);

  // modal open handler
  const openCancelModal = () => {
    if (!canCancel || cancelling) return;
    setShowCancelModal(true);
  };

  // modal close + reset
  const closeCancelModal = () => {
    if (cancelling) return;
    setShowCancelModal(false);
    setCancelReason('');
    setCancelReasonText('');
  };

  // actual cancel REQUEST API (admin approve karega)
  const handleConfirmCancel = async () => {
    if (!order) return;
    if (!canCancel) return;
    if (!cancelReason) {
      alert('Please select a reason for cancellation.');
      return;
    }

    try {
      setCancelling(true);
      setError('');

      const payload = {
        reason: cancelReason,
        reasonText: cancelReason === 'OTHER' ? cancelReasonText : '',
      };

      const res = await axios.patch(
        `${API_BASE_URL}/v1/orders/${order._id || order.orderId}/request-cancel`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const updated = res.data.order || res.data;
      setOrder(updated);
      alert(
        'Your cancellation request has been submitted. You will be notified once it is processed.'
      );

      closeCancelModal();
    } catch (err) {
      console.error('Error submitting cancellation request:', err);
      setError(
        'Unable to submit cancellation request right now. Please try again later.'
      );
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Header row */}
        <div className={styles.headerRow}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(-1)}
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>

          <div className={styles.headerText}>
            <h1 className={styles.title}>Order Details</h1>
            <p className={styles.subtitle}>
              View all items, delivery address, and manage your order.
            </p>
          </div>
        </div>

        {/* Loading / Error states */}
        {loading && (
          <div className={styles.stateBox}>
            <div className={styles.spinner} />
            <p className={styles.stateText}>Loading order details…</p>
          </div>
        )}

        {!loading && error && (
          <div className={styles.stateBox}>
            <p className={styles.stateTitle}>Something went wrong</p>
            <p className={styles.stateText}>{error}</p>
          </div>
        )}

        {!loading && !error && order && (
          <div className={styles.contentGrid}>
            {/* LEFT: order summary + address + actions */}
            <div className={styles.leftColumn}>
              {/* Summary card */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <div className={styles.orderId}>{getOrderIdDisplay()}</div>
                    <div className={styles.orderDate}>
                      Placed on {getOrderDate()}
                    </div>
                  </div>

                  <div
                    className={`${styles.statusPill} ${
                      styles[`status_${orderStatusInfo.key}`] || ''
                    }`}
                  >
                    <span className={styles.statusIcon}>
                      {orderStatusInfo.icon}
                    </span>
                    <span>{orderStatusInfo.label}</span>
                  </div>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Items</span>
                  <span className={styles.summaryValue}>
                    {items.length} item{items.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Payment</span>
                  <span className={styles.summaryValue}>
                    {getPaymentMethod()}
                  </span>
                </div>

                {/* totals */}
                <div className={styles.summaryDivider} />

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal</span>
                  <span className={styles.summaryValue}>
                    ₹ {totals.subtotal.toFixed(2)}
                  </span>
                </div>

                {totals.discount > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Discount</span>
                    <span className={styles.summaryValue}>
                      -₹ {totals.discount.toFixed(2)}
                    </span>
                  </div>
                )}

                {totals.shipping > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Shipping</span>
                    <span className={styles.summaryValue}>
                      ₹ {totals.shipping.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className={styles.summaryDivider} />

                <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
                  <span className={styles.summaryLabel}>Total</span>
                  <span className={styles.summaryValue}>
                    ₹ {totals.grandTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Address card */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Delivery Address</h2>
                {shippingAddress ? (
                  <div className={styles.addressBlock}>
                    {shippingAddress.fullName && (
                      <p className={styles.addressName}>
                        {shippingAddress.fullName}
                      </p>
                    )}
                    {shippingAddress.line1 && (
                      <p className={styles.addressLine}>
                        {shippingAddress.line1}
                      </p>
                    )}
                    {shippingAddress.line2 && (
                      <p className={styles.addressLine}>
                        {shippingAddress.line2}
                      </p>
                    )}

                    {(shippingAddress.city ||
                      shippingAddress.state ||
                      shippingAddress.pincode) && (
                      <p className={styles.addressLine}>
                        {shippingAddress.city && `${shippingAddress.city}, `}
                        {shippingAddress.state && `${shippingAddress.state} `}
                        {shippingAddress.pincode &&
                          `- ${shippingAddress.pincode}`}
                      </p>
                    )}

                    {shippingAddress.phone && (
                      <p className={styles.addressLine}>
                        Phone: {shippingAddress.phone}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className={styles.addressLine}>
                    Address information not available.
                  </p>
                )}
              </div>

              {/* Cancel order */}
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Order Actions</h2>
                {order.cancelRequested && order.status !== 'CANCELLED' ? (
                  <>
                    <p className={styles.cardText}>
                      You&apos;ve requested to cancel this order. Our team is
                      reviewing your request. You&apos;ll receive an update on your
                      registered email.
                    </p>
                  </>
                ) : (
                  <>
                    <p className={styles.cardText}>
                      You can request cancellation before the order is shipped.
                      Once dispatched, cancellation may not be possible.
                    </p>

                    <button
                      type="button"
                      className={`${styles.cancelBtn} ${
                        !canCancel || cancelling ? styles.cancelBtnDisabled : ''
                      }`}
                      disabled={!canCancel || cancelling}
                      onClick={openCancelModal}
                    >
                      Request cancellation
                    </button>

                    {!canCancel && order.status !== 'CANCELLED' && (
                      <p className={styles.helpText}>
                        This order cannot be cancelled in its current status.
                      </p>
                    )}
                  </>
                )}

                {order.status === 'CANCELLED' && (
                  <p className={styles.helpText}>
                    This order has been cancelled.
                  </p>
                )}
              </div>
            </div>

            {/* RIGHT: items list */}
            <div className={styles.rightColumn}>
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Items in this order</h2>

                {items.length === 0 && (
                  <p className={styles.cardText}>No items found in this order.</p>
                )}

                {items.length > 0 && (
                  <div className={styles.itemsList}>
                    {items.map((item, idx) => {
                      const unitPrice =
                        typeof item.salePrice === 'number'
                          ? item.salePrice
                          : typeof item.price === 'number'
                          ? item.price
                          : null;
                      const unitMrp =
                        typeof item.mrp === 'number' ? item.mrp : null;
                      const qty = item.quantity || item.qty || 1;
                      const lineTotal =
                        typeof item.lineTotal === 'number'
                          ? item.lineTotal
                          : unitPrice !== null
                          ? unitPrice * qty
                          : null;

                      return (
                        <div
                          key={item._id || item.productId || idx}
                          className={styles.itemRow}
                        >
                          <div className={styles.itemImgWrap}>
                            {item.image && (
                              <img
                                src={getImageUrl(item.image)}
                                alt={item.name || item.productName || 'Product'}
                                className={styles.itemImg}
                              />
                            )}
                          </div>

                          <div className={styles.itemInfo}>
                            <div className={styles.itemName}>
                              {item.name || item.productName || 'Product'}
                            </div>

                            <div className={styles.itemMeta}>
                              {item.size && <span>Size: {item.size}</span>}
                              {item.color && <span>Color: {item.color}</span>}
                              <span>Qty: {qty}</span>
                            </div>

                            <div className={styles.itemPriceRow}>
                              {unitPrice !== null && (
                                <span className={styles.itemPrice}>
                                  ₹ {unitPrice.toFixed(2)}
                                </span>
                              )}
                              {unitMrp !== null &&
                                unitPrice !== null &&
                                unitMrp > unitPrice && (
                                  <span className={styles.itemMrp}>
                                    MRP ₹ {unitMrp.toFixed(2)}
                                  </span>
                                )}
                              {lineTotal !== null && qty > 1 && (
                                <span className={styles.itemLinePrice}>
                                  Line total: ₹ {lineTotal.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !order && (
          <div className={styles.stateBox}>
            <p className={styles.stateTitle}>Order not found</p>
            <p className={styles.stateText}>
              We couldn&apos;t find this order. It may have been removed.
            </p>
          </div>
        )}

        {/* CANCEL REASON MODAL */}
        {showCancelModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <h2 className={styles.modalTitle}>Cancel this order</h2>
              <p className={styles.modalSubtitle}>
                Please tell us why you&apos;re cancelling this order.
              </p>

              <div className={styles.modalReasons}>
                <label
                  className={`${styles.modalReason} ${
                    cancelReason === 'ORDERED_BY_MISTAKE'
                      ? styles.modalReasonSelected
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value="ORDERED_BY_MISTAKE"
                    checked={cancelReason === 'ORDERED_BY_MISTAKE'}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <span>I ordered by mistake</span>
                </label>

                <label
                  className={`${styles.modalReason} ${
                    cancelReason === 'FOUND_BETTER_PRICE'
                      ? styles.modalReasonSelected
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value="FOUND_BETTER_PRICE"
                    checked={cancelReason === 'FOUND_BETTER_PRICE'}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <span>Found a better price somewhere else</span>
                </label>

                <label
                  className={`${styles.modalReason} ${
                    cancelReason === 'DELIVERY_DELAY'
                      ? styles.modalReasonSelected
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value="DELIVERY_DELAY"
                    checked={cancelReason === 'DELIVERY_DELAY'}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <span>Delivery is taking too long</span>
                </label>

                <label
                  className={`${styles.modalReason} ${
                    cancelReason === 'CHANGE_ADDRESS'
                      ? styles.modalReasonSelected
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value="CHANGE_ADDRESS"
                    checked={cancelReason === 'CHANGE_ADDRESS'}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <span>I want to change address / details</span>
                </label>

                <label
                  className={`${styles.modalReason} ${
                    cancelReason === 'OTHER'
                      ? styles.modalReasonSelected
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="cancelReason"
                    value="OTHER"
                    checked={cancelReason === 'OTHER'}
                    onChange={(e) => setCancelReason(e.target.value)}
                  />
                  <span>Something else</span>
                </label>
              </div>

              {cancelReason === 'OTHER' && (
                <textarea
                  className={styles.modalTextarea}
                  placeholder="Write your reason here…"
                  rows={3}
                  value={cancelReasonText}
                  onChange={(e) => setCancelReasonText(e.target.value)}
                />
              )}

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.modalSecondaryBtn}
                  onClick={closeCancelModal}
                  disabled={cancelling}
                >
                  Back
                </button>
                <button
                  type="button"
                  className={styles.modalPrimaryBtn}
                  onClick={handleConfirmCancel}
                  disabled={!cancelReason || cancelling}
                >
                  {cancelling ? 'Submitting…' : 'Submit request'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
