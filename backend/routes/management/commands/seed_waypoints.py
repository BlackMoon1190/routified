from django.core.management.base import BaseCommand
from routes.models import Waypoint

RAW_DATA = [
    {
        "name": "Eiffel Tower",
        "city": "Paris",
        "postal_code": "75007",
        "street": "Champ de Mars",
        "house_number": "5",
        "apartment_number": "",
        "latitude": 48.8584,
        "longitude": 2.2945,
    },
    {
        "name": "Brandenburg Gate",
        "city": "Berlin",
        "postal_code": "10117",
        "street": "Pariser Platz",
        "house_number": "1",
        "apartment_number": "",
        "latitude": 52.5163,
        "longitude": 13.3777,
    },
    {
        "name": "Poznań Old Town",
        "city": "Poznań",
        "postal_code": "61-772",
        "street": "Stary Rynek",
        "house_number": "1",
        "apartment_number": "",
        "latitude": 52.4082,
        "longitude": 16.9340,
    },
    {
        "name": "Colosseum",
        "city": "Rome",
        "postal_code": "00184",
        "street": "Piazza del Colosseo",
        "house_number": "1",
        "apartment_number": "",
        "latitude": 41.8902,
        "longitude": 12.4922,
    },
    {
        "name": "Statue of Liberty",
        "city": "New York",
        "postal_code": "10004",
        "street": "Liberty Island",
        "house_number": "1",
        "apartment_number": "",
        "latitude": 40.6892,
        "longitude": -74.0445,
    },
    {
        "name": "Warsaw Palace of Culture",
        "city": "Warszawa",
        "postal_code": "00-901",
        "street": "plac Defilad",
        "house_number": "1",
        "apartment_number": "",
        "latitude": 52.2317,
        "longitude": 21.0060,
    },
    {
        "name": "Tokyo Tower",
        "city": "Tokyo",
        "postal_code": "105-0011",
        "street": "Shibakoen",
        "house_number": "4-2-8",
        "apartment_number": "",
        "latitude": 35.6586,
        "longitude": 139.7454,
    },
    {
        "name": "Empire State Building",
        "city": "New York",
        "postal_code": "10001",
        "street": "W 34th St",
        "house_number": "20",
        "apartment_number": "Suite 101",
        "latitude": 40.7484,
        "longitude": -73.9857,
    },
    {
        "name": "Sydney Opera House",
        "city": "Sydney",
        "postal_code": "2000",
        "street": "Bennelong Point",
        "house_number": "1",
        "apartment_number": "",
        "latitude": -33.8568,
        "longitude": 151.2153,
    },
    {
        "name": "Christ the Redeemer",
        "city": "Rio de Janeiro",
        "postal_code": "22241-330",
        "street": "Parque Nacional da Tijuca",
        "house_number": "1",
        "apartment_number": "",
        "latitude": -22.9519,
        "longitude": -43.2105,
    },
    {
        "name": "Złota 44",
        "city": "Warszawa",
        "postal_code": "00-120",
        "street": "Złota",
        "house_number": "44",
        "apartment_number": "150",
        "latitude": 52.2319,
        "longitude": 21.0022,
    },
    {
        "name": "Buckingham Palace",
        "city": "London",
        "postal_code": "SW1A 1AA",
        "street": "Buckingham Palace",
        "house_number": "1",
        "apartment_number": "",
        "latitude": 51.5014,
        "longitude": -0.1419,
    }
]

class Command(BaseCommand):
    help = 'Seeds the database with test waypoints.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to seed waypoints...'))
        
        created_count = 0
        skipped_count = 0

        for wp_data in RAW_DATA:
            try:
                obj, created = Waypoint.objects.get_or_create(
                    city=wp_data["city"],
                    street=wp_data["street"],
                    house_number=wp_data["house_number"],
                    apartment_number=wp_data.get("apartment_number", ""),
                    postal_code=wp_data.get("postal_code", ""),
                    defaults={
                        'name': wp_data["name"],
                        'latitude': wp_data.get("latitude"),
                        'longitude': wp_data.get("longitude")
                    }
                )

                if created:
                    self.stdout.write(self.style.SUCCESS(f'  [+] Created: {wp_data["name"]}'))
                    created_count += 1
                else:
                    self.stdout.write(self.style.WARNING(f'  [!] Skipped (already exists): {wp_data["name"]}'))
                    skipped_count += 1

            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  [X] Error processing "{wp_data["name"]}": {e}'))

        self.stdout.write(self.style.SUCCESS(f'\nSeeding complete! Created: {created_count}, Skipped: {skipped_count}'))