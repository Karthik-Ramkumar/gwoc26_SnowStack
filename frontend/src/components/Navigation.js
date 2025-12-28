import React from 'react';
import { useCart } from '../context/CartContext';

function Navigation({ currentPage, onNavigate }) {
  const { cartCount, toggleCart } = useCart();

  return (
    <nav className="navbar">
      {/* Logo */}
      <div
        className="logo"
        onClick={() => onNavigate("home")}
        style={{ cursor: "pointer" }}
      >
        <img
          src="https://i.postimg.cc/nLh2w8mP/transbashologo.png"
          alt="Basho Logo"
        />
      </div>

      {/* Navigation Links */}
      <div className="nav-links">
        <span
          className={currentPage === "products" ? "active" : ""}
          onClick={() => onNavigate("products")}
        >
          Collections
        </span>

        <span
          className={currentPage === "workshops" ? "active" : ""}
          onClick={() => onNavigate("workshops")}
        >
          Workshops
        </span>

        <span
          className={currentPage === "studio" ? "active" : ""}
          onClick={() => onNavigate("studio")}
        >
          Studio
        </span>

        <span
          className={currentPage === "corporate" ? "active" : ""}
          onClick={() => onNavigate("corporate")}
        >
          Corporate
        </span>

        <span
          className={currentPage === "media" ? "active" : ""}
          onClick={() => onNavigate("media")}
        >
          Media
        </span>

        {/* Bag Icon */}
        <div
          className="cart-icon-wrapper"
          onClick={toggleCart}
          title="Open Bag"
          style={{ marginLeft: '1rem' }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {cartCount > 0 && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
