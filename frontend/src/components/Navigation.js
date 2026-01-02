import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { User, LogOut, UserCircle } from "lucide-react";

function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setShowDropdown(false);
      navigate('/');
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return currentUser?.email[0].toUpperCase();
    const names = name.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
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

        {/* Authentication UI */}
        {currentUser ? (
          <div className="user-menu" ref={dropdownRef}>
            <button
              className="user-avatar"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="User menu"
            >
              {currentUser.photoURL ? (
                <img src={currentUser.photoURL} alt="Profile" />
              ) : (
                <span className="user-initials">
                  {getInitials(currentUser.displayName)}
                </span>
              )}
            </button>

            {showDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p className="user-name">
                    {currentUser.displayName || 'Basho Member'}
                  </p>
                  <p className="user-email">{currentUser.email}</p>
                </div>
                <div className="dropdown-divider"></div>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate('/profile');
                    setShowDropdown(false);
                  }}
                >
                  <UserCircle size={18} />
                  <span>My Profile</span>
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-button">
            <User size={18} />
            <span>Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navigation;
