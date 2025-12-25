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
from .email_utils import (
    send_order_confirmation_email,
    send_order_status_update_email,
    send_admin_new_order_notification
)


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
        Create new custom order and send confirmation emails
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        custom_order = serializer.save()

        # Send confirmation email to customer
        send_order_confirmation_email(custom_order)

        # Send notification email to admin
        send_admin_new_order_notification(custom_order)

        return Response({
            'success': True,
            'order_number': custom_order.order_number,
            'message': 'Custom order request received. We will contact you within 24 hours.',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """
        Update order status and send status update email to customer
        """
        custom_order = self.get_object()
        old_status = custom_order.status

        # Update status
        new_status = request.data.get('status')
        if new_status and new_status in dict(CustomOrder.STATUS_CHOICES):
            custom_order.status = new_status
            custom_order.save()

            # Send status update email if status actually changed
            if old_status != new_status:
                send_order_status_update_email(custom_order)

            return Response({
                'success': True,
                'message': f'Order status updated to {custom_order.get_status_display()}',
                'data': CustomOrderSerializer(custom_order).data
            })
        else:
            return Response({
                'success': False,
                'message': 'Invalid status provided'
            }, status=status.HTTP_400_BAD_REQUEST)


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
