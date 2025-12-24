import React from 'react';

const Navigation = () => {
  return (
    <nav className="main-nav" id="mainNav">
      <div className="nav-container">
        <div className="logo">
          <a href="/">
            <span className="logo-japanese">芭蕉</span>
            <span className="logo-text">BASHO</span>
          </a>
        </div>
        <ul className="nav-menu" id="navMenu">
          <li><a href="/" className="active">Collections</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
