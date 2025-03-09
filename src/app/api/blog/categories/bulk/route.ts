// src/app/api/blog/categories/bulk/route.ts
import { createClient, type Transaction } from '@libsql/client';
import { NextResponse } from 'next/server';
import { validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';
import { nanoid } from '@/lib/clerk';
import slugify from 'slugify';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

interface BulkCategoryAction {
  action: 'create' | 'update' | 'delete';
  id?: string;
  name?: string;
  slug?: string;
  description?: string | null;
  parentId?: string | null;
  displayOrder?: number;
}

/**
 * POST handler for bulk category operations
 */
export async function POST(request: Request) {
  try {
    const { isAuthorized, user, error } = await validateUserAccess(request, [
      ROLES.ADMIN,
      ROLES.SUPERADMIN
    ]);
    
    if (!isAuthorized || !user) {
      return NextResponse.json(
        { error: error || 'Unauthorized' },
        { status: error === 'Unauthorized' ? 401 : 403 }
      );
    }

    const body = await request.json();
    const { actions } = body as { actions: BulkCategoryAction[] };

    if (!actions || !Array.isArray(actions) || actions.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request. Expected array of actions.' },
        { status: 400 }
      );
    }

    // Start transaction
    const transaction = await client.transaction();
    
    try {
      const results = [];
      
      for (const action of actions) {
        switch (action.action) {
          case 'create':
            results.push(await createCategory(transaction, action));
            break;
          case 'update':
            results.push(await updateCategory(transaction, action));
            break;
          case 'delete':
            results.push(await deleteCategory(transaction, action));
            break;
          default:
            results.push({
              success: false,
              error: `Unknown action: ${action.action}`,
              action
            });
        }
      }
      
      // Commit transaction
      await transaction.commit();
      
      return NextResponse.json({ results });
    } catch (error) {
      // Rollback on error
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Error performing bulk category operations:', error);
    return NextResponse.json(
      { error: 'Failed to perform bulk category operations' },
      { status: 500 }
    );
  }
}

// Helper function to create a category
async function createCategory(transaction: Transaction, action: BulkCategoryAction) {
  try {
    if (!action.name) {
      return { success: false, error: 'Name is required', action };
    }

    const id = action.id || nanoid();
    const slug = action.slug || slugify(action.name, { lower: true, strict: true });

    // Check if slug already exists
    const existing = await transaction.execute({
      sql: 'SELECT id FROM blog_categories WHERE slug = ? AND is_deleted = FALSE',
      args: [slug]
    });

    if (existing.rows.length > 0) {
      return { success: false, error: 'A category with this slug already exists', action };
    }

    // Insert new category
    await transaction.execute({
      sql: `
        INSERT INTO blog_categories (
          id,
          name,
          slug,
          description,
          parent_id,
          display_order,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `,
      args: [
        id,
        action.name,
        slug,
        action.description || null,
        action.parentId || null,
        action.displayOrder || 0
      ]
    });

    return { success: true, id, slug, action };
  } catch (error) {
    console.error('Error creating category:', error);
    return { success: false, error: 'Failed to create category', action };
  }
}

// Helper function to update a category
async function updateCategory(transaction: Transaction, action: BulkCategoryAction) {
  try {
    if (!action.id && !action.slug) {
      return { success: false, error: 'ID or slug is required for update', action };
    }

    // Find category by ID or slug
    let category;
    if (action.id) {
      category = await transaction.execute({
        sql: 'SELECT id, slug FROM blog_categories WHERE id = ? AND is_deleted = FALSE',
        args: [action.id]
      });
    } else {
      category = await transaction.execute({
        sql: 'SELECT id, slug FROM blog_categories WHERE slug = ? AND is_deleted = FALSE',
        args: [action.slug]
      });
    }

    if (!category.rows.length) {
      return { success: false, error: 'Category not found', action };
    }

    const categoryId = String(category.rows[0].id);
    const currentSlug = String(category.rows[0].slug);
    
    // Generate new slug if name is provided
    const newSlug = action.name 
      ? slugify(action.name, { lower: true, strict: true }) 
      : currentSlug;

    // Build dynamic update query
    const updateFields = [];
    const updateParams = [];

    if (action.name) {
      updateFields.push('name = ?');
      updateParams.push(action.name);
    }

    updateFields.push('slug = ?');
    updateParams.push(newSlug);

    if (action.description !== undefined) {
      updateFields.push('description = ?');
      updateParams.push(action.description);
    }

    if (action.parentId !== undefined) {
      updateFields.push('parent_id = ?');
      updateParams.push(action.parentId);
    }

    if (action.displayOrder !== undefined) {
      updateFields.push('display_order = ?');
      updateParams.push(action.displayOrder);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    // Execute update query
    await transaction.execute({
      sql: `
        UPDATE blog_categories
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `,
      args: [...updateParams, categoryId]
    });

    return { success: true, id: categoryId, slug: newSlug, action };
  } catch (error) {
    console.error('Error updating category:', error);
    return { success: false, error: 'Failed to update category', action };
  }
}

// Helper function to delete a category
async function deleteCategory(transaction: Transaction, action: BulkCategoryAction) {
  try {
    if (!action.id && !action.slug) {
      return { success: false, error: 'ID or slug is required for delete', action };
    }

    // Find category
    let category;
    if (action.id) {
      category = await transaction.execute({
        sql: 'SELECT id, slug FROM blog_categories WHERE id = ? AND is_deleted = FALSE',
        args: [action.id]
      });
    } else {
      category = await transaction.execute({
        sql: 'SELECT id, slug FROM blog_categories WHERE slug = ? AND is_deleted = FALSE',
        args: [action.slug]
      });
    }

    if (!category.rows.length) {
      return { success: false, error: 'Category not found', action };
    }

    const categoryId = String(category.rows[0].id);

    // Check if category has posts
    const postsCheck = await transaction.execute({
      sql: `
        SELECT COUNT(*) as count
        FROM blog_post_categories
        WHERE category_id = ?
      `,
      args: [categoryId]
    });

    if (Number(postsCheck.rows[0].count) > 0) {
      return { 
        success: false, 
        error: 'Cannot delete category with existing posts', 
        action 
      };
    }

    // Check if category has children
    const childrenCheck = await transaction.execute({
      sql: `
        SELECT COUNT(*) as count
        FROM blog_categories
        WHERE parent_id = ? AND is_deleted = FALSE
      `,
      args: [categoryId]
    });

    if (Number(childrenCheck.rows[0].count) > 0) {
      return { 
        success: false, 
        error: 'Cannot delete category with child categories', 
        action 
      };
    }

    // Soft delete the category
    await transaction.execute({
      sql: `
        UPDATE blog_categories
        SET is_deleted = TRUE,
            deleted_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [categoryId]
    });

    return { success: true, id: categoryId, action };
  } catch (error) {
    console.error('Error deleting category:', error);
    return { success: false, error: 'Failed to delete category', action };
  }
}