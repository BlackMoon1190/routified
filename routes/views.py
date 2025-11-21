from rest_framework import viewsets
from .models import Route, Waypoint, RouteWaypoint
from .serializers import RouteSerializer, WaypointSerializer, RouteWaypointSerializer
from django.shortcuts import render
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from rest_framework.decorators import action
from rest_framework.response import Response


class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer
    @action(detail=True, methods=['post'])
    def update_order(self, request, pk=None):
        route = self.get_object()
        ordered_ids = request.data.get('route_waypoint_ids')

        if not isinstance(ordered_ids, list):
            return Response(
                {"error": "Expected ID's list in 'route_waypoint_ids'"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            existing_links = RouteWaypoint.objects.filter(route=route).in_bulk(field_name='id')
            
            if len(ordered_ids) != len(existing_links):
                return Response(
                    {"error": "Incorrect amount of ID's provided."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            updates = []
            for index, rw_id in enumerate(ordered_ids):
                if rw_id not in existing_links:
                    return Response(
                        {"error": f"Link ID {rw_id} does not belong to the current rotue."}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                link = existing_links[rw_id]
                link.sequence = index + 1
                updates.append(link)
            
            with transaction.atomic():
                RouteWaypoint.objects.bulk_update(updates, ['sequence'])

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"status": "Kolejność zaktualizowana"}, status=status.HTTP_200_OK)


class WaypointViewSet(viewsets.ModelViewSet):
    queryset = Waypoint.objects.all()
    serializer_class = WaypointSerializer


class RouteWaypointViewSet(viewsets.ModelViewSet):
    queryset = RouteWaypoint.objects.all()
    serializer_class = RouteWaypointSerializer
    
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['route']