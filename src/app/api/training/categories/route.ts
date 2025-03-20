// src/app/api/training/categories/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess, nanoid } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface CategoryBody {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// GET all categories
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    
    let whereClause = 'WHERE is_deleted = FALSE';
    if (!includeInactive) {
      whereClause += ' AND is_active = TRUE';
    }
    
    const result = await client.execute({
      sql: `
        SELECT 
          id,
          name,
          description,
          icon,
          color,
          display_order as displayOrder,
          is_active as isActive,
          created_at as createdAt,
          updated_at as updatedAt
        FROM training_categories
        ${whereClause}
        ORDER BY display_order ASC, name ASC
      `, args: []
    });
    
    const categories = result.rows.map(row => ({
      ...row,
      displayOrder: Number(row.displayOrder),
      isActive: Boolean(row.isActive)
    }));
    
    return NextResponse.json({ categories });
    
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// Create a new category (admin only)
export async function POST(request: Request) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const body = await request.json() as CategoryBody;
    
    // Validate required fields
    if (!body.name?.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Check if category with the same name already exists
    const existingCategory = await client.execute({
      sql: 'SELECT id FROM training_categories WHERE name = ? AND is_deleted = FALSE',
      args: [body.name]
    });
    
    if (existingCategory.rows.length > 0) {
      return NextResponse.json(
        { error: 'Category with this name already exists' },
        { status: 400 }
      );
    }
    
    // Generate unique ID
    const categoryId = nanoid();
    
    // Insert the category
    await client.execute({
      sql: `
        INSERT INTO training_categories (
          id,
          name,
          description,
          icon,
          color,
          display_order,
          is_active,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [
        categoryId,
        body.name,
        body.description || null,
        body.icon || null,
        body.color || null,
        body.displayOrder || 0,
        body.isActive !== undefined ? (body.isActive ? 1 : 0) : 1
      ]
    });
    
    // Return the created category
    const category = {
      id: categoryId,
      name: body.name,
      description: body.description,
      icon: body.icon,
      color: body.color,
      displayOrder: body.displayOrder || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json(category, { status: 201 });
    
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}