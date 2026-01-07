from rest_framework import serializers
from .models import Workshop, WorkshopSlot, WorkshopRegistration


class WorkshopSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkshopSlot
        fields = ['id', 'date', 'start_time', 'end_time', 'available_spots', 'is_available']


class WorkshopSerializer(serializers.ModelSerializer):
    slots = WorkshopSlotSerializer(many=True, read_only=True)
    workshop_type_display = serializers.CharField(source='get_workshop_type_display', read_only=True)
    difficulty_level_display = serializers.CharField(source='get_difficulty_level_display', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Workshop
        fields = [
            'id', 'workshop_id', 'name', 'workshop_type', 'workshop_type_display',
            'difficulty_level', 'difficulty_level_display', 'description', 'short_description',
            'duration_hours', 'price', 'max_participants', 'min_age', 'image', 'image_url',
            'is_active', 'available_slots', 'includes_materials', 'includes_refreshments',
            'takes_home_creation', 'is_featured', 'is_popular', 'slots', 'created_at'
        ]
    
    def get_image_url(self, obj):
        """Return full image URL"""
        # First check if there's an uploaded image
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
        # Otherwise return the image_url field (relative or absolute path)
        return obj.image_url or None


class WorkshopRegistrationSerializer(serializers.ModelSerializer):
    workshop_name = serializers.CharField(source='workshop.name', read_only=True)
    slot_details = WorkshopSlotSerializer(source='slot', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = WorkshopRegistration
        fields = [
            'id', 'workshop', 'workshop_name', 'slot', 'slot_details',
            'full_name', 'email', 'phone', 'number_of_participants',
            'special_requests', 'experience_level', 'status', 'status_display',
            'total_amount', 'registered_at'
        ]
        read_only_fields = ['total_amount', 'status']
    
    def validate(self, data):
        workshop = data.get('workshop')
        slot = data.get('slot')
        number_of_participants = data.get('number_of_participants')
        
        # Validate slot belongs to workshop
        if slot and slot.workshop != workshop:
            raise serializers.ValidationError("Selected slot does not belong to this workshop")
        
        # Validate available spots
        if slot and slot.available_spots < number_of_participants:
            raise serializers.ValidationError(f"Only {slot.available_spots} spots available")
        
        # Validate max participants
        if number_of_participants > workshop.max_participants:
            raise serializers.ValidationError(f"Maximum {workshop.max_participants} participants allowed")
        
        return data
