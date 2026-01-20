# Generated migration to change ImageField to CloudinaryField

from django.db import migrations
import cloudinary.models


class Migration(migrations.Migration):

    dependencies = [
        ('homepage', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='creation',
            name='image',
            field=cloudinary.models.CloudinaryField(help_text='Upload a high-quality image for the gallery', max_length=255, verbose_name='image'),
        ),
    ]
