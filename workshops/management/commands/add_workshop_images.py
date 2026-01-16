from django.core.management.base import BaseCommand
from workshops.models import Workshop


class Command(BaseCommand):
    help = 'Add pottery images to workshops from Unsplash'

    def handle(self, *args, **kwargs):
        # High-quality pottery workshop images from Unsplash
        workshop_images = {
            # Group workshops - people working with clay
            'group': [
                'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',  # Pottery wheel hands
                'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',  # Clay work
                'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&q=80',  # Ceramics workshop
            ],
            # One-on-one - focused pottery work
            'one-on-one': [
                'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80',  # Pottery wheel close-up
                'https://images.unsplash.com/photo-1528459105426-b9548367069b?w=800&q=80',  # Hands on pottery
            ],
            # Couple - romantic pottery session
            'couple': [
                'https://images.unsplash.com/photo-1594069255016-c43949a25b5e?w=800&q=80',  # Couple pottery
                'https://images.unsplash.com/photo-1617398955318-8a1bc6f30321?w=800&q=80',  # Clay working together
            ],
            # Birthday/Party - fun group setting
            'birthday': [
                'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?w=800&q=80',  # Colorful ceramics
                'https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=800&q=80',  # Workshop setting
            ],
            'party': [
                'https://images.unsplash.com/photo-1572635196243-4dd75fbdbd7f?w=800&q=80',  # Workshop atmosphere
                'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',  # Pottery session
            ]
        }

        # Generic fallback images
        fallback_images = [
            'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=80',  # Beautiful pottery wheel
            'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',  # Hands on clay
            'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80',  # Clay forming
        ]

        workshops = Workshop.objects.all()
        self.stdout.write(f"Found {workshops.count()} workshops")

        for idx, workshop in enumerate(workshops):
            workshop_type = workshop.workshop_type
            
            # Get images for this workshop type
            type_images = workshop_images.get(workshop_type, fallback_images)
            
            # Cycle through images
            image_url = type_images[idx % len(type_images)]
            
            workshop.image_url = image_url
            workshop.save()
            
            self.stdout.write(self.style.SUCCESS(f"✓ Updated {workshop.name} ({workshop.workshop_type}) with image"))

        self.stdout.write(self.style.SUCCESS(f"\n✅ Successfully updated {workshops.count()} workshops with images!"))
