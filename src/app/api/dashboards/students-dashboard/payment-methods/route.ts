// src/app/api/student/payment-methods/route.ts
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

    // Connect to your payment processor (e.g., Stripe) and fetch payment methods
    // This is example data
    const paymentMethods = [
      {
        id: 'pm_1',
        last4: '4242',
        brand: 'Visa',
        expiryMonth: 12,
        expiryYear: 2024
      }
    ];

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
  }
}


