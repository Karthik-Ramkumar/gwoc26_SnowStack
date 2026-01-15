import requests

# Test custom order submission without Celery
url = "http://localhost:8000/api/products/custom-orders/"
data = {
    "name": "Test Customer",
    "email": "test@example.com",
    "phone": "+919876543210",
    "project_type": "tableware",
    "description": "Testing custom order without Celery"
}

try:
    response = requests.post(url, data=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    
    if response.status_code == 201:
        print("\n✅ SUCCESS! Custom order submitted without Celery")
        print(f"Order Number: {response.json().get('order_number')}")
    else:
        print("\n❌ FAILED")
        print(f"Error: {response.text}")
except Exception as e:
    print(f"❌ Error: {e}")
