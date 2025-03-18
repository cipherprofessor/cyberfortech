// src/app/api/contact/[id]/route.ts
import { createClient, Value } from '@libsql/client';
import { NextRequest, NextResponse } from 'next/server';

// Define interfaces for type safety
interface ContactMetadata {
  sourcePage?: string;
  userAgent?: string | null;
  submittedAt?: string;
  partnerType?: string;
  partnerPageSubmission?: boolean;
  [key: string]: any; // Allow for additional properties
}

interface ContactParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: ContactParams
) {
  const { id } = params;

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
    // Fetch the contact by ID
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
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [id]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Contact not found' }, 
        { status: 404 }
      );
    }

    // Get the contact and parse metadata
    const contact = { ...result.rows[0] };
    
    if (contact.metadata) {
      try {
        const parsedMetadata = JSON.parse(contact.metadata as string) as ContactMetadata;
        contact.metadata = JSON.stringify(parsedMetadata) as unknown as Value;
      } catch (error) {
        console.error('Error parsing metadata JSON:', error);
        contact.metadata = JSON.stringify({}) as unknown as Value;
      }
    }

    // Fetch contact history
    const historyResult = await db.execute({
      sql: `
        SELECT 
          id,
          action,
          action_by,
          previous_status,
          new_status,
          notes,
          created_at
        FROM contact_history
        WHERE contact_id = ?
        ORDER BY created_at DESC
      `,
      args: [id]
    });

    return NextResponse.json({
      contact,
      history: historyResult.rows
    });
  } catch (error) {
    console.error('Error fetching contact details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contact details' }, 
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}

export async function PUT(
  request: NextRequest,
  { params }: ContactParams
) {
  const { id } = params;

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
    
    // Check if contact exists
    const checkResult = await db.execute({
      sql: 'SELECT id FROM contacts WHERE id = ? AND is_deleted = FALSE',
      args: [id]
    });

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Contact not found' }, 
        { status: 404 }
      );
    }

    // Determine what fields can be updated
    const allowedFields = [
      'status', 
      'priority', 
      'assigned_to', 
      'response', 
      'response_by'
    ];
    
    // Build update SQL
    let updateSQL = 'UPDATE contacts SET ';
    const updateValues: any[] = [];
    let hasUpdates = false;

    // Add fields to update
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        if (hasUpdates) updateSQL += ', ';
        updateSQL += `${field} = ?`;
        updateValues.push(body[field]);
        hasUpdates = true;
      }
    });

    // Add responded_at if response is provided
    if (body.response !== undefined && body.response) {
      if (hasUpdates) updateSQL += ', ';
      updateSQL += 'responded_at = CURRENT_TIMESTAMP';
      hasUpdates = true;
    }

    // Always update the updated_at timestamp
    if (hasUpdates) updateSQL += ', ';
    updateSQL += 'updated_at = CURRENT_TIMESTAMP';

    // Finalize SQL
    updateSQL += ' WHERE id = ?';
    updateValues.push(id);

    // Execute update if there are fields to update
    if (hasUpdates) {
      await db.execute({
        sql: updateSQL,
        args: updateValues
      });

      // Add history entry for updates (if relevant)
      if (body.action && body.action_by) {
        await db.execute({
          sql: `
            INSERT INTO contact_history (
              id,
              contact_id,
              action,
              action_by,
              notes,
              created_at
            ) VALUES (
              lower(hex(randomblob(16))),
              ?,
              ?,
              ?,
              ?,
              CURRENT_TIMESTAMP
            )
          `,
          args: [
            id,
            body.action,
            body.action_by,
            body.notes || null
          ]
        });
      }
    }

    return NextResponse.json({ 
      message: 'Contact updated successfully',
      success: true
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' }, 
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: ContactParams
) {
  const { id } = params;

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
    // We'll do a soft delete by setting is_deleted flag
    await db.execute({
      sql: `
        UPDATE contacts SET 
          is_deleted = TRUE,
          deleted_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [id]
    });

    return NextResponse.json({ 
      message: 'Contact deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' }, 
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}