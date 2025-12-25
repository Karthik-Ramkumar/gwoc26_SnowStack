# Basho Products - Admin Interface
#
# Register models in Django admin for easy management
# Your friend can access this at: http://localhost:8000/admin/

from django.contrib import admin
from django.contrib import messages
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.urls import reverse
from .models import Product, CustomOrder, CartItem
from .email_utils import send_order_status_update_email


# ====================
# PRODUCT ADMIN
# Purpose: Manage products in Django admin panel
# ====================
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """
    Enhanced admin interface for managing products

    Features:
    - List view shows key product information with image previews
    - Search by name, product_id, description
    - Filter by category, stock status, featured
    - Bulk actions to mark items in/out of stock, featured, etc.
    - Image preview in list view
    - Quick edit capabilities
    """

    list_display = [
        'product_image_preview',
        'product_id',
        'name',
        'category',
        'price_display',
        'stock_status',
        'is_featured_badge',
        'stock_quantity',
        'price',  # Added for list_editable
        'in_stock',  # Added for list_editable
        'is_featured',  # Added for list_editable
        'created_at'
    ]

    list_filter = [
        'category',
        'in_stock',
        'is_featured',
        'is_bestseller',
        'is_food_safe',
        'is_microwave_safe',
        'created_at'
    ]

    search_fields = ['name', 'product_id', 'description', 'short_description']

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
            'fields': ('product_image_preview', 'image', 'image_url')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    # Bulk actions
    actions = [
        'mark_in_stock',
        'mark_out_of_stock',
        'mark_featured',
        'mark_not_featured',
        'mark_bestseller',
        'duplicate_products'
    ]

    def product_image_preview(self, obj):
        """Display product image preview in admin"""
        if obj.image:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />', obj.image.url)
        elif obj.image_url:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />', obj.image_url)
        return mark_safe('<div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 5px; display: flex; align-items: center; justify-content: center; color: #999;">📷</div>')
    product_image_preview.short_description = 'Image'

    def price_display(self, obj):
        """Display price with currency"""
        return f"₹{obj.price}"
    price_display.short_description = 'Price'
    price_display.admin_order_field = 'price'

    def stock_status(self, obj):
        """Display stock status with color coding"""
        if obj.in_stock:
            if obj.stock_quantity > 10:
                return format_html('<span style="color: green;">✓ In Stock ({})</span>', obj.stock_quantity)
            elif obj.stock_quantity > 0:
                return format_html('<span style="color: orange;">⚠ Low Stock ({})</span>', obj.stock_quantity)
            else:
                return format_html('<span style="color: red;">✗ Out of Stock</span>')
        else:
            return mark_safe('<span style="color: red;">✗ Out of Stock</span>')
    stock_status.short_description = 'Stock Status'

    def is_featured_badge(self, obj):
        """Display featured status as badge"""
        if obj.is_featured:
            return mark_safe('<span style="background: #28a745; color: white; padding: 3px 8px; border-radius: 10px; font-size: 12px;">Featured</span>')
        return ''
    is_featured_badge.short_description = 'Featured'

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

    def mark_not_featured(self, request, queryset):
        updated = queryset.update(is_featured=False)
        self.message_user(request, f'{updated} products unmarked as featured.')
    mark_not_featured.short_description = "Remove featured status"

    def mark_bestseller(self, request, queryset):
        updated = queryset.update(is_bestseller=True)
        self.message_user(request, f'{updated} products marked as bestsellers.')
    mark_bestseller.short_description = "Mark selected products as bestsellers"

    def duplicate_products(self, request, queryset):
        """Duplicate selected products with new product_ids"""
        duplicated_count = 0
        for product in queryset:
            # Create a copy with modified product_id
            new_product_id = f"{product.product_id}-copy"
            counter = 1
            while Product.objects.filter(product_id=new_product_id).exists():
                new_product_id = f"{product.product_id}-copy-{counter}"
                counter += 1

            Product.objects.create(
                product_id=new_product_id,
                name=f"{product.name} (Copy)",
                category=product.category,
                description=product.description,
                short_description=product.short_description,
                price=product.price,
                weight=product.weight,
                dimensions=product.dimensions,
                is_food_safe=product.is_food_safe,
                is_microwave_safe=product.is_microwave_safe,
                is_dishwasher_safe=product.is_dishwasher_safe,
                is_handmade=product.is_handmade,
                in_stock=product.in_stock,
                stock_quantity=product.stock_quantity,
                is_featured=False,  # Don't mark copies as featured
                is_bestseller=product.is_bestseller,
                image=product.image,
                image_url=product.image_url
            )
            duplicated_count += 1

        self.message_user(request, f'{duplicated_count} products duplicated successfully.')
    duplicate_products.short_description = "Duplicate selected products"


# ====================
# CUSTOM ORDER ADMIN
# Purpose: Manage custom order requests
# ====================
@admin.register(CustomOrder)
class CustomOrderAdmin(admin.ModelAdmin):
    """
    Enhanced admin interface for managing custom orders

    Features:
    - View all custom order requests with status badges
    - Filter by status, project type, budget, date
    - Search by customer name, email, order number
    - Update order status with email notifications
    - Image preview for reference images
    - Customer communication tracking
    """

    list_display = [
        'order_number',
        'customer_info',
        'project_type',
        'budget_display',
        'status_badge',
        'reference_image_preview',
        'status',  # Added for list_editable
        'created_at',
        'days_since_created'
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

    readonly_fields = [
        'order_number',
        'created_at',
        'updated_at',
        'reference_image_preview',
        'order_timeline'
    ]

    fieldsets = (
        ('Order Information', {
            'fields': ('order_number', 'status', 'order_timeline')
        }),
        ('Customer Details', {
            'fields': ('name', 'email', 'phone', 'gst_number')
        }),
        ('Order Details', {
            'fields': ('project_type', 'description', 'budget', 'reference_image_preview', 'reference_images')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    # Bulk actions for status changes
    actions = [
        'mark_contacted',
        'mark_in_progress',
        'mark_completed',
        'mark_cancelled',
        'export_orders_csv'
    ]

    def customer_info(self, obj):
        """Display customer name and email"""
        return format_html('<strong>{}</strong><br><small style="color: #666;">{}</small>', obj.name, obj.email)
    customer_info.short_description = 'Customer'

    def budget_display(self, obj):
        """Display budget with color coding"""
        if obj.budget:
            budget_colors = {
                '5000-10000': '#28a745',
                '10000-25000': '#17a2b8',
                '25000-50000': '#ffc107',
                '50000+': '#dc3545'
            }
            color = budget_colors.get(obj.budget, '#6c757d')
            return format_html('<span style="background: {}; color: white; padding: 2px 6px; border-radius: 10px; font-size: 12px;">{}</span>', color, obj.get_budget_display())
        return '-'
    budget_display.short_description = 'Budget'

    def status_badge(self, obj):
        """Display status as colored badge"""
        status_colors = {
            'pending': '#ffc107',
            'contacted': '#17a2b8',
            'in_progress': '#28a745',
            'completed': '#6c757d',
            'cancelled': '#dc3545'
        }
        color = status_colors.get(obj.status, '#6c757d')
        return format_html('<span style="background: {}; color: white; padding: 3px 8px; border-radius: 10px; font-size: 12px; font-weight: bold;">{}</span>', color, obj.get_status_display())
    status_badge.short_description = 'Status'

    def reference_image_preview(self, obj):
        """Display reference image preview"""
        if obj.reference_images:
            return format_html('<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />', obj.reference_images.url)
        return mark_safe('<div style="width: 50px; height: 50px; background: #f0f0f0; border-radius: 5px; display: flex; align-items: center; justify-content: center; color: #999;">📷</div>')
    reference_image_preview.short_description = 'Reference'

    def days_since_created(self, obj):
        """Show days since order was created"""
        from datetime import datetime, timezone
        days = (datetime.now(timezone.utc) - obj.created_at).days
        if days == 0:
            return mark_safe('<span style="color: #28a745; font-weight: bold;">Today</span>')
        elif days == 1:
            return mark_safe('<span style="color: #17a2b8;">1 day ago</span>')
        elif days < 7:
            return format_html('<span style="color: #17a2b8;">{} days ago</span>', days)
        else:
            return format_html('<span style="color: #dc3545; font-weight: bold;">{} days ago</span>', days)
    days_since_created.short_description = 'Age'

    def order_timeline(self, obj):
        """Display order timeline"""
        timeline_items = [
            ('Order Received', obj.created_at, True),
        ]

        # Add status-based timeline items
        if obj.status in ['contacted', 'in_progress', 'completed']:
            timeline_items.append(('Customer Contacted', obj.updated_at if obj.status != 'pending' else None, obj.status != 'pending'))

        if obj.status in ['in_progress', 'completed']:
            timeline_items.append(('Work Started', obj.updated_at if obj.status == 'in_progress' else None, obj.status == 'in_progress'))

        if obj.status == 'completed':
            timeline_items.append(('Order Completed', obj.updated_at, True))

        timeline_html = '<div style="font-family: monospace; line-height: 1.5;">'
        for label, date, completed in timeline_items:
            icon = '✓' if completed else '○'
            color = '#28a745' if completed else '#ccc'
            date_str = date.strftime('%b %d, %Y %H:%M') if date else 'Pending'
            timeline_html += f'<div style="color: {color};">{icon} {label} - {date_str}</div>'

        timeline_html += '</div>'
        return mark_safe(timeline_html)
    order_timeline.short_description = 'Order Timeline'

    def mark_contacted(self, request, queryset):
        updated_count = 0
        for order in queryset:
            if order.status != 'contacted':
                order.status = 'contacted'
                order.save()
                send_order_status_update_email(order)
                updated_count += 1

        if updated_count > 0:
            self.message_user(request, f'{updated_count} orders marked as contacted and status emails sent.')
        else:
            self.message_user(request, 'No orders were updated.', level=messages.WARNING)
    mark_contacted.short_description = "Mark as contacted (sends email)"

    def mark_in_progress(self, request, queryset):
        updated_count = 0
        for order in queryset:
            if order.status != 'in_progress':
                order.status = 'in_progress'
                order.save()
                send_order_status_update_email(order)
                updated_count += 1

        if updated_count > 0:
            self.message_user(request, f'{updated_count} orders marked as in progress and status emails sent.')
        else:
            self.message_user(request, 'No orders were updated.', level=messages.WARNING)
    mark_in_progress.short_description = "Mark as in progress (sends email)"

    def mark_completed(self, request, queryset):
        updated_count = 0
        for order in queryset:
            if order.status != 'completed':
                order.status = 'completed'
                order.save()
                send_order_status_update_email(order)
                updated_count += 1

        if updated_count > 0:
            self.message_user(request, f'{updated_count} orders marked as completed and status emails sent.')
        else:
            self.message_user(request, 'No orders were updated.', level=messages.WARNING)
    mark_completed.short_description = "Mark as completed (sends email)"

    def mark_cancelled(self, request, queryset):
        updated_count = 0
        for order in queryset:
            if order.status != 'cancelled':
                order.status = 'cancelled'
                order.save()
                # Note: No email sent for cancellations to avoid confusion
                updated_count += 1

        if updated_count > 0:
            self.message_user(request, f'{updated_count} orders marked as cancelled.')
        else:
            self.message_user(request, 'No orders were updated.', level=messages.WARNING)
    mark_cancelled.short_description = "Mark as cancelled"

    def export_orders_csv(self, request, queryset):
        """Export selected orders to CSV"""
        import csv
        from django.http import HttpResponse
        from django.utils import timezone

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = f'attachment; filename="custom_orders_{timezone.now().strftime("%Y%m%d_%H%M%S")}.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'Order Number', 'Customer Name', 'Email', 'Phone', 'Project Type',
            'Budget', 'Status', 'Description', 'GST Number', 'Created At'
        ])

        for order in queryset:
            writer.writerow([
                order.order_number,
                order.name,
                order.email,
                order.phone,
                order.get_project_type_display(),
                order.get_budget_display() if order.budget else '',
                order.get_status_display(),
                order.description[:100] + '...' if len(order.description) > 100 else order.description,
                order.gst_number,
                order.created_at.strftime('%Y-%m-%d %H:%M:%S')
            ])

        self.message_user(request, f'Exported {queryset.count()} orders to CSV.')
        return response
    export_orders_csv.short_description = "Export selected orders to CSV"


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

