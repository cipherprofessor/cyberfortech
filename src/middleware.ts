// src/middleware.ts
import { clerkMiddleware } from "@clerk/nextjs";

export default clerkMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/about",
    "/contact",
    "/courses",
    "/api/courses(.*)",
    "/api/contact",
  ],

  // Routes that can be accessed while signed in or not
  ignoredRoutes: [
    "/api/webhook/clerk",
    "/api/webhook/stripe",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};