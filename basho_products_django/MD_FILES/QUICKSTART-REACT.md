# QUICK START - React + Django

## What Changed?

The project now uses **React** instead of vanilla JavaScript. This provides:
- ✅ Better mobile/desktop responsiveness
- ✅ Modern component-based architecture  
- ✅ Fast development with hot reload
- ✅ Easy state management

---

## ⚡ FASTEST WAY TO START

### **Option 1: Single Command (Easy)**
```bash
cd basho_products_django
./start.sh
```

This starts both Django and React automatically!

### **Option 2: Manual (Two Terminals)**

**Terminal 1 - Django Backend:**
```bash
cd basho_products_django
source venv/bin/activate
python manage.py runserver
```

**Terminal 2 - React Frontend:**
```bash
cd basho_products_django/frontend
npm start
```

**Open:** http://localhost:3000/

---

## 📋 FIRST TIME SETUP

If this is your first time:

```bash
cd basho_products_django

# 1. Activate Python environment
source venv/bin/activate

# 2. Install Python packages (if updated)
pip install -r requirements.txt

# 3. Run database migrations
python manage.py migrate

# 4. Install React dependencies
cd frontend
npm install
cd ..

# 5. Start servers
./start.sh
```

---

## 🎯 WHAT YOUR FRIEND NEEDS TO KNOW

### **Backend (Django REST API)**
- **File:** `products/views.py` - Add backend logic here
- **File:** `products/serializers.py` - Customize JSON output
- **Admin:** http://localhost:8000/admin/ - Manage products
- **API:** http://localhost:8000/api/products/ - Test endpoints

### **Frontend (React)**
- **Components:** `frontend/src/components/` - Edit UI here
- **Styling:** `frontend/public/css/` - Original CSS
- **App:** `frontend/src/App.js` - Main component

### **Key Differences:**
| Before (Vanilla JS) | Now (React) |
|---------------------|-------------|
| Django templates | React components |
| Server renders HTML | API returns JSON |
| `static/js/products.js` | `src/components/ProductList.js` |
| Reload page to update | Hot reload instantly |

---

## 🔧 COMMON TASKS

### **Add Products**
```bash
# Open admin panel
http://localhost:8000/admin/

# Or load sample data
python manage.py shell -c "from load_sample_data import load_sample_products; load_sample_products()"
```

### **Test API**
```bash
# Django must be running
curl http://localhost:8000/api/products/
```

### **Edit Product Card**
Edit `frontend/src/components/ProductList.js`

### **Change Filters**
Edit `frontend/src/App.js` (handleCategoryChange, handleSortChange)

### **Modify Custom Order Form**
Edit `frontend/src/components/CustomOrderForm.js`

---

## 🌐 ARCHITECTURE

```
React (Port 3000)
      ↓
   HTTP Requests (axios)
      ↓
Django REST API (Port 8000)
      ↓
   Database (SQLite)
```

**Data Flow:**
1. React fetches products from `/api/products/`
2. Django queries database
3. Serializer converts to JSON
4. React displays in components

---

## 📱 MOBILE RESPONSIVE

The CSS automatically adjusts:

- **Mobile (<768px):** 1 column grid
- **Tablet (768-1024px):** 2 column grid  
- **Desktop (>1024px):** 3+ column grid

Test by opening DevTools (F12) and using responsive mode.

---

## 🐛 TROUBLESHOOTING

**React shows blank page:**
- Check browser console (F12)
- Ensure Django is running
- Check `API_BASE_URL` in App.js

**"CORS error":**
- Ensure `django-cors-headers` installed
- Check `CORS_ALLOWED_ORIGINS` in settings.py

**Products don't load:**
- Visit http://localhost:8000/api/products/
- If empty, add products via admin
- Check database: `python manage.py shell`

**npm start fails:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

---

## 📚 DOCUMENTATION

- **README-REACT.md** - Complete React + Django guide
- **README.md** - Original Django documentation
- **Code comments** - Every component explained

---

## ✅ QUICK CHECK

After starting, verify:

1. Django admin works: http://localhost:8000/admin/
2. React loads: http://localhost:3000/
3. Products display correctly
4. Filters work (category, sort)
5. Custom order form submits
6. No errors in browser console

---

**READY!** Your friend has a modern React frontend with Django REST API backend. 🚀

All backend TODO items remain in `products/views.py` - same as before, just returning JSON instead of HTML.
