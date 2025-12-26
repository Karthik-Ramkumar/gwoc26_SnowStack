# Basho Products Page - Django Backend
# 
# Database models for the products page
# These models define the structure of your database tables

from django.db import models
from django.core.validators import MinValueValidator


# ====================
# PRODUCT MODEL
# Purpose: Stores all product information (bowls, plates, vases, etc.)
# ====================
class Product(models.Model):
    """
    Main product model for storing pottery items
    Your friend needs to:
    1. Run migrations to create this table in the database
    2. Populate this with actual product data
    3. Use this in views to display products
    """
    
    # Product Categories
    CATEGORY_CHOICES = [
        ('tableware', 'Tableware'),
        ('art', 'Art Pieces'),
        ('custom', 'Custom Order'),
    ]
    
    # Basic Information
    product_id = models.CharField(max_length=50, unique=True, help_text="Unique identifier (e.g., 'bowl-1')")
    name = models.CharField(max_length=200, help_text="Product name (e.g., 'Zen Breakfast Bowl')")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='tableware')
    
    # Description & Details
    description = models.TextField(help_text="Product description")
    short_description = models.CharField(max_length=300, blank=True, help_text="Brief description for cards")
    
    # Pricing
    price = models.DecimalField(    
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text="Price in INR"
    )
    
    # Product Attributes
    weight = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        null=True, 
        blank=True,
        help_text="Weight in kg (used for shipping calculation)"
    )
    dimensions = models.CharField(max_length=100, blank=True, help_text="e.g., '10 inches diameter'")
    
    # Features/Tags
    is_food_safe = models.BooleanField(default=True)
    is_microwave_safe = models.BooleanField(default=True)
    is_dishwasher_safe = models.BooleanField(default=True)
    is_handmade = models.BooleanField(default=True)
    
    # Inventory
    in_stock = models.BooleanField(default=True)
    stock_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    
    # Display
    is_featured = models.BooleanField(default=False, help_text="Show on homepage")
    is_bestseller = models.BooleanField(default=False)
    
    # Image
    image = models.ImageField(upload_to='products/', blank=True, null=True, help_text="Product image")
    image_url = models.URLField(blank=True, help_text="Alternative: external image URL")
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Product'
        verbose_name_plural = 'Products'
    
    def __str__(self):
        return f"{self.name} - ₹{self.price}"
    
    def get_tags(self):
        """Returns list of product tags for display"""
        tags = []
        if self.is_food_safe:
            tags.append('Food Safe')
        if self.is_microwave_safe:
            tags.append('Microwave Safe')
        if self.is_dishwasher_safe:
            tags.append('Dishwasher Safe')
        if self.is_handmade:
            tags.append('Handmade')
        return tags


# ====================
# CUSTOM ORDER MODEL
# Purpose: Stores custom order requests from customers
# ====================
class CustomOrder(models.Model):
    """
    Stores custom pottery order requests
    Your friend needs to:
    1. Create views to handle form submissions
    2. Send email notifications when orders are received
    3. Add admin interface to manage orders
    """
    
    PROJECT_TYPE_CHOICES = [
        ('tableware', 'Tableware Set'),
        ('art', 'Art Piece'),
        ('corporate', 'Corporate Order'),
        ('event', 'Event/Wedding'),
        ('other', 'Other'),
    ]
    
    BUDGET_CHOICES = [
        ('5000-10000', '₹5,000 - ₹10,000'),
        ('10000-25000', '₹10,000 - ₹25,000'),
        ('25000-50000', '₹25,000 - ₹50,000'),
        ('50000+', '₹50,000+'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('contacted', 'Customer Contacted'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    # Customer Information
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    
    # Order Details
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE_CHOICES)
    description = models.TextField(help_text="Customer's vision/requirements")
    budget = models.CharField(max_length=20, choices=BUDGET_CHOICES, blank=True)
    
    # Optional Fields
    gst_number = models.CharField(max_length=15, blank=True, help_text="For invoice generation")
    reference_images = models.ImageField(upload_to='custom_orders/', blank=True, null=True)
    
    # Status & Tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    order_number = models.CharField(max_length=50, unique=True, editable=False)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Custom Order'
        verbose_name_plural = 'Custom Orders'
    
    def __str__(self):
        return f"{self.order_number} - {self.name}"
    
    def save(self, *args, **kwargs):
        """Auto-generate order number if not exists"""
        if not self.order_number:
            from datetime import datetime
            self.order_number = f"CO-{datetime.now().strftime('%Y%m%d%H%M%S')}"
        super().save(*args, **kwargs)


# ====================
# CART ITEM MODEL (Optional - for future use)
# Purpose: Store cart items for logged-in users
# ====================
class CartItem(models.Model):
    """
    Optional: For implementing persistent cart functionality
    Currently the frontend uses localStorage
    This can be used later for logged-in users
    """
    # If using Django's built-in User model:
    # user = models.ForeignKey('auth.User', on_delete=models.CASCADE)
    
    session_key = models.CharField(max_length=40, help_text="For guest users")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Cart Item'
        verbose_name_plural = 'Cart Items'
    
    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
    
    def get_total_price(self):
        return self.product.price * self.quantity
