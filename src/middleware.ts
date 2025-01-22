// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, req) => {
  // Check if the user is not authenticated on a protected route
  const { userId } = await auth();

  if (!userId && !isPublicRoute(req)) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }
});

// Helper function to check public routes
function isPublicRoute(req: Request) {
  const path = new URL(req.url).pathname;
  const publicRoutes = [
    "/",
    "/sign-in",
    "/sign-up",
    "/about",
    "/contact", 
    "/courses",
    "/api/courses",
    "/api/contact",
  ];

  return publicRoutes.some(route => 
    path === route || 
    path.startsWith(route + "/") || 
    (route.includes("(.*)" ) && path.startsWith(route.replace("(.*)", "")))
  );
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};