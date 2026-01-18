from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create a superuser if one does not exist'

    def add_arguments(self, parser):
        parser.add_argument('--username', type=str, help='Username')
        parser.add_argument('--email', type=str, help='Email')
        parser.add_argument('--password', type=str, help='Password')

    def handle(self, *args, **options):
        username = options.get('username') or 'admin'
        email = options.get('email') or 'admin@example.com'
        password = options.get('password') or 'admin123'

        try:
            if User.objects.filter(username=username).exists():
                self.stdout.write(self.style.WARNING(f'[SUPERUSER] User "{username}" already exists - skipping creation'))
            else:
                User.objects.create_superuser(username=username, email=email, password=password)
                self.stdout.write(self.style.SUCCESS(f'[SUPERUSER] Successfully created superuser "{username}"'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'[SUPERUSER] Error creating superuser: {e}'))
            raise
