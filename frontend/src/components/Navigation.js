import React from 'react';

const Navigation = ({ currentPage, onNavigate }) => {
  return (
    <nav className="main-nav" id="mainNav">
      <div className="nav-container">
        <div className="logo">
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('products'); }}>
            <span className="logo-japanese">芭蕉</span>
            <span className="logo-text">BASHO</span>
          </a>
        </div>
        <ul className="nav-menu" id="navMenu">
          <li>
            <a 
              href="/products" 
              className={currentPage === 'products' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onNavigate('products'); }}
            >
              Collections
            </a>
          </li>
          <li>
            <a 
              href="/workshops" 
              className={currentPage === 'workshops' ? 'active' : ''}
              onClick={(e) => { e.preventDefault(); onNavigate('workshops'); }}
            >
              Workshops
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
