import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { getCartCount } = useCart();
  const { currentUser, logout, isStaff } = useAuth();
  const cartCount = getCartCount();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      setMobileMenuOpen(false);
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <Link
        to="/products"
        className={currentPath === "/products" ? "active" : ""}
        onClick={handleNavClick}
      >
        Collections
      </Link>

      <Link
        to="/workshops"
        className={currentPath === "/workshops" ? "active" : ""}
        onClick={handleNavClick}
      >
        Workshops
      </Link>

      <Link
        to="/studio"
        className={currentPath === "/studio" ? "active" : ""}
        onClick={handleNavClick}
      >
        Studio
      </Link>

      <Link
        to="/corporate"
        className={currentPath === "/corporate" ? "active" : ""}
        onClick={handleNavClick}
      >
        Corporate
      </Link>

      <Link
        to="/media"
        className={currentPath === "/media" ? "active" : ""}
        onClick={handleNavClick}
      >
        Media
      </Link>
    </>
  );

  return (
    <nav className="navbar">
      {/* LEFT: Logo */}
      <div className="nav-left">
        <Link to="/" className="logo" onClick={handleNavClick}>
          <img
            src="https://i.postimg.cc/nLh2w8mP/transbashologo.png"
            alt="Basho Logo"
          />
        </Link>
      </div>

      {/* CENTER: Desktop Links */}
      <div className="nav-center-desktop">
        <NavLinks />
      </div>
<<<<<<< HEAD

      {/* RIGHT: Actions */}
      <div className="nav-right">
=======

      {/* RIGHT: Actions */}
      <div className="nav-right">
        {/* Admin Button - Only show for staff users */}
        {currentUser && isStaff && (
          <a
            href="/admin/"
            className="admin-btn"
            title="Admin Panel"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#652810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </a>
        )}

>>>>>>> c0c29b90927ff3afed6f1717adf0cd201a6ecc91
        {/* Cart */}
        <Link
          to="/cart"
          className={`cart-icon ${currentPath === "/cart" ? "active" : ""}`}
          onClick={handleNavClick}
        >
          <ShoppingCart size={24} color="#652810" strokeWidth={2} />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {/* User Menu */}
        {currentUser ? (
          <div className="user-menu">
            <Link
              to="/profile"
              className="user-avatar"
              title={currentUser.displayName || currentUser.email}
              onClick={handleNavClick}
            >
              {currentUser.photoURL && !imageError ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Profile'}
                  className="user-avatar-img"
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                />
              ) : (
                (currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()
              )}
            </Link>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <LogOut size={20} color="#652810" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className={`login-link ${currentPath === "/login" ? "active" : ""}`}
            onClick={handleNavClick}
          >
            <User size={24} color="#652810" strokeWidth={2} />
          </Link>
        )}

        {/* Mobile Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} color="#652810" /> : <Menu size={28} color="#652810" />}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <div className={`mobile-nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <NavLinks />

        {/* Mobile Specific Actions */}
        <div className="mobile-menu-actions">
          <Link
            to="/cart"
            className={currentPath === "/cart" ? "active" : ""}
            onClick={handleNavClick}
          >
            Cart ({cartCount})
          </Link>

          {currentUser ? (
            <>
<<<<<<< HEAD
=======
              {isStaff && (
                <a
                  href="/admin/"
                  className="admin-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleNavClick}
                >
                  Admin Panel
                </a>
              )}
>>>>>>> c0c29b90927ff3afed6f1717adf0cd201a6ecc91
              <Link
                to="/profile"
                className={currentPath === "/profile" ? "active" : ""}
                onClick={handleNavClick}
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="mobile-logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={currentPath === "/login" ? "active" : ""}
              onClick={handleNavClick}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
