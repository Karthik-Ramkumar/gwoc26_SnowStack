"""
Email utility functions for sending order-related emails
With automatic Celery fallback support
"""

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from email.mime.image import MIMEImage
import os
import logging

logger = logging.getLogger(__name__)


def _send_custom_order_admin_email_sync(order_id, order_number, name, email, phone,
                                         project_type_display, budget_display, description):
    """
    Send admin notification email synchronously (without Celery)
    """
    context = {
        'order_number': order_number,
        'customer_name': name,
        'customer_email': email,
        'customer_phone': phone,
        'project_type': project_type_display,
        'budget': budget_display if budget_display else 'Not specified',
        'description': description,
        'admin_url': f'http://127.0.0.1:8000/admin/products/customorder/{order_id}/',
    }
    
    # Render HTML template
    html_content = render_to_string('emails/admin_notification.html', context)
    
    # Plain text fallback
    text_content = f'''
New Custom Order Received

Order Number: {order_number}
Customer: {name}
Email: {email}
Phone: {phone}
Project Type: {project_type_display}
Budget: {budget_display if budget_display else 'Not specified'}

Description:
{description}

Login to admin panel: http://127.0.0.1:8000/admin/products/customorder/{order_id}/
    '''
    
    # Create email
    subject = f'🔔 New Custom Order: {order_number}'
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.COMPANY_EMAIL,
        to=[settings.COMPANY_EMAIL]
    )
    msg.attach_alternative(html_content, "text/html")
    msg.send(fail_silently=False)
    
    logger.info(f"Admin email sent synchronously for order {order_number}")


def _send_custom_order_customer_email_sync(order_number, name, email, project_type_display):
    """
    Send customer confirmation email synchronously (without Celery)
    """
    context = {
        'customer_name': name,
        'order_number': order_number,
        'project_type': project_type_display,
        'company_email': settings.COMPANY_EMAIL,
        'company_phone': settings.COMPANY_PHONE,
    }
    
    # Render HTML template
    html_content = render_to_string('emails/customer_confirmation.html', context)
    
    # Plain text fallback
    text_content = f'''
Dear {name},

Thank you for your custom order request at Basho By Shivangi!

Order Number: {order_number}
Project Type: {project_type_display}

We have received your request and will contact you within 24 hours to discuss your project in detail.

If you have any immediate questions, please contact us at:
Email: {settings.COMPANY_EMAIL}
Phone: {settings.COMPANY_PHONE}

With heartfelt appreciation,
BASHO BY SHIVANGI
    '''
    
    # Create email
    subject = f'Thank You for Your Order - {order_number}'
    msg = EmailMultiAlternatives(
        subject=subject,
        body=text_content,
        from_email=settings.COMPANY_EMAIL,
        to=[email]
    )
    msg.attach_alternative(html_content, "text/html")

    # Attach image with Content-ID
    image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
    if os.path.exists(image_path):
        with open(image_path, 'rb') as f:
            img = MIMEImage(f.read())
            img.add_header('Content-ID', '<header_image>')
            img.add_header('Content-Disposition', 'inline', filename='header.jpg')
            msg.attach(img)
    
    msg.send(fail_silently=False)
    
    logger.info(f"Customer email sent synchronously to {email} for order {order_number}")


def is_celery_available():
    """
    Check if Celery worker is available and can actually process tasks
    
    This checks both:
    1. If Celery workers are active
    2. If the broker (Redis) is accessible
    
    Returns:
        bool: True if Celery is fully functional, False otherwise
    """
    try:
        from basho_project.celery import app
        
        # Try to ping the broker (Redis) first
        try:
            app.broker_connection().ensure_connection(max_retries=1, timeout=2)
        except Exception as broker_error:
            logger.warning(f"Celery broker not accessible: {broker_error}")
            return False
        
        # Then check if workers are active
        inspector = app.control.inspect(timeout=2)
        active_workers = inspector.active()
        
        if active_workers is not None and len(active_workers) > 0:
            logger.debug(f"Celery is available with {len(active_workers)} worker(s)")
            return True
        else:
            logger.debug("No active Celery workers found")
            return False
            
    except Exception as e:
        logger.debug(f"Celery availability check failed: {e}")
        return False


def send_custom_order_emails_with_fallback(order_id, order_number, name, email, phone, 
                                           project_type_display, budget_display, description):
    """
    Send custom order emails with Celery fallback
    
    Tries to send via Celery async tasks first. If Celery is not available,
    sends emails synchronously.
    
    Returns:
        bool: True if emails sent/queued successfully, False otherwise
    """
    try:
        from .tasks import send_custom_order_admin_email, send_custom_order_customer_email
        
        # Check if Celery worker is available
        if is_celery_available():
            # Send via Celery (async)
            send_custom_order_admin_email.delay(
                order_id=order_id,
                order_number=order_number,
                name=name,
                email=email,
                phone=phone,
                project_type_display=project_type_display,
                budget_display=budget_display,
                description=description
            )
            send_custom_order_customer_email.delay(
                order_number=order_number,
                name=name,
                email=email,
                project_type_display=project_type_display
            )
            logger.info(f"Custom order emails queued via Celery for order {order_number}")
        else:
            # Fallback to synchronous sending
            logger.warning("Celery worker not available, sending emails synchronously")
            
            # Send admin email directly
            try:
                _send_custom_order_admin_email_sync(
                    order_id, order_number, name, email, phone,
                    project_type_display, budget_display, description
                )
            except Exception as e:
                logger.error(f"Failed to send admin email: {str(e)}")
            
            # Send customer email directly
            try:
                _send_custom_order_customer_email_sync(
                    order_number, name, email, project_type_display
                )
            except Exception as e:
                logger.error(f"Failed to send customer email: {str(e)}")
                
            logger.info(f"Custom order emails sent synchronously for order {order_number}")
            
        return True
            
    except Exception as e:
        logger.error(f"Failed to send custom order emails: {str(e)}")
        return False


def send_product_order_emails_with_fallback(order_id):
    """
    Send product order confirmation emails with Celery fallback
    
    Returns:
        dict: Status information about emails sent
    """
    email_sent = False
    admin_email_sent = False
    
    try:
        from .tasks import send_product_order_confirmation_email, send_product_order_admin_notification
        
        if is_celery_available():
            # Send via Celery (async)
            send_product_order_confirmation_email.delay(order_id)
            email_sent = True
            send_product_order_admin_notification.delay(order_id)
            admin_email_sent = True
            logger.info(f"Product order emails queued via Celery for order ID {order_id}")
        else:
            # Fallback to synchronous sending
            logger.warning("Celery worker not available, sending emails synchronously")
            
            from .models import Order
            try:
                order = Order.objects.get(id=order_id)
                
                # Send customer email
                if send_order_confirmation_email(order):
                    email_sent = True
                
                # Send admin email
                if send_admin_order_notification(order):
                    admin_email_sent = True
                    
                logger.info(f"Product order emails processed synchronously for order ID {order_id}")
                
            except Order.DoesNotExist:
                logger.error(f"Order {order_id} not found during email sync fallback")
            except Exception as e:
                logger.error(f"Error in sync email sending: {str(e)}")
            
    except Exception as e:
        logger.error(f"Failed to send product order emails: {str(e)}")
        
    return {'email_queued': email_sent, 'admin_notified': admin_email_sent}


def send_workshop_registration_emails_with_fallback(registration_id):
    """
    Send workshop registration emails with Celery fallback
    
    Returns:
        dict: Status information about emails sent
    """
    email_queued = False
    admin_email_queued = False
    
    try:
        from .tasks import send_workshop_confirmation_email, send_workshop_admin_notification
        
        if is_celery_available():
            # Send via Celery (async)
            send_workshop_confirmation_email.delay(registration_id)
            email_queued = True
            send_workshop_admin_notification.delay(registration_id)
            admin_email_queued = True
            logger.info(f"Workshop emails queued via Celery for registration ID {registration_id}")
        else:
            # Fallback to synchronous sending
            logger.warning("Celery worker not available, sending emails synchronously")
            
            from workshops.models import WorkshopRegistration
            try:
                registration = WorkshopRegistration.objects.get(id=registration_id)
                
                # Send customer email
                if _send_workshop_confirmation_email_sync(registration):
                    email_queued = True
                
                # Send admin email
                if _send_workshop_admin_notification_sync(registration):
                    admin_email_queued = True
                    
                logger.info(f"Workshop emails sent synchronously for registration ID {registration_id}")
                
            except WorkshopRegistration.DoesNotExist:
                logger.error(f"Workshop registration {registration_id} not found during email sync fallback")
            except Exception as e:
                logger.error(f"Error in sync workshop email sending: {str(e)}")
            
    except Exception as e:
        logger.error(f"Failed to send workshop registration emails: {str(e)}")
        
    return {'email_queued': email_queued, 'admin_notified': admin_email_queued}


def send_order_confirmation_email(order):
    """
    Send order confirmation email to customer after successful payment
    
    Args:
        order: Order model instance
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Prepare context data for email template
        context = {
            'customer_name': order.customer_name,
            'order_number': order.order_number,
            'order_date': order.created_at.strftime('%B %d, %Y at %I:%M %p'),
            'payment_method': order.get_payment_method_display(),
            'subtotal': f"{order.subtotal:,.2f}",
            'shipping_charge': f"{order.shipping_charge:,.2f}",
            'tax_amount': f"{order.tax_amount:,.2f}",
            'discount_amount': f"{order.discount_amount:,.2f}",
            'total_amount': f"{order.total_amount:,.2f}",
            'shipping_address': order.shipping_address,
            'shipping_city': order.shipping_city,
            'shipping_state': order.shipping_state,
            'shipping_pincode': order.shipping_pincode,
            'customer_phone': order.customer_phone,
            'company_email': settings.COMPANY_EMAIL,
            'company_phone': settings.COMPANY_PHONE,
            'order_items': [],
        }
        
        # Add order items to context
        for item in order.items.all():
            context['order_items'].append({
                'product_name': item.product_name,
                'quantity': item.quantity,
                'product_price': f"{item.product_price:,.2f}",
                'total_price': f"{item.get_total_price():,.2f}",
            })
        
        # Render HTML email template
        html_content = render_to_string('emails/order_confirmation.html', context)
        
        # Create plain text version (fallback)
        text_content = f"""
Dear {order.customer_name},

Thank you for your order!

Order Number: {order.order_number}
Order Date: {context['order_date']}
Payment Status: Paid
Total Amount: ₹{context['total_amount']}

We'll process your order and send you tracking details soon.

Thank you for supporting Basho By Shivangi!

Best regards,
Basho By Shivangi Team
        """.strip()
        
        # Create email message
        subject = f"Order Confirmation #{order.order_number} - Basho By Shivangi"
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = order.customer_email
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=from_email,
            to=[to_email]
        )
        
        # Attach HTML version
        msg.attach_alternative(html_content, "text/html")
        
        # Attach header image inline
        header_image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
        if os.path.exists(header_image_path):
            with open(header_image_path, 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<header_image>')
                img.add_header('Content-Disposition', 'inline', filename='header.jpg')
                msg.attach(img)
        
        # Send email
        msg.send()
        
        logger.info(f"Order confirmation email sent successfully to {to_email} for order {order.order_number}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send order confirmation email for order {order.order_number}: {str(e)}")
        return False


def send_admin_order_notification(order):
    """
    Send notification email to admin when new order is placed
    
    Args:
        order: Order model instance
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Prepare email content
        subject = f"New Order Received - {order.order_number}"
        
        text_content = f"""
New order received!

Order Number: {order.order_number}
Customer: {order.customer_name}
Email: {order.customer_email}
Phone: {order.customer_phone}
Total Amount: ₹{order.total_amount:,.2f}
Payment Status: {'Paid' if order.payment_status else 'Pending'}

Items:
"""
        
        for item in order.items.all():
            text_content += f"- {item.product_name} x {item.quantity} = ₹{item.get_total_price():,.2f}\n"
        
        text_content += f"""
Shipping Address:
{order.shipping_address}
{order.shipping_city}, {order.shipping_state} {order.shipping_pincode}

Please process this order in the admin panel.
        """.strip()
        
        # Create and send email
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        
        msg.send()
        
        logger.info(f"Admin notification email sent for order {order.order_number}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send admin notification for order {order.order_number}: {str(e)}")
        return False


def _send_workshop_confirmation_email_sync(registration):
    """
    Send workshop confirmation email synchronously
    """
    try:
        # Prepare context data
        context = {
            'customer_name': registration.full_name,
            'registration_number': registration.registration_number,
            'workshop_name': registration.workshop.name,
            'workshop_type': registration.workshop.get_workshop_type_display(),
            'difficulty_level': registration.workshop.get_difficulty_level_display(),
            'duration': registration.workshop.duration_hours,
            'number_of_participants': registration.number_of_participants,
            'total_amount': f"{registration.total_amount:,.2f}",
            'status': registration.get_status_display(),
            'special_requests': registration.special_requests,
            'company_email': settings.COMPANY_EMAIL,
            'company_phone': settings.COMPANY_PHONE,
        }
        
        if registration.slot:
            context['slot_date'] = registration.slot.date.strftime('%B %d, %Y')
            context['slot_time'] = f"{registration.slot.start_time.strftime('%I:%M %p')} - {registration.slot.end_time.strftime('%I:%M %p')}"
        
        # Render HTML
        html_content = render_to_string('emails/workshop_confirmation.html', context)
        
        # Plain text
        text_content = f"""
Dear {registration.full_name},

Thank you for registering for our pottery workshop!

Registration Number: {registration.registration_number}
Workshop: {registration.workshop.name}
Participants: {registration.number_of_participants}
Total Amount: ₹{registration.total_amount:,.2f}

We're excited to have you join us for a creative and enriching experience.

If you have any questions, please contact us:
Email: {settings.COMPANY_EMAIL}
Phone: {settings.COMPANY_PHONE}

See you soon!
Team Basho By Shivangi
        """.strip()
        
        # Send email
        subject = f"Workshop Registration Confirmed - {registration.registration_number}"
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[registration.email]
        )
        msg.attach_alternative(html_content, "text/html")
        
        # Attach image
        header_image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
        if os.path.exists(header_image_path):
            with open(header_image_path, 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<header_image>')
                img.add_header('Content-Disposition', 'inline', filename='header.jpg')
                msg.attach(img)
                
        msg.send(fail_silently=False)
        return True
    
    except Exception as e:
        logger.error(f"Failed to send workshop confirmation sync: {str(e)}")
        return False


def _send_workshop_admin_notification_sync(registration):
    """
    Send workshop admin notification synchronously
    """
    try:
        subject = f"New Workshop Registration - {registration.registration_number}"
        
        text_content = f"""
New workshop registration received!

Registration Number: {registration.registration_number}
Workshop: {registration.workshop.name}
Customer: {registration.full_name}
Email: {registration.email}
Phone: {registration.phone}
Participants: {registration.number_of_participants}
Total Amount: ₹{registration.total_amount:,.2f}
Status: {registration.get_status_display()}
"""
        
        if registration.slot:
            text_content += f"""
Scheduled Slot:
Date: {registration.slot.date.strftime('%B %d, %Y')}
Time: {registration.slot.start_time.strftime('%I:%M %p')} - {registration.slot.end_time.strftime('%I:%M %p')}
"""
        
        if registration.special_requests:
            text_content += f"""
Special Requests:
{registration.special_requests}
"""
        
        text_content += f"""
View in admin: http://127.0.0.1:8000/admin/workshops/workshopregistration/{registration.id}/

Please confirm the registration and prepare for the workshop.
        """.strip()
        
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        
        msg.send(fail_silently=False)
        return True
        
    except Exception as e:
        logger.error(f"Failed to send workshop admin notification sync: {str(e)}")
        return False
