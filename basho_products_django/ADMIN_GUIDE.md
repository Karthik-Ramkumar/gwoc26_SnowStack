# Basho Pottery Admin Guide

## Overview
The Django admin interface has been enhanced with comprehensive product and custom order management features for your pottery business.

## Accessing Admin
- URL: `http://localhost:8000/admin/`
- Login with your superuser credentials

## Dashboard
The main dashboard (`/admin/dashboard/`) provides key business metrics:
- **Product Statistics**: Total products, featured items, stock levels
- **Custom Orders**: Order counts by status, recent activity
- **Quick Actions**: Direct links to common admin tasks

## Product Management

### Features
- **Visual Product List**: Image previews, color-coded stock status, featured badges
- **Advanced Filtering**: By category, stock status, features, creation date
- **Quick Editing**: Edit price, stock, and featured status directly in the list
- **Bulk Actions**: Update multiple products at once

### Product Fields
- **Basic Info**: Product ID, name, category, descriptions
- **Pricing**: Price in INR
- **Inventory**: Stock quantity, in/out of stock status
- **Features**: Food safe, microwave safe, dishwasher safe, handmade
- **Display**: Featured status, bestseller badge
- **Media**: Product image upload or URL

### Bulk Actions for Products
- Mark as in stock/out of stock
- Mark as featured/not featured
- Mark as bestseller
- Duplicate products (creates copies with new IDs)

### Stock Management
- **In Stock**: Green indicator with quantity
- **Low Stock**: Orange warning (≤5 items)
- **Out of Stock**: Red indicator

## Custom Order Management

### Features
- **Customer Overview**: Name, email, contact info in compact view
- **Status Tracking**: Color-coded status badges
- **Reference Images**: Thumbnail previews of customer uploads
- **Order Timeline**: Visual progress tracking
- **Age Tracking**: Days since order creation

### Order Status Workflow
1. **Pending Review** (Yellow): New orders awaiting review
2. **Customer Contacted** (Blue): Initial contact made
3. **In Progress** (Green): Work has begun
4. **Completed** (Gray): Order finished
5. **Cancelled** (Red): Order cancelled

### Bulk Actions for Orders
- Mark as contacted (sends status email)
- Mark as in progress (sends status email)
- Mark as completed (sends status email)
- Mark as cancelled (no email sent)
- Export to CSV

### Email Automation
Status changes automatically trigger professional HTML emails to customers with:
- Order details and timeline
- Current status updates
- Contact information
- Next steps guidance

## Search & Filtering

### Product Search
- Product name, ID, description
- Short description content

### Order Search
- Order number, customer name, email, phone
- Order description content

### Advanced Filters
- **Products**: Category, stock status, featured, features, creation date
- **Orders**: Status, project type, budget range, creation date

## Image Management

### Product Images
- Upload images directly or use external URLs
- Automatic thumbnail generation
- Image previews in admin list view

### Reference Images
- Customer-uploaded reference photos
- Thumbnail previews in order view
- Full-size viewing in detail pages

## Export Features

### CSV Export for Orders
- Export selected orders to CSV format
- Includes all customer and order details
- Timestamped filenames
- Ready for spreadsheet analysis

## Quick Actions Panel
Located on the admin index page:
- View Dashboard
- Add New Product
- Review Pending Orders
- Check Out of Stock Items

## Best Practices

### Product Management
1. Use consistent product ID naming (e.g., `bowl-001`, `plate-045`)
2. Keep stock levels updated regularly
3. Mark featured products strategically (homepage display)
4. Use high-quality product images

### Order Management
1. Review pending orders within 24 hours
2. Update status promptly when contacting customers
3. Use bulk actions for efficiency
4. Export orders periodically for business analysis

### Email Communication
1. Status emails are sent automatically
2. Manual follow-up may be needed for complex orders
3. Keep customer contact information updated

## Troubleshooting

### Common Issues
- **Images not showing**: Check file permissions on media directory
- **Emails not sending**: Verify email settings in `settings.py`
- **Stock not updating**: Ensure bulk actions complete successfully

### Performance Tips
- Use filters to narrow down large product/order lists
- Export data periodically rather than running large queries
- Keep product images optimized for web (under 500KB each)

## Customization

### Adding New Fields
1. Update the model in `models.py`
2. Create and run migrations
3. Update admin configuration in `admin.py`
4. Add fields to templates if needed

### Custom Bulk Actions
Add new bulk actions by creating methods in the admin class:
```python
def custom_action(self, request, queryset):
    # Your logic here
    self.message_user(request, f'Updated {updated} items')
custom_action.short_description = "Custom action description"
```

## Security Notes
- Admin access requires superuser or staff status
- All actions are logged in Django's admin log
- Email credentials should use app passwords (Gmail)
- Regular password updates recommended

## Support
For technical issues or feature requests, check:
- Django admin documentation
- Custom email templates in `products/templates/emails/`
- Admin customization in `products/admin.py`