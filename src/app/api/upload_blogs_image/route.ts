// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { nanoid } from '@/lib/clerk';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

// Allowed file types
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml'
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    // Validate user authentication
    const { isAuthorized, user, error } = await validateUserAccess(request, [
      ROLES.ADMIN,
      ROLES.SUPERADMIN,
      ROLES.INSTRUCTOR,
      ROLES.STUDENT
    ]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds the maximum limit of 5MB.' },
        { status: 400 }
      );
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileExt = file.name.split('.').pop() || 'jpg';
    const fileName = `${nanoid()}.${fileExt}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      // Write file to disk
      await writeFile(join(uploadDir, fileName), buffer);
      
      // Return the URL to the uploaded file
      const fileUrl = `/uploads/${fileName}`;
      
      return NextResponse.json({
        success: true,
        url: fileUrl,
        fileName,
        type: file.type,
        size: file.size
      });
    } catch (err) {
      console.error('Error writing file:', err);
      return NextResponse.json(
        { error: 'Failed to save file. Please try again.' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'File upload failed' },
      { status: 500 }
    );
  }
}