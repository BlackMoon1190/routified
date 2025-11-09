# Database Schema Design

This document outlines the logical data model for the application. It was designed to be implemented using the **Django ORM**.

The model defines the core tables (models), their fields, and the key constraints required to ensure data integrity and fulfill the application's business logic.

---

## 1. Model: `Route`

Stores the top-level route definitions. Each route is a container for an ordered sequence of waypoints.

| Field | Django Field Type | Notes |
| :--- | :--- | :--- |
| `id` | `AutoField` | **Primary Key.** Automatically generated integer. |
| `name` | `CharField(max_length=255)` | **Required.** The user-given name for the route. |
| `description` | `TextField` | **Optional.** A longer, user-supplied description. (`null=True, blank=True`) |

### Constraints & Logic (`Route`)
This model is intentionally simple as its primary role is to be a top-level container for a route. Its data integrity is already maintained by the standard field constraints:

* **`id` (Primary Key):** The database automatically ensures that every single `Route` record is unique.
* **`name` (Required):** The `NOT NULL` constraint (which is the default for a `CharField` in Django) ensures every route has a human-readable identifier.

Unlike the other models, there are no complex business rules at this level that require database-level constraints.


---

## 2. Model: `Waypoint`

Acts as a library/dictionary of all unique locations available in the system. A single waypoint can exist once and be reused in many different routes.

| Field | Django Field Type | Notes |
| :--- | :--- | :--- |
| `id` | `AutoField` | **Primary Key.** |
| `name` | `CharField(max_length=255)` | **Optional.** The user-given name for the waypoint. (`null=True, blank=True`) |
| `city` | `CharField(max_length=128)` | **Optional.** (`null=True, blank=True`) |
| `postal_code` | `CharField(max_length=15)` | **Optional.** (`null=True, blank=True`) |
| `street` | `CharField(max_length=255)` | **Optional.** (`null=True, blank=True`) |
| `house_number` | `CharField(max_length=15)` | **Optional.** (`null=True, blank=True`) |
| `apartment_number` | `CharField(max_length=15)` | **Optional.** (`null=True, blank=True`) |
| `latitude` | `DecimalField(max_digits=9, decimal_places=6)` | **Optional.** Geographic latitude. (`null=True, blank=True`) |
| `longitude` | `DecimalField(max_digits=9, decimal_places=6)` | **Optional.** Geographic longitude. (`null=True, blank=True`) |

### Constraints & Logic (`Waypoint`)

These constraints are critical for preventing duplicate and "empty" data.

1.  **`UNIQUE (latitude, longitude)`**
    * **Purpose:** Ensures that no two waypoints share the exact same set of coordinates. This prevents ambiguity when plotting points.

2.  **`UNIQUE (city, postal_code, street, house_number, apartment_number)`**
    * **Purpose:** Ensures that no two waypoints share the exact same full address. This prevents duplicate entries for named locations.

3.  **`CHECK ( (city IS NOT NULL AND street IS NOT NULL AND house_number IS NOT NULL) OR (latitude IS NOT NULL AND longitude IS NOT NULL) )`**
    * **Purpose:** Enforces data validity. A waypoint is only considered valid if it contains *either* a minimal usable address (city, street, number) *or* a valid set of geographic coordinates. This prevents empty or useless records in the database.

---

## 3. Model: `RouteWaypoint` (Junction Model)

This is the most important model. It connects `Routes` and `Waypoints` and, crucially, defines the **order** of waypoints *within* a specific route. This model implements the Many-to-Many relationship.

| Field | Django Field Type | Notes |
| :--- | :--- | :--- |
| `id` | `AutoField` | **Primary Key.** |
| `route` | `ForeignKey('Route')` | **Required.** A reference to the parent route. |
| `waypoint` | `ForeignKey('Waypoint')` | **Required.** A reference to the location for this step. |
| `sequence` | `IntegerField` | **Required.** The order of this step (e.g., 1, 2, 3...). This is used for sorting. |

### Constraints & Logic (`RouteWaypoint`)

1.  **`UNIQUE (route, sequence)`**
    * **Purpose:** This is the core logic of the app. It guarantees that within a single route (e.g., `RouteID` = 5), each sequence number (e.g., `sequence` = 2) can only be used *once*. This makes the order unambiguous.
    * It **allows** a waypoint to be repeated (e.g., `RouteID=5, WaypointID=10, sequence=1` and `RouteID=5, WaypointID=10, sequence=5` is valid), which fulfills the requirement.

---