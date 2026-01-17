# Render + Redis + Celery Configuration Guide

## The Problem

Your current setup uses:
- **Celery** for async email sending (faster, non-blocking)
- **Redis** as message broker (for task queue)

On Render:
- ❌ Redis is NOT running by default
- ❌ Celery workers are NOT running by default
- ❌ Redis connection hardcoded to `localhost:6379` (won't work on Render)

**Result:** Emails won't send on Render (Celery tasks fail silently)

## Current Settings (settings.py)

```python
# These won't work on Render - hardcoded to localhost
CELERY_BROKER_URL = 'redis://localhost:6379/0'
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
```

## Solution Options

### Option 1: Use Managed Redis + Celery (RECOMMENDED)

Best for production, more reliable.

#### Step 1: Add Redis to Render

1. Go to Render Dashboard
2. Click "New +" → "Redis"
3. Name: `basho-redis`
4. Plan: Starter (free)
5. Click "Create Redis"
6. Copy the connection URL

#### Step 2: Update Environment Variables

In Render Dashboard → Your Web Service → Environment:

```
REDIS_URL=redis://your-redis-url-from-render:port
CELERY_BROKER_URL=${REDIS_URL}/0
CELERY_RESULT_BACKEND=${REDIS_URL}/1
```

#### Step 3: Update settings.py

```python
import os

# Use environment variables for Redis
REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')

CELERY_BROKER_URL = f'{REDIS_URL}/0'
CELERY_RESULT_BACKEND = f'{REDIS_URL}/1'
```

#### Step 4: Create Background Worker Service

In Render Dashboard, create a NEW service:

1. Click "New +" → "Background Worker"
2. Name: `basho-celery-worker`
3. Language: Python
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `celery -A basho_project worker -l info`
6. Environment: Copy same variables as web service

**Cost:** Redis ~$7/month + Worker ~$7/month

---

### Option 2: Disable Celery (EASIEST - FOR NOW)

Fastest way to get working. Emails send synchronously (slower but works).

#### Update settings.py

```python
# Disable Celery - emails will send synchronously
CELERY_ENABLED = False

CELERY_BROKER_URL = 'redis://localhost:6379/0'  # Won't be used
CELERY_RESULT_BACKEND = 'redis://localhost:6379/0'
```

#### Update products/tasks.py

Wrap all tasks to check if Celery is enabled:

```python
from django.conf import settings

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_custom_order_admin_email(self, ...):
    if not settings.CELERY_ENABLED:
        # Send synchronously without Celery
        try:
            # ... existing email code ...
            msg.send(fail_silently=False)
            return "Email sent successfully"
        except Exception as e:
            print(f"Error sending email: {e}")
            return f"Error: {str(e)}"
    
    # ... rest of Celery logic ...
```

**Cost:** Free (but emails slower - 2-5 seconds each)

---

### Option 3: Use Third-Party Service (SCALABLE)

Use AWS SES, SendGrid, or similar.

**Cost:** $0-20/month depending on volume

---

## Recommended Environment Variables for Render

Add to Render Dashboard → Environment Variables:

```
DEBUG=False
SECRET_KEY=your-long-random-key-here
ALLOWED_HOSTS=your-app.onrender.com
DATABASE_URL=postgresql://... (if using PostgreSQL)
REDIS_URL=redis://your-redis-url:port
CELERY_BROKER_URL=${REDIS_URL}/0
CELERY_RESULT_BACKEND=${REDIS_URL}/1
EMAIL_HOST_USER=your-gmail@gmail.com
EMAIL_HOST_PASSWORD=your-app-password-here
RAZORPAY_KEY_ID=rzp_live_xxxx
RAZORPAY_KEY_SECRET=xxxx
CELERY_ENABLED=True
```

## What You Need to Change

### 1. Update settings.py - Use Environment Variables

```python
import os

# Redis configuration
REDIS_URL = os.environ.get('REDIS_URL', 'redis://localhost:6379')

# Celery Configuration
CELERY_ENABLED = os.environ.get('CELERY_ENABLED', 'False') == 'True'
CELERY_BROKER_URL = os.environ.get('CELERY_BROKER_URL', f'{REDIS_URL}/0')
CELERY_RESULT_BACKEND = os.environ.get('CELERY_RESULT_BACKEND', f'{REDIS_URL}/1')
CELERY_ACCEPT_CONTENT = ['json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_TIMEZONE = 'UTC'
CELERY_TASK_TRACK_STARTED = True
CELERY_TASK_TIME_LIMIT = 30 * 60
```

### 2. Update products/tasks.py - Add Celery Enabled Check

At the top of each task:

```python
from django.conf import settings
from celery import shared_task

@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_custom_order_admin_email(self, ...):
    if not settings.CELERY_ENABLED:
        # Send synchronously
        try:
            # ... send email code ...
            return "Email sent"
        except Exception as e:
            return f"Error: {e}"
    
    # Original Celery code with retry logic
    try:
        # ... send email code ...
    except Exception as exc:
        raise self.retry(exc=exc)
```

### 3. requirements.txt - Ensure packages present

Already have:
- ✅ celery==5.3.6
- ✅ redis==5.0.7
- ✅ django==6.0
- ✅ gunicorn==23.0.0

## Testing on Render

### Test Synchronous Email (Option 2)
1. Set `CELERY_ENABLED=False`
2. Deploy to Render
3. Submit a form that triggers email
4. Check if email arrives (might take 5-10 seconds)

### Test with Redis + Celery (Option 1)
1. Add Redis to Render
2. Set `REDIS_URL=...` environment variable
3. Add Celery worker service
4. Set `CELERY_ENABLED=True`
5. Deploy all services
6. Submit form - email should arrive in 1-2 seconds

## Quick Implementation (Start with Option 2)

**Fastest path to get working:**

1. Update `basho_project/settings.py`:
   - Add `CELERY_ENABLED = os.environ.get('CELERY_ENABLED', 'False') == 'True'`
   - Make REDIS_URL use environment variable

2. Deploy to Render with `CELERY_ENABLED=False`

3. Test - emails will work but slower

4. Later, upgrade to Option 1 with managed Redis for faster emails

## Deployment Checklist

- [ ] Update settings.py to use environment variables
- [ ] Set CELERY_ENABLED in environment (True or False)
- [ ] Deploy web service first
- [ ] Test email sending (check logs)
- [ ] If using Option 1: Add Redis service
- [ ] If using Option 1: Add Celery worker service
- [ ] Verify emails arrive in < 2 seconds

## Monitoring

### Check Render Logs
```
Dashboard → Web Service → Logs
Dashboard → Worker Service → Logs (if using Celery)
```

### Look For
- ✅ "Email sent successfully"
- ❌ "Connection refused" (Redis not running)
- ❌ "Task rejected" (Celery worker not running)

## Cost Comparison

| Option | Setup Time | Cost/Month | Speed | Reliability |
|--------|-----------|-----------|-------|------------|
| Option 1 (Redis+Celery) | 30 min | ~$15 | Fast (1-2s) | High |
| Option 2 (Sync only) | 10 min | Free | Slow (5-10s) | Medium |
| Option 3 (SendGrid, etc) | 15 min | $10-20 | Fast (instant) | Very High |

---

**Recommendation:** Start with Option 2 (easiest), upgrade to Option 1 later when you need faster emails.
