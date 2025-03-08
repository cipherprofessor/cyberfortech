# Blog System Enhancements

This document explains the enhancements made to the blog system, focusing on the new features, API routes, and UI components.

## New Features Overview

1. **Enhanced BlogEditor**
   - Image upload support with preview
   - Categories and tags selection
   - Modern responsive layout
   - Two-column design for better organization
   - Improved error handling and feedback
   - Smooth animations with Framer Motion

2. **New API Routes**
   - `/api/upload` - File upload handling
   - `/api/blog/categories` - Category management
   - `/api/blog/tags` - Tag management

3. **Custom Hooks**
   - `useBlogOperations` - Centralized blog CRUD operations

## Directory Structure

```
src/
├── app/
│   ├── (routes)/blog/
│   │   ├── page.tsx                   # Main blog page
│   │   ├── BlogPage.module.scss       # Blog page styles
│   │   ├── new/
│   │   │   └── page.tsx               # New blog post page
│   │   └── [slug]/
│   │       └── page.tsx               # Individual blog post page
│   └── api/
│       ├── blog/
│       │   ├── route.ts               # Main blog API
│       │   ├── [slug]/
│       │   │   └── route.ts           # Single post API
│       │   ├── categories/
│       │   │   └── route.ts           # Categories API
│       │   └── tags/
│       │       └── route.ts           # Tags API
│       └── upload/
│           └── route.ts               # File upload API
├── components/
│   └── blog/
│       ├── BlogCard/
│       │   ├── index.tsx              # Blog card component
│       │   └── BlogCard.module.scss   # Blog card styles
│       ├── BlogEditor/
│       │   ├── index.tsx              # Blog editor component
│       │   └── BlogEditor.module.scss # Blog editor styles
│       └── BlogList/
│           ├── index.tsx              # Blog list component
│           └── BlogList.module.scss   # Blog list styles
├── contexts/
│   └── BlogContext.tsx                # Blog context provider
├── hooks/
│   └── useBlogOperations.ts           # Blog operations hook
└── services/
    └── blog-service.ts                # Shared blog service
```

## Setup Instructions

1. **Create Upload Directory**

First, create a directory for uploaded files:

```sh
mkdir -p public/uploads
```

2. **Configure TinyMCE**

Add your TinyMCE API key to the environment variables:

```
NEXT_PUBLIC_TINYMCE_API_KEY=your-api-key
```

3. **Run Database Migrations**

The database schema is already set up with the necessary tables.

## Feature Details

### 1. Image Upload

The system now supports two ways to add featured images:
- URL input
- File upload

The file upload API:
- Validates file types (only images allowed)
- Limits file size to 5MB
- Generates unique filenames
- Stores files in the public/uploads directory

### 2. Categories & Tags

- Categories are predefined and managed by admins
- Tags can be created by any user when creating/editing posts
- Both are stored in separate tables with junction tables for many-to-many relationships

### 3. Modern UI

The BlogEditor now features:
- Two-column layout (main content + sidebar)
- Collapsible panels for organization
- Real-time image preview
- Animated transitions and feedback
- Dark/light mode support

## Usage Example

```tsx
import { useBlogOperations } from '@/hooks/useBlogOperations';
import BlogEditor from '@/components/blog/BlogEditor';

function CreatePostPage() {
  const { handleCreatePost } = useBlogOperations();
  
  const handleCancel = () => {
    // Handle cancel action
  };
  
  return (
    <BlogEditor 
      onSave={handleCreatePost}
      onCancel={handleCancel}
    />
  );
}
```

## API Endpoints

1. **GET /api/blog** - List blog posts with filtering and pagination
2. **POST /api/blog** - Create a new blog post
3. **GET /api/blog/[slug]** - Get a specific blog post
4. **PUT /api/blog/[slug]** - Update a blog post
5. **DELETE /api/blog/[slug]** - Delete a blog post
6. **GET /api/blog/categories** - List all categories
7. **POST /api/blog/categories** - Create a new category (admin only)
8. **GET /api/blog/tags** - List all tags
9. **POST /api/blog/tags** - Create a new tag
10. **POST /api/upload** - Upload files

## Responsiveness

The enhanced UI is fully responsive:
- Desktop: Two-column layout
- Tablet: Adjusted spacing and panels
- Mobile: Single column layout with optimized controls