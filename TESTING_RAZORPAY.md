# Quick Start Guide - Testing Razorpay Integration

## Prerequisites
✅ Razorpay package installed (`pip install razorpay==1.4.2`)
✅ Razorpay API keys configured in settings.py

## Step-by-Step Testing

### 1. Configure Razorpay Keys

1. Sign up at https://dashboard.razorpay.com/signup
2. Get Test API keys from: https://dashboard.razorpay.com/app/keys
3. Update `/basho_project/settings.py`:
   ```python
   RAZORPAY_KEY_ID = 'rzp_test_xxxxx'  # Your test key
   RAZORPAY_KEY_SECRET = 'your_secret'  # Your secret
   ```

### 2. Start the Development Server

```bash
# Backend (Django)
cd /home/karthik/gwoc26_SnowStack
source .venv/bin/activate
python manage.py runserver

# Frontend (React) - In another terminal
cd frontend
npm start
```

### 3. Test the Payment Flow

1. **Browse Products**
   - Go to http://localhost:3000/products
   - Click "Add to Cart" on any product

2. **View Cart**
   - Click cart icon in navigation
   - Review items
   - Click "Proceed to Checkout"

3. **Fill Checkout Form**
   - First Name: John
   - Last Name: Doe
   - Phone: 9876543210
   - Email: test@example.com
   - Address: 123 Test Street
   - City: Mumbai
   - State: Maharashtra
   - Pincode: 400001

4. **Click "Proceed to Payment"**
   - Razorpay popup will open

5. **Test Payment**
   
   **Option 1: Card Payment**
   - Card Number: `4111 1111 1111 1111`
   - CVV: `123`
   - Expiry: `12/25` (any future date)
   - Click "Pay Now"
   
   **Option 2: UPI**
   - UPI ID: `success@razorpay`
   
   **Option 3: Test Failure**
   - Card Number: `4111 1111 1111 1112`

6. **Verify Success**
   - You should see "Payment successful!" alert
   - Order number will be displayed
   - Cart should be cleared
   - Redirected to home page

### 4. Verify in Database

```bash
python manage.py shell
```

```python
from products.models import Order, OrderItem

# Check latest order
latest_order = Order.objects.latest('created_at')
print(f"Order Number: {latest_order.order_number}")
print(f"Customer: {latest_order.customer_name}")
print(f"Total: ₹{latest_order.total_amount}")
print(f"Payment Status: {latest_order.payment_status}")
print(f"Items: {latest_order.items.count()}")

# View items
for item in latest_order.items.all():
    print(f"  - {item.product_name} x{item.quantity} = ₹{item.get_total_price()}")
```

### 5. Check Admin Panel

1. Go to http://localhost:8000/admin/
2. Login with superuser credentials
3. Navigate to "Products Orders" 
4. You should see your order with:
   - ✅ Payment Status: True
   - ✅ Payment Method: razorpay
   - ✅ Internal notes with Payment ID

## Common Issues & Solutions

### Issue: "Failed to create Razorpay order"
**Solution:** Check that:
- Razorpay keys are correctly set in settings.py
- Keys don't have extra spaces
- Using test keys (rzp_test_xxx) for development

### Issue: Payment verification failed
**Solution:**
- This is normal for cancelled payments
- Check browser console for error details
- Verify signature verification is working

### Issue: Cart items not showing correct price
**Solution:**
- Clear browser localStorage
- Refresh the page
- Re-add items to cart

### Issue: Order not created in database
**Solution:**
- Check Django terminal for errors
- Verify migrations are up to date:
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```

## Test Checklist

- [ ] Razorpay keys configured
- [ ] Backend server running
- [ ] Frontend server running
- [ ] Can add products to cart
- [ ] Checkout form validation works
- [ ] Razorpay popup opens
- [ ] Test payment succeeds
- [ ] Order created in database
- [ ] Payment status = True
- [ ] Cart cleared after payment
- [ ] Admin panel shows order

## Next Steps

Once testing is complete:
1. ✅ Products payment working
2. ⏳ Workshop registration payment (pending)
3. ⏳ Email notifications
4. ⏳ Order confirmation page
5. ⏳ Order tracking

## Support

If you encounter any issues:
1. Check Django terminal for backend errors
2. Check browser console for frontend errors
3. Review [RAZORPAY_SETUP.md](RAZORPAY_SETUP.md) for detailed documentation
