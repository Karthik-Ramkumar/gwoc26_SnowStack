# Email Configuration Guide

## Setting up Automated Emails for Custom Orders

### 1. Configure Email Settings

Email settings are loaded from environment variables in `basho_backend/settings.py`. Do not hardcode credentials.

Set the following variables in your environment (e.g., `.env` file or deployment secrets):

```env
# Required
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=true
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password

# Optional
DEFAULT_FROM_EMAIL=Basho Pottery <your-email@gmail.com>
```

Company information can remain in settings as non-sensitive values:

```python
COMPANY_NAME = 'Basho Pottery'
COMPANY_EMAIL = 'orders@bashopottery.com'
COMPANY_PHONE = '+91 XXXXX XXXXX'
COMPANY_ADDRESS = 'Clay Studio, Pottery Lane, Creative District'
```

### 2. Gmail Setup (if using Gmail)

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
   - Use this password in EMAIL_HOST_PASSWORD

### 3. Alternative Email Providers

**Outlook/Hotmail:**
```python
EMAIL_HOST = 'smtp-mail.outlook.com'
EMAIL_PORT = 587
```

**Yahoo:**
```python
EMAIL_HOST = 'smtp.mail.yahoo.com'
EMAIL_PORT = 587
```

**SendGrid/Mailgun (Production):**
For production, consider using dedicated email services like SendGrid or Mailgun for better deliverability.

### 4. Testing Email Functionality

A comprehensive test management command has been created at `products/management/commands/test_emails.py`.

**Test all email types:**
```bash
python manage.py test_emails
```

**Test specific email types:**
```bash
# Test only confirmation emails
python manage.py test_emails --type confirmation

# Test only status update emails
python manage.py test_emails --type status_update

# Test only admin notifications
python manage.py test_emails --type admin_notification
```

The command will use the first custom order in your database for testing. If no orders exist, it will prompt you to create one first.

### 5. Email Templates

Email templates are located in `templates/emails/`:
- `order_confirmation.html` - Sent to customers when order is placed
- `order_status_update.html` - Sent when order status changes
- `admin_new_order.html` - Sent to admin when new order is received

### 6. Admin Interface

Use the Django admin to manage orders and trigger status updates:

1. Go to `/admin/products/customorder/`
2. Select orders and use bulk actions:
   - "Mark as contacted (sends email)"
   - "Mark as in progress (sends email)"
   - "Mark as completed (sends email)"

### 7. API Endpoints

**Update order status via API:**
```
PATCH /api/custom-orders/{id}/update_status/
{
    "status": "contacted"
}
```

This will automatically send a status update email to the customer.

### 8. Troubleshooting

**Common Issues:**

1. **Authentication Failed**: Check EMAIL_HOST_PASSWORD (use app password for Gmail)
2. **Connection Refused**: Verify EMAIL_HOST and EMAIL_PORT
3. **Emails Not Sending**: Check Django logs for error messages
4. **Emails Going to Spam**: This is normal for development; use a dedicated email service in production

**Debug Mode:**
You can set `EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend` in your environment to print emails to console during development instead of sending them.

### 9. Production Considerations

- Use environment variables for sensitive email credentials
- Implement email queuing (Celery + Redis) for high volume
- Add email tracking and analytics
- Set up SPF/DKIM records for better deliverability
- Use a professional email service (SendGrid, Mailgun, AWS SES)