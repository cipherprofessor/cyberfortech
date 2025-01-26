
// src/app/api/student/subscription/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function GET() {
  try {
    const { userId } = auth();
    
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