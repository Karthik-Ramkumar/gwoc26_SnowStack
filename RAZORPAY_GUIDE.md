# Razorpay Payment Gateway - Complete Guide

## Overview

Razorpay integration for secure online payments on the Basho e-commerce platform. Supports test mode for development and live mode for production.

---

## 🚀 Quick Setup

### 1. Get Razorpay Credentials

1. Sign up at [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Navigate to **Settings → API Keys**: [Dashboard Keys](https://dashboard.razorpay.com/app/keys)
3. Copy your **Key ID** and **Key Secret**
   - Test Mode: `rzp_test_xxxxx`
   - Live Mode: `rzp_live_xxxxx` (requires KYC approval)

### 2. Configure Backend

Update `basho_project/settings.py`:

```python
# Test Mode (for development)
RAZORPAY_KEY_ID = 'rzp_test_xxxxx'
RAZORPAY_KEY_SECRET = 'your_test_secret_key'

# Live Mode (production - after KYC)
RAZORPAY_KEY_ID = os.environ.get('RAZORPAY_KEY_ID', 'rzp_live_xxxxx')
RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET', 'your_secret')
```

**⚠️ Security:** Never commit secret keys to Git! Use environment variables in production.

### 3. Install Dependencies

Already included in `requirements.txt`:
```bash
pip install razorpay==1.4.2
```

---

## 🧪 Testing the Integration

### Test Cards (Test Mode Only)

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits (e.g., 123)
- Expiry: Any future date (e.g., 12/28)
- Name: Any name

**Failed Payment:**
- Card Number: `4111 1111 1111 1112`
- CVV: Any 3 digits
- Expiry: Any future date

### Step-by-Step Testing

1. **Start Servers:**
   ```bash
   # Backend
   python manage.py runserver
   
   # Frontend (new terminal)
   cd frontend && npm start
   ```

2. **Test Flow:**
   - Browse products at http://localhost:3000/products
   - Add items to cart
   - Click "Proceed to Checkout"
   - Fill checkout form:
     - First Name: John
     - Last Name: Doe
     - Phone: 9876543210
     - Email: test@example.com
     - Address: 123 Test Street
     - City: Mumbai
     - State: Maharashtra
     - Postal Code: 400001
   - Click "Place Order"
   - Use test card details above
   - Click "Pay" in Razorpay modal
   - Verify success message and order creation

3. **Verify in Django Admin:**
   - Go to http://127.0.0.1:8000/admin/products/order/
   - Check that order was created with correct payment details

---

## 🔧 Implementation Details

### Backend API Endpoints

**1. Create Razorpay Order**
- **Endpoint:** `POST /api/products/create-razorpay-order/`
- **Request:**
  ```json
  {
    "amount": 2500,
    "currency": "INR"
  }
  ```
- **Response:**
  ```json
  {
    "order_id": "order_xxxxx",
    "amount": 2500,
    "currency": "INR",
    "razorpay_key_id": "rzp_test_xxxxx"
  }
  ```

**2. Verify Payment**
- **Endpoint:** `POST /api/products/verify-payment/`
- **Request:**
  ```json
  {
    "razorpay_order_id": "order_xxxxx",
    "razorpay_payment_id": "pay_xxxxx",
    "razorpay_signature": "signature_hash",
    "customer_details": {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "address": "123 Test Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postal_code": "400001"
    },
    "items": [
      {
        "product_id": 1,
        "quantity": 2,
        "price": 1250
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Payment verified successfully",
    "order_id": 1
  }
  ```

### Frontend Integration

**Checkout Component** (`frontend/src/components/Checkout.jsx`):
- Loads Razorpay SDK script on component mount
- Creates order on backend before opening payment modal
- Handles payment success/failure callbacks
- Verifies payment signature on backend
- Clears cart after successful payment

**Key Features:**
- Processing state to prevent double submissions
- Error handling for failed payments
- Automatic cart clearing on success
- User-friendly success/error messages

---

## ⚠️ Troubleshooting

### Error: "Payment could not be completed" (500 Error)

**Possible Causes:**
1. **Account Not Fully Activated**
   - KYC documents pending
   - Account in test mode without verification
   
2. **Payment Gateway Not Enabled**
   - Standard checkout not enabled in dashboard
   - Test/Live mode mismatch
   
3. **API Key Issues**
   - Wrong key ID or secret
   - Keys from different mode (test vs live)

**Solutions:**

1. **Verify Account Status:**
   - Check [Razorpay Dashboard](https://dashboard.razorpay.com)
   - Ensure you're in **Test Mode** (toggle in top-right)
   - Look for warning banners about incomplete setup

2. **Enable Standard Checkout:**
   - Go to **Settings → API Keys**
   - Verify both Test and Live keys are visible
   - Navigate to **Settings → Integrations**
   - Enable **Razorpay Checkout (Standard)**
   - Ensure payment capture is enabled

3. **Verify API Keys:**
   - Regenerate test keys if necessary
   - Ensure keys match the mode (test/live)
   - Update `settings.py` with correct keys

4. **Check Payment Methods:**
   - Go to **Settings → Payment Methods**
   - Enable Cards, UPI, Netbanking, etc.
   - Ensure no restrictions are set

5. **Test Different Cards:**
   - Try multiple test cards
   - Check [Razorpay Test Card Details](https://razorpay.com/docs/payments/payments/test-card-details/)

### Error: Signature Verification Failed

**Cause:** Secret key mismatch or incorrect signature calculation

**Solution:**
- Verify `RAZORPAY_KEY_SECRET` matches dashboard
- Don't modify payment response data before verification
- Check console for detailed error messages

### Payment Success but Order Not Created

**Cause:** Backend verification error or database issue

**Solution:**
- Check Django server logs for errors
- Verify all required fields in `customer_details`
- Ensure products exist in database
- Check Django admin for partial order creation

---

## 🔐 Security Best Practices

1. **Never expose secret keys:**
   ```python
   # ❌ Bad
   RAZORPAY_KEY_SECRET = 'your_secret_key'
   
   # ✅ Good
   RAZORPAY_KEY_SECRET = os.environ.get('RAZORPAY_KEY_SECRET')
   ```

2. **Always verify payment signature on backend** (already implemented)

3. **Use HTTPS in production** (enforced by Razorpay in live mode)

4. **Validate order amount** before creating Razorpay order

5. **Log all payment attempts** for audit trails

---

## 📝 Production Deployment Checklist

- [ ] Complete KYC on Razorpay dashboard
- [ ] Switch to Live Mode keys
- [ ] Set environment variables on Render:
  - `RAZORPAY_KEY_ID=rzp_live_xxxxx`
  - `RAZORPAY_KEY_SECRET=your_live_secret`
- [ ] Test with small real transaction
- [ ] Enable webhook notifications (optional but recommended)
- [ ] Configure auto-capture or manual capture based on business needs
- [ ] Set up payment failure alerts

---

## 📚 Additional Resources

- [Razorpay API Documentation](https://razorpay.com/docs/api/)
- [Test Card Details](https://razorpay.com/docs/payments/payments/test-card-details/)
- [Webhook Integration](https://razorpay.com/docs/webhooks/)
- [Payment Gateway Best Practices](https://razorpay.com/docs/payments/best-practices/)

---

**Need Help?** Contact Razorpay Support: support@razorpay.com
