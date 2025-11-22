import './assets/css/App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { useState } from 'react';

import initialTheme from './theme/theme';

// PAGES & COMPONENTS
import Home from 'components/Home';
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

// 👉 NEW IMPORT
import AdminRoute from 'routes/AdminRoute';
import ProfilePage from 'views/account/ProfilePage';
import OrdersPage from 'views/account/OrdersPage';
import VerifyEmail from 'views/auth/VerifyEmail';
import ForgotPassword from 'views/auth/ForgotPassword';
import ResetPassword from 'views/auth/ResetPassword';

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
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {!hideHeader && <Header />}

        <div style={{ flex: 1 }}>
          <Routes>
            {/* Auth layout (register, forgot, etc) */}
            <Route path="auth/*" element={<AuthLayout />} />

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

            {/* HOME PAGE (public) */}
            <Route path="/" element={<Home />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Routes>
        </div>

        <FixedPlugin />

        {!hideFooter && <Footer />}
      </div>
    </ChakraProvider>
  );
}
