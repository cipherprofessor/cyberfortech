// src/app/api/training/categories/[categoryId]/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface CategoryUpdateBody {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
  isActive?: boolean;
}

// GET a specific category by ID
export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { categoryId } = params;
    
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
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [categoryId]
    });
    
    if (!result.rows.length) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    const category = {
      ...result.rows[0],
      displayOrder: Number(result.rows[0].displayOrder),
      isActive: Boolean(result.rows[0].isActive)
    };
    
    return NextResponse.json(category);
    
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

// UPDATE a category (admin only)
export async function PUT(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { categoryId } = params;
    const body = await request.json() as CategoryUpdateBody;
    
    // Check if category exists
    const categoryExists = await client.execute({
      sql: 'SELECT id FROM training_categories WHERE id = ? AND is_deleted = FALSE',
      args: [categoryId]
    });
    
    if (!categoryExists.rows.length) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // If name is being updated, check for uniqueness
    if (body.name) {
      const nameExists = await client.execute({
        sql: 'SELECT id FROM training_categories WHERE name = ? AND id != ? AND is_deleted = FALSE',
        args: [body.name, categoryId]
      });
      
      if (nameExists.rows.length > 0) {
        return NextResponse.json(
          { error: 'Category with this name already exists' },
          { status: 400 }
        );
      }
    }
    
    // Build update SQL
    const updates: string[] = [];
    const queryParams: any[] = [];
    
    // Helper function to add a field to the update
    const addField = (fieldName: string, value: any, dbFieldName?: string) => {
      if (value !== undefined) {
        updates.push(`${dbFieldName || fieldName} = ?`);
        queryParams.push(value);
      }
    };
    
    // Add all possible fields
    addField('name', body.name);
    addField('description', body.description);
    addField('icon', body.icon);
    addField('color', body.color);
    addField('displayOrder', body.displayOrder, 'display_order');
    addField('isActive', body.isActive !== undefined ? (body.isActive ? 1 : 0) : undefined, 'is_active');
    
    // Only proceed if there are fields to update
    if (updates.length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Add updated_at timestamp
    updates.push('updated_at = CURRENT_TIMESTAMP');
    
    // Execute the update
    await client.execute({
      sql: `
        UPDATE training_categories
        SET ${updates.join(', ')}
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [...queryParams, categoryId]
    });
    
    // Fetch the updated category
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
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [categoryId]
    });
    
    const updatedCategory = {
      ...result.rows[0],
      displayOrder: Number(result.rows[0].displayOrder),
      isActive: Boolean(result.rows[0].isActive)
    };
    
    return NextResponse.json(updatedCategory);
    
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE a category (admin only, soft delete)
export async function DELETE(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }
    
    const { categoryId } = params;
    
    // Check if category exists
    const categoryExists = await client.execute({
      sql: 'SELECT id FROM training_categories WHERE id = ? AND is_deleted = FALSE',
      args: [categoryId]
    });
    
    if (!categoryExists.rows.length) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    // Check if there are active courses using this category
    const coursesUsingCategory = await client.execute({
      sql: `
        SELECT COUNT(*) as count
        FROM training_courses
        WHERE category = (
          SELECT name FROM training_categories WHERE id = ?
        ) AND is_deleted = FALSE
      `,
      args: [categoryId]
    });
    
    if (Number(coursesUsingCategory.rows[0].count) > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with active courses' },
        { status: 400 }
      );
    }
    
    // Soft delete the category
    await client.execute({
      sql: `
        UPDATE training_categories
        SET 
          is_deleted = TRUE,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [categoryId]
    });
    
    return NextResponse.json({
      message: 'Category deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}