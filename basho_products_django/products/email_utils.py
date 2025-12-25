# Email utilities for Basho Pottery
# Handles automated emails for custom orders

from django.core.mail import send_mail, EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from django.urls import reverse
from .models import CustomOrder


def send_order_confirmation_email(order):
    """
    Send order confirmation email to customer
    """
    subject = f'Order Confirmation - {order.order_number} - Basho Pottery'

    # Prepare context for template
    context = {
        'customer_name': order.name,
        'order_number': order.order_number,
        'project_type_display': order.get_project_type_display(),
        'budget_display': order.get_budget_display() if order.budget else None,
        'status_display': order.get_status_display(),
        'created_at': order.created_at,
        'company_name': getattr(settings, 'COMPANY_NAME', 'Basho Pottery'),
        'company_email': getattr(settings, 'COMPANY_EMAIL', 'orders@bashopottery.com'),
        'company_phone': getattr(settings, 'COMPANY_PHONE', '+91 XXXXX XXXXX'),
        'company_address': getattr(settings, 'COMPANY_ADDRESS', 'Clay Studio, Pottery Lane, Creative District'),
    }

    # Render HTML email
    html_message = render_to_string('emails/order_confirmation.html', context)

    # Send email
    try:
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.email],
        )
        email.content_subtype = 'html'
        email.send()

        print(f"✓ Order confirmation email sent to {order.email} for order {order.order_number}")
        return True
    except Exception as e:
        print(f"✗ Failed to send order confirmation email: {e}")
        return False


def send_order_status_update_email(order):
    """
    Send status update email to customer
    """
    subject = f'Order Update - {order.order_number} - Basho Pottery'

    # Prepare timeline based on current status
    timeline_steps = get_order_timeline(order)

    # Prepare next steps based on current status
    next_steps = get_next_steps(order)

    # Prepare context for template
    context = {
        'customer_name': order.name,
        'order_number': order.order_number,
        'project_type_display': order.get_project_type_display(),
        'budget_display': order.get_budget_display() if order.budget else None,
        'status_display': order.get_status_display(),
        'created_at': order.created_at,
        'timeline_steps': timeline_steps,
        'next_steps': next_steps,
        'company_name': getattr(settings, 'COMPANY_NAME', 'Basho Pottery'),
        'company_email': getattr(settings, 'COMPANY_EMAIL', 'orders@bashopottery.com'),
        'company_phone': getattr(settings, 'COMPANY_PHONE', '+91 XXXXX XXXXX'),
        'company_address': getattr(settings, 'COMPANY_ADDRESS', 'Clay Studio, Pottery Lane, Creative District'),
    }

    # Render HTML email
    html_message = render_to_string('emails/order_status_update.html', context)

    # Send email
    try:
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[order.email],
        )
        email.content_subtype = 'html'
        email.send()

        print(f"✓ Status update email sent to {order.email} for order {order.order_number}")
        return True
    except Exception as e:
        print(f"✗ Failed to send status update email: {e}")
        return False


def send_admin_new_order_notification(order):
    """
    Send notification email to admin when new order is received
    """
    subject = f'🆕 New Custom Order - {order.order_number}'

    # Prepare context for template
    context = {
        'order': order,
        'customer_name': order.name,
        'customer_email': order.email,
        'customer_phone': order.phone,
        'order_number': order.order_number,
        'project_type_display': order.get_project_type_display(),
        'budget_display': order.get_budget_display() if order.budget else None,
        'gst_number': order.gst_number,
        'description': order.description,
        'reference_images': order.reference_images if hasattr(order, 'reference_images') and order.reference_images else None,
        'created_at': order.created_at,
        'company_name': getattr(settings, 'COMPANY_NAME', 'Basho Pottery'),
        'company_email': getattr(settings, 'COMPANY_EMAIL', 'orders@bashopottery.com'),
        'company_phone': getattr(settings, 'COMPANY_PHONE', '+91 XXXXX XXXXX'),
        'company_address': getattr(settings, 'COMPANY_ADDRESS', 'Clay Studio, Pottery Lane, Creative District'),
    }

    # Render HTML email
    html_message = render_to_string('emails/admin_new_order.html', context)

    # Send email to admin (you can configure multiple admin emails)
    admin_emails = [settings.EMAIL_HOST_USER]  # Send to the configured email

    try:
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=admin_emails,
        )
        email.content_subtype = 'html'
        email.send()

        print(f"✓ Admin notification sent for new order {order.order_number}")
        return True
    except Exception as e:
        print(f"✗ Failed to send admin notification: {e}")
        return False


def get_order_timeline(order):
    """
    Generate timeline steps based on order status
    """
    status_order = ['pending', 'contacted', 'in_progress', 'completed', 'cancelled']
    current_index = status_order.index(order.status)

    timeline = [
        {
            'title': 'Order Received',
            'description': 'Your custom order has been received and is being reviewed',
            'status': 'completed',
            'date': order.created_at,
        },
        {
            'title': 'Design Consultation',
            'description': 'We contact you to discuss your vision and requirements',
            'status': 'completed' if current_index >= 1 else 'current' if current_index == 0 else 'pending',
            'date': None,
        },
        {
            'title': 'Design & Approval',
            'description': 'Creating design concepts and getting your approval',
            'status': 'completed' if current_index >= 2 else 'pending',
            'date': None,
        },
        {
            'title': 'Production',
            'description': 'Handcrafting your custom pottery piece',
            'status': 'completed' if current_index >= 3 else 'pending',
            'date': None,
        },
        {
            'title': 'Completion & Delivery',
            'description': 'Final quality check and secure delivery',
            'status': 'completed' if current_index >= 4 else 'pending',
            'date': None,
        },
    ]

    return timeline


def get_next_steps(order):
    """
    Get next steps based on current order status
    """
    if order.status == 'pending':
        return [
            {
                'title': 'Design Consultation',
                'description': 'We\'ll contact you within 24 hours to discuss your project in detail'
            }
        ]
    elif order.status == 'contacted':
        return [
            {
                'title': 'Design Concepts',
                'description': 'We\'ll prepare initial design concepts based on our discussion'
            },
            {
                'title': 'Your Feedback',
                'description': 'Review and provide feedback on the design concepts'
            }
        ]
    elif order.status == 'in_progress':
        return [
            {
                'title': 'Production Updates',
                'description': 'We\'ll keep you updated on the production progress'
            },
            {
                'title': 'Quality Check',
                'description': 'Final inspection before delivery'
            }
        ]
    elif order.status == 'completed':
        return [
            {
                'title': 'Delivery',
                'description': 'Your custom piece is ready for delivery'
            }
        ]

    return None