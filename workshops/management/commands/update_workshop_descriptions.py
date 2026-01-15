from django.core.management.base import BaseCommand
from workshops.models import Workshop


class Command(BaseCommand):
    help = 'Update workshop descriptions with proper content'

    def handle(self, *args, **kwargs):
        # Update the testing workshop to Studio-Based Experiences
        try:
            workshop = Workshop.objects.get(name='testing')
            workshop.name = 'Studio-Based Experiences'
            workshop.short_description = 'Immerse yourself in a creative group pottery session designed for all skill levels. Learn...'
            workshop.description = 'Immerse yourself in a creative group pottery session designed for all skill levels. Learn traditional pottery techniques, create your own pieces, and take home beautiful handcrafted works.'
            workshop.save()
            self.stdout.write(self.style.SUCCESS(f'✓ Updated Studio-Based Experiences workshop'))
        except Workshop.DoesNotExist:
            self.stdout.write(self.style.WARNING('Workshop "testing" not found'))
        
        # Update all other workshops with descriptions if they don't have them
        workshops = Workshop.objects.all()
        for workshop in workshops:
            if not workshop.short_description or len(workshop.short_description) < 10:
                workshop.short_description = f'Join us for an amazing {workshop.workshop_type_display.lower()} experience. Learn pottery techniques and create beautiful pieces.'
                workshop.save()
                self.stdout.write(self.style.SUCCESS(f'✓ Updated {workshop.name}'))
        
        self.stdout.write(self.style.SUCCESS('\n✅ All workshops updated with descriptions!'))
