# Basho Products Page - Django Views (REST API)
#
# REST API views for React frontend
# Your friend needs to complete these view functions

from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Product, CustomOrder
from .serializers import ProductSerializer, CustomOrderSerializer


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
    http_method_names = ['get', 'post', 'head', 'options']  # Only allow GET and POST
    
    def create(self, request, *args, **kwargs):
        """
        Create new custom order and send email notifications
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_order = serializer.save()
        
        # Send email notification to admin
        try:
            from django.core.mail import send_mail
            from django.conf import settings
            
            # Email to admin
            # Email to admin
            admin_subject = f'New Custom Order: {custom_order.order_number}'
            
            # Common imports for templates are already handled or will be imported
            from django.template.loader import render_to_string
            from django.utils.html import strip_tags
            
            # Context for template
            admin_context = {
                'custom_order': custom_order,
                'settings': settings,
            }
            
            admin_html = render_to_string('products/email/admin_new_order.html', admin_context)
            admin_plain = strip_tags(admin_html)
            
            send_mail(
                subject=admin_subject,
                message=admin_plain,
                from_email=settings.COMPANY_EMAIL,
                recipient_list=[settings.COMPANY_EMAIL],
                html_message=admin_html,
                fail_silently=True,  # Don't crash if email fails
            )
            
            # Email confirmation to customer
            customer_subject = f'Order Confirmation - {custom_order.order_number}'
            
            # Context for template
            context = {
                'custom_order': custom_order,
                'settings': settings,
                'domain': 'localhost:3000',  # Replace with actual domain in production
            }
            
            from django.template.loader import render_to_string
            from django.utils.html import strip_tags
            
            html_message = render_to_string('products/email/custom_order_confirmation.html', context)
            plain_message = strip_tags(html_message)
            
            send_mail(
                subject=customer_subject,
                message=plain_message,
                from_email=settings.COMPANY_EMAIL,
                recipient_list=[custom_order.email],
                html_message=html_message,
                fail_silently=True,
            )

        except Exception as e:
            # Log the error but don't fail the request
            print(f"Email sending failed: {str(e)}")
        
        return Response({
            'success': True,
            'order_number': custom_order.order_number,
            'message': 'Custom order request received. We will contact you within 24 hours.',
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
