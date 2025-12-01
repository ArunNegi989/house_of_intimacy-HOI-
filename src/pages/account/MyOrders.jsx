// src/pages/account/MyOrders.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiXCircle,
} from 'react-icons/fi';
import axios from 'axios';

import styles from '../../assets/styles/account/MyOrders.module.css';

const API_BASE_URL = 'http://localhost:8000';

// helper for image URL
const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

// map backend status → label + className key
const formatStatus = (statusRaw = '') => {
  const s = statusRaw.toUpperCase();

  if (s === 'PLACED' || s === 'PENDING')
    return { label: 'Order Placed', key: 'placed', icon: <FiClock /> };
  if (s === 'PROCESSING' || s === 'CONFIRMED')
    return { label: 'Processing', key: 'processing', icon: <FiPackage /> };
  if (s === 'SHIPPED' || s === 'OUT_FOR_DELIVERY')
    return { label: 'Shipped', key: 'shipped', icon: <FiTruck /> };
  if (s === 'DELIVERED')
    return { label: 'Delivered', key: 'delivered', icon: <FiCheckCircle /> };
  if (s === 'CANCELLED' || s === 'CANCELED')
    return { label: 'Cancelled', key: 'cancelled', icon: <FiXCircle /> };

  return { label: statusRaw || 'Unknown', key: 'other', icon: <FiClock /> };
};

const MyOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authToken =
    localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError('');

        // 🔁 change this endpoint to your real one
        const res = await axios.get(`${API_BASE_URL}/v1/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // adjust depending on backend shape
        const fetched = Array.isArray(res.data) ? res.data : res.data.orders || [];
        setOrders(fetched);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Unable to load your orders right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [authToken, navigate]);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'ALL') return orders;
    return orders.filter((o) => {
      const s = (o.status || '').toUpperCase();
      if (statusFilter === 'ACTIVE') {
        return ['PLACED', 'PENDING', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'OUT_FOR_DELIVERY'].includes(
          s
        );
      }
      if (statusFilter === 'COMPLETED') {
        return s === 'DELIVERED';
      }
      if (statusFilter === 'CANCELLED') {
        return s === 'CANCELLED' || s === 'CANCELED';
      }
      return true;
    });
  }, [orders, statusFilter]);

  const getOrderItems = (order) => {
    // adjust based on your backend
    return order.items || order.orderItems || [];
  };

  const getOrderTotal = (order) => {
    if (typeof order.totalAmount === 'number') return order.totalAmount;
    if (typeof order.grandTotal === 'number') return order.grandTotal;
    return order.amount || 0;
  };

  const getOrderIdDisplay = (order) =>
    order.orderNumber || order.orderId || (order._id ? `#${order._id.slice(-8)}` : '#N/A');

  const getOrderDate = (order) => {
    const raw = order.createdAt || order.orderDate;
    if (!raw) return '';
    const d = new Date(raw);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
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
            <h1 className={styles.title}>My Orders</h1>
            <p className={styles.subtitle}>
              Track your current orders and view your order history on House of Intimacy.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filtersRow}>
          {['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'].map((filterKey) => (
            <button
              key={filterKey}
              type="button"
              className={`${styles.filterChip} ${
                statusFilter === filterKey ? styles.filterChipActive : ''
              }`}
              onClick={() => setStatusFilter(filterKey)}
            >
              {filterKey === 'ALL' && 'All'}
              {filterKey === 'ACTIVE' && 'In Progress'}
              {filterKey === 'COMPLETED' && 'Completed'}
              {filterKey === 'CANCELLED' && 'Cancelled'}
            </button>
          ))}
        </div>

        {/* Content area */}
        <div className={styles.contentArea}>
          {loading && (
            <div className={styles.stateBox}>
              <div className={styles.spinner} />
              <p className={styles.stateText}>Loading your orders…</p>
            </div>
          )}

          {!loading && error && (
            <div className={styles.stateBox}>
              <p className={styles.stateTitle}>Something went wrong</p>
              <p className={styles.stateText}>{error}</p>
            </div>
          )}

          {!loading && !error && filteredOrders.length === 0 && (
            <div className={styles.stateBox}>
              <p className={styles.stateTitle}>No orders yet</p>
              <p className={styles.stateText}>
                Looks like you haven&apos;t placed any orders. Start shopping to see them here.
              </p>
              <button
                type="button"
                className={styles.shopBtn}
                onClick={() => navigate('/')}
              >
                Start Shopping
              </button>
            </div>
          )}

          {!loading && !error && filteredOrders.length > 0 && (
            <div className={styles.orderList}>
              {filteredOrders.map((order) => {
                const items = getOrderItems(order);
                const total = getOrderTotal(order);
                const statusInfo = formatStatus(order.status);

                return (
                  <div className={styles.orderCard} key={order._id || order.orderId}>
                    {/* Top row */}
                    <div className={styles.orderTopRow}>
                      <div>
                        <div className={styles.orderId}>{getOrderIdDisplay(order)}</div>
                        <div className={styles.orderDate}>
                          Placed on {getOrderDate(order)}
                        </div>
                      </div>

                      <div
                        className={`${styles.statusPill} ${
                          styles[`status_${statusInfo.key}`] || ''
                        }`}
                      >
                        <span className={styles.statusIcon}>{statusInfo.icon}</span>
                        <span>{statusInfo.label}</span>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className={styles.orderMetaRow}>
                      <span>
                        {items.length} item{items.length !== 1 ? 's' : ''}
                      </span>
                      <span>₹ {total.toFixed(2)}</span>
                      {order.paymentMethod && (
                        <span className={styles.paymentTag}>
                          {order.paymentMethod.toUpperCase()}
                        </span>
                      )}
                    </div>

                    {/* Items preview */}
                    {items.length > 0 && (
                      <div className={styles.itemsStrip}>
                        {items.slice(0, 4).map((item, idx) => (
                          <div
                            key={`${item._id || item.productId || idx}`}
                            className={styles.itemChip}
                          >
                            {item.image && (
                              <div className={styles.itemImgWrap}>
                                <img
                                  src={getImageUrl(item.image)}
                                  alt={item.name || 'Product image'}
                                  className={styles.itemImg}
                                />
                              </div>
                            )}
                            <div className={styles.itemInfo}>
                              <div className={styles.itemName}>
                                {item.name || item.productName || 'Product'}
                              </div>
                              <div className={styles.itemMeta}>
                                {item.size && <span>Size: {item.size}</span>}
                                {item.color && <span>Color: {item.color}</span>}
                                <span>Qty: {item.quantity || item.qty || 1}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom actions */}
                    <div className={styles.orderActions}>
                      <button
                        type="button"
                        className={styles.secondaryBtn}
                        onClick={() =>
                          navigate(`/account/orders/${order._id || order.orderId}`)
                        }
                      >
                        View Details
                      </button>

                      {formatStatus(order.status).key === 'delivered' && (
                        <button
                          type="button"
                          className={styles.linkBtn}
                          onClick={() => {
                            // TODO: hook up invoice download
                            // navigate(`/account/orders/${order._id}/invoice`)
                          }}
                        >
                          Download Invoice
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
