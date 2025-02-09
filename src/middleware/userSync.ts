// src/middleware/userSync.ts
import { clerkMiddleware, getAuth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from '@libsql/client';
import { NextResponse } from "next/server";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default clerkMiddleware(async (auth, req) => {
  try {
    const { userId } = await auth();
    
    if (userId) {
      // Get user data from Clerk
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId);

      // Sync user to database
      await client.execute({
        sql: `
          INSERT INTO users (
            id, 
            email,
            first_name,
            last_name,
            full_name,
            avatar_url,
            role,
            email_verified,
            updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(id) DO UPDATE SET
            email = excluded.email,
            first_name = excluded.first_name,
            last_name = excluded.last_name,
            full_name = excluded.full_name,
            avatar_url = excluded.avatar_url,
            role = excluded.role,
            email_verified = excluded.email_verified,
            updated_at = CURRENT_TIMESTAMP
        `,
        args: [
          userId,
          user.emailAddresses[0]?.emailAddress || '',
          user.firstName || '',
          user.lastName || '',
          `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          user.imageUrl || '',
          typeof user.publicMetadata?.role === 'string' ? user.publicMetadata.role : 'student',
          user.emailAddresses[0]?.verification?.status === 'verified' || false
        ]
      });
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in user sync middleware:', error);
    return NextResponse.next();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};