# Basho Products Page - Django Backend

**Standalone Django project for Basho by Shivangi pottery products page**

This is a self-contained Django project that implements the products page functionality from the main Basho pottery website. Your friend can download this folder and immediately start implementing the backend logic.

---

## 📁 PROJECT STRUCTURE

```
basho_products_django/
│
├── basho_backend/          # Django project settings
│   ├── settings.py         # Main configuration file (DATABASE, STATIC, etc.)
│   ├── urls.py             # Main URL router (includes products.urls)
│   └── wsgi.py             # WSGI configuration
│
├── products/               # Products Django app
│   ├── models.py           # Database models (Product, CustomOrder, CartItem)
│   ├── views.py            # View functions (YOUR FRIEND ADDS BACKEND LOGIC HERE)
│   ├── urls.py             # URL patterns for products
│   ├── admin.py            # Django admin interface configuration
│   └── migrations/         # Database migrations (auto-generated)
│
├── templates/              # HTML templates
│   └── products/
│       ├── base.html       # Base template with navigation and footer
│       └── product_list.html  # Main products page template
│
├── static/                 # Static files (CSS, JS, images)
│   ├── css/
│   │   ├── style.css       # Main stylesheet
│   │   └── pages.css       # Page-specific styles
│   ├── js/
│   │   ├── main.js         # Core JavaScript functions
│   │   └── products.js     # Product filtering and form handling
│   └── images/
│       └── products/       # Product images go here
│
├── media/                  # User-uploaded files (auto-created)
│   ├── products/           # Product images uploaded via admin
│   └── custom_orders/      # Customer reference images
│
├── manage.py               # Django management script
├── requirements.txt        # Python dependencies
├── db.sqlite3              # SQLite database (auto-created)
└── venv/                   # Virtual environment
```

---

## 🚀 QUICK START GUIDE

### 1. **Download and Setup Environment**

```bash
# Navigate to the project folder
cd basho_products_django

# Activate virtual environment
source venv/bin/activate      # On Linux/Mac
# venv\Scripts\activate       # On Windows

# Install dependencies (if needed)
pip install -r requirements.txt
```

### 2. **Setup Database**

```bash
# Create database tables from models
python manage.py makemigrations
python manage.py migrate

# Create admin user to access Django admin panel
python manage.py createsuperuser
# Enter username, email, and password when prompted
```

### 3. **Run Development Server**

```bash
python manage.py runserver
```

Open browser and visit:
- **Products Page:** http://localhost:8000/
- **Admin Panel:** http://localhost:8000/admin/

---

## 📝 WHAT EACH FILE DOES

### **models.py** - Database Structure
Defines 3 main database models:

1. **Product** - Stores product information
   - Fields: product_id, name, category, price, description, image, etc.
   - Use this to: Display products, check stock, get pricing

2. **CustomOrder** - Stores custom order requests
   - Fields: name, email, phone, project_type, description, status
   - Use this to: Receive orders, track status, send notifications

3. **CartItem** (Optional) - For future cart functionality
   - Fields: product, quantity, session_key
   - Use this to: Implement persistent cart for logged-in users

### **views.py** - Business Logic (WHERE YOUR FRIEND CODES)

This file contains view functions that handle requests. Your friend needs to complete these:

1. **`product_list(request)`** - Shows all products
   - ✅ Already implemented: Basic filtering and sorting
   - 🔨 TODO: Add search functionality, pagination

2. **`products_api(request)`** - Returns products as JSON
   - ✅ Already implemented: Returns product data for AJAX
   - 🔨 TODO: Add advanced filtering

3. **`submit_custom_order(request)`** - Handles custom order form
   - ✅ Already implemented: Saves order to database
   - 🔨 TODO: Send email notifications (see comments in code)

4. **`calculate_shipping(request)`** - Calculates shipping cost
   - ✅ Already implemented: Basic calculation (₹50/kg, min ₹100)
   - 🔨 TODO: Add region-based rates, express shipping

**HOW TO ADD BACKEND FUNCTIONS:**
- Open `products/views.py`
- Find "TODO for your friend" comments
- Add your code in those sections

### **urls.py** - URL Routing

Maps URLs to view functions:
- `/` → Shows products page (`product_list`)
- `/api/products/` → Returns products as JSON (`products_api`)
- `/api/custom-order/` → Handles custom order submission (`submit_custom_order`)
- `/api/shipping-cost/` → Calculates shipping (`calculate_shipping`)

### **admin.py** - Admin Interface

Configures Django admin panel for easy data management:
- Add/edit/delete products
- View custom orders
- Update order status
- Bulk actions (mark in stock, change status)

**Access admin at:** http://localhost:8000/admin/

---

## 🔧 WHERE TO ADD YOUR BACKEND FUNCTIONS

### **1. Email Notifications**

**File:** `products/views.py` → `submit_custom_order` function

```python
# Find this section (line ~150):
# TODO: Send email notifications here

# Add this code:
from django.core.mail import send_mail

send_mail(
    subject=f'New Custom Order: {custom_order.order_number}',
    message=f'New order from {custom_order.name}\n\nDetails:\n{custom_order.description}',
    from_email='noreply@bashobyshivangi.com',
    recipient_list=['hello@bashobyshivangi.com'],
    fail_silently=False,
)
```

**Configure email in `settings.py`:**
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # Or your email provider
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
```

### **2. Search Functionality**

**File:** `products/views.py` → `product_list` function

```python
# Find this section (line ~20):
# Get all products
products = Product.objects.filter(in_stock=True)

# Add search:
search_query = request.GET.get('search', '')
if search_query:
    from django.db.models import Q
    products = products.filter(
        Q(name__icontains=search_query) | 
        Q(description__icontains=search_query)
    )
```

### **3. Payment Integration (Future)**

**File:** Create `products/payment.py`

```python
def initiate_payment(order_id, amount):
    """
    Integrate with Razorpay/Stripe/PayPal
    """
    # Add payment gateway code here
    pass
```

### **4. Inventory Management**

**File:** `products/views.py` → Add new view

```python
def reduce_stock(request, product_id):
    """
    Reduce product stock when order is placed
    """
    product = Product.objects.get(product_id=product_id)
    quantity = request.POST.get('quantity', 1)
    
    if product.stock_quantity >= quantity:
        product.stock_quantity -= quantity
        product.save()
        return JsonResponse({'success': True})
    else:
        return JsonResponse({'success': False, 'error': 'Out of stock'})
```

---

## 🗄️ DATABASE MANAGEMENT

### **Add Products via Django Admin**

1. Run server: `python manage.py runserver`
2. Go to: http://localhost:8000/admin/
3. Login with superuser credentials
4. Click "Products" → "Add Product"
5. Fill in details:
   - **Product ID:** bowl-1
   - **Name:** Zen Breakfast Bowl
   - **Category:** Tableware
   - **Price:** 2500
   - **Description:** Hand-thrown stoneware bowl...
   - **Upload image** or provide image URL
6. Click "Save"

### **Add Products via Python Script**

Create `products/management/commands/load_products.py`:

```python
from django.core.management.base import BaseCommand
from products.models import Product

class Command(BaseCommand):
    def handle(self, *args, **kwargs):
        products_data = [
            {
                'product_id': 'bowl-1',
                'name': 'Zen Breakfast Bowl',
                'category': 'tableware',
                'price': 2500,
                'description': 'Hand-thrown stoneware bowl with natural glaze.',
                'in_stock': True,
                'stock_quantity': 10,
                'is_featured': True,
            },
            # Add more products...
        ]
        
        for data in products_data:
            Product.objects.create(**data)
            
        self.stdout.write('Products loaded!')
```

Run: `python manage.py load_products`

---

## 🎨 FRONTEND INTEGRATION

### **How the Frontend Works**

1. **Static Files:** CSS and JavaScript are in `static/` folder
2. **Templates:** HTML templates use Django template language (`{% %}`)
3. **JavaScript:** 
   - `main.js` - Navigation, cart, form validation
   - `products.js` - Product filtering, custom order form

### **Modifying JavaScript**

**File:** `static/js/products.js`

The custom order form uses JavaScript to submit data to Django:

```javascript
// Current code (line ~50):
fetch('/api/custom-order/', {
    method: 'POST',
    body: JSON.stringify(formData)
})

// This calls the submit_custom_order view in views.py
```

---

## ⚙️ SETTINGS CONFIGURATION

**File:** `basho_backend/settings.py`

Key settings your friend might need to change:

```python
# Debug mode (set to False in production)
DEBUG = True

# Allowed hosts (add your domain in production)
ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Database (currently using SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Static files
STATIC_URL = 'static/'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Media files (user uploads)
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

---

## 🧪 TESTING

### **Test API Endpoints**

```bash
# Test products API
curl http://localhost:8000/api/products/

# Test custom order submission
curl -X POST http://localhost:8000/api/custom-order/ \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","phone":"1234567890","projectType":"tableware","description":"Test order"}'

# Test shipping calculation
curl -X POST http://localhost:8000/api/shipping-cost/ \
  -H "Content-Type: application/json" \
  -d '{"weight":2.5}'
```

### **Run Django Tests**

Create `products/tests.py`:

```python
from django.test import TestCase
from .models import Product

class ProductTestCase(TestCase):
    def test_product_creation(self):
        product = Product.objects.create(
            product_id='test-1',
            name='Test Product',
            category='tableware',
            price=1000
        )
        self.assertEqual(product.name, 'Test Product')
```

Run: `python manage.py test`

---

## 📦 DEPLOYMENT CHECKLIST

When ready to deploy to production:

1. **Update settings.py:**
   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['yourdomain.com']
   SECRET_KEY = 'generate-new-secret-key'
   ```

2. **Setup PostgreSQL** (recommended for production):
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'basho_db',
           'USER': 'your_user',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

3. **Collect static files:**
   ```bash
   python manage.py collectstatic
   ```

4. **Setup email backend** (see Email Notifications section above)

5. **Add CSRF protection:**
   - Remove `@csrf_exempt` from views
   - Ensure `{% csrf_token %}` in all forms

6. **Setup HTTPS and SSL certificate**

---

## 🆘 COMMON ISSUES & SOLUTIONS

### **Issue: "No module named 'products'"**
**Solution:** Make sure you're in the project directory and virtual environment is activated

### **Issue: "Table doesn't exist"**
**Solution:** Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

### **Issue: "Static files not loading"**
**Solution:** Check `STATIC_URL` in settings.py and use `{% load static %}` in templates

### **Issue: "Images not uploading"**
**Solution:** 
- Create `media/` directory
- Check `MEDIA_URL` and `MEDIA_ROOT` in settings.py
- Install Pillow: `pip install Pillow`

---

## 📚 NEXT STEPS FOR YOUR FRIEND

1. **Add Products to Database**
   - Use Django admin or create import script
   - Upload product images

2. **Implement Email Notifications**
   - Configure email settings
   - Add send_mail() in submit_custom_order view

3. **Add Payment Integration**
   - Choose payment gateway (Razorpay, Stripe, etc.)
   - Create payment views and integrate

4. **Implement Cart Backend**
   - Use CartItem model
   - Create add_to_cart, remove_from_cart views

5. **Add User Authentication** (Optional)
   - Django has built-in authentication
   - Add login/register pages

6. **Setup Production Database**
   - Switch from SQLite to PostgreSQL
   - Run migrations on production

---

## 📞 CONTACT & SUPPORT

For questions about this codebase:
- Check comments in `views.py` and `models.py`
- Django documentation: https://docs.djangoproject.com/
- Email: hello@bashobyshivangi.com

---

**READY TO START?**

```bash
# 1. Activate environment
source venv/bin/activate

# 2. Run migrations
python manage.py migrate

# 3. Create admin user
python manage.py createsuperuser

# 4. Start server
python manage.py runserver
```

Then open: http://localhost:8000/

**Good luck! 🎉**
