// app/api/auth/role/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ role: null });
  }
  
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  return NextResponse.json({ role: user.privateMetadata.role });
}