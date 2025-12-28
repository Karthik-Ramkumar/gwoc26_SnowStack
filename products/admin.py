# Basho Products - Admin Interface
#
# Register models in Django admin for easy management
# Your friend can access this at: http://localhost:8000/admin/

from django.contrib import admin
from .models import Product, CustomOrder, CartItem


# ====================
# PRODUCT ADMIN
# Purpose: Manage products in Django admin panel
# ====================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Admin interface for managing products
    
    Features:
    - List view shows key product information
    - Search by name, product_id, description
    - Filter by category, stock status, featured
    - Bulk actions to mark items in/out of stock
    """
    
    list_display = [
        'image_preview',
        'product_id',
        'name',
        'category',
        'price',
        'stock_status_display',
        'is_featured',
        'stock_quantity',
        'in_stock',
        'created_at'
    ]
    
    list_filter = [
        'category',
        'in_stock',
        'is_featured',
        'is_bestseller',
        'is_food_safe',
        'is_microwave_safe',
    ]
    
    search_fields = ['name', 'product_id', 'description']
    
    list_editable = ['price', 'in_stock', 'is_featured', 'stock_quantity']
    
    readonly_fields = ['created_at', 'updated_at', 'product_image_preview']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('product_id', 'name', 'category', 'description', 'short_description')
        }),
        ('Pricing & Inventory', {
            'fields': ('price', 'in_stock', 'stock_quantity')
        }),
        ('Product Details', {
            'fields': ('weight', 'dimensions')
        }),
        ('Features', {
            'fields': (
                'is_food_safe',
                'is_microwave_safe',
                'is_dishwasher_safe',
                'is_handmade'
            )
        }),
        ('Display Options', {
            'fields': ('is_featured', 'is_bestseller')
        }),
        ('Media', {
            'fields': ('image', 'image_url', 'product_image_preview')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Custom display methods
    def image_preview(self, obj):
        """Display product image thumbnail"""
        from django.utils.html import format_html
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd;" />',
                obj.image.url
            )
        elif obj.image_url:
            return format_html(
                '<img src="{}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; border: 1px solid #ddd;" />',
                obj.image_url
            )
        return "No image"
    image_preview.short_description = 'Image'
    
    def stock_status_display(self, obj):
        """Display stock status with warning for low stock"""
        from django.utils.html import format_html
        if not obj.in_stock:
            return format_html(
                '<span style="color: #f44336; font-weight: 500;">⚠️ Out of Stock</span>'
            )
        elif obj.stock_quantity <= 5:
            return format_html(
                '<span style="color: #ff9800; font-weight: 500;">⚠️ Low Stock ({})</span>',
                obj.stock_quantity
            )
        elif obj.stock_quantity <= 10:
            return format_html(
                '<span style="color: #ffc107; font-weight: 500;">⚡ Limited ({})</span>',
                obj.stock_quantity
            )
        else:
            return format_html(
                '<span style="color: #4CAF50; font-weight: 500;">✓ In Stock ({})</span>',
                obj.stock_quantity
            )
    stock_status_display.short_description = 'Stock Status'
    
    def product_image_preview(self, obj):
        """Large preview for detail view"""
        from django.utils.html import format_html
        if obj.image:
            return format_html(
                '<img src="{}" style="max-width: 500px; max-height: 500px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />',
                obj.image.url
            )
        elif obj.image_url:
            return format_html(
                '<img src="{}" style="max-width: 500px; max-height: 500px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />',
                obj.image_url
            )
        return "No product image"
    product_image_preview.short_description = 'Product Image Preview'
    
    # Bulk actions
    actions = ['mark_in_stock', 'mark_out_of_stock', 'mark_featured']
    
    def mark_in_stock(self, request, queryset):
        updated = queryset.update(in_stock=True)
        self.message_user(request, f'{updated} products marked as in stock.')
    mark_in_stock.short_description = "Mark selected products as in stock"
    
    def mark_out_of_stock(self, request, queryset):
        updated = queryset.update(in_stock=False)
        self.message_user(request, f'{updated} products marked as out of stock.')
    mark_out_of_stock.short_description = "Mark selected products as out of stock"
    
    def mark_featured(self, request, queryset):
        updated = queryset.update(is_featured=True)
        self.message_user(request, f'{updated} products marked as featured.')
    mark_featured.short_description = "Mark selected products as featured"



# ====================
# CUSTOM ORDER ADMIN
# Purpose: Manage custom order requests
# ====================
@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    """
    Admin interface for managing custom orders
    
    Features:
    - View all custom order requests
    - Filter by status, project type
    - Search by customer name, email, order number
    - Update order status
    """
    
    list_display = [
        'order_number',
        'customer_info',
        'project_type',
        'budget',
        'colored_status',
        'reference_preview',
        'status',
        'created_at',
        'order_age'
    ]
    
    list_filter = [
        'status',
        'project_type',
        'budget',
        'created_at'
    ]
    
    search_fields = [
        'order_number',
        'name',
        'email',
        'phone',
        'description'
    ]
    
    list_editable = ['status']
    
    readonly_fields = ['order_number', 'created_at', 'updated_at', 'reference_image_preview']
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'status')
        }),
        ('Customer Details', {
            'fields': ('name', 'email', 'phone', 'gst_number')
        }),
        ('Order Details', {
            'fields': ('project_type', 'description', 'budget', 'reference_images', 'reference_image_preview')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    # Custom display methods
    def customer_info(self, obj):
        """Display customer name and email"""
        from django.utils.html import format_html
        return format_html(
            '<strong>{}</strong><br><span style="color: #666; font-size: 0.9em;">{}</span>',
            obj.name,
            obj.email
        )
    customer_info.short_description = 'Customer'
    
    def colored_status(self, obj):
        """Display status with colored badge"""
        from django.utils.html import format_html
        colors = {
            'pending': '#ffa500',
            'contacted': '#2196F3',
            'in_progress': '#4CAF50',
            'completed': '#9C27B0',
            'cancelled': '#f44336'
        }
        color = colors.get(obj.status, '#666')
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; border-radius: 3px; font-size: 0.85em;">{}</span>',
            color,
            obj.get_status_display()
        )
    colored_status.short_description = 'Status Badge'
    
    def reference_preview(self, obj):
        """Display reference image thumbnail"""
        from django.utils.html import format_html
        if obj.reference_images:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" />',
                obj.reference_images.url
            )
        return format_html('<span style="color: #999;">No image</span>')
    reference_preview.short_description = 'Reference'
    
    def reference_image_preview(self, obj):
        """Large preview for detail view"""
        from django.utils.html import format_html
        if obj.reference_images:
            return format_html(
                '<img src="{}" style="max-width: 400px; max-height: 400px; border-radius: 8px;" />',
                obj.reference_images.url
            )
        return "No reference image uploaded"
    reference_image_preview.short_description = 'Reference Image Preview'
    
    def order_age(self, obj):
        """Display how long ago the order was created"""
        from django.utils import timezone
        from django.utils.html import format_html
        now = timezone.now()
        delta = now - obj.created_at
        
        if delta.days == 0:
            age_text = 'Today'
            color = '#4CAF50'
        elif delta.days == 1:
            age_text = 'Yesterday'
            color = '#FF9800'
        elif delta.days < 7:
            age_text = f'{delta.days} days ago'
            color = '#FF9800'
        elif delta.days < 30:
            weeks = delta.days // 7
            age_text = f'{weeks} week{"s" if weeks > 1 else ""} ago'
            color = '#F44336'
        else:
            months = delta.days // 30
            age_text = f'{months} month{"s" if months > 1 else ""} ago'
            color = '#9E9E9E'
        
        return format_html(
            '<span style="color: {}; font-weight: 500;">{}</span>',
            color,
            age_text
        )
    order_age.short_description = 'Age'
    
    # Bulk actions for status changes
    actions = ['mark_contacted', 'mark_in_progress', 'mark_completed']
    
    def mark_contacted(self, request, queryset):
        updated = queryset.update(status='contacted')
        self.message_user(request, f'{updated} orders marked as contacted.')
    mark_contacted.short_description = "Mark as contacted"
    
    def mark_in_progress(self, request, queryset):
        updated = queryset.update(status='in_progress')
        self.message_user(request, f'{updated} orders marked as in progress.')
    mark_in_progress.short_description = "Mark as in progress"
    
    def mark_completed(self, request, queryset):
        updated = queryset.update(status='completed')
        self.message_user(request, f'{updated} orders marked as completed.')
    mark_completed.short_description = "Mark as completed"



# ====================
# CART ITEM ADMIN (Optional)
# ====================
@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    """
    Admin interface for viewing cart items (if implemented)
    """
    
    list_display = ['product', 'quantity', 'session_key', 'added_at']
    list_filter = ['added_at']
    search_fields = ['session_key', 'product__name']
