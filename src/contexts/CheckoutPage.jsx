// src/pages/Checkout/CheckoutPage.jsx
import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

import { CartContext } from '../contexts/CartContext';
import styles from '../assets/styles/checkout/CheckoutPage.module.css';

// Files (images) ke liye
const FILE_BASE_URL = 'http://localhost:8000';
// Backend API root
const API_ROOT = 'http://localhost:8000/v1';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${FILE_BASE_URL}${url}`;
};

// ✅ Token helper
const getToken = () => localStorage.getItem('authToken');

// small helper for duplicate check
const normalize = (str) => (str || '').trim().toLowerCase();

function CheckoutPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { cartItems, clearCart, removeFromCart } = useContext(CartContext);

  // ---------- CONTACT STATE ----------
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEmailLocked, setIsEmailLocked] = useState(false);

  // ---------- NEW ADDRESS FORM STATE ----------
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [addressType, setAddressType] = useState('home'); // 'home' | 'work' | 'other'

  // ---------- MULTIPLE ADDRESSES (BACKEND) ----------
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loadingUser, setLoadingUser] = useState(true);

  // ---------- INIT: CHECK LOGIN + FETCH USER + ADDRESSES ----------
  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    const fetchAll = async () => {
      try {
        // 1) Logged-in user
        const userRes = await axios.get(`${API_ROOT}/users/userdata`, {
          headers,
        });

        const user = userRes.data?.user || {};

        setFullName(user.name || user.fullName || '');
        setEmail(user.email || '');
        setPhone(user.phone || user.mobile || user.contactNumber || '');
        if (user.email) setIsEmailLocked(true);

        // 2) Addresses
        try {
          const addrRes = await axios.get(`${API_ROOT}/users/addresses`, {
            headers,
          });

          const list = Array.isArray(addrRes.data)
            ? addrRes.data
            : addrRes.data.addresses || [];

          setAddresses(list);

          // try to select default first
          const defaultAddr = list.find((a) => a.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr._id);
          } else if (list.length > 0) {
            setSelectedAddressId(list[0]._id);
          }
        } catch (addrErr) {
          console.error('Fetch addresses error:', addrErr);
        }
      } catch (err) {
        console.error('Checkout init error:', err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoadingUser(false);
      }
    };

    fetchAll();
  }, [navigate]);

  // ---------- ORDER TOTALS ----------
  const subtotal = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce((sum, item) => {
      const unitPrice =
        Number(
          item.price ??
            item.salePrice ??
            item.product?.price?.sale ??
            item.product?.price?.mrp ??
            0,
        ) || 0;

      const qty = Number(item.quantity ?? 1);
      return sum + unitPrice * qty;
    }, 0);
  }, [cartItems]);

  const shippingCharge = subtotal >= 799 ? 0 : 49; // example rule
  const grandTotal = subtotal + shippingCharge;

  // ---------- SAVE ADDRESS (BACKEND) ----------
  const handleSaveAddress = async () => {
    setError('');
    setSuccessMessage('');

    if (!addressLine1.trim()) {
      setError('Please enter Address Line 1 to save this address.');
      return;
    }
    if (!city.trim() || !state.trim() || !pincode.trim()) {
      setError('Please fill City, State and Pincode to save this address.');
      return;
    }
    if (!fullName.trim() || !phone.trim()) {
      setError('Please fill your name and phone before saving address.');
      return;
    }

    // 🔹 DUPLICATE CHECK (frontend)
    const isDuplicate = addresses.some(
      (a) =>
        normalize(a.addressLine1) === normalize(addressLine1) &&
        normalize(a.addressLine2) === normalize(addressLine2) &&
        normalize(a.city) === normalize(city) &&
        normalize(a.state) === normalize(state) &&
        normalize(a.pincode) === normalize(pincode),
    );

    if (isDuplicate) {
      const msg = 'This address is already saved in your account.';
      setError(msg);
      toast({
        title: 'Duplicate address',
        description: msg,
        status: 'warning',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
      return;
    }

    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    const newAddressPayload = {
      name: fullName.trim(),
      phone: phone.trim(),
      pincode: pincode.trim(),
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      state: state.trim(),
      landmark: landmark.trim() || undefined,
      addressType,
    };

    try {
      const res = await axios.post(
        `${API_ROOT}/users/addresses`,
        newAddressPayload,
        { headers },
      );

      let updatedAddresses;
      if (Array.isArray(res.data)) {
        updatedAddresses = res.data;
      } else if (Array.isArray(res.data.addresses)) {
        updatedAddresses = res.data.addresses;
      } else {
        updatedAddresses = [...addresses, res.data];
      }

      setAddresses(updatedAddresses);
      const last = updatedAddresses[updatedAddresses.length - 1];
      setSelectedAddressId(last?._id || null);

      // ✅ clear form after successful save
      setAddressLine1('');
      setAddressLine2('');
      setCity('');
      setStateVal('');
      setPincode('');
      setLandmark('');
      setAddressType('home');

      setSuccessMessage('Address saved successfully ✅');
      toast({
        title: 'Address saved',
        description: 'Your new address has been added.',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } catch (err) {
      console.error('Save address error:', err);
      const msg =
        err.response?.data?.message ||
        'Failed to save address. Please try again.';
      setError(msg);
      toast({
        title: 'Save failed',
        description: msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  // ---------- DELETE SAVED ADDRESS (BACKEND) ----------
  const handleDeleteAddress = async (addressId, e) => {
    // label click ko block karne ke liye
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    setError('');
    setSuccessMessage('');

    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await axios.delete(
        `${API_ROOT}/users/addresses/${addressId}`,

        { headers },
      );

      // backend returns updated addresses
      const updated = Array.isArray(res.data)
        ? res.data
        : res.data.addresses || [];

      setAddresses(updated);

      // if deleted one was selected, pick default or first
      if (selectedAddressId === addressId) {
        const defaultAddr = updated.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (updated.length > 0) {
          setSelectedAddressId(updated[0]._id);
        } else {
          setSelectedAddressId(null);
        }
      }

      setSuccessMessage('Address deleted successfully ✅');
      toast({
        title: 'Address deleted',
        description: 'The address has been removed from your account.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    } catch (err) {
      console.error('Delete address error:', err);
      const msg =
        err.response?.data?.message ||
        'Failed to delete address. Please try again.';
      setError(msg);
      toast({
        title: 'Delete failed',
        description: msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  // ---------- BUILD ITEMS PAYLOAD FOR BACKEND ----------
  const buildItemsPayload = () => {
    if (!cartItems || cartItems.length === 0) return [];

    return cartItems.map((item) => {
      const productId =
        item.productId || item._id || item.product?._id || item.id;

      return {
        productId,
        quantity: item.quantity || 1,
        color: item.color || item.selectedColor || null,
        size:
          typeof item.size === 'string' ? item.size : item.size?.label || null,
      };
    });
  };

  // ---------- DELETE SINGLE ITEM FROM CART (ORDER SUMMARY) ----------
  const handleDeleteItem = (lineIndex) => {
    try {
      if (typeof removeFromCart !== 'function') {
        console.warn('removeFromCart not available in CartContext');
        return;
      }

      removeFromCart(lineIndex);
      toast({
        title: 'Item removed',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    } catch (err) {
      console.error('Delete item error:', err);
      toast({
        title: 'Failed to remove item',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
    }
  };

  // ---------- PLACE ORDER (BACKEND) ----------
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // CONTACT VALIDATION
    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please enter a valid phone number.');
      return;
    }

    if (!paymentMethod) {
      setError('Please select a payment method.');
      return;
    }

    if (!cartItems || cartItems.length === 0) {
      setError('Your bag is empty.');
      return;
    }

    // ADDRESS SELECTION / VALIDATION
    let shippingAddress = null;

    if (selectedAddressId) {
      const addr = addresses.find((a) => a._id === selectedAddressId);
      if (!addr) {
        setError('Please select a valid saved address.');
        return;
      }

      shippingAddress = {
        name: addr.name,
        phone: addr.phone,
        pincode: addr.pincode,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        city: addr.city,
        state: addr.state,
        landmark: addr.landmark,
        addressType: addr.addressType || 'home',
      };
    } else {
      if (!addressLine1.trim()) {
        setError('Please enter your address.');
        return;
      }
      if (!city.trim() || !state.trim() || !pincode.trim()) {
        setError('Please fill City, State and Pincode.');
        return;
      }

      shippingAddress = {
        name: fullName.trim(),
        phone: phone.trim(),
        pincode: pincode.trim(),
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        landmark: landmark.trim() || undefined,
        addressType,
      };
    }

    const itemsPayload = buildItemsPayload();
    if (!itemsPayload.length) {
      setError('Unable to prepare order items.');
      return;
    }

    const token = getToken();
    if (!token) {
      navigate('/login');
      return;
    }
    const headers = { Authorization: `Bearer ${token}` };

    let paymentMethodForApi = 'COD';
    if (paymentMethod === 'cod') paymentMethodForApi = 'COD';
    else paymentMethodForApi = 'ONLINE';

    const orderPayload = {
      items: itemsPayload,
      shippingAddress,
      paymentMethod: paymentMethodForApi,
    };

    try {
      setPlacingOrder(true);

      const res = await axios.post(`${API_ROOT}/orders`, orderPayload, {
        headers,
      });

      const createdOrder = res.data;
      setSuccessMessage('Order placed successfully 🎉');

      if (typeof clearCart === 'function') {
        clearCart();
      }

      toast({
        title: 'Order placed',
        description: 'Thank you for shopping with us!',
        status: 'success',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });

      if (createdOrder && createdOrder._id) {
        navigate(`/order-success/${createdOrder._id}`);
      } else {
        navigate('/account/my-orders');
      }
    } catch (err) {
      console.error('Place order error:', err);
      const msg =
        err.response?.data?.message ||
        'Failed to place order. Please try again.';
      setError(msg);
      toast({
        title: 'Order failed',
        description: msg,
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top',
      });
    } finally {
      setPlacingOrder(false);
    }
  };

  // ---------- EMPTY CART STATE ----------
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.emptyState}>
          <h1>Your bag is empty</h1>
          <p>Add some products to your bag before checking out.</p>
          <button
            type="button"
            className={styles.primaryBtn}
            onClick={() => navigate('/')}
          >
            Back to shopping
          </button>
        </div>
      </div>
    );
  }

  if (loadingUser) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.loadingState}>Loading your details...</div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.headerRow}>
        <button
          type="button"
          className={styles.backBtn}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
        <h1 className={styles.pageTitle}>Checkout</h1>
        <div className={styles.secureBadge}>
          <FiLock />
          <span>100% Secure Checkout</span>
        </div>
      </div>

      <div className={styles.layout}>
        {/* LEFT COLUMN: FORM */}
        <form className={styles.leftCol} onSubmit={handlePlaceOrder}>
          {/* CONTACT */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Contact Details</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={
                    isEmailLocked ? undefined : (e) => setEmail(e.target.value)
                  }
                  readOnly={isEmailLocked}
                  className={isEmailLocked ? styles.readOnlyInput : ''}
                  placeholder={
                    isEmailLocked
                      ? 'Using your login email'
                      : 'Enter your email (optional)'
                  }
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit mobile number"
                />
              </div>
            </div>
          </section>

          {/* SHIPPING ADDRESS WITH MULTIPLE OPTIONS */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>

            {/* SAVED ADDRESSES (BACKEND) */}
            {addresses.length > 0 && (
              <div className={styles.savedAddresses}>
                <h3 className={styles.savedTitle}>Saved addresses</h3>
                <div className={styles.savedList}>
                  {addresses.map((addr) => (
                    <label
                      key={addr._id}
                      className={`${styles.addressCard} ${
                        selectedAddressId === addr._id
                          ? styles.addressCardActive
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        value={addr._id}
                        checked={selectedAddressId === addr._id}
                        onChange={() => setSelectedAddressId(addr._id)}
                      />
                      <div className={styles.addressContent}>
                        <div className={styles.addressHeaderRow}>
                          <div className={styles.addressLabelRow}>
                            <div className={styles.addressTypePills}>
                              <span className={styles.addressTypeChip}>
                                {addr.addressType
                                  ? addr.addressType.toUpperCase()
                                  : 'HOME'}
                              </span>
                              {addr.isDefault && (
                                <span className={styles.defaultBadge}>
                                  Default
                                </span>
                              )}
                            </div>

                            <span className={styles.addressName}>
                              {addr.name} • {addr.phone}
                            </span>
                          </div>

                          {/* DELETE BUTTON */}
                          <button
                            type="button"
                            className={styles.addressDeleteBtn}
                            onClick={(e) => handleDeleteAddress(addr._id, e)}
                          >
                            <FiTrash2 className={styles.addressDeleteIcon} />
                          </button>
                        </div>

                        <div className={styles.addressText}>
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                          <br />
                          {addr.city}, {addr.state} - {addr.pincode}
                          {addr.landmark ? (
                            <>
                              <br />
                              Landmark: {addr.landmark}
                            </>
                          ) : null}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className={styles.orNewAddress}>
                  Or deliver to a new address
                </div>
              </div>
            )}

            {/* NEW ADDRESS FORM */}
            <div className={styles.formGroup}>
              <label>Address Line 1 *</label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => {
                  setAddressLine1(e.target.value);
                  setSelectedAddressId(null);
                }}
                placeholder="Flat / House No. / Street"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Address Line 2</label>
              <input
                type="text"
                value={addressLine2}
                onChange={(e) => {
                  setAddressLine2(e.target.value);
                  setSelectedAddressId(null);
                }}
                placeholder="Area / Landmark (optional)"
              />
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>City *</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setSelectedAddressId(null);
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>State *</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => {
                    setStateVal(e.target.value);
                    setSelectedAddressId(null);
                  }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Pincode *</label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => {
                    setPincode(e.target.value);
                    setSelectedAddressId(null);
                  }}
                />
              </div>
            </div>

            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Landmark</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => {
                    setLandmark(e.target.value);
                    setSelectedAddressId(null);
                  }}
                  placeholder="Near XYZ (optional)"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Address Type</label>
                <select
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className={styles.saveAddressBtn}
              onClick={handleSaveAddress}
            >
              Save this address
            </button>
          </section>

          {/* PAYMENT */}
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Payment Method</h2>
            <div className={styles.paymentOptions}>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Cash on Delivery</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="payment"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>UPI / Wallets (Online)</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Credit / Debit Card (Online)</span>
              </label>
            </div>
          </section>

          {error && <div className={styles.errorBox}>{error}</div>}
          {successMessage && (
            <div className={styles.successBox}>{successMessage}</div>
          )}

          <button
            type="submit"
            className={styles.placeOrderBtn}
            disabled={placingOrder}
          >
            {placingOrder ? 'Placing your order...' : 'Place Order'}
          </button>
        </form>

        {/* RIGHT COLUMN: ORDER SUMMARY */}
        <aside className={styles.rightCol}>
          <section className={styles.card}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.itemsList}>
              {cartItems.map((item, idx) => {
                const itemName = item.name || item.product?.name || 'Product';
                const itemBrand = item.brand || item.product?.brand || '';
                const img =
                  item.image ||
                  item.product?.mainImage ||
                  (Array.isArray(item.product?.galleryImages) &&
                    item.product.galleryImages[0]) ||
                  null;
                const unitPrice =
                  Number(
                    item.price ??
                      item.salePrice ??
                      item.product?.price?.sale ??
                      item.product?.price?.mrp ??
                      0,
                  ) || 0;
                const qty = Number(item.quantity ?? 1);
                const sizeLabel =
                  typeof item.size === 'string'
                    ? item.size
                    : item.size?.label || '';

                return (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemImgWrapper}>
                      {img && <img src={getImageUrl(img)} alt={itemName} />}
                    </div>
                    <div className={styles.itemInfo}>
                      {itemBrand && (
                        <div className={styles.itemBrand}>{itemBrand}</div>
                      )}
                      <div className={styles.itemName}>{itemName}</div>
                      <div className={styles.itemMeta}>
                        {sizeLabel && <span>Size: {sizeLabel}</span>}
                        {item.color && (
                          <span className={styles.colorWrapper}>
                            Color:
                            <span
                              className={styles.colorDot}
                              style={{ backgroundColor: item.color }}
                            />
                          </span>
                        )}
                      </div>
                      <div className={styles.itemPriceRow}>
                        <span>
                          ₹ {unitPrice} × {qty}
                        </span>
                        <span className={styles.itemLineTotal}>
                          ₹ {unitPrice * qty}
                        </span>
                      </div>
                    </div>

                    {/* DELETE BUTTON ON RIGHT */}
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteItem(idx)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹ {subtotal}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>
                  {shippingCharge === 0 ? 'FREE' : `₹ ${shippingCharge}`}
                </span>
              </div>
              <div className={styles.summaryRowTotal}>
                <span>Total</span>
                <span>₹ {grandTotal}</span>
              </div>
            </div>

            <p className={styles.summaryNote}>
              You will see available offers and final payment options on the
              next step of payment gateway.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default CheckoutPage;
