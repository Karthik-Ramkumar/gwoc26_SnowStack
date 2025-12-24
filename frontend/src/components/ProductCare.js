import React from 'react';

const ProductCare = () => {
  return (
    <section className="section-padding" style={{background: 'var(--cream)'}}>
      <div className="container">
        <div className="section-header center">
          <h2 className="section-title">
            <span className="title-accent">Product Care &</span>
            <span className="title-main">Information</span>
          </h2>
        </div>

        <div className="content-grid">
          <div className="fade-in">
            <h3>Material & Safety</h3>
            <ul>
              <li><strong>Clay:</strong> High-quality stoneware fired at 1200°C</li>
              <li><strong>Glazes:</strong> Food-safe, lead-free glazes</li>
              <li><strong>Certifications:</strong> Food-safe and non-toxic</li>
              <li><strong>Usage:</strong> Microwave and dishwasher safe (unless specified)</li>
            </ul>
          </div>

          <div className="fade-in">
            <h3>Care Instructions</h3>
            <ul>
              <li>Hand wash recommended for longevity</li>
              <li>Avoid thermal shock (sudden temperature changes)</li>
              <li>Do not place directly from refrigerator to oven</li>
              <li>Minor surface variations are natural and intentional</li>
            </ul>
          </div>

          <div className="fade-in">
            <h3>Shipping Information</h3>
            <ul>
              <li><strong>Packaging:</strong> Eco-friendly, secure packaging</li>
              <li><strong>Shipping:</strong> Calculated by weight (₹50/kg)</li>
              <li><strong>Delivery:</strong> 5-7 business days within India</li>
              <li><strong>Custom Orders:</strong> 3-4 weeks production time</li>
            </ul>
          </div>

          <div className="fade-in">
            <h3>Returns & Exchange</h3>
            <ul>
              <li>Damaged items: Full refund or replacement</li>
              <li>Report damage within 48 hours of delivery</li>
              <li>Custom orders: Non-refundable once production starts</li>
              <li>Contact us for any concerns</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductCare;
