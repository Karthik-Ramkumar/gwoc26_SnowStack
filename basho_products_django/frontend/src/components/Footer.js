import React from 'react';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <h3 className="footer-title">
              <span className="logo-japanese">芭蕉</span>
              <span>BASHO</span>
            </h3>
            <p>Handcrafted pottery inspired by Japanese philosophy.</p>
            <div className="social-links">
              <a 
                href="https://www.instagram.com/bashobyyshivangi/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Connect</h4>
            <ul>
              <li><a href="mailto:hello@bashobyshivangi.com">Email Us</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Basho by Shivangi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
