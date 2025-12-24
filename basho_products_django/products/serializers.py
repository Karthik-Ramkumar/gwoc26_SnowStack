# Basho Products - REST API Serializers
#
# Serializers convert Django models to JSON for the React frontend

from rest_framework import serializers
from .models import Product, CustomOrder


class ProductSerializer(serializers.ModelSerializer):
    """
    Serializer for Product model
    Converts Product objects to JSON for React frontend
    """
    tags = serializers.SerializerMethodField()
    image_url_full = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'product_id',
            'name',
            'category',
            'description',
            'short_description',
            'price',
            'weight',
            'dimensions',
            'is_food_safe',
            'is_microwave_safe',
            'is_dishwasher_safe',
            'is_handmade',
            'in_stock',
            'stock_quantity',
            'is_featured',
            'is_bestseller',
            'image',
            'image_url',
            'image_url_full',
            'tags',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at', 'tags', 'image_url_full']
    
    def get_tags(self, obj):
        """Return product tags as array"""
        return obj.get_tags()
    
    def get_image_url_full(self, obj):
        """Return full image URL"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        return obj.image_url or None


class CustomOrderSerializer(serializers.ModelSerializer):
    """
    Serializer for CustomOrder model
    Handles custom order form submissions from React
    """
    
    class Meta:
        model = CustomOrder
        fields = [
            'id',
            'name',
            'email',
            'phone',
            'project_type',
            'description',
            'budget',
            'gst_number',
            'reference_images',
            'status',
            'order_number',
            'created_at',
        ]
        read_only_fields = ['id', 'order_number', 'status', 'created_at']
    
    def validate_email(self, value):
        """Validate email format"""
        import re
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(pattern, value):
            raise serializers.ValidationError("Invalid email format")
        return value
    
    def validate_phone(self, value):
        """Validate phone number"""
        import re
        # Remove spaces and dashes
        cleaned = re.sub(r'[\s\-\(\)]', '', value)
        if not re.match(r'^\+?[\d]{10,15}$', cleaned):
            raise serializers.ValidationError("Invalid phone number format")
        return value
