from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'workshops', views.WorkshopViewSet)
router.register(r'slots', views.WorkshopSlotViewSet)
router.register(r'registrations', views.WorkshopRegistrationViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
