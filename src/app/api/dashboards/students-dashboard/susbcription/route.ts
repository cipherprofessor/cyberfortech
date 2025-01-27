
// src/app/api/student/subscription/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to your payment processor and fetch subscription details
    // This is example data
    const subscription = {
      plan: 'Premium Plan',
      status: 'active',
      nextBillingDate: '2024-02-15',
      amount: 49.99
    };

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}