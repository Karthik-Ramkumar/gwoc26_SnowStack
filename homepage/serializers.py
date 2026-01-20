from rest_framework import serializers
from .models import Creation


class CreationSerializer(serializers.ModelSerializer):
    """
    Serializer for Creation model.
    Returns the full Cloudinary URL for the image field.
    """
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Creation
        fields = ['id', 'image_url', 'url', 'height', 'order', 'alt_text']

    def get_image_url(self, obj):
        """Return Cloudinary URL for the image."""
        # CloudinaryField returns full URL, no need to build absolute URI
        if obj.image:
            return obj.image.url
        return None
