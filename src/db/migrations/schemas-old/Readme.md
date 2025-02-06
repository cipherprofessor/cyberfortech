// src/db/schemas/README.md

# Database Schema Documentation

## Overview
This directory contains the database schema definitions for our application. The schemas are split into multiple files for better organization and maintenance.

### Schema Files Order
1. 00_core.sql: Core database settings
2. 01_users.sql: User management system
3. 02_courses.sql: Course management system
4. 03_forum.sql: Forum system
5. 04_contacts.sql: Contact management system

### File Descriptions

#### 00_core.sql
- Contains core database configuration
- Sets up foreign key support
- Configures database performance settings

#### 01_users.sql
- User account management
- Authentication and authorization
- User profiles and preferences
- User statistics and activity tracking

#### 02_courses.sql
- Course creation and management
- Course sections and lessons
- Enrollments and progress tracking
- Course reviews and ratings

#### 03_forum.sql
- Forum categories and subcategories
- Topics and posts management
- User activity and statistics
- Reactions and attachments
- Analytics and trending content

#### 04_contacts.sql
- Contact form submissions
- Support ticket management
- Response tracking

## Usage
Run migrations in order using the migration script:
```bash
npm run migrate