"""
Direct email test to check SMTP configuration
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

print("=" * 60)
print("TESTING DIRECT EMAIL SENDING")
print("=" * 60)

print(f"\nEmail Configuration:")
print(f"  Backend: {settings.EMAIL_BACKEND}")
print(f"  Host: {settings.EMAIL_HOST}")
print(f"  Port: {settings.EMAIL_PORT}")
print(f"  Use TLS: {settings.EMAIL_USE_TLS}")
print(f"  From: {settings.DEFAULT_FROM_EMAIL}")
print(f"  Host User: {settings.EMAIL_HOST_USER}")

print(f"\nAttempting to send test email...")

try:
    result = send_mail(
        subject='Test Email from Basho',
        message='This is a test email to verify SMTP configuration.',
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=['vinanth60@gmail.com'],
        fail_silently=False,
    )
    
    if result == 1:
        print("✅ SUCCESS! Email sent successfully.")
        print("\nPlease check your inbox (and spam folder) for the test email.")
    else:
        print("❌ FAILED! Email was not sent.")
        
except Exception as e:
    print(f"❌ ERROR sending email:")
    print(f"   {type(e).__name__}: {str(e)}")
    print("\nPossible issues:")
    print("  1. Gmail App Password might be incorrect")
    print("  2. Gmail account might have 2FA disabled")
    print("  3. 'Less secure app access' might be needed")
    print("  4. Network/firewall blocking SMTP")

print("=" * 60)
