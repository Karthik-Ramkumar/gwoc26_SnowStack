from django.contrib import admin
from .models import Workshop, WorkshopSlot, WorkshopRegistration


@admin.register(Workshop)
class WorkshopAdmin(admin.ModelAdmin):
    list_display = ['name', 'workshop_type', 'difficulty_level', 'price', 'duration_hours', 
                    'available_slots', 'is_featured', 'is_popular', 'is_active']
    list_filter = ['workshop_type', 'difficulty_level', 'is_featured', 'is_popular', 'is_active']
    search_fields = ['name', 'description', 'workshop_id']
    list_editable = ['is_featured', 'is_popular', 'is_active', 'available_slots']
    prepopulated_fields = {'workshop_id': ('name',)}


@admin.register(WorkshopSlot)
class WorkshopSlotAdmin(admin.ModelAdmin):
    list_display = ['workshop', 'date', 'start_time', 'end_time', 'available_spots', 'is_available']
    list_filter = ['workshop', 'date', 'is_available']
    list_editable = ['available_spots', 'is_available']
    date_hierarchy = 'date'


@admin.register(WorkshopRegistration)
class WorkshopRegistrationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'workshop', 'email', 'phone', 'number_of_participants', 
                    'status', 'total_amount', 'registered_at']
    list_filter = ['status', 'workshop', 'registered_at']
    search_fields = ['full_name', 'email', 'phone']
    list_editable = ['status']
    readonly_fields = ['registered_at', 'updated_at', 'total_amount']
    date_hierarchy = 'registered_at'
