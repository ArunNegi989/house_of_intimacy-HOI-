// src/Main or src/App (your file)
// ... your imports ...
import './assets/css/App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';

import initialTheme from './theme/theme';

// PAGES & COMPONENTS
import Home from 'components/Homepagecomopents/Home';
import SignIn from 'views/auth/signIn';
import Header from 'components/Header';
import Footer from 'components/Footer';
import CreateNewUser from 'views/auth/CreateNewUser';

// LAYOUTS
import AuthLayout from './layouts/auth';
import AdminLayout from './layouts/admin';

// DARK MODE FLOAT BUTTON
import FixedPlugin from '../src/components/Dashboard/fixedPlugin/FixedPlugin';
import ProtectedRoute from 'routes/ProtectedRoute'; // ab user routes ke liye
import PublicRoute from 'components/PublicRoute';

// 👉 NEW IMPORT – Wishlist

import AdminRoute from 'routes/AdminRoute';
import ProfilePage from 'views/account/ProfilePage';
import OrdersPage from 'views/account/OrdersPage';
import VerifyEmail from 'views/auth/VerifyEmail';
import ForgotPassword from 'views/auth/ForgotPassword';
import ResetPassword from 'views/auth/ResetPassword';
import BraListing from 'components/productcollections/bras';
import PantiesListing from 'components/productcollections/panties';
import NightwearListing from 'components/productcollections/nightwear';
import ProductDetail from 'pages/management/ProductDetail/ProductDetail';
import { WishlistProvider } from 'contexts/WishlistContext';
import { CartProvider } from 'contexts/CartContext';
import WishlistPage from 'pages/Wishlist/WishlistPage';
import AllProducts from 'pages/allbrands/AllProducts';
import { Aboutus } from 'components/AboutUs';
import { ContactUs } from 'components/ContactUs';
import CheckoutPage from 'contexts/CheckoutPage';
import PrivacyPolicy from 'pages/legal/PrivacyPolicy';
import { FAQ } from 'components/FAQ';
import RefundPolicy from 'pages/RefundPolicy/RefundPolicy';
import MyOrders from 'pages/account/MyOrders';
import OrderDetails from 'pages/account/OrderDetails';
import OrderSuccess from 'pages/Checkout/OrderSuccess';
import ScrollToTop from 'components/ScrollToTop';
import { BlogDetails } from 'components/BlogDetails';

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const location = useLocation();

  const hideHeader =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/auth') ||
    location.pathname === '/login';

  const hideFooter =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/auth') ||
    location.pathname === '/login';

  return (
    <ChakraProvider theme={currentTheme}>
      {/* ✅ Wrap whole app UI in Wishlist + Cart providers */}
      <WishlistProvider>
        <CartProvider>
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {!hideHeader && <Header />}
            <ScrollToTop />
            <div style={{ flex: 1 }}>
              <Routes>
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <CheckoutPage />
                    </ProtectedRoute>
                  }
                />

                {/* Auth layout (register, forgot, etc) */}
                <Route path="auth/*" element={<AuthLayout />} />
                <Route path="/wishlist" element={<WishlistPage />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/refund-policy" element={<RefundPolicy />} />
                <Route path="/account/orders" element={<MyOrders />} />
                <Route
                  path="/account/orders/:orderId"
                  element={<OrderDetails />}
                />
                <Route
                  path="/order-success/:orderId"
                  element={<OrderSuccess />}
                />
                <Route path="/BlogDetails" element={<BlogDetails/>} />

                {/* 🔐 ADMIN LAYOUT – now uses AdminRoute */}
                <Route
                  path="admin/*"
                  element={
                    <AdminRoute>
                      <AdminLayout
                        theme={currentTheme}
                        setTheme={setCurrentTheme}
                      />
                    </AdminRoute>
                  }
                />

                {/* Login */}
                <Route
                  path="/login"
                  element={
                    <PublicRoute>
                      <SignIn />
                    </PublicRoute>
                  }
                />

                {/* Register */}
                <Route
                  path="/auth/create_new_user"
                  element={
                    <PublicRoute>
                      <CreateNewUser />
                    </PublicRoute>
                  }
                />

                {/* ✅ NEW: Verify Email (OTP) */}
                <Route
                  path="/auth/verify-email"
                  element={
                    <PublicRoute>
                      <VerifyEmail />
                    </PublicRoute>
                  }
                />

                {/* Account pages (protected) */}
                <Route
                  path="/account/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/account/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="/bras" element={<BraListing />} />
                <Route path="/panties" element={<PantiesListing />} />
                <Route path="/nightwear" element={<NightwearListing />} />

                {/* HOME PAGE (public) */}
                <Route path="/" element={<Home />} />
                <Route path="/about-us" element={<Aboutus />} />
                <Route path="/ContactUs" element={<ContactUs />} />
                <Route path="/products" element={<AllProducts />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
              </Routes>
            </div>

            <FixedPlugin />

            {!hideFooter && <Footer />}
          </div>
        </CartProvider>
      </WishlistProvider>
    </ChakraProvider>
  );
}
