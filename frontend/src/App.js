import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

import { AuthProvider } from "./contexts/AuthContext";
import Home from "./components/Home";
import Products from "./components/Products";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Workshops from "./components/Workshops";
import Studio from "./components/Studio";
import Corporate from "./components/Corporate";
import Media from "./components/Media";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import ForgotPassword from "./components/auth/ForgotPassword";
import UserProfile from "./components/auth/UserProfile";

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ScrollToTop />
          <Navigation />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/workshops" element={<Workshops />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/media" element={<Media />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>

          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

