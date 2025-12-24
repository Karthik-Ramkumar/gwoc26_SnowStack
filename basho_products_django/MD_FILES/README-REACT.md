# Basho Products - React + Django (UPDATED)

**React frontend with Django REST API backend**

This project has been updated to use **React** for the frontend instead of vanilla JavaScript. This provides better mobile/desktop responsiveness and a modern development experience.

---

## 🏗️ ARCHITECTURE

```
Frontend (React)          Backend (Django REST API)
Port: 3000          <-->  Port: 8000

- React Components        - REST API ViewSets
- Axios HTTP calls        - Product/CustomOrder models
- State management        - JSON serializers
- Responsive UI           - Database (SQLite)
```

---

## 🚀 QUICK START

### **Terminal 1: Django Backend**
```bash
cd basho_products_django
source venv/bin/activate
python manage.py runserver
```

### **Terminal 2: React Frontend**
```bash
cd basho_products_django/frontend
npm start
```

**Open:** http://localhost:3000/

The React app will automatically connect to the Django API at http://localhost:8000/

---

## 📁 PROJECT STRUCTURE (UPDATED)

```
basho_products_django/
│
├── basho_backend/              # Django settings
│   ├── settings.py             # Updated with REST Framework & CORS
│   └── urls.py                 # API routes
│
├── products/                   # Django REST API
│   ├── models.py               # Product, CustomOrder models
│   ├── serializers.py          # NEW: JSON serializers
│   ├── views.py                # UPDATED: REST API viewsets
│   ├── urls.py                 # UPDATED: API endpoints
│   └── admin.py                # Django admin
│
├── frontend/                   # NEW: React application
│   ├── public/
│   │   ├── css/                # Copied from static/
│   │   ├── images/             # Copied from static/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Navigation.js
│   │   │   ├── ProductList.js
│   │   │   ├── CustomOrderForm.js
│   │   │   ├── ProductCare.js
│   │   │   └── Footer.js
│   │   ├── App.js              # Main React component
│   │   ├── App.css             # React styles
│   │   └── index.js            # React entry point
│   ├── package.json            # NPM dependencies
│   └── node_modules/           # NPM packages
│
├── static/                     # Original CSS/JS (for reference)
├── templates/                  # Old Django templates (not used)
├── venv/                       # Python virtual environment
├── db.sqlite3                  # Database
├── requirements.txt            # Python dependencies
└── README-REACT.md             # This file
```

---

## 🔧 SETUP GUIDE

### **First Time Setup**

1. **Backend Setup (Django)**
```bash
cd basho_products_django
source venv/bin/activate

# Install updated requirements
pip install -r requirements.txt

# Run migrations (if not done)
python manage.py migrate

# Create superuser (if not done)
python manage.py createsuperuser

# Load sample data (if not done)
python manage.py shell -c "from load_sample_data import load_sample_products; load_sample_products()"
```

2. **Frontend Setup (React)**
```bash
cd frontend

# Install dependencies (already done, but if needed)
npm install

# Start development server
npm start
```

---

## 🌐 API ENDPOINTS

All API endpoints return JSON and are consumed by React:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/products/` | GET | List all products with filtering/sorting |
| `/api/products/{product_id}/` | GET | Get single product details |
| `/api/custom-orders/` | POST | Submit custom order request |
| `/api/calculate-shipping/` | POST | Calculate shipping cost |

### **Example API Calls**

**Get all products:**
```bash
curl http://localhost:8000/api/products/
```

**Filter by category:**
```bash
curl "http://localhost:8000/api/products/?category=tableware&sort=price-low"
```

**Submit custom order:**
```bash
curl -X POST http://localhost:8000/api/custom-orders/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+919876543210",
    "project_type": "tableware",
    "description": "Custom dinner set for 6 people"
  }'
```

---

## 🎨 REACT COMPONENTS

### **App.js** (Main Component)
- Manages state (products, filters, sorting)
- Fetches data from Django API
- Renders all child components

### **Navigation.js**
- Top navigation bar with logo
- Responsive design

### **ProductList.js**
- Displays product grid
- Handles "Add to Cart" (localStorage)
- Shows loading spinner
- Responsive grid (1 col mobile, 2 col tablet, 3+ col desktop)

### **CustomOrderForm.js**
- Custom order form with validation
- Axios POST to Django API
- Success/error messages
- Form state management

### **ProductCare.js**
- Product care information
- Material specs, shipping, returns

### **Footer.js**
- Footer with social links
- Contact information

---

## 🔨 WHERE TO ADD BACKEND CODE

Your friend still adds backend logic in the **same files as before**, but now they return JSON instead of HTML:

### **products/views.py**
```python
class ProductViewSet(viewsets.ModelViewSet):
    # TODO: Add custom filtering
    # TODO: Add search functionality
    # TODO: Add pagination customization
```

### **products/serializers.py** (NEW)
```python
class ProductSerializer(serializers.ModelSerializer):
    # Converts Product model to JSON
    # Customize what fields are exposed to React
```

### **Email Notifications** (Same as before)
In `views.py` → `CustomOrderViewSet.create()`:
```python
from django.core.mail import send_mail

send_mail(
    subject=f'New Order: {order_number}',
    message=f'...',
    from_email='noreply@bashobyshivangi.com',
    recipient_list=['hello@bashobyshivangi.com'],
)
```

---

## 📱 RESPONSIVE DESIGN

React components use the original CSS which includes:

**Mobile (< 768px):**
- Single column product grid
- Stacked filter bars
- Full-width forms

**Tablet (768px - 1024px):**
- 2-column product grid
- Side-by-side filters

**Desktop (> 1024px):**
- 3-column product grid
- Multi-column layouts
- Optimized spacing

---

## 🧪 TESTING

### **Test Backend API**
```bash
# Start Django server
python manage.py runserver

# In another terminal
curl http://localhost:8000/api/products/
```

### **Test Frontend**
```bash
# Start React dev server
cd frontend
npm start

# Opens http://localhost:3000/ automatically
```

### **Test Full Stack**
1. Start Django: `python manage.py runserver`
2. Start React: `cd frontend && npm start`
3. Open browser: http://localhost:3000/
4. Check console for API calls
5. Test filtering, sorting, custom order form

---

## 🏭 PRODUCTION BUILD

### **Build React for Production**
```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build/`.

### **Serve React Build with Django**

Update `settings.py`:
```python
# Add to TEMPLATES DIRS
'DIRS': [BASE_DIR / 'frontend' / 'build'],

# Add to STATICFILES_DIRS
STATICFILES_DIRS = [
    BASE_DIR / 'static',
    BASE_DIR / 'frontend' / 'build' / 'static',
]
```

Update `urls.py`:
```python
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('', TemplateView.as_view(template_name='index.html')),
]
```

---

## 🔄 WHAT CHANGED FROM VANILLA JS?

| Feature | Vanilla JS | React |
|---------|-----------|-------|
| UI Framework | None | React |
| State Management | Manual | React Hooks |
| API Calls | Fetch API | Axios |
| Templating | Django Templates | JSX Components |
| Routing | Django URLs | Single Page App |
| Build Process | None | npm build |
| Hot Reload | Django dev server | React Fast Refresh |

**Benefits of React:**
- ✅ Better mobile/desktop responsiveness
- ✅ Component reusability
- ✅ Modern development tools
- ✅ Fast re-renders
- ✅ Easy state management
- ✅ Large ecosystem

---

## 💡 TIPS FOR YOUR FRIEND

### **React Basics**
- Components are in `frontend/src/components/`
- State is managed with `useState`
- API calls use `useEffect` hook
- Props pass data between components

### **Backend (No Change)**
- Django admin still works: http://localhost:8000/admin/
- Models are the same
- Add products via admin panel
- All TODO comments still valid

### **Common Tasks**

**Add a new API endpoint:**
1. Add method to viewset in `views.py`
2. Call it from React with axios

**Modify product display:**
1. Edit `ProductList.js` component
2. Changes reflect immediately

**Change styling:**
1. Edit `public/css/style.css` or `App.css`
2. Refresh browser

---

## 📦 DEPLOYMENT

### **Option 1: Separate Deployments**
- **Backend:** Deploy Django to Heroku/DigitalOcean/AWS
- **Frontend:** Deploy React to Vercel/Netlify
- Update `API_BASE_URL` in `App.js`

### **Option 2: Single Server**
- Build React: `npm run build`
- Serve build folder with Django
- Deploy both together

---

## 🆘 TROUBLESHOOTING

**React can't connect to Django:**
- Check Django is running on port 8000
- Check CORS settings in `settings.py`
- Check `API_BASE_URL` in `App.js`

**Products not showing:**
- Check backend API: http://localhost:8000/api/products/
- Check browser console for errors
- Verify database has products

**npm start fails:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

**CORS errors:**
- Ensure `django-cors-headers` is installed
- Check `CORS_ALLOWED_ORIGINS` in settings.py

---

## ✅ VERIFICATION CHECKLIST

After setup, verify:

- [ ] Django server runs: `python manage.py runserver`
- [ ] React server runs: `npm start`
- [ ] Can access http://localhost:3000/
- [ ] Products display correctly
- [ ] Filtering/sorting works
- [ ] Custom order form submits
- [ ] No console errors
- [ ] Responsive on mobile (use DevTools)

---

**Your friend now has a modern React + Django REST API project!** 🎉

The backend logic additions remain the same as documented in `README.md`, but now they power a React frontend instead of server-rendered templates.
