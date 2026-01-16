# Basho Products Page - Django Views (REST API)
#
# REST API views for React frontend
# Your friend needs to complete these view functions

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from .models import Product, CustomOrder, Order, OrderItem
from .serializers import ProductSerializer, CustomOrderSerializer, OrderSerializer


# ====================
# PRODUCTS API VIEWSET
# Purpose: REST API for products (GET, POST, PUT, DELETE)
# URLs: /api/products/ and /api/products/{id}/
# ====================
class ProductViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for Product model
    Provides: list, retrieve, create, update, delete
    
    TODO for your friend:
    1. Add custom filtering (by category, price range, tags)
    2. Add search functionality
    3. Add pagination customization
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'product_id'
    
    def get_queryset(self):
        """
        Filter products based on query parameters
        """
        queryset = Product.objects.filter(in_stock=True)
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category and category != 'all':
            queryset = queryset.filter(category=category)
        
        # Filter by featured
        featured = self.request.query_params.get('featured', None)
        if featured:
            queryset = queryset.filter(is_featured=True)
        
        # Search by name or description
        search = self.request.query_params.get('search', None)
        if search:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
        
        # Sort
        sort = self.request.query_params.get('sort', 'featured')
        if sort == 'price-low':
            queryset = queryset.order_by('price')
        elif sort == 'price-high':
            queryset = queryset.order_by('-price')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')
        else:  # featured
            queryset = queryset.order_by('-is_featured', '-created_at')
        
        return queryset


# ====================
# CUSTOM ORDER API VIEWSET
# Purpose: Handle custom order submissions
# URL: /api/custom-orders/
# ====================
class CustomOrderViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for CustomOrder model
    
    TODO for your friend:
    1. Send email notification when order created
    2. Send confirmation email to customer
    3. Add file upload handling for reference images
    """
    queryset = CustomOrder.objects.all()
    serializer_class = CustomOrderSerializer
    permission_classes = [AllowAny]  # Allow unauthenticated users to submit custom orders
    http_method_names = ['get', 'post', 'head', 'options']  # Only allow GET and POST
    
    def create(self, request, *args, **kwargs):
        """
        Create new custom order and send email notifications
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_order = serializer.save()
        
        # Send emails synchronously
        try:
            import logging
            from django.core.mail import EmailMultiAlternatives
            from django.template.loader import render_to_string
            from django.conf import settings
            
            logger = logging.getLogger(__name__)
            logger.info(f"Sending emails for custom order {custom_order.order_number}")
            
            # Send customer confirmation email
            try:
                import os
                from email.mime.image import MIMEImage
                
                context = {
                    'customer_name': custom_order.name,
                    'order_number': custom_order.order_number,
                    'project_type': custom_order.get_project_type_display(),
                    'company_email': settings.COMPANY_EMAIL,
                    'company_phone': settings.COMPANY_PHONE,
                }
                html_content = render_to_string('emails/customer_confirmation.html', context)
                text_content = f'Thank you for your custom order {custom_order.order_number}'
                
                msg = EmailMultiAlternatives(
                    subject=f'Thank You for Your Order - {custom_order.order_number}',
                    body=text_content,
                    from_email=settings.COMPANY_EMAIL,
                    to=[custom_order.email]
                )
                msg.attach_alternative(html_content, "text/html")
                
                # Attach header image
                header_image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
                if os.path.exists(header_image_path):
                    with open(header_image_path, 'rb') as img_file:
                        img = MIMEImage(img_file.read())
                        img.add_header('Content-ID', '<header_image>')
                        img.add_header('Content-Disposition', 'inline', filename='email_header.jpg')
                        msg.attach(img)
                
                msg.send(fail_silently=False)
                logger.info(f"✓ Customer email sent to {custom_order.email}")
                print(f"✓ Customer email sent to {custom_order.email}")
            except Exception as customer_email_error:
                logger.error(f"Failed to send customer email: {str(customer_email_error)}", exc_info=True)
                print(f"✗ Customer email failed: {str(customer_email_error)}")
            
            # Send admin notification email
            try:
                import os
                from email.mime.image import MIMEImage
                
                admin_context = {
                    'order_number': custom_order.order_number,
                    'customer_name': custom_order.name,
                    'customer_email': custom_order.email,
                    'customer_phone': custom_order.phone,
                    'project_type': custom_order.get_project_type_display(),
                    'budget': custom_order.get_budget_display() if custom_order.budget else 'Not specified',
                    'description': custom_order.description,
                    'admin_url': f'http://127.0.0.1:8000/admin/products/customorder/{custom_order.id}/',
                }
                admin_html = render_to_string('emails/admin_notification.html', admin_context)
                admin_msg = EmailMultiAlternatives(
                    subject=f'🔔 New Custom Order: {custom_order.order_number}',
                    body=f'New custom order received: {custom_order.order_number}',
                    from_email=settings.COMPANY_EMAIL,
                    to=[settings.COMPANY_EMAIL]
                )
                admin_msg.attach_alternative(admin_html, "text/html")
                
                # Attach header image
                header_image_path = os.path.join(settings.BASE_DIR, 'email_header.jpg')
                if os.path.exists(header_image_path):
                    with open(header_image_path, 'rb') as img_file:
                        img = MIMEImage(img_file.read())
                        img.add_header('Content-ID', '<header_image>')
                        img.add_header('Content-Disposition', 'inline', filename='email_header.jpg')
                        admin_msg.attach(img)
                
                admin_msg.send(fail_silently=False)
                logger.info(f"✓ Admin email sent")
                print(f"✓ Admin email sent")
            except Exception as admin_email_error:
                logger.error(f"Failed to send admin email: {str(admin_email_error)}", exc_info=True)
                print(f"✗ Admin email failed: {str(admin_email_error)}")
                
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Email sending error: {str(e)}", exc_info=True)
            print(f"✗ Email error: {str(e)}")
        
        return Response({
            'success': True,
            'order_number': custom_order.order_number,
            'message': 'Custom order request received. We will contact you within 24 hours.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


# ====================
# ORDER API VIEWSET
# Purpose: Handle product orders (checkout)
# URL: /api/orders/
# ====================
class OrderViewSet(viewsets.ModelViewSet):
    """
    API ViewSet for Order model
    Handles product orders from checkout
    """
    serializer_class = OrderSerializer
    
    def get_queryset(self):
        """
        Filter orders based on query parameters
        """
        queryset = Order.objects.all().prefetch_related('items', 'items__product')
        
        # Filter by firebase_uid (matching Django username)
        firebase_uid = self.request.query_params.get('firebase_uid', None)
        if firebase_uid:
            from django.contrib.auth.models import User
            try:
                user = User.objects.get(username=firebase_uid)
                queryset = queryset.filter(user=user)
            except User.DoesNotExist:
                # If user doesn't exist in Django, return no orders
                return Order.objects.none()
        
        return queryset

    def create(self, request, *args, **kwargs):
        """
        Create new order from checkout
        Links to user if firebase_uid provided, otherwise guest checkout
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # TODO: Send email notifications
        # TODO: Integrate with payment gateway
        
        return Response({
            'success': True,
            'order_number': order.order_number,
            'message': 'Order placed successfully!',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)


# ====================
# SHIPPING CALCULATOR API
# Purpose: Calculate shipping cost
# URL: /api/calculate-shipping/
# Method: POST
# ====================
@api_view(['POST'])
def calculate_shipping(request):
    """
    Calculate shipping cost based on weight
    
    Request body: {"weight": 2.5}
    Response: {"weight": 2.5, "shippingCost": 125, "ratePerKg": 50}
    
    TODO for your friend:
    1. Add region-based rates
    2. Add express shipping option
    3. Integrate with shipping provider API
    """
    try:
        weight_kg = float(request.data.get('weight', 0))
        
        if weight_kg <= 0:
            return Response({
                'error': 'Weight must be greater than 0'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Shipping calculation
        rate_per_kg = 50
        shipping_cost = weight_kg * rate_per_kg
        
        # Minimum shipping charge
        if shipping_cost < 100:
            shipping_cost = 100
        
        return Response({
            'weight': weight_kg,
            'shippingCost': shipping_cost,
            'ratePerKg': rate_per_kg
        })
        
    except (ValueError, TypeError):
        return Response({
            'error': 'Invalid weight value'
        }, status=status.HTTP_400_BAD_REQUEST)


# ====================
# CREATE USER API
# Purpose: Create Django user from Firebase authentication
# URL: /api/create-user/
# Method: POST
# ====================
@api_view(['POST'])
@permission_classes([AllowAny])
def create_user(request):
    """
    Create or update Django user from Firebase authentication
    
    Request body: {
        "username": "firebase_uid",
        "email": "user@example.com",
        "first_name": "John",
        "last_name": "Doe"
    }
    """
    try:
        username = request.data.get('username')  # Firebase UID
        email = request.data.get('email')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        
        if not username or not email:
            return Response({
                'error': 'Username and email are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create or update user
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                'email': email,
                'first_name': first_name,
                'last_name': last_name
            }
        )
        
        # Update if user already exists
        if not created:
            user.email = email
            user.first_name = first_name
            user.last_name = last_name
            user.save()
        
        return Response({
            'success': True,
            'created': created,
            'message': 'User created' if created else 'User updated',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name
            }
        }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ====================
# RAZORPAY PAYMENT INTEGRATION
# ====================

@api_view(['POST'])
@permission_classes([AllowAny])
def create_razorpay_order(request):
    """
    Create Razorpay order for payment (Updated with improved validation)
    
    Request body: {
        "amount": 5000,  // Amount in rupees
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_phone": "9876543210"
    }
    
    Response: {
        "success": true,
        "orderId": "order_xyz123",
        "amount": 500000,  // Amount in paise
        "currency": "INR",
        "key": "rzp_test_xxxxx"
    }
    """
    try:
        import razorpay
        from django.conf import settings
        import logging
        
        logger = logging.getLogger(__name__)
        logger.info(f"Razorpay order creation request received: {request.data}")
        
        # Validate required fields
        amount = request.data.get('amount')
        customer_name = request.data.get('customer_name', '')
        customer_email = request.data.get('customer_email', '')
        customer_phone = request.data.get('customer_phone', '')
        
        if not amount:
            logger.error("Missing amount in request")
            return Response({
                'error': 'Missing required field: amount'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Convert to float and validate
        try:
            amount_rupees = float(amount)
        except (ValueError, TypeError):
            logger.error(f"Invalid amount format: {amount}")
            return Response({
                'error': 'Invalid amount format'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if amount_rupees <= 0:
            logger.error(f"Amount must be positive: {amount_rupees}")
            return Response({
                'error': 'Amount must be greater than 0'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Convert to paise using round() to avoid floating point issues
        amount_paise = round(amount_rupees * 100)
        
        logger.info(f"Amount: ₹{amount_rupees} = {amount_paise} paise")
        
        # Initialize Razorpay client
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        client.set_app_details({"title": "Basho", "version": "1.0"})
        
        # Create receipt ID
        import uuid
        receipt_id = f"ORDER_{str(uuid.uuid4())[:10].upper()}"
        
        # Create Razorpay order with all required parameters
        order_data = {
            'amount': amount_paise,
            'currency': 'INR',
            'receipt': receipt_id,
            'payment_capture': 1,  # Auto capture payment
            'notes': {
                'customer_name': customer_name,
                'customer_email': customer_email,
                'customer_phone': customer_phone
            }
        }
        
        logger.info(f"Creating Razorpay order with data: {order_data}")
        razorpay_order = client.order.create(data=order_data)
        logger.info(f"Razorpay order created successfully: {razorpay_order['id']}")
        
        return Response({
            'success': True,
            'orderId': razorpay_order['id'],
            'amount': razorpay_order['amount'],
            'currency': razorpay_order['currency'],
            'key': settings.RAZORPAY_KEY_ID
        }, status=status.HTTP_201_CREATED)
        
    except razorpay.errors.BadRequestError as e:
        logger.error(f"Razorpay Bad Request Error: {str(e)}")
        error_message = 'Invalid request to payment gateway'
        if settings.DEBUG:
            error_message += f': {str(e)}'
        return Response({
            'error': error_message
        }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Razorpay order creation error: {str(e)}", exc_info=True)
        error_message = 'Failed to create payment order. Please try again.'
        if settings.DEBUG:
            error_message += f' Error: {str(e)}'
        return Response({
            'error': error_message
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@permission_classes([AllowAny])
def calculate_shipping(request):
    """
    Calculate shipping cost based on cart items
    
    Request body: {
        "items": [
            {"product_id": 1, "quantity": 2},
            {"product_id": 2, "quantity": 1}
        ],
        "subtotal": 1500.00
    }
    
    Returns: {
        "shipping_charge": 150.00,
        "total_weight_kg": 3.5,
        "rate_per_kg": 50.00,
        "minimum_charge": 100.00,
        "free_shipping_threshold": 5000.00,
        "is_free_shipping": false
    }
    """
    try:
        from .models import ShippingConfig, Product
        from decimal import Decimal
        
        items = request.data.get('items', [])
        subtotal = Decimal(str(request.data.get('subtotal', 0)))
        
        # Calculate total weight
        total_weight = Decimal('0.0')
        for item in items:
            try:
                product = Product.objects.get(id=item['product_id'])
                quantity = int(item.get('quantity', 1))
                if product.weight:
                    total_weight += product.weight * quantity
            except Product.DoesNotExist:
                continue
        
        # Default to 1kg if no weight specified
        if total_weight == 0:
            total_weight = Decimal('1.0')
        
        # Get shipping configuration and calculate
        config = ShippingConfig.load()
        shipping_charge = config.calculate_shipping(total_weight, subtotal)
        
        is_free = shipping_charge == 0 and config.free_shipping_threshold > 0
        
        return Response({
            'shipping_charge': float(shipping_charge),
            'total_weight_kg': float(total_weight),
            'rate_per_kg': float(config.rate_per_kg),
            'minimum_charge': float(config.minimum_charge),
            'free_shipping_threshold': float(config.free_shipping_threshold),
            'is_free_shipping': is_free,
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({
            'error': f'Failed to calculate shipping: {str(e)}'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_payment(request):
    """
    Verify Razorpay payment signature
    
    Request body: {
        "razorpay_order_id": "order_xyz123",
        "razorpay_payment_id": "pay_abc456",
        "razorpay_signature": "signature_hash",
        "order_data": {
            // All order fields for creating Order in database
        }
    }
    """
    try:
        import razorpay
        from django.conf import settings
        import logging
        
        logger = logging.getLogger(__name__)
        
        # Initialize Razorpay client
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
        
        # Get payment details
        razorpay_order_id = request.data.get('razorpay_order_id')
        razorpay_payment_id = request.data.get('razorpay_payment_id')
        razorpay_signature = request.data.get('razorpay_signature')
        
        if not all([razorpay_order_id, razorpay_payment_id, razorpay_signature]):
            return Response({
                'error': 'Missing payment verification parameters'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify payment signature
        params_dict = {
            'razorpay_order_id': razorpay_order_id,
            'razorpay_payment_id': razorpay_payment_id,
            'razorpay_signature': razorpay_signature
        }
        
        try:
            client.utility.verify_payment_signature(params_dict)
            payment_verified = True
        except razorpay.errors.SignatureVerificationError:
            payment_verified = False
            return Response({
                'success': False,
                'error': 'Payment verification failed'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # If payment verified, create order in database
        if payment_verified:
            from django.db import transaction
            
            order_data = request.data.get('order_data', {})
            
            # Calculate shipping based on configuration
            from .models import ShippingConfig
            from decimal import Decimal
            
            shipping_config = ShippingConfig.load()
            
            # Calculate total weight from items
            total_weight = Decimal('0.0')
            for item_data in order_data.get('items', []):
                try:
                    from .models import Product
                    product = Product.objects.get(id=item_data['product'])
                    quantity = item_data.get('quantity', 1)
                    if product.weight:
                        total_weight += product.weight * quantity
                except:
                    pass
            
            # Default to 1kg if no weight specified
            if total_weight == 0:
                total_weight = Decimal('1.0')
            
            # Calculate shipping
            subtotal = Decimal(str(order_data.get('subtotal', 0)))
            shipping_charge = shipping_config.calculate_shipping(total_weight, subtotal)
            
            # Update order data with payment info and calculated shipping
            order_data['payment_method'] = 'razorpay'
            order_data['payment_status'] = True
            order_data['shipping_charge'] = shipping_charge
            
            # Create order within transaction
            from .serializers import OrderSerializer
            serializer = OrderSerializer(data=order_data)
            
            if serializer.is_valid():
                with transaction.atomic():
                    order = serializer.save()
                    
                    # Store payment details in order notes
                    order.internal_notes = f"Razorpay Payment\nOrder ID: {razorpay_order_id}\nPayment ID: {razorpay_payment_id}"
                    order.save()
                
                logger.info(f"Order {order.order_number} created successfully for payment {razorpay_payment_id}")
                
                # Send email confirmations asynchronously using Celery
                email_sent = False
                admin_email_sent = False
                
                try:
                    from .tasks import send_product_order_confirmation_email, send_product_order_admin_notification
                    
                    # Queue customer confirmation email (non-blocking)
                    try:
                        send_product_order_confirmation_email.delay(order.id)
                        email_sent = True
                        logger.info(f"Customer confirmation email queued for order {order.order_number}")
                    except Exception as email_error:
                        logger.error(f"Error queueing customer email for order {order.order_number}: {str(email_error)}")
                    
                    # Queue admin notification email (non-blocking)
                    try:
                        send_product_order_admin_notification.delay(order.id)
                        admin_email_sent = True
                        logger.info(f"Admin notification email queued for order {order.order_number}")
                    except Exception as email_error:
                        logger.error(f"Error queueing admin email for order {order.order_number}: {str(email_error)}")
                        
                except ImportError as import_error:
                    logger.warning(f"Celery tasks not available: {str(import_error)}. Emails will not be sent.")
                
                return Response({
                    'success': True,
                    'message': 'Payment verified and order created successfully',
                    'order_number': order.order_number,
                    'order_id': order.id,
                    'payment_id': razorpay_payment_id,
                    'email_queued': email_sent,
                    'admin_notified': admin_email_sent
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({
                    'success': False,
                    'error': 'Failed to create order',
                    'details': serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        logger.error(f"Payment verification error: {str(e)}", exc_info=True)
        error_message = 'Payment verification failed. Please contact support if amount was deducted.'
        if settings.DEBUG:
            error_message += f' Error: {str(e)}'
        return Response({
            'error': error_message
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




