// src/middleware.ts
import { NextResponse } from "next/server";
import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";

const publicRoutes = ["/", "/sign-in",  "/sign-in(.*)", "/sign-up(.*)", "/sign-up", "/about", "/contact", "/courses", "/blog", "/api/courses", "/api/contact", "/api/blog"];
const adminRoutes = ["/admin", "/dashboard/admin", "/api/admin"];
const superAdminRoutes = ["/superadmin", "/dashboard/superadmin", "/api/superadmin"];

// Use Clerk's clerkMiddleware for the middleware implementation
export default clerkMiddleware(async (auth, req) => {
  // Get auth data using the await auth() pattern
  const { userId } = await auth();
  const path = new URL(req.url).pathname;

  // Allow public routes
  if (!userId && isPublicRoute(path)) return;
  
  // Redirect to sign-in if not authenticated and not public
  if (!userId) return NextResponse.redirect(new URL('/sign-in', req.url));

  // For protected routes, check user role
  if (userId) {
    // Get the client and then the user
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userRole = user.publicMetadata.role as string;

    if (isSuperAdminRoute(path) && userRole !== 'superadmin') {
      return NextResponse.redirect(new URL('/', req.url));
    }

    if (isAdminRoute(path) && !['superadmin', 'admin'].includes(userRole)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
});

function isPublicRoute(path: string) {
  return publicRoutes.some(route => path === route || path.startsWith(route + "/"));
}

function isAdminRoute(path: string) {
  return adminRoutes.some(route => path.startsWith(route));
}

function isSuperAdminRoute(path: string) {
  return superAdminRoutes.some(route => path.startsWith(route));
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};