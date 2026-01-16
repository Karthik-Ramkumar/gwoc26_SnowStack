
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from media_content.models import GalleryImage

print(f"Total Gallery Images: {GalleryImage.objects.count()}")
print(f"Workshop Images: {GalleryImage.objects.filter(category='workshop').count()}")
print(f"Studio Images: {GalleryImage.objects.filter(category='studio').count()}")
