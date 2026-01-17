from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Workshop, WorkshopSlot, WorkshopRegistration
from .serializers import WorkshopSerializer, WorkshopSlotSerializer, WorkshopRegistrationSerializer


class WorkshopViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing workshops.
    Supports filtering by type, difficulty, and searching.
    """
    queryset = Workshop.objects.filter(is_active=True)
    serializer_class = WorkshopSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['workshop_type', 'difficulty_level', 'is_featured', 'is_popular']
    search_fields = ['name', 'description', 'short_description']
    ordering_fields = ['price', 'duration_hours', 'created_at', 'name']
    ordering = ['-is_featured', '-is_popular', 'name']
    
    @action(detail=True, methods=['get'])
    def slots(self, request, pk=None):
        """Get available slots for a specific workshop"""
        workshop = self.get_object()
        slots = WorkshopSlot.objects.filter(
            workshop=workshop,
            is_available=True,
            available_spots__gt=0
        )
        serializer = WorkshopSlotSerializer(slots, many=True)
        return Response(serializer.data)


class WorkshopSlotViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for viewing workshop slots"""
    queryset = WorkshopSlot.objects.filter(is_available=True, available_spots__gt=0)
    serializer_class = WorkshopSlotSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['workshop', 'date']
    ordering = ['date', 'start_time']


class WorkshopRegistrationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for creating and managing workshop registrations.
    """
    queryset = WorkshopRegistration.objects.all()
    serializer_class = WorkshopRegistrationSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['workshop', 'status']
    ordering = ['-registered_at']
    
    def create(self, request, *args, **kwargs):
        import logging
        logger = logging.getLogger(__name__)
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Reduce available spots when registration is created
        registration = serializer.save()
        if registration.slot:
            slot = registration.slot
            slot.available_spots -= registration.number_of_participants
            if slot.available_spots <= 0:
                slot.is_available = False
            slot.save()
        
        # Send email confirmations (with automatic Celery/sync fallback)
        email_sent = False
        admin_email_sent = False
        
        try:
            from products.tasks import send_workshop_confirmation_email, send_workshop_admin_notification
            from products.email_utils import send_email_with_celery_fallback
            
            # Send customer confirmation email (async if Celery enabled, sync otherwise)
            send_email_with_celery_fallback(send_workshop_confirmation_email, registration.id)
            email_sent = True
            logger.info(f"Workshop confirmation email sent for registration {registration.registration_number}")
        except Exception as email_error:
            logger.error(f"Error sending customer email for registration {registration.registration_number}: {str(email_error)}")
        
        try:
            # Send admin notification email (async if Celery enabled, sync otherwise)
            send_email_with_celery_fallback(send_workshop_admin_notification, registration.id)
            admin_email_sent = True
            logger.info(f"Admin notification email sent for registration {registration.registration_number}")
        except Exception as email_error:
            logger.error(f"Error sending admin email for registration {registration.registration_number}: {str(email_error)}")
        
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'message': 'Registration successful! You will receive a confirmation email shortly.',
                'registration': serializer.data,
                'email_sent': email_sent,
                'admin_notified': admin_email_sent
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )

