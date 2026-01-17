# Basho By Shivangi - Handcrafted Ceramics & Pottery Workshops

A full-stack e-commerce platform for handcrafted ceramic products, pottery workshops, and custom orders. Built with Django REST Framework and React, featuring secure payments via Razorpay, async email notifications, and a modern admin dashboard.

---

## 🚀 Features

- **Product Catalog** - Browse handcrafted ceramics with filtering, search, and cart functionality
- **Workshop Registration** - Book pottery workshop sessions with real-time slot availability
- **Custom Orders** - Request personalized ceramic pieces through an inquiry form
- **Corporate Solutions** - Team building workshops and bulk custom orders for businesses
- **Secure Payments** - Razorpay integration for online transactions
- **Email Notifications** - Automated order confirmations and admin alerts
- **Admin Dashboard** - Modern Jazzmin-powered interface for managing products, orders, and workshops
- **Media Gallery** - Showcase creations, customer testimonials, and studio events

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19.2.3, React Router, Axios, Lucide Icons |
| **Backend** | Django 6.0, Django REST Framework 3.16 |
| **Database** | PostgreSQL (production), SQLite (development) |
| **Payments** | Razorpay Payment Gateway |
| **Email** | Gmail SMTP with Celery (async) or sync fallback |
| **Task Queue** | Celery + Redis (optional for production) |
| **Deployment** | Render (Web Service + PostgreSQL) |
| **Static Files** | WhiteNoise with gzip compression |

---

## 📦 Installation & Setup

### Prerequisites
- Python 3.12+
- Node.js 16+ and npm
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/Karthik-Ramkumar/gwoc26_SnowStack.git
cd gwoc26_SnowStack
```

### 2. Backend Setup

#### On Linux/Mac:
```bash
# Create and activate virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser for admin panel
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --no-input
```

#### On Windows:
```bash
# Create and activate virtual environment
python -m venv .venv
.venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser for admin panel
python manage.py createsuperuser

# Collect static files
python manage.py collectstatic --no-input
```

> **Note for Windows Users:** If images don't load, you may need to update image paths in components to remove `/static/` prefix (e.g., change `/static/images/file.jpg` to `images/file.jpg`).

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run build
cd ..
```

### 4. Environment Variables

Create a `.env` file in the root directory (optional for local development):

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Email Configuration (Gmail)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=rzp_test_xxxx
RAZORPAY_KEY_SECRET=your_secret_key

# Celery/Redis (Optional - for async emails)
CELERY_ENABLED=False
REDIS_URL=redis://localhost:6379
```

**Getting API Keys:**
- **Razorpay:** Sign up at [razorpay.com](https://razorpay.com) → Dashboard → Settings → API Keys
- **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords

### 5. Run the Development Server
```bash
python manage.py runserver
```

Visit:
- **Website:** http://127.0.0.1:8000/
- **Admin Panel:** http://127.0.0.1:8000/admin/

---

## 🌐 Deployment on Render

### Step 1: Create Web Service

1. Go to [render.com](https://render.com) and sign in
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** basho-api (or your choice)
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn basho_project.wsgi:application`
   - **Python Version:** 3.12

### Step 2: Add PostgreSQL Database

1. In Render Dashboard, click **New +** → **PostgreSQL**
2. Name: `basho-db`
3. Plan: Free
4. Once created, copy the **Internal Database URL**

### Step 3: Environment Variables

Add these in Render Dashboard → Your Web Service → Environment:

```env
# Required
DEBUG=False
SECRET_KEY=generate-a-strong-random-key-here
ALLOWED_HOSTS=your-app.onrender.com
DATABASE_URL=<your-postgresql-url-from-step-2>

# Email (Gmail SMTP)
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password

# Razorpay (Use LIVE keys for production)
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# Email Mode (set to False for free tier)
CELERY_ENABLED=False
```

### Step 4: Deploy

1. Click **Create Web Service**
2. Render will automatically:
   - Install dependencies
   - Run migrations
   - Collect static files
   - Start the server

Your site will be live at `https://your-app.onrender.com`

> **Note:** Emails will send synchronously (5-10s) with `CELERY_ENABLED=False`. For faster async emails, add Redis and Celery worker services (see `REDIS_CELERY_RENDER.md`).

---

## 📁 Project Structure

```
gwoc26_SnowStack/
├── basho_project/              # Django project configuration
│   ├── settings.py            # Database, email, Celery, WhiteNoise config
│   ├── urls.py                # Main URL routing
│   └── celery.py              # Celery task queue setup
│
├── products/                  # Products app
│   ├── models.py             # Product, Order, CustomOrder models
│   ├── views.py              # REST API views with Razorpay integration
│   ├── serializers.py        # DRF serializers
│   ├── tasks.py              # Celery email tasks
│   └── email_utils.py        # Sync/async email fallback
│
├── workshops/                 # Workshops app
│   ├── models.py             # Workshop, Slot, Registration models
│   ├── views.py              # Workshop API endpoints
│   └── serializers.py        # DRF serializers
│
├── studio/                    # Studio & exhibitions app
│   ├── models.py             # Exhibitions, events, gallery
│   └── views.py              # Studio API
│
├── media_content/             # Media & testimonials app
│   ├── models.py             # Gallery, testimonials, experiences
│   └── views.py              # Media API
│
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/       # React components (Home, Products, Cart, etc.)
│   │   ├── context/          # Cart and Auth context providers
│   │   └── App.js            # Main React app with routing
│   ├── public/               # Public assets
│   └── build/                # Production build (auto-generated)
│
├── static/                    # Django static files
│   └── images/               # Product images, backgrounds
│
├── templates/                 # Django HTML templates
│   └── emails/               # Email notification templates
│
├── requirements.txt           # Python dependencies
├── build.sh                   # Render build script
├── Procfile                   # Gunicorn configuration
└── manage.py                  # Django management script
```

---

## 🔌 API Endpoints

### Products
- `GET /api/products/` - List products (with filters: `?category=`, `?featured=`)
- `GET /api/products/{id}/` - Product details
- `POST /api/custom-orders/` - Submit custom order request
- `POST /api/corporate-inquiries/` - Submit corporate inquiry

### Workshops
- `GET /api/workshops/` - List all workshops
- `GET /api/workshops/{id}/` - Workshop details
- `GET /api/workshops/{id}/slots/` - Available time slots
- `POST /api/registrations/` - Register for workshop

### Orders & Payments
- `POST /api/products/create-razorpay-order/` - Initialize payment
- `POST /api/products/verify-payment/` - Verify and create order
- `GET /api/products/orders/` - User order history

See `API_DOCUMENTATION.md` for detailed endpoints.

---

## 🎨 Admin Panel

Access at `/admin/` with superuser credentials.

**Features:**
- Product management with image upload
- Workshop scheduling and slot management
- Order tracking with payment details
- Customer inquiries and registrations
- Media gallery and testimonials
- Modern Jazzmin theme with custom icons

---

## 🧪 Testing

### Test Email System
```bash
# With Celery (if Redis running)
celery -A basho_project worker -l info

# Test custom order emails
python test_order_emails.py

# Test corporate inquiry emails
python test_email_templates.py
```

### Test Payments (Razorpay Test Mode)
Use test cards from [Razorpay Docs](https://razorpay.com/docs/payments/payments/test-card-details/):
- Card: `5267 3181 8797 5449`
- Expiry: Any future date
- CVV: Any 3 digits

---

## 📝 License

This project is developed for educational purposes as part of Google Winter of Code(GWOC) at SVNIT 2026.

---

## 👥 Contributors

- **Chris Reji George**
- **Karthik Ramkumar** 
- **Nalan Baburajan**
- **Vinanth P**

---

**Built with ❤️ for artisans and pottery enthusiasts**
- Accent: #EDD8B4 (Cream)

---
Built by SnowStack for Basho By Shivangi
