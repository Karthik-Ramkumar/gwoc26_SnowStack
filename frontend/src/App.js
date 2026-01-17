import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Always load these immediately (needed for layout)
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ChatbotWidget from "./components/ChatbotWidget";

// Lazy load page components for better performance
const Home = lazy(() => import("./components/Home"));
const Products = lazy(() => import("./components/Products"));
const Workshops = lazy(() => import("./components/Workshops"));
const Studio = lazy(() => import("./components/Studio"));
const Corporate = lazy(() => import("./components/Corporate"));
const Media = lazy(() => import("./components/Media"));
const Cart = lazy(() => import("./components/Cart"));
const Checkout = lazy(() => import("./components/Checkout"));
const Login = lazy(() => import("./components/Login"));
const Signup = lazy(() => import("./components/Signup"));
const Profile = lazy(() => import("./components/Profile"));

// Component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

// Loading fallback component
function PageLoader() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      fontSize: '1.2rem',
      color: '#EDD8B4'
    }}>
      Loading...
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <div className="App">
              <ScrollToTop />
              <Navigation />

              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/workshops" element={<Workshops />} />
                  <Route path="/studio" element={<Studio />} />
                  <Route path="/corporate" element={<Corporate />} />
                  <Route path="/media" element={<Media />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Suspense>

              <Footer />
              <ChatbotWidget />
            </div>
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
