// src/app/api/contact/route.ts
import { createClient } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// Define interfaces for type safety - for internal use, not for the database
interface ContactMetadata {
  sourcePage?: string;
  userAgent?: string | null;
  submittedAt?: string;
  partnerType?: string;
  partnerPageSubmission?: boolean;
  [key: string]: any;
}

export async function POST(request: NextRequest) {
  // Validate environment variables
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return NextResponse.json(
      { error: 'Database configuration missing' }, 
      { status: 500 }
    );
  }

  // Create database client
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Parse request body
    const body = await request.json();

    // Validate input
    const { name, email, phone, subject, message, sourcePage, metadata } = body;
    
    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // Get source page information
    // If not provided in the request, try to get from referer header
    const pageSource = sourcePage || request.headers.get('referer') || 'unknown';
    
    // Handle metadata - use provided metadata or create a new one
    let metadataObject: ContactMetadata = {};
    
    if (metadata && typeof metadata === 'string') {
      try {
        // If metadata is already a JSON string, parse it
        metadataObject = JSON.parse(metadata);
      } catch (error) {
        // If parsing fails, use empty object
        console.error('Failed to parse metadata string:', error);
      }
    } else if (metadata && typeof metadata === 'object') {
      // If metadata is already an object, use it directly
      metadataObject = metadata as ContactMetadata;
    }
    
    // Add or update source page info
    metadataObject.sourcePage = pageSource;
    metadataObject.userAgent = request.headers.get('user-agent');
    if (!metadataObject.submittedAt) {
      metadataObject.submittedAt = new Date().toISOString();
    }
    
    // Convert to JSON string for storage - this is what gets stored in the database
    const metadataString: string = JSON.stringify(metadataObject);

    // Insert contact form submission
    await db.execute({
      sql: `
        INSERT INTO contacts
        (id, name, email, phone, subject, message, metadata) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        uuidv4(), 
        name || 'Anonymous', 
        email, 
        phone || null, 
        subject, 
        message,
        metadataString // This needs to be a string
      ]
    });

    return NextResponse.json(
      { 
        message: 'Your message has been submitted successfully. We will get back to you soon!' 
      }, 
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit contact form' }, 
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}

export async function GET(request: NextRequest) {
  // Validate environment variables
  if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
    return NextResponse.json(
      { error: 'Database configuration missing' }, 
      { status: 500 }
    );
  }

  // Create database client
  const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortOrder = searchParams.get('sortOrder') || 'DESC';
    const searchTerm = searchParams.get('search') || '';
    const sourcePage = searchParams.get('sourcePage') || '';

    // Build the WHERE clause based on parameters
    let whereClause = 'WHERE is_deleted = FALSE';
    const queryParams: any[] = [];

    if (status) {
      whereClause += ' AND status = ?';
      queryParams.push(status);
    }

    if (searchTerm) {
      whereClause += ` AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)`;
      const searchPattern = `%${searchTerm}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (sourcePage) {
      whereClause += ` AND metadata LIKE ?`;
      queryParams.push(`%${sourcePage}%`);
    }

    // Get total count
    const countResult = await db.execute({
      sql: `SELECT COUNT(*) as total FROM contacts ${whereClause}`,
      args: queryParams
    });
    
    const total = Number(countResult.rows[0].total);

    // Make sure sortBy is a valid column to prevent SQL injection
    const validColumns = ['created_at', 'updated_at', 'status', 'priority', 'name', 'email'];
    const validSortBy = validColumns.includes(sortBy) ? sortBy : 'created_at';
    
    // Make sure sortOrder is valid
    const validSortOrder = sortOrder === 'ASC' ? 'ASC' : 'DESC';

    // Execute the query with pagination
    const result = await db.execute({
      sql: `
        SELECT 
          id, 
          name, 
          email, 
          phone, 
          subject, 
          message, 
          status, 
          priority, 
          assigned_to, 
          response, 
          responded_at,
          metadata,
          created_at, 
          updated_at
        FROM contacts 
        ${whereClause}
        ORDER BY ${validSortBy} ${validSortOrder}
        LIMIT ? OFFSET ?
      `,
      args: [...queryParams, limit, offset]
    });

    // Parse metadata field in each record
    const contacts = result.rows.map(row => {
      const contact = { ...row };
      if (contact.metadata && typeof contact.metadata === 'string') {
        try {
          // Parse the string metadata into an object
          const parsedMetadata = JSON.parse(contact.metadata);
          contact.metadata = parsedMetadata;
        } catch (error) {
          console.error('Error parsing metadata JSON:', error);
          contact.metadata = null; // Fallback to null
        }
      }
      return contact;
    });

    return NextResponse.json({
      contacts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' }, 
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}