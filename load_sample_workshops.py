# Sample Workshops Data
# Use this file to quickly populate the database with sample workshops

import os
import django
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from workshops.models import Workshop, WorkshopSlot

# Sample workshop data
SAMPLE_WORKSHOPS = [
    {
        'workshop_id': 'intro-pottery',
        'name': 'Introduction to Pottery',
        'workshop_type': 'group',
        'difficulty_level': 'beginner',
        'description': 'Perfect for beginners! Learn the basics of hand-building pottery in this fun, interactive group workshop. Create your own bowl or cup to take home.',
        'short_description': 'Learn pottery basics and create your first piece',
        'duration_hours': 3.0,
        'price': 3500,
        'max_participants': 8,
        'min_age': 12,
        'includes_materials': True,
        'includes_refreshments': True,
        'takes_home_creation': True,
        'is_featured': True,
        'is_popular': True,
        'available_slots': 5,
    },
    {
        'workshop_id': 'wheel-throwing-101',
        'name': 'Wheel Throwing 101',
        'workshop_type': 'group',
        'difficulty_level': 'beginner',
        'description': 'Experience the magic of the potter\'s wheel! This hands-on workshop teaches you the fundamentals of centering clay and throwing your first bowl.',
        'short_description': 'Master the basics of wheel throwing',
        'duration_hours': 4.0,
        'price': 4500,
        'max_participants': 6,
        'min_age': 15,
        'includes_materials': True,
        'includes_refreshments': True,
        'takes_home_creation': True,
        'is_featured': True,
        'is_popular': False,
        'available_slots': 4,
    },
    {
        'workshop_id': 'private-session',
        'name': 'Private Pottery Session',
        'workshop_type': 'one-on-one',
        'difficulty_level': 'all',
        'description': 'Enjoy personalized instruction in this private one-on-one session. Perfect for those who want focused attention and customized learning at their own pace.',
        'short_description': 'Personalized one-on-one pottery instruction',
        'duration_hours': 2.0,
        'price': 5500,
        'max_participants': 1,
        'min_age': 10,
        'includes_materials': True,
        'includes_refreshments': False,
        'takes_home_creation': True,
        'is_featured': False,
        'is_popular': True,
        'available_slots': 8,
    },
    {
        'workshop_id': 'couple-pottery-date',
        'name': 'Romantic Pottery Date Night',
        'workshop_type': 'couple',
        'difficulty_level': 'all',
        'description': 'Create memories and pottery together! This romantic experience is perfect for couples looking for a unique and creative date. Includes refreshments and a special couples\' photo.',
        'short_description': 'A creative and romantic experience for two',
        'duration_hours': 2.5,
        'price': 6500,
        'max_participants': 2,
        'min_age': 18,
        'includes_materials': True,
        'includes_refreshments': True,
        'takes_home_creation': True,
        'is_featured': True,
        'is_popular': True,
        'available_slots': 6,
    },
    {
        'workshop_id': 'birthday-celebration',
        'name': 'Birthday Party Experience',
        'workshop_type': 'birthday',
        'difficulty_level': 'all',
        'description': 'Celebrate your special day with pottery! Perfect for kids and adults alike. Includes pottery instruction, materials, decorations, and a birthday cake. Each guest creates and takes home their own piece.',
        'short_description': 'Unforgettable pottery birthday celebration',
        'duration_hours': 3.0,
        'price': 8500,
        'max_participants': 10,
        'min_age': 8,
        'includes_materials': True,
        'includes_refreshments': True,
        'takes_home_creation': True,
        'is_featured': False,
        'is_popular': True,
        'available_slots': 3,
    },
    {
        'workshop_id': 'mini-party',
        'name': 'Farm & Garden Mini Party',
        'workshop_type': 'party',
        'difficulty_level': 'all',
        'description': 'Enjoy a unique studio experience combined with our beautiful garden setting. Perfect for small gatherings, team building, or social events. Create pottery while enjoying the natural beauty of our farm.',
        'short_description': 'Pottery making in our beautiful garden setting',
        'duration_hours': 3.5,
        'price': 7500,
        'max_participants': 12,
        'min_age': 12,
        'includes_materials': True,
        'includes_refreshments': True,
        'takes_home_creation': True,
        'is_featured': False,
        'is_popular': False,
        'available_slots': 2,
    },
    {
        'workshop_id': 'advanced-glazing',
        'name': 'Advanced Glazing Techniques',
        'workshop_type': 'group',
        'difficulty_level': 'advanced',
        'description': 'Take your pottery to the next level! Learn professional glazing techniques including layering, resist methods, and special effects. Bring your own bisque-fired pieces or use ours.',
        'short_description': 'Master professional glazing methods',
        'duration_hours': 4.0,
        'price': 5000,
        'max_participants': 6,
        'min_age': 16,
        'includes_materials': True,
        'includes_refreshments': True,
        'takes_home_creation': True,
        'is_featured': False,
        'is_popular': False,
        'available_slots': 4,
    },
]

def load_workshops():
    print("Loading sample workshops...")
    
    for workshop_data in SAMPLE_WORKSHOPS:
        workshop, created = Workshop.objects.get_or_create(
            workshop_id=workshop_data['workshop_id'],
            defaults=workshop_data
        )
        if created:
            print(f"✓ Created: {workshop.name}")
            
            # Create some sample slots for each workshop
            start_date = datetime.now().date() + timedelta(days=7)
            for i in range(4):  # Create 4 slots per workshop
                slot_date = start_date + timedelta(days=i*7)
                WorkshopSlot.objects.create(
                    workshop=workshop,
                    date=slot_date,
                    start_time='10:00',
                    end_time=f"{10 + int(workshop.duration_hours):02d}:00",
                    available_spots=workshop.max_participants,
                    is_available=True
                )
        else:
            print(f"  Workshop already exists: {workshop.name}")
    
    print(f"\nTotal workshops in database: {Workshop.objects.count()}")
    print("Done!")

if __name__ == '__main__':
    load_workshops()
