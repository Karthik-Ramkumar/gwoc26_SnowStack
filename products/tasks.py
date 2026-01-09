"""
Celery tasks for the products app
Handles asynchronous operations like email sending
"""
from celery import shared_task
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_custom_order_admin_email(self, order_id, order_number, name, email, phone, 
                                   project_type_display, budget_display, description):
    """
    Send HTML email notification to admin about new custom order
    
    Args:
        order_id: CustomOrder database ID
        order_number: Order number
        name: Customer name
        email: Customer email
        phone: Customer phone
        project_type_display: Human-readable project type
        budget_display: Human-readable budget range
        description: Order description
    """
    try:
        # Context for template
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
        
        return f"Admin email sent successfully for order {order_number}"
        
    except Exception as exc:
        # Retry the task if it fails
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_order_confirmation_email(self, order_id):
    """
    Send order confirmation email to customer after successful payment
    
    Args:
        order_id: Order database ID
    """
    try:
        from .models import Order
        
        order = Order.objects.get(id=order_id)
        
        # Calculate total items
        total_items = sum(item.quantity for item in order.items.all())
        
        # Context for template
        context = {
            'customer_name': order.customer_name,
            'order_number': order.order_number,
            'order_date': order.created_at.strftime('%B %d, %Y'),
            'order_items': order.items.all(),
            'total_items': total_items,
            'subtotal': order.subtotal,
            'shipping': order.shipping_charge,
            'total_amount': order.total_amount,
            'shipping_address': f"{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}",
            'customer_phone': order.customer_phone,
            'customer_email': order.customer_email,
            'company_email': settings.COMPANY_EMAIL,
            'company_phone': settings.COMPANY_PHONE,
        }
        
        # Render HTML template
        try:
            html_content = render_to_string('emails/order_confirmation.html', context)
        except:
            # Fallback if template doesn't exist
            html_content = None
        
        # Plain text content
        items_text = '\n'.join([
            f"  - {item.product.name} x {item.quantity} @ ₹{item.product_price} = ₹{item.quantity * item.product_price}"
            for item in order.items.all()
        ])
        
        text_content = f'''
Dear {order.customer_name},

Thank you for your order at Basho By Shivangi!

Order Number: {order.order_number}
Order Date: {order.created_at.strftime('%B %d, %Y')}

Order Items:
{items_text}

Subtotal: ₹{order.subtotal}
Shipping: ₹{order.shipping_charge}
Total Amount: ₹{order.total_amount}

Shipping Address:
{order.shipping_address}
{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}

We will process your order and ship it within 3-5 business days.
You will receive a tracking number once your order is shipped.

If you have any questions, please contact us at:
Email: {settings.COMPANY_EMAIL}
Phone: {settings.COMPANY_PHONE}

Thank you for supporting handcrafted pottery!

With heartfelt appreciation,
BASHO BY SHIVANGI
        '''
        
        # Create email
        subject = f'Order Confirmation - {order.order_number}'
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.COMPANY_EMAIL,
            to=[order.customer_email]
        )
        
        if html_content:
            msg.attach_alternative(html_content, "text/html")
        
        msg.send(fail_silently=False)
        
        return f"Order confirmation email sent to {order.customer_email} for order {order.order_number}"
        
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_product_order_admin_notification(self, order_id):
    """
    Send order notification to admin after successful payment
    
    Args:
        order_id: Order database ID
    """
    try:
        from .models import Order
        
        order = Order.objects.get(id=order_id)
        
        # Calculate total items
        total_items = sum(item.quantity for item in order.items.all())
        
        # Context for template
        context = {
            'order_number': order.order_number,
            'customer_name': order.customer_name,
            'customer_email': order.customer_email,
            'customer_phone': order.customer_phone,
            'order_date': order.created_at.strftime('%B %d, %Y'),
            'order_items': order.items.all(),
            'total_items': total_items,
            'subtotal': order.subtotal,
            'shipping': order.shipping_charge,
            'total_amount': order.total_amount,
            'shipping_address': f"{order.shipping_address}, {order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}",
            'payment_status': 'Paid via Razorpay',
            'admin_url': f'http://127.0.0.1:8000/admin/products/order/{order_id}/',
        }
        
        # Render HTML template  
        try:
            html_content = render_to_string('emails/admin_order_notification.html', context)
        except:
            html_content = None
        
        # Plain text content
        items_text = '\n'.join([
            f"  - {item.product.name} x {item.quantity} @ ₹{item.product_price} = ₹{item.quantity * item.product_price}"
            for item in order.items.all()
        ])
        
        text_content = f'''
New Product Order Received

Order Number: {order.order_number}
Order Date: {order.created_at.strftime('%B %d, %Y')}

Customer Details:
Name: {order.customer_name}
Email: {order.customer_email}
Phone: {order.customer_phone}

Order Items ({total_items} items):
{items_text}

Subtotal: ₹{order.subtotal}
Shipping: ₹{order.shipping_charge}
Total Amount: ₹{order.total_amount}

Shipping Address:
{order.shipping_address}
{order.shipping_city}, {order.shipping_state} - {order.shipping_pincode}

Payment Status: Paid via Razorpay

View in admin panel: http://127.0.0.1:8000/admin/products/order/{order_id}/
        '''
        
        # Create email
        subject = f'🛒 New Order Received: {order.order_number}'
        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.COMPANY_EMAIL,
            to=[settings.COMPANY_EMAIL]
        )
        
        if html_content:
            msg.attach_alternative(html_content, "text/html")
        
        msg.send(fail_silently=False)
        
        return f"Admin notification sent for order {order.order_number}"
        
    except Exception as exc:
        raise self.retry(exc=exc)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_custom_order_customer_email(self, order_number, name, email, project_type_display):
    """
    Send HTML confirmation email to customer about their custom order
    
    Args:
        order_number: Order number
        name: Customer name
        email: Customer email
        project_type_display: Human-readable project type
    """
    try:
        # Context for template
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
        import os
        from email.mime.image import MIMEImage
        
        image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
        if os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                img = MIMEImage(f.read())
                img.add_header('Content-ID', '<header_image>')
                img.add_header('Content-Disposition', 'inline', filename='header.jpg')
                msg.attach(img)
        
        msg.send(fail_silently=False)
        
        return f"Customer email sent successfully to {email} for order {order_number}"
        
    except Exception as exc:
        # Retry the task if it fails
        raise self.retry(exc=exc)

