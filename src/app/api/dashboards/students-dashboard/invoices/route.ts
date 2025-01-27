// src/app/api/student/invoices/route.ts
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

    // Connect to your payment processor and fetch invoices
    // This is example data
    const invoices = [
      {
        id: 'inv_1',
        amount: 49.99,
        status: 'paid',
        date: '2024-01-15',
        invoiceUrl: '/invoices/1'
      },
      {
        id: 'inv_2',
        amount: 49.99,
        status: 'pending',
        date: '2024-02-15',
        invoiceUrl: '/invoices/2'
      }
    ];

    return NextResponse.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}