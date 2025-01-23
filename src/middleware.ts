// src/middleware.ts
import { clerkClient, clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/sign-in", "/sign-up", "/about", "/contact", "/courses", "/api/courses", "/api/contact"];
const adminRoutes = ["/admin", "/dashboard/admin", "/api/admin"];
const superAdminRoutes = ["/superadmin", "/dashboard/superadmin", "/api/superadmin"];

export default clerkMiddleware(async (auth, req) => {
 const { userId } = await auth();
 const path = new URL(req.url).pathname;

 if (!userId && isPublicRoute(path)) return;
 if (!userId) return NextResponse.redirect(new URL('/sign-in', req.url));

 const client = await clerkClient();
 const user = await client.users.getUser(userId);
 const userRole = user.publicMetadata.role as string;
//  console.log("userRole", userRole);
//  console.log("user",user)

 if (isSuperAdminRoute(path) && userRole !== 'superadmin') {
   return NextResponse.redirect(new URL('/', req.url));
 }

 if (isAdminRoute(path) && !['superadmin', 'admin'].includes(userRole)) {
   return NextResponse.redirect(new URL('/', req.url));
 }
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