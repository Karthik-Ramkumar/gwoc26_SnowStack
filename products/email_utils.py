"""
Email utility functions for sending order-related emails
"""

from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from email.mime.image import MIMEImage
import os
import logging

logger = logging.getLogger(__name__)


def send_email_with_celery_fallback(task_func, *args, **kwargs):
    """
    Smart email sender - uses Celery if enabled, otherwise sends synchronously
    
    Args:
        task_func: The Celery task function to call
        *args, **kwargs: Arguments to pass to the task
        
    Returns:
        Result from task execution or None if failed
    """
    # Check if Celery is enabled
    celery_enabled = getattr(settings, 'CELERY_ENABLED', False)
    
    if celery_enabled:
        # Try async with Celery
        try:
            return task_func.delay(*args, **kwargs)
        except Exception as e:
            # If Celery fails (Redis not available), fall back to sync
            logger.warning(f"Celery failed ({e}), executing task synchronously")
            try:
                # Call the task function directly (sync)
                return task_func(*args, **kwargs)
            except Exception as sync_error:
                logger.error(f"Sync email also failed: {sync_error}")
                return None
    else:
        # Celery disabled - execute synchronously
        try:
            return task_func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Sync email failed: {e}")
            return None


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
        header_image_path = os.path.join(settings.BASE_DIR, 'static', 'images', 'email_header.jpg')
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


def send_corporate_inquiry_customer_email_sync(inquiry_number, company_name, contact_name, 
                                                email, service_type_display):
    """
    Send corporate inquiry confirmation email to customer (synchronous)
    Used as fallback when Celery is not available
    
    Args:
        inquiry_number: Inquiry number
        company_name: Company name
        contact_name: Contact person name
        email: Customer email
        service_type_display: Human-readable service type
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Context for template
        context = {
            'inquiry_number': inquiry_number,
            'company_name': company_name,
            'contact_name': contact_name,
            'service_type': service_type_display,
            'company_email': settings.COMPANY_EMAIL,
            'company_phone': settings.COMPANY_PHONE,
        }
        
        # Render HTML template
        html_content = render_to_string('emails/corporate_customer_confirmation.html', context)
        
        # Plain text fallback
        text_content = f'''
Dear {contact_name},

Thank you for your corporate inquiry at Basho By Shivangi!

Inquiry Number: {inquiry_number}
Company: {company_name}
Service Type: {service_type_display}

We have received your inquiry and will contact you within 24 hours to discuss your project in detail.

If you have any immediate questions, please contact us at:
Email: {settings.COMPANY_EMAIL}
Phone: {settings.COMPANY_PHONE}

With heartfelt appreciation,
BASHO BY SHIVANGI
        '''.strip()
        
        # Create email message
        subject = f'Thank You for Your Inquiry - {inquiry_number}'
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.COMPANY_EMAIL,
            to=[email]
        )
        msg.attach_alternative(html_content, "text/html")

        # Attach header image inline
        header_image_path = os.path.join(settings.BASE_DIR, 'static', 'images', 'email_header.jpg')
        if os.path.exists(header_image_path):
            with open(header_image_path, 'rb') as img_file:
                img = MIMEImage(img_file.read())
                img.add_header('Content-ID', '<header_image>')
                img.add_header('Content-Disposition', 'inline', filename='header.jpg')
                msg.attach(img)
        
        # Send email
        msg.send()
        
        logger.info(f"Corporate inquiry customer email sent successfully to {email} for {inquiry_number}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send corporate inquiry customer email for {inquiry_number}: {str(e)}")
        return False


def send_corporate_inquiry_admin_notification_sync(inquiry_id, inquiry_number, company_name, 
                                                    contact_name, email, phone, service_type_display,
                                                    team_size, budget_range, message):
    """
    Send corporate inquiry notification email to admin (synchronous)
    Used as fallback when Celery is not available
    
    Args:
        inquiry_id: CorporateInquiry database ID
        inquiry_number: Inquiry number
        company_name: Company name
        contact_name: Contact person name
        email: Customer email
        phone: Customer phone
        service_type_display: Human-readable service type
        team_size: Team size or participant count
        budget_range: Budget range
        message: Inquiry message
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        # Context for template
        context = {
            'inquiry_number': inquiry_number,
            'company_name': company_name,
            'contact_name': contact_name,
            'customer_email': email,
            'customer_phone': phone,
            'service_type': service_type_display,
            'team_size': team_size,
            'budget_range': budget_range,
            'message': message,
            'admin_url': f'http://127.0.0.1:8000/admin/products/corporateinquiry/{inquiry_id}/',
        }
        
        # Render HTML template
        html_content = render_to_string('emails/corporate_admin_notification.html', context)
        
        # Plain text fallback
        text_content = f'''
New Corporate Inquiry Received

Inquiry Number: {inquiry_number}
Company: {company_name}
Contact: {contact_name}
Email: {email}
Phone: {phone}
Service Type: {service_type_display}
Team Size: {team_size}
Budget Range: {budget_range}

Message:
{message}

Login to admin panel: http://127.0.0.1:8000/admin/products/corporateinquiry/{inquiry_id}/
        '''.strip()
        
        # Create email message
        subject = f'🏢 New Corporate Inquiry: {inquiry_number}'
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.COMPANY_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        msg.attach_alternative(html_content, "text/html")
        
        # Send email
        msg.send()
        
        logger.info(f"Corporate inquiry admin notification sent for {inquiry_number}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send corporate inquiry admin notification for {inquiry_number}: {str(e)}")
        return False
