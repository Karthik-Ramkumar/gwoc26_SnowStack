#!/usr/bin/env python
"""
Test Cloudinary image upload locally
This will verify that your Cloudinary credentials work correctly
"""
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

import cloudinary
import cloudinary.uploader
from cloudinary.models import CloudinaryField

def test_cloudinary_upload():
    """Test uploading an image to Cloudinary"""
    
    print("\n" + "="*60)
    print("CLOUDINARY UPLOAD TEST")
    print("="*60)
    
    # Get credentials from user input
    print("\nEnter your Cloudinary credentials:")
    print("(You can find these at: https://console.cloudinary.com/)")
    print()
    
    cloud_name = input("Cloud Name: ").strip()
    api_key = input("API Key: ").strip()
    api_secret = input("API Secret: ").strip()
    
    if not all([cloud_name, api_key, api_secret]):
        print("\n✗ All fields are required!")
        return False
    
    # Configure Cloudinary
    print("\n1. Configuring Cloudinary...")
    cloudinary.config(
        cloud_name=cloud_name,
        api_key=api_key,
        api_secret=api_secret,
        secure=True
    )
    
    # Test API connection
    print("2. Testing API connection...")
    try:
        result = cloudinary.api.ping()
        print(f"   ✓ API Connection: {result.get('status', 'unknown')}")
    except Exception as e:
        print(f"   ✗ API Connection Failed: {e}")
        return False
    
    # Create a test image
    print("3. Creating test image...")
    from PIL import Image
    test_image_path = "/tmp/test_cloudinary_image.png"
    
    # Create a simple 200x200 red square
    img = Image.new('RGB', (200, 200), color='red')
    img.save(test_image_path)
    print(f"   ✓ Created test image at {test_image_path}")
    
    # Upload to Cloudinary
    print("4. Uploading to Cloudinary...")
    try:
        upload_result = cloudinary.uploader.upload(
            test_image_path,
            folder="products",  # Same folder as your products
            resource_type="image"
        )
        
        print(f"\n{'='*60}")
        print("✓ UPLOAD SUCCESSFUL!")
        print(f"{'='*60}")
        print(f"\nCloudinary URL: {upload_result['secure_url']}")
        print(f"Public ID: {upload_result['public_id']}")
        print(f"Format: {upload_result['format']}")
        print(f"Width: {upload_result['width']}px")
        print(f"Height: {upload_result['height']}px")
        print(f"Size: {upload_result['bytes']} bytes")
        print(f"\n{'='*60}")
        
        # Clean up
        os.remove(test_image_path)
        
        print("\n✓ Your Cloudinary credentials are working!")
        print("\nNEXT STEPS:")
        print("1. Add these to Render Dashboard → Environment:")
        print(f"   CLOUDINARY_CLOUD_NAME = {cloud_name}")
        print(f"   CLOUDINARY_API_KEY = {api_key}")
        print(f"   CLOUDINARY_API_SECRET = {api_secret}")
        print("2. Click 'Save Changes'")
        print("3. Wait for automatic redeploy (3-5 minutes)")
        print()
        
        return True
        
    except Exception as e:
        print(f"\n✗ Upload Failed: {e}")
        if "test_image_path" in locals() and os.path.exists(test_image_path):
            os.remove(test_image_path)
        return False

if __name__ == "__main__":
    try:
        test_cloudinary_upload()
    except KeyboardInterrupt:
        print("\n\nTest cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n✗ Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
