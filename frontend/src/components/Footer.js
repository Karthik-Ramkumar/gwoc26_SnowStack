import React from 'react';
import { Instagram } from 'lucide-react';

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
                className="social-link instagram-link"
              >
                <Instagram size={24} strokeWidth={2} />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Contact Us</h4>
            <ul>
              <li><a href="mailto:bashobyyshivange@gmail.com">email: bashobyyshivangi@gmail.com</a></li>
              <li><a href="tel:+919879575601">Phone No: +91 9879575601</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Basho byy Shivangi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
