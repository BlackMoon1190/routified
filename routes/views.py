from rest_framework import viewsets
from .models import Route, Waypoint, RouteWaypoint
from .serializers import RouteSerializer, WaypointSerializer, RouteWaypointSerializer


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer


class WaypointViewSet(viewsets.ModelViewSet):
    queryset = Waypoint.objects.all()
    serializer_class = WaypointSerializer


class RouteWaypointViewSet(viewsets.ModelViewSet):
    queryset = RouteWaypoint.objects.all()
    serializer_class = RouteWaypointSerializer