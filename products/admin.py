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
        'product_id', 
        'name', 
        'category', 
        'price', 
        'in_stock', 
        'is_featured', 
        'stock_quantity',
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
    
    readonly_fields = ['created_at', 'updated_at']
    
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
            'fields': ('image', 'image_url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
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
        'name',
        'email',
        'phone',
        'project_type',
        'status',
        'created_at'
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
    
    readonly_fields = ['order_number', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'status')
        }),
        ('Customer Details', {
            'fields': ('name', 'email', 'phone', 'gst_number')
        }),
        ('Order Details', {
            'fields': ('project_type', 'description', 'budget', 'reference_images')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
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
