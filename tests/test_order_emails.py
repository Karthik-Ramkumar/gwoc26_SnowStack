#!/usr/bin/env python
"""
Test script to verify email system is working for custom orders
"""
import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from products.tasks import send_custom_order_customer_email, send_custom_order_admin_email

print("=" * 60)
print("Testing Custom Order Email System")
print("=" * 60)

# Test data
test_order_number = "TEST-001"
test_customer_name = "Test Customer"
test_customer_email = "karthik.sb.ram@gmail.com"  # Using admin email for testing
test_customer_phone = "+91 9876543210"
test_project_type = "Custom Pottery Project"
test_description = "Test order to verify email system is working"
test_quantity = "5 pieces"
test_timeline = "2 weeks"

print("\n🔵 Sending customer confirmation email...")
print(f"   To: {test_customer_email}")
print(f"   Order: {test_order_number}")

try:
    # Send customer email
    customer_task = send_custom_order_customer_email.delay(
        order_number=test_order_number,
        name=test_customer_name,
        email=test_customer_email,
        project_type_display=test_project_type
    )
    print(f"✅ Customer email task queued: {customer_task.id}")
except Exception as e:
    print(f"❌ Error sending customer email: {e}")

print("\n🔵 Sending admin notification email...")
print(f"   To: Admin (vinanthp@gmail.com)")

try:
    # Send admin email
    admin_task = send_custom_order_admin_email.delay(
        order_id=999,  # Test order ID
        order_number=test_order_number,
        name=test_customer_name,
        email=test_customer_email,
        phone=test_customer_phone,
        project_type_display=test_project_type,
        description=test_description,
        quantity=test_quantity,
        timeline=test_timeline
    )
    print(f"✅ Admin email task queued: {admin_task.id}")
except Exception as e:
    print(f"❌ Error sending admin email: {e}")

print("\n" + "=" * 60)
print("Email tasks have been queued!")
print("Check the Celery worker terminal for execution logs")
print("Check the email inbox: vinanthp@gmail.com")
print("=" * 60)
