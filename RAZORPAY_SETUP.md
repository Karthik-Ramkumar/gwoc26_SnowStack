# Razorpay Payment Gateway Integration

This document explains how to set up and use Razorpay payment gateway for the Basho website.

## Setup Instructions

### 1. Get Razorpay Credentials

1. Sign up for a Razorpay account at [https://dashboard.razorpay.com/signup](https://dashboard.razorpay.com/signup)
2. Complete the KYC process (required for live mode)
3. Go to Settings > API Keys: [https://dashboard.razorpay.com/app/keys](https://dashboard.razorpay.com/app/keys)
4. Copy your **Key ID** and **Key Secret**

### 2. Configure Backend

1. **Install Razorpay package:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Update Django settings:**
   
   Open `basho_project/settings.py` and update:
   
   ```python
   # For Testing (Test Mode)
   RAZORPAY_KEY_ID = 'rzp_test_xxxxxxxxxx'
   RAZORPAY_KEY_SECRET = 'your_test_secret_key'
   
   # For Production (Live Mode) - Only after KYC approval
   RAZORPAY_KEY_ID = 'rzp_live_xxxxxxxxxx'
   RAZORPAY_KEY_SECRET = 'your_live_secret_key'
   ```
   
   **Important:** Never commit the secret key to Git! Use environment variables in production.

### 3. Test the Integration

#### Test Cards for Test Mode:

- **Successful Payment:**
  - Card Number: `4111 1111 1111 1111`
  - CVV: Any 3 digits
  - Expiry: Any future date
  
- **Failed Payment:**
  - Card Number: `4111 1111 1111 1112`
  - CVV: Any 3 digits
  - Expiry: Any future date

#### Test UPI:
- UPI ID: `success@razorpay`

## How It Works

### Payment Flow:

1. **User fills checkout form** with delivery address
2. **Clicks "Proceed to Payment"**
3. **Backend creates Razorpay order** via `/api/products/create-razorpay-order/`
4. **Razorpay popup opens** with payment options (Card, UPI, NetBanking, Wallets)
5. **User completes payment**
6. **Payment verified** via `/api/products/verify-payment/`
7. **Order created in database** with payment confirmation
8. **Cart cleared** and user redirected to home

### API Endpoints:

1. **Create Razorpay Order**
   - Endpoint: `POST /api/products/create-razorpay-order/`
   - Request:
     ```json
     {
       "amount": 5000,
       "customer_name": "John Doe",
       "customer_email": "john@example.com",
       "customer_phone": "9876543210"
     }
     ```
   - Response:
     ```json
     {
       "success": true,
       "order_id": "order_xyz123",
       "amount": 500000,
       "currency": "INR",
       "key": "rzp_test_xxxxx"
     }
     ```

2. **Verify Payment**
   - Endpoint: `POST /api/products/verify-payment/`
   - Request:
     ```json
     {
       "razorpay_order_id": "order_xyz123",
       "razorpay_payment_id": "pay_abc456",
       "razorpay_signature": "signature_hash",
       "order_data": {
         "customer_name": "John Doe",
         "customer_email": "john@example.com",
         ...
       }
     }
     ```

## Features Implemented

✅ **Products Payment:**
- Integrated Razorpay for product purchases
- Shipping cost set to 0 (can be updated later)
- Automatic payment verification
- Order creation on successful payment
- Cart clearance after successful order

✅ **Security:**
- Payment signature verification
- Secure server-side validation
- Protected API endpoints

✅ **User Experience:**
- Loading state during payment processing
- Error handling
- Payment cancellation support
- Success/failure notifications

## Testing Checklist

- [ ] Backend API endpoints working
- [ ] Razorpay keys configured correctly
- [ ] Test payment with test card
- [ ] Payment verification working
- [ ] Order created in database
- [ ] Cart cleared after payment
- [ ] Email notifications (if configured)

## Going Live

Before going live:

1. Complete Razorpay KYC
2. Get Live API keys
3. Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in settings
4. Test with small amount in live mode
5. Set up webhooks for payment notifications (optional)

## Webhooks (Optional)

For better reliability, set up webhooks:

1. Go to Razorpay Dashboard > Webhooks
2. Add webhook URL: `https://yourdomain.com/api/products/razorpay-webhook/`
3. Select events: `payment.captured`, `payment.failed`
4. Implement webhook handler in Django

## Support

- **Razorpay Documentation:** [https://razorpay.com/docs/](https://razorpay.com/docs/)
- **Razorpay Support:** [https://razorpay.com/support/](https://razorpay.com/support/)

## Notes

- Shipping cost is currently set to 0
- Tax calculation not implemented yet
- Workshop payment integration pending (will be added next)
