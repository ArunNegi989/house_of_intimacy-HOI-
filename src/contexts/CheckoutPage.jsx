// src/pages/Checkout/CheckoutPage.jsx
import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiLock } from 'react-icons/fi';

import { CartContext } from '../contexts/CartContext';
import styles from '../assets/styles/checkout/CheckoutPage.module.css';

const API_BASE_URL = 'http://localhost:8000';

const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_BASE_URL}${url}`;
};

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);

  // ---------- CONTACT STATE ----------
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isEmailLocked, setIsEmailLocked] = useState(false); // 👈 NEW

  // ---------- NEW ADDRESS FORM STATE ----------
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setStateVal] = useState('');
  const [pincode, setPincode] = useState('');

  // ---------- MULTIPLE ADDRESSES ----------
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Load saved addresses from localStorage (optional but useful)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hoi_addresses');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setAddresses(parsed);
          if (parsed.length > 0) {
            setSelectedAddressId(parsed[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Error reading addresses from localStorage', err);
    }
  }, []);

  // Save addresses whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('hoi_addresses', JSON.stringify(addresses));
    } catch (err) {
      console.error('Error saving addresses to localStorage', err);
    }
  }, [addresses]);

  // ---------- LOAD LOGGED-IN USER (EMAIL LOCKED, NAME/PHONE EDITABLE) ----------
  useEffect(() => {
    try {
      // 👉 change 'hoi_user' if your login uses a different key
      const storedUser = localStorage.getItem('hoi_user');
      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      // email: fill + lock
      if (user.email) {
        setEmail(user.email);
        setIsEmailLocked(true);
      }

      // name: prefill but editable
      if (user.fullName || user.name) {
        setFullName(user.fullName || user.name);
      }

      // phone: prefill but editable
      if (user.phone || user.mobile || user.contactNumber) {
        setPhone(user.phone || user.mobile || user.contactNumber);
      }
    } catch (err) {
      console.error('Error reading logged-in user from localStorage', err);
    }
  }, []);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [error, setError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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

  // ---------- ADD / SAVE ADDRESS ----------
  const handleSaveAddress = () => {
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

    const newAddress = {
      id: Date.now(),
      label: `Address ${addresses.length + 1}`,
      addressLine1: addressLine1.trim(),
      addressLine2: addressLine2.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
    };

    setAddresses((prev) => [...prev, newAddress]);
    setSelectedAddressId(newAddress.id);
    setSuccessMessage('Address saved successfully ✅');
  };

  // ---------- PLACE ORDER ----------
  const handlePlaceOrder = (e) => {
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
      // Use saved address
      shippingAddress = addresses.find(
        (addr) => addr.id === selectedAddressId,
      );
      if (!shippingAddress) {
        setError(
          'Please select a valid saved address or use a new address.',
        );
        return;
      }
    } else {
      // Use address from form (not saved)
      if (!addressLine1.trim()) {
        setError('Please enter your address.');
        return;
      }
      if (!city.trim() || !state.trim() || !pincode.trim()) {
        setError('Please fill City, State and Pincode.');
        return;
      }

      shippingAddress = {
        label: 'Current Address',
        addressLine1: addressLine1.trim(),
        addressLine2: addressLine2.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      };
    }

    setPlacingOrder(true);

    const orderPayload = {
      customer: {
        fullName,
        email,
        phone,
      },
      address: shippingAddress,
      paymentMethod,
      items: cartItems,
      amounts: {
        subtotal,
        shippingCharge,
        grandTotal,
      },
    };

    console.log('ORDER PAYLOAD 👉', orderPayload);

    // TODO: yaha future me backend API call karege (POST /orders)
    setTimeout(() => {
      setPlacingOrder(false);
      setSuccessMessage('Order placed successfully 🎉');
      // if you have clearCart() in CartContext, call here
      // clearCart();
      // navigate('/'); // or navigate('/order-success');
    }, 1000);
  };

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

            {/* SAVED ADDRESSES */}
            {addresses.length > 0 && (
              <div className={styles.savedAddresses}>
                <h3 className={styles.savedTitle}>Saved addresses</h3>
                <div className={styles.savedList}>
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`${styles.addressCard} ${
                        selectedAddressId === addr.id
                          ? styles.addressCardActive
                          : ''
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        value={addr.id}
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />
                      <div className={styles.addressContent}>
                        <div className={styles.addressLabelRow}>
                          <span className={styles.addressLabel}>
                            {addr.label}
                          </span>
                        </div>
                        <div className={styles.addressText}>
                          {addr.addressLine1}
                          {addr.addressLine2
                            ? `, ${addr.addressLine2}`
                            : ''}
                          <br />
                          {addr.city}, {addr.state} - {addr.pincode}
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
                  // if user is typing new address, unselect saved
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
                <span>UPI / Wallets</span>
              </label>
              <label className={styles.radioOption}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Credit / Debit Card</span>
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
                const itemName =
                  item.name || item.product?.name || 'Product';
                const itemBrand =
                  item.brand || item.product?.brand || '';
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

                return (
                  <div key={idx} className={styles.itemRow}>
                    <div className={styles.itemImgWrapper}>
                      {img && (
                        <img src={getImageUrl(img)} alt={itemName} />
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      {itemBrand && (
                        <div className={styles.itemBrand}>
                          {itemBrand}
                        </div>
                      )}
                      <div className={styles.itemName}>{itemName}</div>
                      <div className={styles.itemMeta}>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && (
                          <span>Color: {item.color}</span>
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
