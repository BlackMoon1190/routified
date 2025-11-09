from django.db import models
from django.db.models import Q, CheckConstraint, UniqueConstraint

class Route(models.Model):
    """
    Stores the top-level route definitions. Each route is a container
    for an ordered sequence of waypoints.
    """
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name

class Waypoint(models.Model):
    """
    Acts as a library/dictionary of all unique locations.
    A single waypoint can be reused in many different routes.
    """
    name = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=128, null=True, blank=True)
    postal_code = models.CharField(max_length=15, null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    house_number = models.CharField(max_length=15, null=True, blank=True)
    apartment_number = models.CharField(max_length=15, null=True, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    class Meta:
            constraints = [
                UniqueConstraint(
                    fields=['latitude', 'longitude'],
                    condition=Q(latitude__isnull=False) & Q(longitude__isnull=False),
                    name='unique_lat_lon_not_null'
                ),
                
                UniqueConstraint(
                    fields=['city', 'postal_code', 'street', 'house_number', 'apartment_number'],
                    condition=Q(city__isnull=False) & Q(street__isnull=False) & Q(house_number__isnull=False),
                    name='unique_address_not_null'
                ),

                CheckConstraint(
                    check=Q(
                        (Q(city__isnull=False) & Q(street__isnull=False) & Q(house_number__isnull=False)) |
                        (Q(latitude__isnull=False) & Q(longitude__isnull=False))
                    ),
                    name='check_valid_waypoint_data'
                )
            ]

    def __str__(self):
        if self.name:
            return self.name
        if self.city and self.street:
            return f"{self.street} {self.house_number}, {self.city}"
        if self.latitude and self.longitude:
            return f"({self.latitude}, {self.longitude})"
        return f"Waypoint {self.id}"

class RouteWaypoint(models.Model):
    """
    Connects a Route to a Waypoint and defines the sequence (order).
    This is the "through" model for the Many-to-Many relationship.
    """
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="waypoints")
    waypoint = models.ForeignKey(Waypoint, on_delete=models.CASCADE, related_name="routes")
    sequence = models.IntegerField()

    class Meta:
        constraints = [
            UniqueConstraint(fields=['route', 'sequence'], name='unique_route_sequence')
        ]
        ordering = ['sequence']

    def __str__(self):
        return f"{self.route.name} - Step {self.sequence}: {self.waypoint.name or self.waypoint.id}"