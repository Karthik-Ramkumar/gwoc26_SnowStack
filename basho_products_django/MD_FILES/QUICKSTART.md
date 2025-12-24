# QUICK START - For Your Friend

## What is this?

This is a **standalone Django project** for the Basho Pottery products page. Everything your friend needs is in this folder - they can download it and start coding immediately.

---

## ⚡ FASTEST WAY TO GET STARTED

```bash
cd basho_products_django

# 1. Activate environment
source venv/bin/activate

# 2. Run setup script (creates database, asks for admin user)
./setup.sh

# 3. Start server
python manage.py runserver
```

Open browser: **http://localhost:8000/**

**That's it!** The website is running.

---

## 📋 WHAT YOUR FRIEND NEEDS TO DO

### **Step 1: Add Products**

Option A - Via Admin Panel (Easy):
1. Go to http://localhost:8000/admin/
2. Login with the username/password you created
3. Click "Products" → "Add Product"
4. Fill in details and upload images
5. Click "Save"

Option B - Load Sample Data (Fast):
```bash
python manage.py shell
>>> from load_sample_data import load_sample_products
>>> load_sample_products()
>>> exit()
```

### **Step 2: Implement Backend Functions**

Open `products/views.py` and look for comments that say:
```python
# TODO for your friend:
```

These are the sections where your friend needs to add code.

**Main tasks:**
1. **Email notifications** - Send emails when custom orders are received
2. **Advanced filtering** - Add search functionality
3. **Payment integration** - Connect to Razorpay/Stripe
4. **Inventory management** - Update stock when orders placed

---

## 🗂️ FILE GUIDE - WHERE IS EVERYTHING?

| What you want to do | Which file to edit |
|---------------------|-------------------|
| Add backend logic | `products/views.py` |
| Change database structure | `products/models.py` |
| Modify HTML/design | `templates/products/product_list.html` |
| Change CSS styling | `static/css/style.css` or `static/css/pages.css` |
| Modify JavaScript | `static/js/products.js` |
| Configure Django | `basho_backend/settings.py` |
| Add URL routes | `products/urls.py` |

---

## 🔧 COMMON TASKS

### **View existing data**
```bash
python manage.py shell
>>> from products.models import Product, CustomOrder
>>> Product.objects.all()  # See all products
>>> CustomOrder.objects.all()  # See all orders
```

### **Delete all data and start fresh**
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

### **Add a new API endpoint**
1. Add function in `products/views.py`
2. Add URL in `products/urls.py`
3. Test at http://localhost:8000/api/your-endpoint/

---

## 📚 DETAILED DOCUMENTATION

See `README.md` for:
- Complete project structure explanation
- Detailed code examples
- Deployment instructions
- Troubleshooting guide

---

## ❓ NEED HELP?

1. **Check comments in the code** - Every file has detailed explanations
2. **Read README.md** - Has examples for every task
3. **Django docs** - https://docs.djangoproject.com/
4. **Test the APIs** - See what works before coding

---

## ✅ VERIFICATION CHECKLIST

After setup, verify everything works:

- [ ] Can access http://localhost:8000/ - See products page
- [ ] Can access http://localhost:8000/admin/ - Django admin works
- [ ] Can create product in admin - Products appear on page
- [ ] Custom order form submits - Check admin for orders
- [ ] JavaScript filtering works - Select categories/sort

If all checked - **YOU'RE READY TO CODE!** 🎉

---

**Start here:** Open `products/views.py` and read the comments
