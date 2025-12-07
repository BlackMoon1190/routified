from django.contrib import admin
from .models import Route, Waypoint, RouteWaypoint

admin.site.register(Route)
admin.site.register(Waypoint)
admin.site.register(RouteWaypoint)
