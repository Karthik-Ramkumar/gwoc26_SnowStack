from django.core.management.base import BaseCommand
from django.conf import settings
import os

class Command(BaseCommand):
    help = 'Check Cloudinary configuration'

    def handle(self, *args, **options):
        self.stdout.write("="*60)
        self.stdout.write("CLOUDINARY CONFIGURATION CHECK")
        self.stdout.write("="*60)
        
        # Check environment variables
        cloud_name = os.environ.get('CLOUDINARY_CLOUD_NAME')
        api_key = os.environ.get('CLOUDINARY_API_KEY')
        api_secret = os.environ.get('CLOUDINARY_API_SECRET')
        
        self.stdout.write(f"\n1. Environment Variables:")
        self.stdout.write(f"   CLOUDINARY_CLOUD_NAME: {'✓ SET' if cloud_name else '✗ NOT SET'}")
        if cloud_name:
            self.stdout.write(f"      Value: {cloud_name}")
        self.stdout.write(f"   CLOUDINARY_API_KEY: {'✓ SET' if api_key else '✗ NOT SET'}")
        if api_key:
            self.stdout.write(f"      Value: {api_key[:4]}...{api_key[-4:]}" if len(api_key) > 8 else api_key)
        self.stdout.write(f"   CLOUDINARY_API_SECRET: {'✓ SET' if api_secret else '✗ NOT SET'}")
        
        # Check Django settings
        self.stdout.write(f"\n2. Django Settings:")
        self.stdout.write(f"   DEFAULT_FILE_STORAGE: {settings.DEFAULT_FILE_STORAGE}")
        self.stdout.write(f"   MEDIA_URL: {settings.MEDIA_URL}")
        
        if hasattr(settings, 'CLOUDINARY_STORAGE'):
            self.stdout.write(f"   CLOUDINARY_STORAGE configured: ✓")
        else:
            self.stdout.write(f"   CLOUDINARY_STORAGE configured: ✗")
        
        # Test Cloudinary connection
        self.stdout.write(f"\n3. Testing Cloudinary Connection:")
        if cloud_name and api_key and api_secret:
            try:
                import cloudinary
                import cloudinary.api
                
                result = cloudinary.api.ping()
                self.stdout.write(self.style.SUCCESS(f"   ✓ Connection successful: {result}"))
                
                # Show account info
                try:
                    usage = cloudinary.api.usage()
                    self.stdout.write(f"   Cloud name: {usage.get('cloud_name', 'N/A')}")
                    self.stdout.write(f"   Plan: {usage.get('plan', 'N/A')}")
                    self.stdout.write(f"   Resources: {usage.get('resources', 0)}")
                except Exception as e:
                    self.stdout.write(f"   Usage info unavailable: {e}")
                    
            except Exception as e:
                self.stdout.write(self.style.ERROR(f"   ✗ Connection failed: {e}"))
        else:
            self.stdout.write(self.style.WARNING("   Skipped - environment variables not set"))
        
        self.stdout.write("\n" + "="*60)
        
        # Recommendation
        if not cloud_name or not api_key or not api_secret:
            self.stdout.write(self.style.ERROR("\n⚠ ACTION REQUIRED:"))
            self.stdout.write("Add these to Render Dashboard → Environment:")
            if not cloud_name:
                self.stdout.write("  - CLOUDINARY_CLOUD_NAME")
            if not api_key:
                self.stdout.write("  - CLOUDINARY_API_KEY")
            if not api_secret:
                self.stdout.write("  - CLOUDINARY_API_SECRET")
        elif settings.DEFAULT_FILE_STORAGE != 'cloudinary_storage.storage.MediaCloudinaryStorage':
            self.stdout.write(self.style.ERROR("\n⚠ WARNING:"))
            self.stdout.write(f"DEFAULT_FILE_STORAGE is set to: {settings.DEFAULT_FILE_STORAGE}")
            self.stdout.write("Expected: cloudinary_storage.storage.MediaCloudinaryStorage")
        else:
            self.stdout.write(self.style.SUCCESS("\n✓ Cloudinary is properly configured!"))
