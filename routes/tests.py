from django.test import TestCase
from django.db.utils import IntegrityError
from decimal import Decimal

from .models import Route, Waypoint, RouteWaypoint


class RouteModelTests(TestCase):

    def setUp(self):
        """Creates a sample route for tests."""
        self.route = Route.objects.create(name="Test Route")

    def test_route_str_method(self):
        """
        Tests the __str__ method of the Route model.
        """
        self.assertEqual(str(self.route), "Test Route")


class WaypointModelTests(TestCase):

    def test_waypoint_str_with_name(self):
        """Tests __str__ when 'name' is provided."""
        wp = Waypoint.objects.create(name="My Home", latitude=10.0, longitude=10.0)
        self.assertEqual(str(wp), "My Home")

    def test_waypoint_str_fallback_to_address(self):
        """Tests __str__ fallback to address when 'name' is null."""
        wp = Waypoint.objects.create(city="Testers", street="Main St", house_number="1")
        self.assertEqual(str(wp), "Main St 1, Testers")

    def test_waypoint_str_fallback_to_coords(self):
        """Tests __str__ fallback to coords when 'name' and address are null."""
        wp = Waypoint.objects.create(latitude=Decimal("12.345678"), longitude=Decimal("98.765432"))
        self.assertEqual(str(wp), "(12.345678, 98.765432)")

    def test_check_constraint_valid_with_address(self):
        """
        Tests that a waypoint can be saved with only an address.
        """
        try:
            Waypoint.objects.create(city="Testers", street="Main St", house_number="1")
        except IntegrityError:
            self.fail("CHECK constraint failed: Waypoint with address should be valid.")
        self.assertEqual(Waypoint.objects.count(), 1)

    def test_check_constraint_valid_with_coords(self):
        """
        Tests that a waypoint can be saved with only coordinates.
        """
        try:
            Waypoint.objects.create(latitude=10.0, longitude=10.0)
        except IntegrityError:
            self.fail("CHECK constraint failed: Waypoint with coords should be valid.")
        self.assertEqual(Waypoint.objects.count(), 1)

    def test_check_constraint_fails_when_empty(self):
        """
        Tests that an empty waypoint (violating CHECK) raises IntegrityError.
        """
        with self.assertRaises(IntegrityError, msg="Empty Waypoint did not raise IntegrityError"):
            Waypoint.objects.create()

    def test_check_constraint_fails_with_partial_address(self):
        """
        Tests that a partial address (violating CHECK) raises IntegrityError.
        """
        with self.assertRaises(IntegrityError, msg="Partial address did not raise IntegrityError"):
            Waypoint.objects.create(city="Test City", street="Main St") # Missing house_number

    def test_unique_constraint_fails_on_duplicate_coords(self):
        """
        Tests that duplicate coordinates (violating UNIQUE) raise IntegrityError.
        """
        Waypoint.objects.create(latitude=10.0, longitude=10.0)
        with self.assertRaises(IntegrityError, msg="Duplicate coords did not raise IntegrityError"):
            Waypoint.objects.create(latitude=10.0, longitude=10.0)
        self.assertEqual(Waypoint.objects.count(), 1)

    def test_unique_constraint_fails_on_duplicate_address(self):
        """
        Tests that a duplicate address (violating UNIQUE) raises IntegrityError.
        """
        Waypoint.objects.create(city="Testville", street="Main St", house_number="1")
        with self.assertRaises(IntegrityError, msg="Duplicate address did not raise IntegrityError"):
            Waypoint.objects.create(city="Testville", street="Main St", house_number="1")
        self.assertEqual(Waypoint.objects.count(), 1)


class RouteWaypointModelTests(TestCase):

    def setUp(self):
        """Creates a sample route and two waypoints."""
        self.route = Route.objects.create(name="My Test Route")
        self.wp1 = Waypoint.objects.create(name="Point A", latitude=10.0, longitude=10.0)
        self.wp2 = Waypoint.objects.create(name="Point B", latitude=20.0, longitude=20.0)

    def test_unique_constraint_fails_on_duplicate_sequence(self):
        """
        Tests that (route, sequence) must be unique.
        """
        RouteWaypoint.objects.create(route=self.route, waypoint=self.wp1, sequence=1)
        
        with self.assertRaises(IntegrityError, msg="Duplicate sequence number did not raise error"):
            RouteWaypoint.objects.create(route=self.route, waypoint=self.wp2, sequence=1)
        
        self.assertEqual(self.route.waypoints.count(), 1)

    def test_allows_repeating_waypoint_with_different_sequence(self):
        """
        Tests the core logic: a waypoint CAN be repeated on a route
        if the sequence number is different.
        """
        RouteWaypoint.objects.create(route=self.route, waypoint=self.wp1, sequence=1)
        
        try:
            RouteWaypoint.objects.create(route=self.route, waypoint=self.wp1, sequence=2)
        except IntegrityError:
            self.fail("Could not add a repeated waypoint with a different sequence.")
        
        self.assertEqual(self.route.waypoints.count(), 2)

    def test_ordering_is_correct(self):
        """
        Tests if the 'ordering = ['sequence']' Meta option really works.
        """
        rw_step2 = RouteWaypoint.objects.create(route=self.route, waypoint=self.wp2, sequence=2)
        rw_step1 = RouteWaypoint.objects.create(route=self.route, waypoint=self.wp1, sequence=1)
        
        steps = list(self.route.waypoints.all())
        
        # Check if the list is correctly ordered; should be [step1, step2]
        self.assertEqual(steps[0], rw_step1)
        self.assertEqual(steps[1], rw_step2)

    def test_route_waypoint_str_method(self):
        """Tests the __str__ method of the junction model."""
        rw = RouteWaypoint.objects.create(route=self.route, waypoint=self.wp1, sequence=1)
        expected_str = f"My Test Route - Step 1: Point A"
        self.assertEqual(str(rw), expected_str)