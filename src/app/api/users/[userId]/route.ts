// src/app/api/users/[userId]/route.ts
import { createClient } from '@libsql/client';
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function GET(
  req: NextRequest,
  context: { params: { userId: string } }
) {
  try {
    const { userId } = await Promise.resolve(context.params);
    
    // Verify authentication
    const { userId: authenticatedUserId } = getAuth(req);
    if (!authenticatedUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only allow users to fetch their own data unless they're an admin
    const userRole = await client.execute({
      sql: 'SELECT role FROM users WHERE id = ?',
      args: [authenticatedUserId]
    });

    const isAdmin = userRole.rows[0]?.role === 'admin' || userRole.rows[0]?.role === 'super_admin';
    if (!isAdmin && authenticatedUserId !== userId) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const result = await client.execute({
      sql: `
        SELECT id, email, name, role, avatar_url, created_at
        FROM users
        WHERE id = ?
      `,
      args: [userId]
    });

    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}