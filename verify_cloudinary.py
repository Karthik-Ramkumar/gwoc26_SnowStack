#!/usr/bin/env python
"""
Verification script to check if Cloudinary is configured correctly.
Run this on Render to verify environment variables are loaded.
"""
import os
import sys

print("=" * 60)
print("CLOUDINARY CONFIGURATION CHECK")
print("=" * 60)

# Check environment variables
cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME', '')
api_key = os.environ.get('CLOUDINARY_API_KEY', '')
api_secret = os.environ.get('CLOUDINARY_API_SECRET', '')

print(f"\n1. CLOUDINARY_CLOUD_NAME: {'✓ SET' if cloud_name else '✗ NOT SET'}")
if cloud_name:
    print(f"   Value: {cloud_name}")

print(f"\n2. CLOUDINARY_API_KEY: {'✓ SET' if api_key else '✗ NOT SET'}")
if api_key:
    print(f"   Value: {api_key[:6]}{'*' * (len(api_key) - 6)}")

print(f"\n3. CLOUDINARY_API_SECRET: {'✓ SET' if api_secret else '✗ NOT SET'}")
if api_secret:
    print(f"   Value: {'*' * len(api_secret)}")

# Check database
database_url = os.environ.get('DATABASE_URL', '')
print(f"\n4. DATABASE_URL: {'✓ SET' if database_url else '✗ NOT SET'}")
if database_url:
    # Mask password in URL
    if '@' in database_url:
        parts = database_url.split('@')
        print(f"   Value: {parts[0][:15]}...@{parts[1]}")
    else:
        print(f"   Value: {database_url[:20]}...")

print("\n" + "=" * 60)

# Try importing and testing Cloudinary
if cloud_name and api_key and api_secret:
    try:
        import cloudinary
        import cloudinary.uploader
        import cloudinary.api
        
        cloudinary.config(
            cloud_name=cloud_name,
            api_key=api_key,
            api_secret=api_secret,
            secure=True
        )
        
        print("\n✓ Cloudinary library imported successfully")
        print(f"✓ Cloudinary configured for cloud: {cloud_name}")
        
        # Try to ping Cloudinary API
        try:
            result = cloudinary.api.ping()
            print("✓ Cloudinary API connection successful!")
            print(f"  Status: {result.get('status', 'unknown')}")
        except Exception as e:
            print(f"✗ Cloudinary API connection failed: {str(e)}")
            
    except ImportError as e:
        print(f"\n✗ Error importing Cloudinary: {e}")
        print("  Run: pip install cloudinary django-cloudinary-storage")
else:
    print("\n✗ Cannot test Cloudinary - environment variables not set")
    print("\nTO FIX:")
    print("1. Go to Render Dashboard → Your Web Service → Environment")
    print("2. Add these 3 variables:")
    print("   CLOUDINARY_CLOUD_NAME = your_cloud_name")
    print("   CLOUDINARY_API_KEY = your_api_key")
    print("   CLOUDINARY_API_SECRET = your_api_secret")
    print("3. Click 'Save Changes' and wait for redeploy")

print("=" * 60)
