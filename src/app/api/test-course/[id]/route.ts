// src/app/api/test-course/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Always await params before using them
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  console.log("GET request received for test-course with ID:", id);
  
  return NextResponse.json({
    message: 'Test API working',
    courseId: id
  });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Always await params before using them
  const resolvedParams = await Promise.resolve(params);
  const id = resolvedParams.id;
  
  console.log("POST request received for test-course with ID:", id);
  
  try {
    const data = await request.json();
    
    return NextResponse.json({
      message: 'Test POST API working',
      courseId: id,
      receivedData: data
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
  }
}