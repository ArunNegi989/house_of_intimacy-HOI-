import "./assets/css/App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { useState } from "react";

import initialTheme from "./theme/theme";

// PAGES & COMPONENTS
import Home from "components/Home";
import SignIn from "views/auth/signIn";
import Header from "components/Header";
import Footer from "components/Footer";

// LAYOUTS
import AuthLayout from "./layouts/auth";
import AdminLayout from "./layouts/admin";

// 🌙 DARK MODE FLOAT BUTTON
import FixedPlugin from "../src/components/Dashboard/fixedPlugin/FixedPlugin";

export default function Main() {
  const [currentTheme, setCurrentTheme] = useState(initialTheme);
  const location = useLocation();

  // Hide Header on these routes
  const hideHeader =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/auth") ||
    location.pathname === "/login";

    const hideFooter =
    location.pathname.startsWith("/admin");
   
  return (
    <ChakraProvider theme={currentTheme}>
      
      {/* HEADER (conditionally hidden) */}
      {!hideHeader && <Header />}

      {/* ALL ROUTES */}
      <Routes>
        <Route path="auth/*" element={<AuthLayout />} />

        <Route
          path="admin/*"
          element={
            <AdminLayout theme={currentTheme} setTheme={setCurrentTheme} />
          }
        />

        <Route path="/login" element={<SignIn />} />

        {/* HOME PAGE */}
        <Route path="/" element={<Home />} />
      </Routes>

      {/* 🌙 DARK MODE BUTTON ON ALL PAGES */}
      <FixedPlugin />

      {/* FOOTER */}
      {! hideFooter && <Footer />}
    </ChakraProvider>
  );
}
