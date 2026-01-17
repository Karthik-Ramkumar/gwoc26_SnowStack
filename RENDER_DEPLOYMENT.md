# Render Deployment Guide for Basho

## What Was Fixed

The deployment failed because Render couldn't find `./build.sh`. This has been fixed with:

1. **build.sh** - Created executable build script with proper permissions (755)
2. **Procfile** - Defines how Render starts the application (gunicorn with 4 workers)
3. **render.yaml** - Optional explicit configuration (Render will use Procfile first)

## How to Deploy on Render

### Step 1: Connect Your Repository
1. Go to [render.com](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select `gwoc26_SnowStack` repository
5. Choose `main` branch

### Step 2: Configure Settings

| Setting | Value |
|---------|-------|
| **Name** | basho-api |
| **Runtime** | Python 3 |
| **Build Command** | `./build.sh` |
| **Start Command** | `gunicorn basho_project.wsgi:application --bind 0.0.0.0:$PORT` |
| **Python Version** | 3.12 |

### Step 3: Set Environment Variables

In Render Dashboard → Environment:

```
DEBUG=False
SECRET_KEY=your_django_secret_key_here
ALLOWED_HOSTS=your-app.onrender.com
DATABASE_URL=postgresql://your_db_url (if using PostgreSQL)
```

### Step 4: Configure Database (Optional)

If you want persistent data:
1. Add PostgreSQL database from Render dashboard
2. Render will auto-populate `DATABASE_URL`
3. Django will automatically use it if available

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically:
   - Clone your repo
   - Run `./build.sh` (installs dependencies, collects static files, runs migrations)
   - Start the application with gunicorn

### What Happens During Build

```bash
# Step 1: Upgrade pip
pip install --upgrade pip setuptools wheel

# Step 2: Install dependencies
pip install -r requirements.txt

# Step 3: Collect static files (React build + Django static)
python manage.py collectstatic --no-input

# Step 4: Run migrations
python manage.py migrate

# Step 5: Start server
gunicorn basho_project.wsgi:application --bind 0.0.0.0:$PORT
```

## Deployment Checklist

- [x] build.sh exists and is executable
- [x] Procfile configured correctly
- [x] requirements.txt has all dependencies
- [x] Frontend is pre-built and committed to git
- [x] Static files configuration in settings.py
- [x] WhiteNoise configured for static file serving
- [ ] Set SECRET_KEY in environment variables
- [ ] Set DEBUG=False in production
- [ ] Configure ALLOWED_HOSTS for your domain
- [ ] (Optional) Set up PostgreSQL database

## Troubleshooting

### Build Fails: "./build.sh: No such file or directory"
**Solution:** File permissions were wrong. Now fixed - rebuild should work.

### Images Not Loading (404 errors)
**Solution:** Run collectstatic manually:
```bash
python manage.py collectstatic --no-input
```

### Database Errors
**Solution:** Render will auto-run migrations. If issues:
```bash
# Manually trigger from Render shell
python manage.py migrate
```

### Static Files Not Served
**Check:**
1. `STATIC_ROOT` is set to `staticfiles/`
2. WhiteNoise middleware is configured
3. Run `collectstatic` before deploying

## Performance Optimization

To improve load times:

1. **Image Compression** (Most Important!)
   - Follow `IMAGE_OPTIMIZATION.md`
   - Compress large images before deploying

2. **Browser Caching**
   - Already configured in settings.py
   - Static files cached for 1 year

3. **Gzip Compression**
   - Automatically enabled by WhiteNoise
   - API responses compressed by middleware

4. **Lazy Loading**
   - Product images use `loading="lazy"`
   - Images only load when scrolled into view

## Monitoring

### View Logs
```
Render Dashboard → Your Service → Logs
```

### Common Issues to Look For
- Database connection errors
- Static file collection failures
- Missing environment variables
- Memory issues (upgrade if needed)

## Scaling (Future)

If you need more performance:
1. Upgrade plan (Standard, Pro)
2. Add PostgreSQL database
3. Configure Redis for caching/sessions
4. Add CDN for static files (Cloudflare)

## First Time Setup on Render

1. Service deploys
2. Migrations run automatically
3. Static files collected
4. Site goes live!

**Note:** First load may take 30-60s. After that, should be fast with caching.

---

**Questions?** Check:
- Render docs: https://render.com/docs
- Django deployment: https://docs.djangoproject.com/en/6.0/howto/deployment/
- Our README.md for local setup
