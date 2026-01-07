# Sample Workshops Data
# Use this file to quickly populate the database with sample workshops

import os
import django
from datetime import datetime, timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'basho_project.settings')
django.setup()

from workshops.models import Workshop, WorkshopSlot

# Sample workshop data - 4 main workshop experiences
SAMPLE_WORKSHOPS = [
    {
        'workshop_id': 'couple-pottery-dates',
        'name': 'Couple Pottery Dates',
        'workshop_type': 'couple',
        'difficulty_level': 'all',
        'description': 'A romantic and creative experience for couples. Create pottery together in an intimate studio setting with personalized instruction.',
        'short_description': 'Romantic pottery experience for couples',
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
        'image_url': '',
    },
    {
        'workshop_id': 'birthday-celebrations',
        'name': 'Birthday Celebrations',
        'workshop_type': 'birthday',
        'difficulty_level': 'all',
        'description': 'Celebrate your special day with a unique pottery party! Perfect for all ages, includes instruction, materials, and refreshments.',
        'short_description': 'Unforgettable pottery birthday experience',
        'duration_hours': 3.0,
        'price': 8500,
        'max_participants': 10,
        'min_age': 8,
        'includes_materials': True,
        'includes_refreshments': True,
        'takes_home_creation': True,
        'is_featured': True,
        'is_popular': True,
        'available_slots': 4,
        'image_url': '',
    },
    {
        'workshop_id': 'farm-garden-mini-parties',
        'name': 'Farm & Garden Mini Parties',
        'workshop_type': 'party',
        'difficulty_level': 'all',
        'description': 'Enjoy pottery making in our beautiful garden setting. Perfect for small gatherings, team building, or social events surrounded by nature.',
        'short_description': 'Pottery parties in our beautiful garden',
        'duration_hours': 3.5,
        'price': 7500,
        'max_participants': 12,
        'min_age': 12,
        'includes_materials': True,
        'includes_refreshments': True,
        'takes_home_creation': True,
        'is_featured': True,
        'is_popular': False,
        'available_slots': 3,
        'image_url': '',
    },
    {
        'workshop_id': 'studio-based-experiences',
        'name': 'Studio-Based Experiences',
        'workshop_type': 'group',
        'difficulty_level': 'all',
        'description': 'Group pottery sessions in our professional studio space. Learn various techniques and create your own pieces in a supportive, creative environment.',
        'short_description': 'Group pottery sessions in our studio',
        'duration_hours': 3.0,
        'price': 4500,
        'max_participants': 8,
        'min_age': 12,
        'includes_materials': True,
        'includes_refreshments': True,
        'takes_home_creation': True,
        'is_featured': True,
        'is_popular': True,
        'available_slots': 5,
        'image_url': '',
    },
]

def load_workshops():
    """Clear existing workshops and load the 4 main workshop types"""
    print("Clearing existing workshops...")
    
    # Delete all existing workshops (this will cascade to slots and registrations)
    deleted_count = Workshop.objects.all().delete()[0]
    print(f"✓ Deleted {deleted_count} existing workshop(s)")
    
    print("\nLoading new workshops...")
    
    for workshop_data in SAMPLE_WORKSHOPS:
        workshop = Workshop.objects.create(**workshop_data)
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
    
    print(f"\n✓ Successfully loaded {Workshop.objects.count()} workshops")
    print("You can now edit these in the admin panel at /admin/workshops/workshop/")
    print("Done!")

if __name__ == '__main__':
    load_workshops()
