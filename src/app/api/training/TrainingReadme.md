# Training Calendar System API Documentation

This document provides comprehensive details about the Training Calendar System API endpoints, their functionality, request/response formats, and usage examples.

## Table of Contents

- [Database Schema](#database-schema)
- [API Overview](#api-overview)
- [Course APIs](#course-apis)
- [Enrollment APIs](#enrollment-apis)
- [Category APIs](#category-apis)
- [Waitlist APIs](#waitlist-apis)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling](#error-handling)
- [Data Models](#data-models)

## Database Schema

The system is built on the following database tables:

1. **training_courses** - Stores course information
2. **training_enrollments** - Tracks student enrollments in courses
3. **training_waitlist** - Manages users waiting for spots in full courses
4. **training_categories** - Organizes courses into categories
5. **training_instructors** - Stores information about course instructors

## API Overview

All API routes follow this base URL pattern: `/api/training/...`

Authentication is required for all endpoints and is handled via Clerk.js integration.

## Course APIs

### List All Courses

Retrieves a list of available courses with pagination and filtering options.

- **URL:** `GET /api/training/courses`
- **Authentication:** Required
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `level` - Filter by course level (beginner, intermediate, advanced)
  - `category` - Filter by category name
  - `mode` - Filter by course mode (online, in-person, hybrid)
  - `dateFrom` - Filter courses starting from this date
  - `dateTo` - Filter courses ending before this date
  - `instructor` - Filter by instructor name
  - `search` - Search in title and description
- **Response:**
  ```json
  {
    "courses": [
      {
        "id": "course123",
        "title": "Introduction to React",
        "description": "Learn React fundamentals",
        "dates": "June 1-30, 2025",
        "time": "6:00 PM - 8:00 PM",
        "duration": "4 weeks",
        "mode": "online",
        "location": null,
        "instructor": "Jane Smith",
        "maxCapacity": 30,
        "currentEnrollment": 15,
        "availability": 15,
        "price": 299.99,
        "level": "beginner",
        "category": "Web Development",
        "prerequisites": ["Basic HTML, CSS, JavaScript knowledge"],
        "certification": "Certificate of Completion",
        "language": "English",
        "createdAt": "2025-01-15T12:00:00Z",
        "updatedAt": "2025-01-15T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  }
  ```

### Create a New Course

Creates a new training course.

- **URL:** `POST /api/training/courses`
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "title": "Introduction to React",
    "description": "Learn React fundamentals...",
    "dates": "June 1-30, 2025",
    "time": "6:00 PM - 8:00 PM",
    "duration": "4 weeks",
    "mode": "online",
    "location": null,
    "instructor": "Jane Smith",
    "maxCapacity": 30,
    "price": 299.99,
    "level": "beginner",
    "category": "Web Development",
    "prerequisites": ["Basic HTML, CSS, JavaScript knowledge"],
    "certification": "Certificate of Completion",
    "language": "English"
  }
  ```
- **Response:** The created course object with status 201

### Get Course Details

Retrieves details for a specific course.

- **URL:** `GET /api/training/courses/[courseId]`
- **Authentication:** Required
- **Response:** Complete course object

### Update a Course

Updates an existing course.

- **URL:** `PUT /api/training/courses/[courseId]`
- **Authentication:** Required (Admin only)
- **Request Body:** Any course properties to update
- **Response:** The updated course object

### Delete a Course

Soft deletes a course (marks as deleted but preserves data).

- **URL:** `DELETE /api/training/courses/[courseId]`
- **Authentication:** Required (Admin only)
- **Response:**
  ```json
  {
    "message": "Course deleted successfully"
  }
  ```

## Enrollment APIs

### List Course Enrollments

Lists all enrollments for a specific course.

- **URL:** `GET /api/training/courses/[courseId]/enrollments`
- **Authentication:** Required
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 20)
- **Response:**
  ```json
  {
    "enrollments": [
      {
        "id": "enroll123",
        "courseId": "course123",
        "userId": "user456",
        "status": "confirmed",
        "paymentStatus": "paid",
        "paymentId": "pay789",
        "paymentAmount": 299.99,
        "enrollmentDate": "2025-05-15T10:30:00Z",
        "completionDate": null,
        "feedback": null,
        "rating": null,
        "certificateId": null,
        "firstName": "John",
        "lastName": "Doe",
        "fullName": "John Doe",
        "email": "john@example.com",
        "avatarUrl": "https://example.com/avatar.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
  ```

### Enroll in a Course

Creates a new enrollment for the current user.

- **URL:** `POST /api/training/courses/[courseId]/enrollments`
- **Authentication:** Required
- **Request Body:**
  ```json
  {
    "paymentId": "pay123",
    "paymentAmount": 299.99,
    "status": "pending",
    "paymentStatus": "pending"
  }
  ```
- **Response:** The created enrollment object with status 201

### Get Enrollment Details

Retrieves details for a specific enrollment.

- **URL:** `GET /api/training/enrollments/[enrollmentId]`
- **Authentication:** Required (Admin or enrollment owner)
- **Response:** Complete enrollment object with course details

### Update Enrollment

Updates an enrollment's status, payment information, or feedback.

- **URL:** `PUT /api/training/enrollments/[enrollmentId]`
- **Authentication:** Required (Admin for all fields, users can only update feedback and rating)
- **Request Body:** Any enrollment properties to update
- **Response:** The updated enrollment object

### Cancel Enrollment

Cancels an enrollment (soft delete).

- **URL:** `DELETE /api/training/enrollments/[enrollmentId]`
- **Authentication:** Required (Admin or enrollment owner)
- **Response:**
  ```json
  {
    "message": "Enrollment cancelled successfully"
  }
  ```

### Get User Enrollments

Retrieves all enrollments for the current user.

- **URL:** `GET /api/training/user/enrollments`
- **Authentication:** Required
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 10)
  - `status` - Filter by enrollment status
- **Response:** List of user's enrollments with course details

## Category APIs

### List All Categories

Retrieves all course categories.

- **URL:** `GET /api/training/categories`
- **Authentication:** Required
- **Query Parameters:**
  - `includeInactive` - Include inactive categories (default: false)
- **Response:**
  ```json
  {
    "categories": [
      {
        "id": "cat123",
        "name": "Web Development",
        "description": "Courses related to web technologies",
        "icon": "code",
        "color": "#3498db",
        "displayOrder": 1,
        "isActive": true,
        "createdAt": "2025-01-10T08:00:00Z",
        "updatedAt": "2025-01-10T08:00:00Z"
      }
    ]
  }
  ```

### Create a Category

Creates a new course category.

- **URL:** `POST /api/training/categories`
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "name": "Machine Learning",
    "description": "AI and machine learning courses",
    "icon": "brain",
    "color": "#9b59b6",
    "displayOrder": 3,
    "isActive": true
  }
  ```
- **Response:** The created category object with status 201

### Get Category Details

Retrieves details for a specific category.

- **URL:** `GET /api/training/categories/[categoryId]`
- **Authentication:** Required
- **Response:** Complete category object

### Update a Category

Updates an existing category.

- **URL:** `PUT /api/training/categories/[categoryId]`
- **Authentication:** Required (Admin only)
- **Request Body:** Any category properties to update
- **Response:** The updated category object

### Delete a Category

Soft deletes a category (marks as deleted but preserves data).

- **URL:** `DELETE /api/training/categories/[categoryId]`
- **Authentication:** Required (Admin only)
- **Response:**
  ```json
  {
    "message": "Category deleted successfully"
  }
  ```

## Waitlist APIs

### List Course Waitlist

Lists all users on the waitlist for a specific course.

- **URL:** `GET /api/training/courses/[courseId]/waitlist`
- **Authentication:** Required (Admin only)
- **Query Parameters:**
  - `page` - Page number (default: 1)
  - `limit` - Items per page (default: 20)
- **Response:**
  ```json
  {
    "waitlist": [
      {
        "id": "wait123",
        "courseId": "course123",
        "userId": "user456",
        "joinedAt": "2025-05-10T14:30:00Z",
        "status": "waiting",
        "notificationSent": false,
        "notificationDate": null,
        "firstName": "Sarah",
        "lastName": "Johnson",
        "fullName": "Sarah Johnson",
        "email": "sarah@example.com",
        "avatarUrl": "https://example.com/sarah.jpg"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1
    }
  }
  ```

### Join Waitlist

Adds the current user to a course waitlist.

- **URL:** `POST /api/training/courses/[courseId]/waitlist`
- **Authentication:** Required
- **Response:** The created waitlist entry with status 201

### Get Waitlist Entry Details

Retrieves details for a specific waitlist entry.

- **URL:** `GET /api/training/waitlist/[waitlistId]`
- **Authentication:** Required (Admin or waitlist entry owner)
- **Response:** Complete waitlist entry object with course details

### Update Waitlist Entry

Updates a waitlist entry's status or notification flags.

- **URL:** `PUT /api/training/waitlist/[waitlistId]`
- **Authentication:** Required (Admin only)
- **Request Body:**
  ```json
  {
    "status": "invited",
    "notificationSent": true
  }
  ```
- **Response:** The updated waitlist entry object

### Leave Waitlist

Removes user from a waitlist (soft delete).

- **URL:** `DELETE /api/training/waitlist/[waitlistId]`
- **Authentication:** Required (Admin or waitlist entry owner)
- **Response:**
  ```json
  {
    "message": "Removed from waitlist successfully"
  }
  ```

## Authentication & Authorization

All API routes require authentication via Clerk.js. The `validateUserAccess` middleware:

1. Validates the authentication token
2. Checks user roles for admin-only routes
3. Provides user information to API handlers

Admin-only routes require the user to have the `ADMIN` role.

## Error Handling

All API routes implement consistent error handling:

- **400** - Bad Request (invalid input)
- **401** - Unauthorized (not authenticated)
- **403** - Forbidden (not authorized)
- **404** - Not Found (resource does not exist)
- **500** - Server Error (unexpected errors)

Error responses follow this format:
```json
{
  "error": "Error message describing the issue"
}
```

## Data Models

### Course

```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  dates: string;
  time: string;
  duration: string;
  mode: 'online' | 'in-person' | 'hybrid';
  location?: string;
  instructor: string;
  maxCapacity: number;
  currentEnrollment: number;
  availability: number;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  prerequisites?: string[];
  certification?: string;
  language: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Enrollment

```typescript
interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentId?: string;
  paymentAmount?: number;
  enrollmentDate: string;
  completionDate?: string;
  feedback?: string;
  rating?: number;
  certificateId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

### Waitlist Entry

```typescript
interface WaitlistEntry {
  id: string;
  courseId: string;
  userId: string;
  joinedAt: string;
  status: 'waiting' | 'invited' | 'enrolled' | 'expired';
  notificationSent: boolean;
  notificationDate?: string;
  createdAt: string;
  updatedAt: string;
}
```