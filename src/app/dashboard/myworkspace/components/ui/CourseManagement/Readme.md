# CyberFort Learning Management System - Course Management Module

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
4. [Features](#features)
5. [Technical Stack](#technical-stack)
6. [Components](#components)
7. [API Integration](#api-integration)
8. [State Management](#state-management)
9. [Styling](#styling)
10. [Authentication and Authorization](#authentication-and-authorization)
11. [Development Workflow](#development-workflow)
12. [File Organization](#file-organization)
13. [Best Practices](#best-practices)
14. [Dark Mode Support](#dark-mode-support)
15. [Troubleshooting](#troubleshooting)

## Introduction
CyberFort is a Learning Management System (LMS) built with Next.js that enables educational institutions to create and manage courses, enroll students, and track learning progress. The Course Management module specifically handles the creation, editing, and management of course content.

The system supports different user roles (Super Admin, Admin, Instructor, and Student) with appropriate access controls. It provides a comprehensive set of features for course creation, including detailed course information, instructor selection, multimedia content, and structured learning paths.

## Project Structure
The project follows a modular architecture with clear separation of concerns. Here's the high-level structure of the Course Management module:

```
src/
  ├── app/
  │   ├── dashboard/
  │   │   └── myworkspace/
  │   │       └── components/
  │   │           └── ui/
  │   │               └── CourseManagement/
  │   │                   ├── CourseManagement.tsx
  │   │                   ├── CourseManagement.module.scss
  │   │                   ├── CourseCreatePage/
  │   │                   │   ├── CourseCreatePage.tsx
  │   │                   │   ├── CourseCreatePage.module.scss
  │   │                   │   ├── api/
  │   │                   │   │   └── courseContentApi.ts
  │   │                   │   ├── components/
  │   │                   │   │   └── StepIndicator/
  │   │                   │   │       ├── StepIndicator.tsx
  │   │                   │   │       └── StepIndicator.module.scss
  │   │                   │   └── steps/
  │   │                   │       ├── BasicInfoStep/
  │   │                   │       ├── InstructorSelectionStep/
  │   │                   │       ├── CourseImageStep/
  │   │                   │       ├── CourseDetailsStep/
  │   │                   │       └── CourseContentStep/
  │   │                   ├── components/
  │   │                   │   ├── CourseCard/
  │   │                   │   ├── EmptyState/
  │   │                   │   ├── Header/
  │   │                   │   └── SearchControls/
  │   ├── api/
  │   │   ├── courses/
  │   │   │   ├── manage/
  │   │   │   │   ├── route.ts
  │   │   │   │   └── [courseId]/
  │   │   │   │       └── route.ts
  │   │   │   └── [courseId]/
  │   │   │       └── content/
  │   │   │           └── route.ts
  │   │   └── users/
  │   │       └── instructors/
  │   │           └── route.ts
  ├── components/
  │   └── ui/
  │       ├── Mine/
  │       │   └── Alert/
  │       │       └── Alert.tsx
  │       └── DeleteConfirmation/
  │           └── DeleteConfirmation.tsx
  ├── types/
  │   └── courses.ts
  └── utils/
      └── courseDataAdapter.ts
```

## Architecture
The application follows a client-side rendering approach using Next.js App Router. It uses a modular component-based architecture with the following key principles:

1. **Component Modularity**: Each component has a single responsibility and is reusable
2. **Separation of Concerns**: UI logic is separated from business logic and API calls
3. **Step-based Pattern**: Complex forms are broken down into steps for better UX
4. **Adapter Pattern**: Data from APIs is normalized through adapter utilities
5. **Responsive Design**: All components adapt to different screen sizes

## Features

### Course Management
- Course listing with search and filter functionality
- Course creation with multi-step form process
- Course editing with pre-filled data
- Course deletion with confirmation dialog
- Responsive UI for all device sizes

### Course Creation Flow
The course creation process is divided into 5 logical steps:

1. **Basic Information**
   - Course title, description, category
   - Price, duration, experience level

2. **Instructor Selection**
   - Searchable instructor list
   - Instructor details view
   - Clear selection interface

3. **Course Image**
   - Image upload with preview
   - URL-based image selection
   - Image guidelines

4. **Course Details**
   - Course demo URL
   - Course outline
   - Learning objectives (dynamic list)
   - Prerequisites (dynamic list)
   - Target audience
   - Estimated completion time

5. **Content Structure**
   - Section management (create, update, delete)
   - Lesson management within sections
   - Different content types (video, article, quiz, assignment)
   - Free preview settings

## Technical Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: SCSS Modules for component-scoped styling
- **State Management**: React Hooks (useState, useEffect, useContext)
- **UI Components**: Custom components + HeroUI (@heroui/react)
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Database**: Turso (libSQL)
- **Authentication**: Clerk Auth
- **API**: Next.js API Routes with libSQL client
- **File Storage**: ImageKit for image uploads

### Development Tools
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Version Control**: Git
- **Package Manager**: npm/yarn

## Components

### Core Components

#### CourseManagement
The main container component that handles the course listing, search, and CRUD operations.

```typescript
// src/app/dashboard/myworkspace/components/ui/CourseManagement/CourseManagement.tsx
export function CourseManagement() {
  // State and methods for course management
}
```

#### CourseCreatePage
The main component for course creation that manages the step flow and form state.

```typescript
// src/app/dashboard/myworkspace/components/ui/CourseManagement/CourseCreatePage/CourseCreatePage.tsx
export function CourseCreatePage({
  mode,
  course,
  onSubmit,
  onCancel
}: CourseCreatePageProps) {
  // Step management and form state logic
}
```

### Step Components

Each step in the course creation process is implemented as a separate component:

1. **BasicInfoStep**: Handles basic course information
2. **InstructorSelectionStep**: Provides a dedicated interface for selecting an instructor
3. **CourseImageStep**: Manages course image selection or upload
4. **CourseDetailsStep**: Handles additional course details, objectives, and prerequisites
5. **CourseContentStep**: Manages the course structure with sections and lessons

### Utility Components

- **StepIndicator**: Shows progress through the multi-step form
- **CourseCard**: Displays course information in a card layout
- **SearchControls**: Provides search functionality for courses
- **EmptyState**: Shown when no courses are available
- **DeleteConfirmDialog**: Confirmation dialog for course deletion

## API Integration

### Course API
The application interacts with several API endpoints for course management:

- **GET /api/courses/manage**: Fetches all courses
- **POST /api/courses/manage**: Creates a new course
- **PUT /api/courses/manage/[courseId]**: Updates an existing course
- **DELETE /api/courses/manage/[courseId]**: Deletes a course

### Course Content API
Dedicated endpoints for managing course content:

- **GET /api/courses/[courseId]/content**: Fetches course content
- **POST /api/courses/[courseId]/content**: Creates or updates course content

### Instructors API
- **GET /api/users/instructors**: Fetches instructor data

### API Adapter
The `courseDataAdapter.ts` utility normalizes data from the API to ensure consistent structure:

```typescript
// src/utils/courseDataAdapter.ts
export const normalizeInstructorsData = (data: any): Instructor[] => {
  // Normalize instructor data from API
};
```

## State Management

The application uses React's built-in state management with hooks:

- `useState`: For component-level state
- `useEffect`: For side effects like API calls
- `useCallback`: For memoized callbacks

State is managed hierarchically:
- `CourseManagement`: Manages the list of courses and CRUD operations
- `CourseCreatePage`: Manages the form state and step flow
- Step components: Manage their specific form sections

## Styling

The project uses SCSS Modules for component-scoped styling, with these key features:

- **Module-based**: Each component has its own SCSS module
- **Dark Mode Support**: All components support light and dark themes
- **Responsive Design**: Media queries ensure responsive behavior
- **CSS Variables**: For theme-specific values
- **BEM-inspired Naming**: For clear CSS class naming convention

Example:
```scss
// src/app/dashboard/myworkspace/components/ui/CourseManagement/CourseCreatePage/steps/BasicInfoStep/BasicInfoStep.module.scss
.container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  &.dark {
    // Dark mode styles
  }
}
```

## Authentication and Authorization

The application uses Clerk Auth for authentication and role-based access control:

- **Super Admin**: Full access to all features
- **Admin**: Can manage courses but with some restrictions
- **Instructor**: Can view and manage their own courses
- **Student**: Can view courses and access learning materials

A custom `useAuth` hook manages the authentication state and role-based permissions.

## Development Workflow

### Component Development Process
1. Create component folder and files
2. Implement component logic
3. Create SCSS module for styling
4. Add dark mode support
5. Test component functionality
6. Integrate with parent components

### Best Practices
1. **TypeScript Types**: Use strong typing for props and state
2. **Component Structure**: Follow consistent component structure
3. **Error Handling**: Implement proper error handling for API calls
4. **Responsive Design**: Ensure all components work on different devices
5. **Accessibility**: Follow accessibility best practices
6. **Performance**: Optimize for performance with memoization and lazy loading

## File Organization

Each component follows this file structure:

```
ComponentName/
├── ComponentName.tsx       # Component logic
├── ComponentName.module.scss  # Component styles
└── index.ts                # Export file (optional)
```

For larger components with sub-components:

```
ComponentName/
├── ComponentName.tsx       # Main component
├── ComponentName.module.scss  # Main styles
├── components/             # Sub-components
│   └── SubComponent/
│       ├── SubComponent.tsx
│       └── SubComponent.module.scss
└── index.ts                # Export file
```

## Dark Mode Support

The application fully supports dark mode using Next.js themes:

- **Theme Provider**: `useTheme()` hook from next-themes
- **Theme Toggle**: Users can switch between light and dark modes
- **System Preference**: Default theme based on system preference
- **Persistent**: Theme choice is saved in local storage

Implementation:
```tsx
const { theme } = useTheme();
const isDark = theme === 'dark';

return (
  <div className={`${styles.container} ${isDark ? styles.dark : ''}`}>
    {/* Component content */}
  </div>
);
```

## Troubleshooting

### Common Issues

#### Instructor Selection Not Working
If the instructor dropdown doesn't show options:
- Check the API response format
- Ensure the instructors data is properly normalized
- Verify the z-index of the dropdown container

#### Course Content Not Saving
- Verify the course ID is correctly passed
- Check the API endpoint URL
- Validate the request payload format

#### Image Upload Issues
- Ensure the upload API is correctly configured
- Check file size and format validation
- Verify CORS settings if using external storage

## Conclusion

The Course Management module provides a comprehensive solution for creating and managing courses in the CyberFort Learning Management System. Its modular architecture, step-based approach, and responsive design deliver an excellent user experience for both administrators and instructors.

The separation of concerns into discrete components makes the codebase maintainable and extensible, while the consistent styling and dark mode support ensure a professional appearance across devices and user preferences.