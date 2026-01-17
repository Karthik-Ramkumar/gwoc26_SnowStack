# Basho Products - URL Configuration (REST API)
#
# Maps URLs to API views for React frontend

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'products'

# REST API Router
router = DefaultRouter()
router.register(r'products', views.ProductViewSet, basename='product')
router.register(r'custom-orders', views.CustomOrderViewSet, basename='customorder')
router.register(r'corporate-inquiries', views.CorporateInquiryViewSet, basename='corporateinquiry')
router.register(r'orders', views.OrderViewSet, basename='order')

urlpatterns = [
    # REST API endpoints
    path('', include(router.urls)),
    
    # User creation endpoint
    path('create-user/', views.create_user, name='create_user'),
    
    # Check if user is staff
    path('check-staff/', views.check_user_staff, name='check_staff'),
    
    # Shipping calculator
    path('calculate-shipping/', views.calculate_shipping, name='calculate_shipping'),
    
    # JavaScript-based Razorpay payment endpoints
    path('create-razorpay-order/', views.create_razorpay_order, name='create_razorpay_order'),
    path('verify-payment/', views.verify_payment, name='verify_payment'),
    
    # Order tracking endpoint (for chatbot)
    path('track-order/', views.track_order, name='track_order'),
]
