## How to Integrate the Auth Component in Your Project

### 1. File Structure

Place the component files in your project:

```
src/
  app/
    (auth)/
      sign-in/
        page.tsx
      sign-up/
        page.tsx
  components/
    auth/
      AuthCard.tsx
      AuthCard.module.scss
  hooks/
    useAuth.ts  # Your existing hook with our additions
```

### 2. Update Your Navbar Links

Modify your existing Navbar.tsx to use your custom auth pages instead of the default Clerk modals:

```tsx
// From this:
<SignInButton>
  <Button variant="ghost" size="sm" className={styles.signInButton}>
    Sign In1
  </Button>
</SignInButton>

// To this:
<Link href="/sign-in">
  <Button variant="ghost" size="sm" className={styles.signInButton}>
    Sign In
  </Button>
</Link>

// And update the sign-up button similarly:
<Link href="/sign-up">
  <Button variant="solid" size="sm" className={styles.signUpButton}>
    Sign Up
  </Button>
</Link>
```

### 3. Create the Sign In and Sign Up Pages

#### Sign In Page

```tsx
// src/app/(auth)/sign-in/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/auth/AuthCard';
import styles from './page.module.scss';

export default function SignInPage() {
  const router = useRouter();
  
  return (
    <div className={styles.authContainer}>
      <AuthCard 
        mode="signin"
        backgroundImage="/images/auth-bg.jpg"
        onSuccess={() => router.push('/dashboard')}
      />
    </div>
  );
}
```

#### Sign Up Page

```tsx
// src/app/(auth)/sign-up/page.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthCard from '@/components/auth/AuthCard';
import styles from './page.module.scss';

export default function SignUpPage() {
  const router = useRouter();
  
  return (
    <div className={styles.authContainer}>
      <AuthCard 
        mode="signup"
        backgroundImage="/images/learning-bg.jpg"
        onSuccess={() => router.push('/dashboard')}
      />
    </div>
  );
}
```

#### Shared Styles for Auth Pages

```scss
// src/app/(auth)/sign-in/page.module.scss
// (same for sign-up/page.module.scss)
.authContainer {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
}
```

### 4. Update Clerk Configuration

Update your .env.local file:

```
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 5. Update Middleware

Ensure your middleware allows access to these new pages:

```tsx
// src/middleware.ts
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    '/',
    '/courses',
    '/blog',
    '/forum',
    '/about',
    '/contact',
    '/sign-in',
    '/sign-up',
    // Other public routes...
  ]
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

### 6. Set Up Webhook for Role Assignment (Optional)

To automatically assign roles to users when they sign up, create a webhook endpoint:

```tsx
// src/app/api/webhook/clerk/route.ts
import { WebhookEvent } from '@clerk/nextjs/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

export async function POST(req: Request) {
  // Get webhook secret from environment variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET');
  }

  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Missing svix headers', { status: 400 });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Create a new Svix instance with your secret
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }

  // Process the webhook event
  if (evt.type === 'user.created') {
    // Get user data from the event
    const { id, unsafe_metadata } = evt.data;
    const role = unsafe_metadata?.role || 'student';
    
    try {
      // Update user metadata with Clerk API
      const CLERK_API_KEY = process.env.CLERK_SECRET_KEY;
      await fetch(`https://api.clerk.dev/v1/users/${id}/metadata`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${CLERK_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_metadata: {
            role: role,
          },
        }),
      });
      
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error('Error setting user role:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to set user role' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
```

### 7. Add Dashboard Route Protection

Protect your dashboard routes using your updated useAuth hook:

```tsx
// src/app/(dashboard)/layout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Loading from '@/components/common/Loading';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/sign-in');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null; // Will redirect via the useEffect
  }

  return (
    <div className="dashboard-layout">
      {children}
    </div>
  );
}
```

### 8. Role-Based Access Protection

For routes that need specific role access:

```tsx
// src/app/(dashboard)/admin/layout.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ROLES } from '@/constants/auth';
import AccessDenied from '@/components/common/AccessDenied';
import Loading from '@/components/common/Loading';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading, isAdmin, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !(isAdmin || isSuperAdmin)) {
      router.push('/dashboard');
    }
  }, [isAdmin, isSuperAdmin, isLoading, router]);

  if (isLoading) {
    return <Loading />;
  }

  if (!(isAdmin || isSuperAdmin)) {
    return <AccessDenied />;
  }

  return (
    <div className="admin-layout">
      {children}
    </div>
  );
}
```

This implementation gives you a complete, flexible authentication system that's fully integrated with your existing project structure while providing a greatly improved user experience.