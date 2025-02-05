// src/app/api/auth/sync/route.ts
import { createClient } from '@libsql/client';
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse, NextRequest } from 'next/server';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});


export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from Clerk
    const clerk = await clerkClient();
    const clerkUser = await clerk.users.getUser(userId);

    // Prepare social links
    const socialLinks = {
      github: clerkUser.externalAccounts.find(acc => acc.provider === 'github')?.username,
      twitter: clerkUser.externalAccounts.find(acc => acc.provider === 'twitter')?.username,
      // Add other social links as needed
    };

    // Insert or update user in your database
    await client.execute({
      sql: `
        INSERT INTO users (
          id,
          email,
          username,
          first_name,
          last_name,
          full_name,
          avatar_url,
          role,
          email_verified,
          social_links,
          clerk_metadata,
          last_login_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(id) DO UPDATE SET
          email = excluded.email,
          username = excluded.username,
          first_name = excluded.first_name,
          last_name = excluded.last_name,
          full_name = excluded.full_name,
          avatar_url = excluded.avatar_url,
          email_verified = excluded.email_verified,
          social_links = excluded.social_links,
          clerk_metadata = excluded.clerk_metadata,
          last_login_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      `,
      args: [
        userId,
        clerkUser.emailAddresses[0]?.emailAddress || '',
        clerkUser.username || null,
        clerkUser.firstName || null,
        clerkUser.lastName || null,
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || null,
        clerkUser.imageUrl || null,
        typeof clerkUser.publicMetadata?.role === 'string' ? clerkUser.publicMetadata.role : 'student',
        clerkUser.emailAddresses[0]?.verification?.status === 'verified' || false,
        JSON.stringify(socialLinks),
        JSON.stringify({
          publicMetadata: clerkUser.publicMetadata,
          privateMetadata: clerkUser.privateMetadata,
          lastSignInAt: clerkUser.lastSignInAt,
          createdAt: clerkUser.createdAt
        })
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}