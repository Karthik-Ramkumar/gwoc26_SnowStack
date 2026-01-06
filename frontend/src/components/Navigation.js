import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { getCartCount } = useCart();
  const { currentUser, logout } = useAuth();
  const cartCount = getCartCount();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link to="/" className="logo" style={{ cursor: "pointer", textDecoration: "none" }}>
        <img
          src="https://i.postimg.cc/nLh2w8mP/transbashologo.png"
          alt="Basho Logo"
        />
      </Link>

      {/* Navigation Links */}
      <div className="nav-links">
        <Link
          to="/products"
          className={currentPath === "/products" ? "active" : ""}
        >
          Collections
        </Link>

        <Link
          to="/workshops"
          className={currentPath === "/workshops" ? "active" : ""}
        >
          Workshops
        </Link>

        <Link
          to="/studio"
          className={currentPath === "/studio" ? "active" : ""}
        >
          Studio
        </Link>

        <Link
          to="/corporate"
          className={currentPath === "/corporate" ? "active" : ""}
        >
          Corporate
        </Link>

        <Link
          to="/media"
          className={currentPath === "/media" ? "active" : ""}
        >
          Media
        </Link>

        <Link
          to="/cart"
          className={`cart-icon ${currentPath === "/cart" ? "active" : ""}`}
          style={{ position: "relative" }}
        >
          <ShoppingCart size={24} color="#652810" strokeWidth={2} />
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>

        {currentUser ? (
          <div className="user-menu">
            <div className="user-avatar" title={currentUser.displayName || currentUser.email}>
              {(currentUser.displayName || currentUser.email || 'U').charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout} className="logout-btn" title="Logout">
              <LogOut size={20} color="#652810" strokeWidth={2} />
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className={`login-link ${currentPath === "/login" ? "active" : ""}`}
          >
            <User size={24} color="#652810" strokeWidth={2} />
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
