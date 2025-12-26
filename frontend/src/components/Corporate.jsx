import React, { useState } from 'react';
import './Corporate.css';

function Corporate() {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    service_type: '',
    team_size: '',
    message: '',
    budget_range: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // Simulate form submission (replace with actual API endpoint later)
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage('Thank you! We\'ll get back to you within 24 hours.');
      setFormData({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        service_type: '',
        team_size: '',
        message: '',
        budget_range: ''
      });
    } catch (error) {
      setMessage('Error submitting inquiry. Please try again.');
      console.error('Inquiry submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const services = [
    {
      icon: '🎁',
      title: 'Corporate Gifting',
      description: 'Handcrafted pottery pieces that make memorable corporate gifts. Each piece carries the warmth of human touch and the story of mindful creation.',
      features: [
        'Custom branding with subtle elegance',
        'Thoughtfully curated bulk collections',
        'Premium artisanal packaging',
        'Personalized consultation process'
      ]
    },
    {
      icon: '👥',
      title: 'Team Workshops',
      description: 'Immersive pottery experiences that bring teams together. Reconnect with craft, creativity, and the meditative rhythm of working with clay.',
      features: [
        'Onsite sessions or studio immersion',
        'Intimate groups for meaningful connection',
        'Master artisan guidance',
        'Complete materials & tools provided'
      ]
    },
    {
      icon: '🤝',
      title: 'Brand Collaborations',
      description: 'Partner with Basho for exclusive collections that embody artisanal authenticity. From restaurant tableware to retail partnerships.',
      features: [
        'Bespoke design development',
        'Scalable artisan production',
        'Consistent handmade quality',
        'Long-term creative partnerships'
      ]
    }
  ];

  return (
    <div className="corporate-page">
      {/* Hero Section */}
      <section className="corporate-hero">
        <div className="hero-texture-overlay"></div>
        <div className="hero-content">
          <span className="japanese-subtitle">企業連携</span>
          <h1 className="hero-title">
            Corporate <br/><span className="title-accent">Collaborations</span>
          </h1>
          <p className="hero-description">
            Where craft meets commerce. Elevate your business with the timeless 
            beauty of handmade pottery — from thoughtful gifting to immersive 
            team experiences.
          </p>
        </div>
        <div className="hero-scroll-indicator">
          <span>Explore</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Offerings</span>
            <h2 className="section-title">Artisan Solutions for Business</h2>
            <p className="section-description">
              Every collaboration begins with conversation. We listen, we create, 
              we deliver pieces that tell your story through the language of clay.
            </p>
          </div>

          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card" data-index={index}>
                <div className="card-texture"></div>
                <div className="service-icon-wrapper">
                  <span className="service-icon">{service.icon}</span>
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-description">{service.description}</p>
                <ul className="service-features">
                  {service.features.map((feature, idx) => (
                    <li key={idx}>
                      <span className="feature-dot"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-section">
        <div className="why-texture-bg"></div>
        <div className="container">
          <div className="why-grid">
            <div 
              className="why-image with-background"
              style={{
                backgroundImage: "linear-gradient(135deg, rgba(212, 197, 176, 0.3) 0%, rgba(165, 143, 127, 0.3) 100%), url(/static/images/gallery/corporate-why.jpg)",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div className="image-frame">
                <div className="frame-corner tl"></div>
                <div className="frame-corner tr"></div>
                <div className="frame-corner bl"></div>
                <div className="frame-corner br"></div>
              </div>
            </div>
            <div className="why-content">
              <span className="section-label">The Basho Difference</span>
              <h2 className="section-title">Where Craft Meets Intention</h2>
              <p className="why-intro">
                In an era of mass production, we offer something rare: pieces made 
                slowly, with care, each one carrying the imprint of human hands and 
                the quiet beauty of imperfection.
              </p>
              <div className="why-points">
                <div className="why-point">
                  <span className="point-number">01</span>
                  <div className="point-content">
                    <h4>Authentic Artisanship</h4>
                    <p>Every vessel begins as raw clay and becomes art through patient craftsmanship. No two pieces are identical.</p>
                  </div>
                </div>
                <div className="why-point">
                  <span className="point-number">02</span>
                  <div className="point-content">
                    <h4>Sustainable Practice</h4>
                    <p>Earth-friendly materials, ethical production, and support for local artisan communities.</p>
                  </div>
                </div>
                <div className="why-point">
                  <span className="point-number">03</span>
                  <div className="point-content">
                    <h4>Mindful Collaboration</h4>
                    <p>We listen deeply to your vision and translate it into tactile form with precision and care.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section className="inquiry-section">
        <div className="container">
          <div className="inquiry-grid">
            <div className="inquiry-intro">
              <span className="section-label">Let's Begin</span>
              <h2 className="section-title">Start a Conversation</h2>
              <p className="inquiry-description">
                Every collaboration starts with dialogue. Share your vision, your 
                needs, your timeline. We'll respond thoughtfully, with ideas shaped 
                by experience and a deep respect for craft.
              </p>
              <div className="inquiry-details">
                <div className="detail-item">
                  <span className="detail-icon">📧</span>
                  <div>
                    <strong>Email Response</strong>
                    <p>Within 24 hours</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">💬</span>
                  <div>
                    <strong>Consultation</strong>
                    <p>Complimentary initial discussion</p>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🎨</span>
                  <div>
                    <strong>Custom Proposals</strong>
                    <p>Tailored to your requirements</p>
                  </div>
                </div>
              </div>
            </div>

            {message && (
              <div className={`form-message ${message.includes('Thank you') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="corporate-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="company_name">Company Name *</label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                    placeholder="Your organization"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact_name">Your Name *</label>
                  <input
                    type="text"
                    id="contact_name"
                    name="contact_name"
                    value={formData.contact_name}
                    onChange={handleChange}
                    required
                    placeholder="Full name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="you@company.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="service_type">Service Interested In *</label>
                  <select
                    id="service_type"
                    name="service_type"
                    value={formData.service_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a service</option>
                    <option value="gifting">Corporate Gifting</option>
                    <option value="workshop">Team Workshop</option>
                    <option value="collaboration">Brand Collaboration</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="team_size">Team Size / Order Quantity</label>
                  <input
                    type="text"
                    id="team_size"
                    name="team_size"
                    value={formData.team_size}
                    onChange={handleChange}
                    placeholder="e.g., 50 people or 100 pieces"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="budget_range">Budget Range</label>
                <select
                  id="budget_range"
                  name="budget_range"
                  value={formData.budget_range}
                  onChange={handleChange}
                >
                  <option value="">Select a range</option>
                  <option value="under-50k">Under ₹50,000</option>
                  <option value="50k-1l">₹50,000 - ₹1,00,000</option>
                  <option value="1l-3l">₹1,00,000 - ₹3,00,000</option>
                  <option value="above-3l">Above ₹3,00,000</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Tell Us About Your Requirements *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  placeholder="Share your vision, timeline, specific requirements, or any questions you have..."
                ></textarea>
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Submit Inquiry'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Corporate;
