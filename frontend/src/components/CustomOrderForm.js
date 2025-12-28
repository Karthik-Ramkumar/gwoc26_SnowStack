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
  const [referenceImage, setReferenceImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setMessage('Please select a valid image file (JPG, PNG, GIF, or WebP)');
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setMessage('Image size must be less than 10MB');
        return;
      }

      setReferenceImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setMessage('');
    }
  };

  const handleRemoveImage = () => {
    setReferenceImage(null);
    setImagePreview(null);
    // Reset file input
    const fileInput = document.getElementById('reference-image-input');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('project_type', formData.project_type);
      submitData.append('description', formData.description);
      submitData.append('budget', formData.budget);
      submitData.append('gst_number', formData.gst_number);

      // Add image if selected
      if (referenceImage) {
        submitData.append('reference_images', referenceImage);
      }

      const response = await axios.post('http://localhost:8000/api/custom-orders/', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
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
      setReferenceImage(null);
      setImagePreview(null);
      const fileInput = document.getElementById('reference-image-input');
      if (fileInput) fileInput.value = '';
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

        <div className="custom-intro" style={{ maxWidth: '800px', margin: '0 auto var(--spacing-lg)' }}>
          <p className="large-text">
            Have a specific vision? We create custom pottery pieces tailored to your needs—from personalized dinnerware to unique art installations.
          </p>

          <div className="info-box">
            <h4>What We Offer</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
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
            <h3 style={{ marginBottom: 'var(--spacing-md)', textAlign: 'center' }}>
              Request a Custom Order
            </h3>



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

              <div
                onClick={() => document.getElementById('reference-image-input').click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#8B6F47';
                  e.currentTarget.style.backgroundColor = '#f5f5f5';
                }}
                onDragLeave={(e) => {
                  e.currentTarget.style.borderColor = '#d4c5a9';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = '#d4c5a9';
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  const files = e.dataTransfer.files;
                  if (files.length > 0) {
                    const event = { target: { files: files } };
                    handleImageChange(event);
                  }
                }}
                style={{
                  border: '2px dashed #d4c5a9',
                  borderRadius: '8px',
                  padding: '60px 40px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  transition: 'all 0.3s ease',
                  marginTop: '8px'
                }}
              >
                <input
                  type="file"
                  id="reference-image-input"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />

                {!imagePreview ? (
                  <>
                    {/* Paperclip Icon */}
                    <div style={{
                      fontSize: '48px',
                      color: '#8B6F47',
                      marginBottom: '16px'
                    }}>
                      📎
                    </div>

                    <div style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      color: '#5a4a3a',
                      marginBottom: '12px'
                    }}>
                      Click to upload reference images
                    </div>

                    <div style={{
                      fontSize: '14px',
                      color: '#8B6F47'
                    }}>
                      Photos, sketches, or inspiration images (PNG, JPG, up to 10MB each)
                    </div>
                  </>
                ) : (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px'
                  }}>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        maxWidth: '300px',
                        maxHeight: '300px',
                        borderRadius: '8px',
                        border: '2px solid #d4c5a9',
                        objectFit: 'contain'
                      }}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage();
                      }}
                      style={{
                        padding: '10px 24px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c82333'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#dc3545'}
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>
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
              style={{ width: '100%' }}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Custom Order Request'}
            </button>

            {message && (
              <div style={{
                padding: 'var(--spacing-sm)',
                marginTop: 'var(--spacing-md)',
                backgroundColor: message.includes('Success') ? '#d4edda' : '#f8d7da',
                color: message.includes('Success') ? '#155724' : '#721c24',
                borderRadius: '4px',
                textAlign: 'center'
              }}>
                {message}
              </div>
            )}
          </form>
        </div>

        {/* Previous Custom Creations Section */}
        <div style={{
          marginTop: 'var(--spacing-xl)',
          paddingTop: 'var(--spacing-xl)',
          borderTop: '2px solid #e0d5c7'
        }}>
          <div className="section-header center" style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{
              fontSize: '2rem',
              fontWeight: '600',
              color: '#5a4a3a',
              marginBottom: '0.5rem'
            }}>
              Previous Custom Creations
            </h3>
            <p style={{
              fontSize: '1.1rem',
              color: '#8B6F47',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              See what our customers say about their custom pottery
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-md)',
            marginTop: 'var(--spacing-lg)'
          }}>
            {/* Review 1 */}
            <div style={{
              backgroundColor: '#faf8f3',
              border: '1px solid #e0d5c7',
              borderRadius: '12px',
              padding: 'var(--spacing-md)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 111, 71, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                  alt="Customer"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '1rem',
                    border: '2px solid #d4c5a9'
                  }}
                />
                <div>
                  <h4 style={{ margin: 0, color: '#5a4a3a', fontSize: '1.1rem' }}>Priya Sharma</h4>
                  <div style={{ color: '#f4a261', fontSize: '0.9rem' }}>★★★★★</div>
                </div>
              </div>
              <p style={{ color: '#6d5d4b', lineHeight: '1.6', fontSize: '0.95rem', fontStyle: 'italic' }}>
                "Ordered a custom dinner set for my restaurant. The quality is exceptional and the earthy tones perfectly match our ambiance. Shivangi understood my vision completely!"
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0d5c7' }}>
                <img
                  src="https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=250&fit=crop"
                  alt="Custom dinner set"
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#8B6F47' }}>
                <strong>Project:</strong> Restaurant Tableware Set
              </p>
            </div>

            {/* Review 2 */}
            <div style={{
              backgroundColor: '#faf8f3',
              border: '1px solid #e0d5c7',
              borderRadius: '12px',
              padding: 'var(--spacing-md)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 111, 71, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                  alt="Customer"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '1rem',
                    border: '2px solid #d4c5a9'
                  }}
                />
                <div>
                  <h4 style={{ margin: 0, color: '#5a4a3a', fontSize: '1.1rem' }}>Rahul Mehta</h4>
                  <div style={{ color: '#f4a261', fontSize: '0.9rem' }}>★★★★★</div>
                </div>
              </div>
              <p style={{ color: '#6d5d4b', lineHeight: '1.6', fontSize: '0.95rem', fontStyle: 'italic' }}>
                "Got personalized mugs for my team as corporate gifts. Everyone loved them! The craftsmanship is top-notch and delivery was on time. Highly recommend!"
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0d5c7' }}>
                <img
                  src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=250&fit=crop"
                  alt="Custom mugs"
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#8B6F47' }}>
                <strong>Project:</strong> Corporate Gift Set
              </p>
            </div>

            {/* Review 3 */}
            <div style={{
              backgroundColor: '#faf8f3',
              border: '1px solid #e0d5c7',
              borderRadius: '12px',
              padding: 'var(--spacing-md)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease'
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 111, 71, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop"
                  alt="Customer"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: '1rem',
                    border: '2px solid #d4c5a9'
                  }}
                />
                <div>
                  <h4 style={{ margin: 0, color: '#5a4a3a', fontSize: '1.1rem' }}>Anjali Reddy</h4>
                  <div style={{ color: '#f4a261', fontSize: '0.9rem' }}>★★★★★</div>
                </div>
              </div>
              <p style={{ color: '#6d5d4b', lineHeight: '1.6', fontSize: '0.95rem', fontStyle: 'italic' }}>
                "Ordered custom wedding favors for 100 guests. Each piece was beautifully handcrafted with our initials. Our guests still talk about them! Worth every penny."
              </p>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e0d5c7' }}>
                <img
                  src="https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=250&fit=crop"
                  alt="Wedding favors"
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <p style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#8B6F47' }}>
                <strong>Project:</strong> Wedding Favors
              </p>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            backgroundColor: '#f5f0e8',
            borderRadius: '8px'
          }}>
            <p style={{
              fontSize: '1.1rem',
              color: '#5a4a3a',
              marginBottom: '0.5rem',
              fontWeight: '500'
            }}>
              Join Our Happy Customers
            </p>
            <p style={{
              fontSize: '0.95rem',
              color: '#8B6F47'
            }}>
              Over 200+ custom orders completed with 100% satisfaction rate
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomOrderForm;
