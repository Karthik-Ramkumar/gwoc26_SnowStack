"""
Quick test script to simulate payment completion and test email workflow
"""
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from products.models import Order, OrderItem, Product
from products.email_utils import send_product_order_emails_with_fallback
from decimal import Decimal

print("=" * 70)
print("🛒 TESTING PAYMENT EMAIL WORKFLOW")
print("=" * 70)

# Get first product
product = Product.objects.first()
if not product:
    print("\n❌ No products found. Please add products first.")
    exit(1)

# Create test order (simulating successful payment)
print("\n📦 Creating test order...")
order = Order.objects.create(
    customer_name='Test Customer',
    customer_email='vinanth60@gmail.com',  # Change to your email
    customer_phone='9876543210',
    shipping_address='123 Test Street, Apartment 4B',
    shipping_city='Mumbai',
    shipping_state='Maharashtra',
    shipping_pincode='400001',
    status='confirmed',
    payment_method='razorpay',
    payment_status=True,  # Payment successful
    subtotal=Decimal(str(product.price)),
    shipping_charge=Decimal('0.00'),
    tax_amount=Decimal('0.00'),
    discount_amount=Decimal('0.00'),
    total_amount=Decimal(str(product.price))
)

# Add order item
OrderItem.objects.create(
    order=order,
    product=product,
    quantity=1,
    product_name=product.name,
    product_price=product.price
)

print(f"✅ Order created successfully!")
print(f"   Order Number: {order.order_number}")
print(f"   Customer: {order.customer_name}")
print(f"   Email: {order.customer_email}")
print(f"   Product: {product.name}")
print(f"   Total: ₹{order.total_amount}")
print(f"   Payment Status: {'✅ PAID' if order.payment_status else '❌ Pending'}")

# Send emails (exactly like what happens after payment)
print(f"\n{'=' * 70}")
print("📧 SENDING EMAILS (Simulating post-payment flow)...")
print("=" * 70)

try:
    result = send_product_order_emails_with_fallback(order.id)
    
    print(f"\n✅ Email workflow completed!")
    print(f"   Customer email: {'✅ Sent' if result['email_queued'] else '❌ Failed'}")
    print(f"   Admin notification: {'✅ Sent' if result['admin_notified'] else '❌ Failed'}")
    
    if result.get('celery_available'):
        print(f"\n📨 Mode: Celery (Asynchronous)")
        print(f"   Emails are being processed in background by Celery worker")
    else:
        print(f"\n📨 Mode: Direct Send (Synchronous)")
        print(f"   Emails sent immediately")
    
except Exception as e:
    print(f"\n❌ ERROR: {str(e)}")

print(f"\n{'=' * 70}")
print(f"📬 Check your inbox at: {order.customer_email}")
print("=" * 70)
