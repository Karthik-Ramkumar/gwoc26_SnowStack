from django.core.management.base import BaseCommand
from products.models import Product


class Command(BaseCommand):
    help = 'Add more pottery products to the database'

    def handle(self, *args, **kwargs):
        products_to_add = [
            {
                'product_id': 'rustic-mug-1',
                'name': 'Rustic Coffee Mug',
                'category': 'tableware',
                'description': 'Handcrafted ceramic coffee mug with organic texture. Perfect for morning coffee or tea. Earthy brown tones with natural glaze finish.',
                'short_description': 'Handmade ceramic mug with rustic charm',
                'price': 450,
                'weight': 0.3,
                'dimensions': '4 inches height',
                'image_url': 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop',
                'in_stock': True,
                'stock_quantity': 15,
                'is_featured': True
            },
            {
                'product_id': 'dinner-plate-1',
                'name': 'Artisan Dinner Plate',
                'category': 'tableware',
                'description': 'Large handcrafted dinner plate with unique crackle glaze. Each piece is one-of-a-kind. Food safe and dishwasher safe.',
                'short_description': 'Handmade ceramic dinner plate with crackle glaze',
                'price': 800,
                'weight': 0.6,
                'dimensions': '11 inches diameter',
                'image_url': 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&h=800&fit=crop',
                'in_stock': True,
                'stock_quantity': 10,
                'is_featured': True
            },
            {
                'product_id': 'ceramic-vase-1',
                'name': 'Minimalist Ceramic Vase',
                'category': 'art',
                'description': 'Elegant handmade ceramic vase with clean lines and matte finish. Perfect for fresh or dried flowers. Adds sophistication to any space.',
                'short_description': 'Modern handcrafted vase with minimalist design',
                'price': 1200,
                'weight': 0.8,
                'dimensions': '8 inches height',
                'image_url': 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&h=800&fit=crop',
                'in_stock': True,
                'stock_quantity': 8,
                'is_featured': False
            },
            {
                'product_id': 'tea-set-1',
                'name': 'Traditional Tea Set',
                'category': 'tableware',
                'description': 'Complete handmade tea set with teapot and 4 cups. Features traditional Japanese-inspired design with natural clay finish.',
                'short_description': 'Handcrafted tea set with teapot and 4 cups',
                'price': 2500,
                'weight': 1.5,
                'dimensions': 'Set of 5 pieces',
                'image_url': 'https://images.unsplash.com/photo-1560859251-d9c4ca6ed5b2?w=800&h=800&fit=crop',
                'in_stock': True,
                'stock_quantity': 5,
                'is_bestseller': True
            },
            {
                'product_id': 'serving-bowl-1',
                'name': 'Large Serving Bowl',
                'category': 'tableware',
                'description': 'Spacious handcrafted serving bowl ideal for salads, pasta, or fruit. Features warm terracotta tones with elegant rim design.',
                'short_description': 'Handmade ceramic serving bowl',
                'price': 950,
                'weight': 1.0,
                'dimensions': '12 inches diameter',
                'image_url': 'https://images.unsplash.com/photo-1610824352934-c10d87b1c9bb?w=800&h=800&fit=crop',
                'in_stock': True,
                'stock_quantity': 12,
                'is_featured': False
            },
            {
                'product_id': 'planter-pot-1',
                'name': 'Ceramic Planter Pot',
                'category': 'art',
                'description': 'Handcrafted ceramic planter with drainage hole. Perfect for succulents and small plants. Earthy terracotta finish.',
                'short_description': 'Handmade ceramic pot for plants',
                'price': 600,
                'weight': 0.5,
                'dimensions': '6 inches diameter',
                'image_url': 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&h=800&fit=crop',
                'in_stock': True,
                'stock_quantity': 20,
                'is_featured': False
            },
            {
                'product_id': 'sake-set-1',
                'name': 'Handmade Sake Set',
                'category': 'tableware',
                'description': 'Traditional handcrafted sake set with bottle and 2 cups. Beautiful glaze with artisan craftsmanship.',
                'short_description': 'Ceramic sake set with bottle and cups',
                'price': 1800,
                'weight': 0.7,
                'dimensions': 'Set of 3 pieces',
                'image_url': 'https://images.unsplash.com/photo-1569186242389-62c1f7f71732?w=800&h=800&fit=crop',
                'in_stock': True,
                'stock_quantity': 6,
                'is_featured': False
            },
            {
                'product_id': 'decorative-bowl-1',
                'name': 'Decorative Ceramic Bowl',
                'category': 'art',
                'description': 'Statement ceramic bowl with unique artistic glaze pattern. Perfect as centerpiece for any room.',
                'short_description': 'Artistic handmade decorative bowl',
                'price': 1500,
                'weight': 1.2,
                'dimensions': '10 inches diameter',
                'image_url': 'https://images.unsplash.com/photo-1610824352934-c10d87b1c9bb?w=800&h=800&fit=crop&q=80&sat=-50',
                'in_stock': True,
                'stock_quantity': 4,
                'is_featured': True
            }
        ]

        created_count = 0
        updated_count = 0
        
        for p_data in products_to_add:
            product, created = Product.objects.get_or_create(
                product_id=p_data['product_id'],
                defaults=p_data
            )
            if created:
                created_count += 1
                self.stdout.write(self.style.SUCCESS(f'✓ Created: {product.name}'))
            else:
                updated_count += 1
                self.stdout.write(self.style.WARNING(f'○ Already exists: {product.name}'))

        self.stdout.write(self.style.SUCCESS(f'\n✓ Total new products created: {created_count}'))
        self.stdout.write(self.style.SUCCESS(f'✓ Total products in database: {Product.objects.count()}'))
