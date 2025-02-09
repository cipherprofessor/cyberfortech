// src/app/api/forum/attachments/route.ts
import { createClient } from '@libsql/client';
import { NextResponse, NextRequest } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getAuth } from '@clerk/nextjs/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}-${file.name}`;
        const filePath = path.join(process.cwd(), 'public', 'uploads', fileName);

        await writeFile(filePath, buffer);

        // Save file info to database
        const result = await client.execute({
          sql: `
            INSERT INTO forum_attachments (
              user_id,
              file_name,
              original_name,
              file_type,
              file_size,
              created_at
            ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `,
          args: [
            userId,
            fileName,
            file.name,
            file.type,
            file.size
          ]
        });

        return {
          id: result.lastInsertRowid,
          fileName,
          url: `/uploads/${fileName}`
        };
      })
    );

    return NextResponse.json(uploadResults);
  } catch (error) {
    console.error('Error uploading attachments:', error);
    return NextResponse.json(
      { error: 'Failed to upload attachments' },
      { status: 500 }
    );
  }
}