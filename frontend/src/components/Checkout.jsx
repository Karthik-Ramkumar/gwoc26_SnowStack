import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../context/ToastContext';
import { X, AlertCircle } from 'lucide-react';
import './Cart.css';
import './Checkout.css';

function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { showError, showSuccess } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [paymentError, setPaymentError] = useState(null);

  // Load Razorpay script
  useEffect(() => {
    const loadRazorpayScript = () => {
      return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.Razorpay) {
          resolve(window.Razorpay);
          return;
        }

        // Check if script already exists
        const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
        if (existingScript) {
          existingScript.onload = () => resolve(window.Razorpay);
          existingScript.onerror = reject;
          return;
        }

        // Create and load script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          if (window.Razorpay) {
            resolve(window.Razorpay);
          } else {
            reject(new Error('Razorpay SDK failed to load'));
          }
        };
        script.onerror = () => reject(new Error('Failed to load Razorpay script'));
        document.body.appendChild(script);
      });
    };

    loadRazorpayScript().catch(error => {
      console.error('Error loading Razorpay:', error);
      showError('Failed to load payment system. Please refresh the page and try again.');
    });
  }, [showError]);

  // Calculate shipping when cart changes
  useEffect(() => {
    if (cart.length > 0) {
      calculateShipping();
    }
  }, [cart]);

  const calculateShipping = async () => {
    try {
      setIsCalculatingShipping(true);

      // Prepare items array with product IDs and quantities
      const items = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const response = await fetch('/api/products/calculate-shipping/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items,
          subtotal: getCartTotal()
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShippingCost(data.shipping_charge);
      } else {
        console.error('Error calculating shipping:', data.error);
        // Default to 100 if calculation fails
        setShippingCost(100);
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      // Default to 100 if there's an error
      setShippingCost(100);
    } finally {
      setIsCalculatingShipping(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Delivery address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Please enter a valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const totalAmount = getCartTotal() + shippingCost;
      const customerName = `${formData.firstName} ${formData.lastName}`;

      // Step 1: Create Razorpay order
      console.log('Creating Razorpay order with data:', {
        amount: totalAmount,
        customer_name: customerName,
        customer_email: formData.email,
        customer_phone: formData.phone
      });

      const orderResponse = await fetch('/api/products/create-razorpay-order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          customer_name: customerName,
          customer_email: formData.email,
          customer_phone: formData.phone
        })
      });

      const orderData = await orderResponse.json();

      console.log('Order creation response:', orderData);
      console.log('Order response status:', orderResponse.status);

      if (!orderData.success) {
        console.error('Order creation failed:', orderData);
        throw new Error(orderData.error || 'Failed to create payment order');
      }

      console.log('About to initialize Razorpay with options:', {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.order_id,
        prefill: {
          name: customerName,
          email: formData.email,
          contact: formData.phone
        }
      });

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page and try again.');
      }

      // Step 2: Initialize Razorpay payment
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Basho By Shivangi',
        description: 'Product Purchase',
        order_id: orderData.order_id,  // Changed from orderId to order_id
        handler: async function (response) {
          console.log('Payment success response:', response);
          // Step 3: Verify payment and create order
          await handlePaymentSuccess(response, orderData.order_id);  // Changed from orderId to order_id
        },
        prefill: {
          name: customerName,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: formData.address,
          city: formData.city,
          state: formData.state
        },
        theme: {
          color: '#8B4513'
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            showError('Payment cancelled by user');
          },
          // Handle payment failures
          onerror: function (error) {
            setIsProcessing(false);
            console.error('Razorpay payment error:', error);
            showError('Payment failed. Please try again or use a different payment method.');
          }
        }
      };

      console.log('Creating Razorpay instance...');
      try {
        const razorpay = new window.Razorpay(options);

        // Handle errors during Razorpay initialization
        razorpay.on('payment.failed', function (response) {
          setIsProcessing(false);
          console.error('Payment failed:', response.error);
          const errorMsg = response.error?.description || 'Payment failed. Please try again.';
          showError(`Payment failed: ${errorMsg}`);
        });

        console.log('Opening Razorpay checkout...');
        razorpay.open();
      } catch (razorpayError) {
        console.error('Error creating Razorpay instance:', razorpayError);
        throw new Error(`Failed to initialize payment: ${razorpayError.message}`);
      }

    } catch (error) {
      console.error('Error initiating payment:', error);
      showError(error.message || 'Failed to initiate payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentResponse, orderId) => {
    try {
      // Prepare order data
      const orderData = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_state: formData.state,
        shipping_pincode: formData.pincode,
        billing_address: '', // Same as shipping for now
        payment_method: 'razorpay',
        payment_status: false,
        subtotal: getCartTotal(),
        shipping_charge: shippingCost,
        tax_amount: 0,
        discount_amount: 0,
        total_amount: getCartTotal() + shippingCost,
        items: cart.map(item => ({
          product: item.id,
          quantity: item.quantity,
          product_name: item.name,
          product_price: item.price
        }))
      };

      // Add user firebase UID if logged in
      if (currentUser) {
        orderData.user_firebase_uid = currentUser.uid;
      }

      // Verify payment and create order
      const verifyResponse = await fetch('/api/products/verify-payment/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          order_data: orderData
        })
      });

      const result = await verifyResponse.json();

      console.log('Payment verification response:', result);

      if (result.success) {
        // Show success message with order details
        const successMessage = `Payment successful! Order #${result.order_number}. Confirmation email sent to ${formData.email}`;
        showSuccess(successMessage);

        // Clear the cart
        clearCart();

        // Redirect to home after 2 seconds to let user see the success message
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        console.error('Payment verification failed:', result);
        throw new Error(result.error || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      const errorMessage = paymentResponse?.razorpay_payment_id
        ? `Payment received but order creation failed. Please contact support with Payment ID: ${paymentResponse.razorpay_payment_id}`
        : 'Payment verification failed. Please try again or contact support.';
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      {/* Payment Failed Modal */}
      {paymentError && (
        <div className="payment-failed-overlay" onClick={() => setPaymentError(null)}>
          <div className="payment-failed-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="payment-failed-close"
              onClick={() => setPaymentError(null)}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <div className="payment-failed-icon">
              <AlertCircle size={48} strokeWidth={1.5} />
            </div>
            <h3 className="payment-failed-title">Payment Failed</h3>
            <p className="payment-failed-message">{paymentError}</p>
            <button
              className="payment-failed-btn"
              onClick={() => setPaymentError(null)}
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <div className="checkout-page">
        {/* Hero Section */}
        <section className="checkout-hero" style={{
          backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.7) 100%), url('/images/gallery/checkout.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="japanese-accent">チェックアウト</span>
              <span className="main-title">Checkout</span>
            </h1>
            <p className="hero-subtitle">Complete your order</p>
          </div>
        </section>

        {/* Checkout Content */}
        <section className="checkout-content">
          <div className="checkout-container">
            {/* Delivery Form */}
            <div className="checkout-form-section">
              <h2>Delivery Information</h2>
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={errors.firstName ? 'error' : ''}
                    />
                    {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={errors.lastName ? 'error' : ''}
                    />
                    {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      className={errors.phone ? 'error' : ''}
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-row two-col">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="address">Delivery Address *</label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      placeholder="House/Flat No., Street, Locality"
                      className={errors.address ? 'error' : ''}
                    />
                    {errors.address && <span className="error-message">{errors.address}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={errors.state ? 'error' : ''}
                    />
                    {errors.state && <span className="error-message">{errors.state}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="pincode">Pincode *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleChange}
                      placeholder="6-digit pincode"
                      className={errors.pincode ? 'error' : ''}
                    />
                    {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                  </div>
                </div>

                <button
                  type="submit"
                  className="pay-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div className="checkout-summary">
              <h2>Order Summary</h2>

              <div className="summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="summary-item">
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </div>
                    <span className="item-price">
                      ₹{(parseFloat(item.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{getCartTotal().toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>

              <div className="summary-row">
                <span>Shipping</span>
                <span>{isCalculatingShipping ? 'Calculating...' : `₹${shippingCost.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total">
                <span>Total</span>
                <span>₹{(getCartTotal() + shippingCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Checkout;
