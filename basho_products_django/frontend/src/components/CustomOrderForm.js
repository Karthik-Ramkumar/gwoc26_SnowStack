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
  const [referenceImages, setReferenceImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setReferenceImages(files);
  };

  const removeImage = (index) => {
    setReferenceImages(referenceImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // Create FormData for multipart upload
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Add reference images
      referenceImages.forEach((file, index) => {
        submitData.append('reference_images', file);
      });

      const response = await axios.post('/api/custom-orders/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
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
      setReferenceImages([]);
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

        {/* Previous Custom Orders Showcase */}
        <div className="custom-showcase" style={{marginBottom: 'var(--spacing-xl)'}}>
          <div className="container">
            <div className="showcase-header center" style={{marginBottom: 'var(--spacing-lg)'}}>
              <h3 style={{color: 'var(--clay-dark)', marginBottom: 'var(--spacing-sm)'}}>
                ✨ Previous Custom Creations
              </h3>
              <p style={{color: 'var(--clay-medium)', maxWidth: '600px', margin: '0 auto'}}>
                See what we've created for our valued customers. Each piece tells a unique story.
              </p>
            </div>

            <div className="showcase-grid">
              {/* Note: Add these images to public/images/custom/ directory:
                  - wedding-set.jpg
                  - corporate-planters.jpg
                  - art-installation.jpg
                  - family-heirloom.jpg
                  - personalized-mugs.jpg
                  - sculptural-vase.jpg
              */}
              <div className="showcase-item">
                <div className="showcase-image">
                  <img src="/images/custom/wedding-set.jpg" alt="Wedding Dinnerware Set" />
                  <div className="showcase-overlay">
                    <span className="showcase-category">Wedding Set</span>
                  </div>
                </div>
                <div className="showcase-content">
                  <h4>Personalized Wedding Dinnerware</h4>
                  <p>"Our wedding dinnerware set was absolutely perfect. The custom monogram and elegant design made our special day even more memorable."</p>
                  <div className="showcase-meta">
                    <span className="customer-name">— Sarah & Michael</span>
                    <span className="project-type">Complete 24-piece set</span>
                  </div>
                </div>
              </div>

              <div className="showcase-item">
                <div className="showcase-image">
                  <img src="/images/custom/corporate-planters.jpg" alt="Corporate Planters" />
                  <div className="showcase-overlay">
                    <span className="showcase-category">Corporate</span>
                  </div>
                </div>
                <div className="showcase-content">
                  <h4>Branded Office Planters</h4>
                  <p>"The custom planters with our company logo elevated our office space. Excellent craftsmanship and attention to detail."</p>
                  <div className="showcase-meta">
                    <span className="customer-name">— TechCorp Solutions</span>
                    <span className="project-type">50-piece order</span>
                  </div>
                </div>
              </div>

              <div className="showcase-item">
                <div className="showcase-image">
                  <img src="/images/custom/art-installation.jpg" alt="Art Installation" />
                  <div className="showcase-overlay">
                    <span className="showcase-category">Art Installation</span>
                  </div>
                </div>
                <div className="showcase-content">
                  <h4>Restaurant Wall Installation</h4>
                  <p>"The ceramic wall art transformed our restaurant's ambiance. Our customers constantly compliment the unique, handcrafted pieces."</p>
                  <div className="showcase-meta">
                    <span className="customer-name">— Bella Vista Restaurant</span>
                    <span className="project-type">Large-scale installation</span>
                  </div>
                </div>
              </div>

              <div className="showcase-item">
                <div className="showcase-image">
                  <img src="/images/custom/family-heirloom.jpg" alt="Family Heirloom Set" />
                  <div className="showcase-overlay">
                    <span className="showcase-category">Heirloom</span>
                  </div>
                </div>
                <div className="showcase-content">
                  <h4>Generational Dinnerware Set</h4>
                  <p>"We wanted something special to pass down to our children. The custom family crest and quality craftsmanship exceeded our expectations."</p>
                  <div className="showcase-meta">
                    <span className="customer-name">— The Rodriguez Family</span>
                    <span className="project-type">16-piece heirloom set</span>
                  </div>
                </div>
              </div>

              <div className="showcase-item">
                <div className="showcase-image">
                  <img src="/images/custom/personalized-mugs.jpg" alt="Personalized Coffee Mugs" />
                  <div className="showcase-overlay">
                    <span className="showcase-category">Personalized</span>
                  </div>
                </div>
                <div className="showcase-content">
                  <h4>Custom Coffee Mug Set</h4>
                  <p>"Perfect birthday gift for my coffee-loving husband. Each mug has a different inspirational quote and our initials. Love them!"</p>
                  <div className="showcase-meta">
                    <span className="customer-name">— Emma Thompson</span>
                    <span className="project-type">6-piece mug set</span>
                  </div>
                </div>
              </div>

              <div className="showcase-item">
                <div className="showcase-image">
                  <img src="/images/custom/sculptural-vase.jpg" alt="Sculptural Vase" />
                  <div className="showcase-overlay">
                    <span className="showcase-category">Sculptural Art</span>
                  </div>
                </div>
                <div className="showcase-content">
                  <h4>Abstract Sculptural Vase</h4>
                  <p>"This piece is a conversation starter in our living room. The organic shapes and glaze effects are truly mesmerizing."</p>
                  <div className="showcase-meta">
                    <span className="customer-name">— David Chen</span>
                    <span className="project-type">One-of-a-kind sculpture</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="showcase-cta center" style={{marginTop: 'var(--spacing-xl)'}}>
              <p style={{fontSize: '1.1rem', color: 'var(--clay-dark)', marginBottom: 'var(--spacing-md)'}}>
                Ready to create something special?
              </p>
              <div style={{width: '50px', height: '3px', background: 'var(--terracotta)', margin: '0 auto var(--spacing-lg)'}}></div>
            </div>
          </div>
        </div>

        <div className="custom-intro" style={{maxWidth: '800px', margin: '0 auto var(--spacing-lg)'}}>
          <p className="large-text">
            Have a specific vision? We create custom pottery pieces tailored to your needs—from personalized dinnerware to unique art installations.
          </p>
          
          <div className="vision-section" style={{margin: 'var(--spacing-lg) 0'}}>
            <h4 style={{color: 'var(--clay-dark)', marginBottom: 'var(--spacing-md)'}}>
              🖼️ Share Your Vision
            </h4>
            <p style={{marginBottom: 'var(--spacing-md)'}}>
              Upload reference images to help us understand your vision better. Share photos of pottery you love, sketches of your ideas, or inspiration from other art forms.
            </p>
            <div className="vision-tips" style={{background: 'var(--sand-light)', padding: 'var(--spacing-md)', borderRadius: 'var(--border-radius)'}}>
              <strong>Tips for better custom orders:</strong>
              <ul style={{margin: 'var(--spacing-sm) 0 0 0', paddingLeft: 'var(--spacing-lg)'}}>
                <li>Include dimensions or size references</li>
                <li>Share color palettes or mood boards</li>
                <li>Mention the intended use (tableware, decoration, etc.)</li>
                <li>Reference specific pottery styles or artists you admire</li>
              </ul>
            </div>
          </div>
          
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
              <label>Reference Images (Optional)</label>
              <div className="file-upload-area">
                <input
                  type="file"
                  id="reference-images"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor="reference-images" className="file-upload-label">
                  <div className="upload-icon">📎</div>
                  <div className="upload-text">
                    <strong>Click to upload reference images</strong>
                    <br />
                    <small>Photos, sketches, or inspiration images (PNG, JPG, up to 10MB each)</small>
                  </div>
                </label>
              </div>

              {referenceImages.length > 0 && (
                <div className="image-preview">
                  <h4>Selected Images ({referenceImages.length})</h4>
                  <div className="preview-grid">
                    {referenceImages.map((file, index) => (
                      <div key={index} className="preview-item">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Reference ${index + 1}`}
                          className="preview-image"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="remove-image-btn"
                          title="Remove image"
                        >
                          ×
                        </button>
                        <div className="image-info">
                          <small>{file.name}</small>
                          <br />
                          <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
