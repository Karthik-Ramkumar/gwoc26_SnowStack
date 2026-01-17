import React, { useState } from 'react';
import './Corporate.css';
import './Workshops.css';

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

  return (
    <div className="corporate-page">
      {/* HEADER - Corporate Services */}
      <header className="workshops-header" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.8) 100%), url('/static/images/gallery/CollectionHeaderbg.png')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
        <h1 className="funnel-title">
          <span className="japanese-accent">法人</span>
          Corporate Services
        </h1>
        <p>Elevate Your Corporate Culture with Artisanal Excellence</p>
      </header>

      {/* Our Offerings Section */}
      <section className="intro-quote offerings-section porcelain-section" style={{ paddingBottom: '5rem' }}>
        {/* Abstract Glaze Pour Texture */}
        <div className="glaze-texture"></div>
        {/* Services Section */}
        <div className="container-new" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header-new">
            <h2 className="section-title-new">Our Offerings</h2>
          </div>

          <div className="services-grid-new">
            {/* Service 1 */}
            <div className="service-card-new">
              <div className="service-icon-new">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#652810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="8" width="18" height="4" rx="1" />
                  <path d="M12 8v13" />
                  <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
                  <path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
                </svg>
              </div>
              <div className="service-content-new">
                <h3 className="service-title-new">Corporate Gifting</h3>
                <p className="service-description-new">
                  Curated, sustainable gift boxes featuring handmade treasures that tell a story. Perfect for holidays and milestones.
                </p>
              </div>
              <div className="service-image-new">
                <img src="/images/gallery/giftbox.png" alt="Corporate Gifting" />
              </div >
            </div >

            {/* Service 2 */}
            < div className="service-card-new" >
              <div className="service-icon-new">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#652810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div className="service-content-new">
                <h3 className="service-title-new">Team Workshops</h3>
                <p className="service-description-new">
                  Immersive hands-on sessions in pottery, weaving, or painting to foster team creativity and mindfulness.
                </p>
              </div>
              <div className="service-image-new">
                <img src="/static/images/gallery/workshop-team.png" alt="Team Workshop" />
              </div>
            </div >

            {/* Service 3 */}
            < div className="service-card-new" >
              <div className="service-icon-new">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#652810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {/* Two interlocking ceramic bowls */}
                  <path d="M2 14 Q2 20, 8 20 Q14 20, 14 14" />
                  <ellipse cx="8" cy="14" rx="6" ry="2" />
                  <path d="M10 14 Q10 20, 16 20 Q22 20, 22 14" />
                  <ellipse cx="16" cy="14" rx="6" ry="2" />
                </svg>
              </div>
              <div className="service-content-new">
                <h3 className="service-title-new">Brand Collaborations</h3>
                <p className="service-description-new">
                  Co-branded product lines that merge your corporate identity with our artisanal roots and aesthetics.
                </p>
              </div>
              <div className="service-image-new">
                <img src="/static/images/gallery/collaboration.png" alt="Brand Collaborations" />
              </div>
            </div >
          </div >
        </div >
      </section >

      {/* Artisanal Difference */}
      < section className="difference-section" >
        {/* Living Glaze Trails - Animated Background */}
        < svg
          className="glaze-trails-svg"
          width="100%"
          height="100%"
          viewBox="0 0 1400 800"
          preserveAspectRatio="xMidYMid slice"
          style={{ position: 'absolute', top: 0, left: 0, opacity: 0.07, pointerEvents: 'none', zIndex: 0 }
          }
        >
          {/* Trail 1 - Large sweeping curve */}
          < path
            className="glaze-trail glaze-trail-1"
            d="M-50 150 Q200 50, 400 180 T800 120 T1200 200 T1500 100"
            fill="none" stroke="#652810" strokeWidth="3" strokeLinecap="round"
          />
          {/* Trail 2 - Mid-height wave */}
          < path
            className="glaze-trail glaze-trail-2"
            d="M-100 350 Q150 280, 350 380 T750 320 T1100 400 T1450 340"
            fill="none" stroke="#652810" strokeWidth="2.5" strokeLinecap="round"
          />
          {/* Trail 3 - Lower gentle curve */}
          < path
            className="glaze-trail glaze-trail-3"
            d="M-80 550 Q250 480, 500 580 T900 520 T1300 600 T1500 540"
            fill="none" stroke="#652810" strokeWidth="3.5" strokeLinecap="round"
          />
          {/* Trail 4 - Top delicate line */}
          < path
            className="glaze-trail glaze-trail-4"
            d="M0 80 Q300 20, 600 100 T1000 60 T1400 120"
            fill="none" stroke="#652810" strokeWidth="2" strokeLinecap="round"
          />
          {/* Trail 5 - Bottom flowing stroke */}
          < path
            className="glaze-trail glaze-trail-5"
            d="M-50 680 Q200 620, 450 700 T850 650 T1250 720 T1500 680"
            fill="none" stroke="#652810" strokeWidth="2.8" strokeLinecap="round"
          />
          {/* Trail 6 - Central organic brush */}
          < path
            className="glaze-trail glaze-trail-6"
            d="M-100 420 Q180 350, 420 450 T820 380 T1180 480 T1500 400"
            fill="none" stroke="#652810" strokeWidth="3.2" strokeLinecap="round"
          />
          {/* Trail 7 - Upper accent */}
          < path
            className="glaze-trail glaze-trail-7"
            d="M100 250 Q350 180, 600 280 T1000 220 T1350 300"
            fill="none" stroke="#652810" strokeWidth="2.2" strokeLinecap="round"
          />
        </svg >

        <div className="container-new">
          <div className="difference-header">
            <h2 className="section-title-new">The Artisanal Difference</h2>
          </div>

          <div className="difference-grid">
            <div className="difference-item">
              <div className="difference-image">
                <img src="/static/images/gallery/sustainble-materials.png" alt="Sustainable Materials" />
              </div>
              <h4 className="difference-title">Sustainable Sourcing</h4>
              <p className="difference-text">Ethically sourced materials that respect the earth.</p>
            </div>

            <div className="difference-item offset">
              <div className="difference-image">
                <img src="/static/images/gallery/artisan-crafting.png" alt="Artisan Crafting" />
              </div>
              <h4 className="difference-title">Handcrafted Quality</h4>
              <p className="difference-text">Every piece is unique, made by master artisans.</p>
            </div>

            <div className="difference-item">
              <div className="difference-image">
                <img src="/static/images/gallery/traditional-patterns.png" alt="Traditional Patterns" />
              </div>
              <h4 className="difference-title">Cultural Heritage</h4>
              <p className="difference-text">Preserving traditional techniques for modern times.</p>
            </div>
          </div>
        </div>
      </section >

      {/* Inquiry Form */}
      < section className="inquiry-modern" >

        {/* DESCRIPTION SECTION - Restored White Quote Card */}
        < div className="quote-container-restored" >
          <p style={{ fontSize: '1.5rem', color: '#652810', fontWeight: 500, lineHeight: 1.6, margin: 0, fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', textAlign: 'center' }}>
            "Bring the warmth of artisanal heritage to your team and clients through curated experiences, sustainable gifts, and meaningful collaborations. We bridge traditional craftsmanship with modern business needs to create connections that last."
          </p>
        </div >

        <div className="container-new" style={{ marginTop: '4rem' }}>
          <div className="inquiry-card">
            {/* Form Side */}
            <div className="form-side">
              <div className="form-header-new">
                <span className="form-badge">Let's Collaborate</span>
                <h2 className="form-title-new">Start a Conversation</h2>
                <p className="form-subtitle-new">
                  Tell us about your team or project, and we'll craft a proposal tailored to your needs.
                </p>
              </div>

              {message && (
                <div className={`form-message ${message.includes('Thank you') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="modern-form">
                <div className="form-row-new">
                  <div className="form-group-new">
                    <label htmlFor="contact_name">Full Name</label>
                    <input
                      type="text"
                      id="contact_name"
                      name="contact_name"
                      value={formData.contact_name}
                      onChange={handleChange}
                      placeholder="Jane Doe"
                      required
                    />
                  </div>
                  <div className="form-group-new">
                    <label htmlFor="company_name">Company Name</label>
                    <input
                      type="text"
                      id="company_name"
                      name="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                      placeholder="Acme Inc."
                      required
                    />
                  </div>
                </div>

                <div className="form-group-new">
                  <label htmlFor="email">Work Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@acme.com"
                    required
                  />
                </div>

                <div className="form-group-new">
                  <label htmlFor="service_type">Interested Service</label>
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

                <div className="form-group-new">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your requirements..."
                    rows="4"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn-new" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            </div>

            {/* Testimonial Side */}
            <div className="testimonial-side">
              <div className="testimonial-overlay" style={{ backgroundImage: 'url(/static/images/gallery/testimonial-bg.png)' }}>
                <div className="testimonial-content">
                  <span className="quote-mark">"</span>
                  <p className="testimonial-text">
                    "The pottery workshop was the highlight of our annual retreat. It brought the team together in a way that standard corporate activities never have."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {/* TODO: Add author image */}
                    </div>
                    <div className="author-info">
                      <p className="author-name">Shivangi</p>
                      <p className="author-title">HR Director, Studio Tech</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >
    </div >
  );
}

export default Corporate;
