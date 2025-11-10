from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()

router.register(r'routes', views.RouteViewSet, basename='route')
router.register(r'waypoints', views.WaypointViewSet, basename='waypoint')
router.register(r'route-waypoints', views.RouteWaypointViewSet, basename='routewaypoint')

urlpatterns = [
    path('', include(router.urls)),
]