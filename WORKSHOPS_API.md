# Workshops Feature - API Documentation

## Overview
The Workshops module provides a complete system for managing pottery workshops, experiences, and registrations. It includes support for different workshop types, slot management, and participant registration.

## Workshop Types
- **Group Workshop**: Regular group pottery classes
- **One-on-One Workshop**: Private sessions with personalized instruction
- **Couple Pottery Date**: Romantic pottery experiences for couples
- **Birthday Celebration**: Birthday party packages with pottery
- **Farm & Garden Mini Party**: Studio experiences in the garden setting

## API Endpoints

### 1. Workshops API

#### List All Workshops
```
GET /api/workshops/
```
**Parameters:**
- `workshop_type` (optional): Filter by type (group, one-on-one, couple, birthday, party)
- `difficulty_level` (optional): Filter by difficulty (beginner, intermediate, advanced, all)
- `is_featured` (optional): Filter featured workshops (true/false)
- `is_popular` (optional): Filter popular workshops (true/false)
- `search` (optional): Search in name, description
- `ordering` (optional): Sort by price, duration_hours, created_at, name

**Example:**
```
GET /api/workshops/?workshop_type=couple&is_featured=true
```

**Response:**
```json
{
  "count": 7,
  "results": [
    {
      "id": 1,
      "workshop_id": "intro-pottery",
      "name": "Introduction to Pottery",
      "workshop_type": "group",
      "workshop_type_display": "Group Workshop",
      "difficulty_level": "beginner",
      "difficulty_level_display": "Beginner",
      "description": "Perfect for beginners! Learn the basics...",
      "short_description": "Learn pottery basics and create your first piece",
      "duration_hours": "3.0",
      "price": "3500.00",
      "max_participants": 8,
      "min_age": 12,
      "image": null,
      "is_active": true,
      "available_slots": 5,
      "includes_materials": true,
      "includes_refreshments": true,
      "takes_home_creation": true,
      "is_featured": true,
      "is_popular": true,
      "slots": [...],
      "created_at": "2025-12-24T11:25:00Z"
    }
  ]
}
```

#### Get Single Workshop
```
GET /api/workshops/{id}/
```

**Response:** Same as single workshop object above

#### Get Workshop Slots
```
GET /api/workshops/{id}/slots/
```
Returns available slots for a specific workshop.

**Response:**
```json
[
  {
    "id": 1,
    "date": "2025-12-31",
    "start_time": "10:00:00",
    "end_time": "13:00:00",
    "available_spots": 8,
    "is_available": true
  }
]
```

---

### 2. Workshop Slots API

#### List All Available Slots
```
GET /api/slots/
```

**Parameters:**
- `workshop` (optional): Filter by workshop ID
- `date` (optional): Filter by specific date (YYYY-MM-DD format)

**Example:**
```
GET /api/slots/?workshop=1&date=2025-12-31
```

**Response:**
```json
[
  {
    "id": 1,
    "date": "2025-12-31",
    "start_time": "10:00:00",
    "end_time": "13:00:00",
    "available_spots": 8,
    "is_available": true
  }
]
```

#### Get Single Slot
```
GET /api/slots/{id}/
```

---

### 3. Workshop Registrations API

#### Create Registration
```
POST /api/registrations/
```

**Request Body:**
```json
{
  "workshop": 1,
  "slot": 5,
  "full_name": "John Doe",
  "email": "john@example.com",
  "phone": "+91 9876543210",
  "number_of_participants": 2,
  "experience_level": "beginner",
  "special_requests": "Dietary restrictions: vegetarian"
}
```

**Response:**
```json
{
  "message": "Registration successful! You will receive a confirmation email shortly.",
  "registration": {
    "id": 1,
    "workshop": 1,
    "workshop_name": "Introduction to Pottery",
    "slot": 5,
    "slot_details": {
      "id": 5,
      "date": "2025-12-31",
      "start_time": "10:00:00",
      "end_time": "13:00:00",
      "available_spots": 6,
      "is_available": true
    },
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+91 9876543210",
    "number_of_participants": 2,
    "special_requests": "Dietary restrictions: vegetarian",
    "experience_level": "beginner",
    "status": "pending",
    "status_display": "Pending",
    "total_amount": "7000.00",
    "registered_at": "2025-12-24T11:30:00Z"
  }
}
```

**Validation:**
- Slot must belong to the selected workshop
- Number of participants must not exceed available spots
- Number of participants must not exceed workshop max_participants

#### List Registrations
```
GET /api/registrations/
```

**Parameters:**
- `workshop` (optional): Filter by workshop ID
- `status` (optional): Filter by status (pending, confirmed, cancelled, completed)

#### Get Single Registration
```
GET /api/registrations/{id}/
```

#### Update Registration
```
PUT /api/registrations/{id}/
PATCH /api/registrations/{id}/
```

#### Delete Registration
```
DELETE /api/registrations/{id}/
```

---

## Models

### Workshop Model
- `workshop_id`: Unique identifier (string)
- `name`: Workshop name
- `workshop_type`: Type (group, one-on-one, couple, birthday, party)
- `difficulty_level`: Difficulty (beginner, intermediate, advanced, all)
- `description`: Full description
- `short_description`: Brief description
- `duration_hours`: Duration in hours
- `price`: Price per participant
- `max_participants`: Maximum number of participants
- `min_age`: Minimum age requirement
- `image`: Workshop image (optional)
- `is_active`: Active status
- `available_slots`: Number of available slots
- `includes_materials`: Materials included
- `includes_refreshments`: Refreshments included
- `takes_home_creation`: Can take creation home
- `is_featured`: Featured workshop
- `is_popular`: Popular workshop

### WorkshopSlot Model
- `workshop`: Foreign key to Workshop
- `date`: Slot date
- `start_time`: Start time
- `end_time`: End time
- `available_spots`: Available spots
- `is_available`: Availability status

### WorkshopRegistration Model
- `workshop`: Foreign key to Workshop
- `slot`: Foreign key to WorkshopSlot (optional)
- `full_name`: Participant name
- `email`: Email address
- `phone`: Phone number
- `number_of_participants`: Number of participants
- `special_requests`: Special requests
- `experience_level`: Experience level
- `status`: Registration status (pending, confirmed, cancelled, completed)
- `total_amount`: Total amount (calculated automatically)

---

## Frontend Integration

The workshops page is accessible at:
- Navigation: Click "Workshops" in the top navigation bar
- Direct route: The app will display workshops when navigated to

### Features:
1. **Filter by Type**: Filter workshops by type (all, group, one-on-one, couple, birthday, party)
2. **Workshop Cards**: Display all workshops with images, pricing, and details
3. **Workshop Details Modal**: Click any workshop to see full details
4. **Registration Form**: Click "Register Now" to open the registration form
5. **Real-time Availability**: Shows available slots for each workshop
6. **Form Validation**: Validates participant numbers against available spots
7. **Success Confirmation**: Shows success message after registration

### Color Palette Used:
- Primary: #442D1C (Dark brown)
- Secondary: #652810 (Rich brown)
- Accent 1: #8E5022 (Medium brown)
- Accent 2: #C85428 (Terracotta)
- Background: #EDD8B4 (Beige/cream)

---

## Sample Data

Run the following command to load sample workshops:
```bash
python load_sample_workshops.py
```

This will create 7 sample workshops with slots for the next 4 weeks.

---

## Admin Interface

Access the Django admin at `/admin/` to manage:
- Workshops
- Workshop Slots
- Registrations

All models are registered with the admin interface with appropriate list displays, filters, and search capabilities.
