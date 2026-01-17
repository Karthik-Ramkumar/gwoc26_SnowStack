from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import UpcomingExhibition, PastPopup, EventGalleryImage, StudioTourSettings
from .serializers import (
    UpcomingExhibitionSerializer, 
    PastPopupSerializer, 
    EventGalleryImageSerializer,
    StudioTourSettingsSerializer
)


class UpcomingExhibitionListView(generics.ListAPIView):
    """List all active upcoming exhibitions"""
    serializer_class = UpcomingExhibitionSerializer
    
    def get_queryset(self):
        return UpcomingExhibition.objects.filter(is_active=True)


class PastPopupListView(generics.ListAPIView):
    """List all past pop-ups"""
    queryset = PastPopup.objects.all()
    serializer_class = PastPopupSerializer


class EventGalleryListView(generics.ListAPIView):
    """List all event gallery images"""
    queryset = EventGalleryImage.objects.all()
    serializer_class = EventGalleryImageSerializer


class StudioTourSettingsView(APIView):
    """Get 360 studio tour settings"""
    
    def get(self, request):
        settings = StudioTourSettings.objects.first()
        if not settings:
            return Response({'active': False, 'image_url': None})
        serializer = StudioTourSettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)
