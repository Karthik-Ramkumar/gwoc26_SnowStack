import React, { useState } from 'react';
import axios from 'axios';

const CustomOrderForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    project_type: '',
    description: '',
    budget: '',
    gst_number: ''
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
      const response = await axios.post('http://localhost:8000/api/custom-orders/', formData);
      
      setMessage(`Success! Your order number is ${response.data.order_number}. We'll contact you within 24 hours.`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        project_type: '',
        description: '',
        budget: '',
        gst_number: ''
      });
    } catch (error) {
      setMessage('Error submitting order. Please try again or contact us directly.');
      console.error('Order submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="section-padding" id="custom">
      <div className="container">
        <div className="section-header center">
          <h2 className="section-title">
            <span className="title-accent">Custom</span>
            <span className="title-main">Creations</span>
          </h2>
          <p className="section-subtitle">Bespoke pottery crafted to your vision</p>
        </div>

        <div className="custom-intro" style={{maxWidth: '800px', margin: '0 auto var(--spacing-lg)'}}>
          <p className="large-text">
            Have a specific vision? We create custom pottery pieces tailored to your needs—from personalized dinnerware to unique art installations.
          </p>
          
          <div className="info-box">
            <h4>What We Offer</h4>
            <ul style={{listStyle: 'none', padding: 0}}>
              <li>✓ Custom tableware sets for homes and restaurants</li>
              <li>✓ Personalized gifts with names or messages</li>
              <li>✓ Corporate branding on pottery</li>
              <li>✓ Large-scale art installations</li>
              <li>✓ Wedding and event pottery</li>
            </ul>
          </div>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="fade-in">
            <h3 style={{marginBottom: 'var(--spacing-md)', textAlign: 'center'}}>
              Request a Custom Order
            </h3>
            
            {message && (
              <div style={{
                padding: 'var(--spacing-sm)',
                marginBottom: 'var(--spacing-md)',
                backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
                color: message.includes('Success') ? '#155724' : '#721c24',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div className="form-group">
                <label>Project Type *</label>
                <select 
                  name="project_type"
                  value={formData.project_type}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="tableware">Tableware Set</option>
                  <option value="art">Art Piece</option>
                  <option value="corporate">Corporate Order</option>
                  <option value="event">Event/Wedding</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Describe Your Vision *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                required 
                placeholder="Tell us about your custom pottery idea, including size, colors, quantity, and any specific requirements..."
              />
              <span className="form-helper">Be as detailed as possible</span>
            </div>

            <div className="form-group">
              <label>Budget Range (Optional)</label>
              <select 
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Select range</option>
                <option value="5000-10000">₹5,000 - ₹10,000</option>
                <option value="10000-25000">₹10,000 - ₹25,000</option>
                <option value="25000-50000">₹25,000 - ₹50,000</option>
                <option value="50000+">₹50,000+</option>
              </select>
            </div>

            <div className="form-group">
              <label>GST Number (Optional - for invoice)</label>
              <input 
                type="text" 
                name="gst_number"
                value={formData.gst_number}
                onChange={handleChange}
                placeholder="Enter GST number if applicable"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{width: '100%'}}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Custom Order Request'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderForm;
