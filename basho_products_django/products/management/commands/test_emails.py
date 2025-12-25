from django.core.management.base import BaseCommand
from products.models import CustomOrder
from products.email_utils import (
    send_order_confirmation_email,
    send_order_status_update_email,
    send_admin_new_order_notification
)


class Command(BaseCommand):
    help = 'Test email functionality for custom orders'

    def add_arguments(self, parser):
        parser.add_argument(
            '--type',
            type=str,
            choices=['confirmation', 'status_update', 'admin_notification', 'all'],
            default='all',
            help='Type of email to test'
        )

    def handle(self, *args, **options):
        # Get the first order for testing
        try:
            order = CustomOrder.objects.first()
            if not order:
                self.stdout.write(
                    self.style.WARNING('No custom orders found. Please create a test order first.')
                )
                return

            email_type = options['type']

            if email_type in ['confirmation', 'all']:
                self.stdout.write(f'Testing order confirmation email for order {order.order_number}...')
                success = send_order_confirmation_email(order)
                if success:
                    self.stdout.write(self.style.SUCCESS('✓ Order confirmation email sent successfully'))
                else:
                    self.stdout.write(self.style.ERROR('✗ Failed to send order confirmation email'))

            if email_type in ['status_update', 'all']:
                self.stdout.write(f'Testing status update email for order {order.order_number}...')
                success = send_order_status_update_email(order)
                if success:
                    self.stdout.write(self.style.SUCCESS('✓ Status update email sent successfully'))
                else:
                    self.stdout.write(self.style.ERROR('✗ Failed to send status update email'))

            if email_type in ['admin_notification', 'all']:
                self.stdout.write(f'Testing admin notification for order {order.order_number}...')
                success = send_admin_new_order_notification(order)
                if success:
                    self.stdout.write(self.style.SUCCESS('✓ Admin notification sent successfully'))
                else:
                    self.stdout.write(self.style.ERROR('✗ Failed to send admin notification'))

            self.stdout.write(
                self.style.SUCCESS(f'\nEmail testing completed for order {order.order_number}')
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error testing emails: {e}')
            )