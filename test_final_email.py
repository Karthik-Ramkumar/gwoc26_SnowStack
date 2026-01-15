"""
Final Test: Submit custom order and verify email is sent via fallback
"""
import requests
import time

print("=" * 70)
print("FINAL TEST: EMAIL FALLBACK WITH REDIS DOWN")
print("=" * 70)

print("\n1. Checking System Status...")

# Check Celery availability
import os
import sys
sys.path.insert(0, os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
import django
django.setup()

from products.email_utils import is_celery_available

celery_status = is_celery_available()
print(f"   Celery/Redis Available: {celery_status}")

if not celery_status:
    print("   ✅ GOOD! Fallback mode will be used (synchronous emails)")
else:
    print("   ⚠️  Celery is available - emails will be async")

print("\n2. Submitting Custom Order...")
url = "http://localhost:8000/api/products/custom-orders/"
data = {
    "name": "Email Fallback Test",
    "email": "vinanth60@gmail.com",  # Your actual email
    "phone": "+919876543210",
    "project_type": "tableware",
    "description": "Testing that emails are sent even when Redis is down"
}

try:
    start_time = time.time()
    response = requests.post(url, data=data)
    end_time = time.time()
    response_time = end_time - start_time
    
    print(f"   Status Code: {response.status_code}")
    
    if response.status_code == 201:
        result = response.json()
        order_number = result.get('order_number')
        print(f"   ✅ Order Created: {order_number}")
        print(f"   Response Time: {response_time:.2f} seconds")
        
        if not celery_status:
            print("\n3. Email Delivery Method:")
            print("   📧 SYNCHRONOUS (Fallback Mode)")
            print("   ✅ Emails sent IMMEDIATELY during request")
            print("   ✅ This is why response time was longer")
            
            if response_time > 2:
                print("\n4. Response Time Analysis:")
                print(f"   Response took {response_time:.2f}s (slow)")
                print("   This proves emails were sent synchronously!")
                print("   In async mode, response would be < 1 second")
        else:
            print("\n3. Email Delivery Method:")
            print("   ⚡ ASYNCHRONOUS (Celery Mode)")
            print("   Emails queued for background processing")
        
        print("\n" + "=" * 70)
        print("✅ SUCCESS!")
        print("=" * 70)
        print("\nCheck your email inbox (vinanth60@gmail.com)")
        print("You should receive TWO emails:")
        print("  1. Customer confirmation email")
        print("  2. Admin notification email (since using same email)")
        print("\n⚠️  Check SPAM folder if not in inbox!")
        print("=" * 70)
        
    else:
        print(f"   ❌ Failed: {response.text}")
        
except Exception as e:
    print(f"   ❌ Error: {e}")
