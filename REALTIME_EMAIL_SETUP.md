# Email Setup for Custom Orders

## Quick Setup

**1. Install Redis**
```bash
# Linux/WSL
sudo apt install redis-server
sudo service redis-server start

# Windows: Download from https://github.com/tporadowski/redis/releases
# Docker: docker run -d -p 6379:6379 redis:alpine
```

**2. Install Python dependencies**
```bash
pip install -r requirements.txt
```

## Running the App (3 terminals needed)

**Terminal 1 - Redis**
```bash
sudo service redis-server start
# Verify: redis-cli ping (should return PONG)
```

**Terminal 2 - Celery Worker**
```bash
celery -A basho_project worker --loglevel=info --pool=solo
```

**Terminal 3 - Django**
```bash
python manage.py runserver
```

## Testing
Submit a custom order - emails will appear in Terminal 2

## Production Setup
Add to `settings.py`:
```python
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
```
