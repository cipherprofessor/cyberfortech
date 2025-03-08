// // src/app/api/blog/categories/route.ts
// import { createClient } from '@libsql/client';
// import { NextResponse } from 'next/server';
// import { validateUserAccess, nanoid } from '@/lib/clerk';
// import { ROLES } from '@/constants/auth';
// import slugify from 'slugify';

// const client = createClient({
//   url: process.env.TURSO_DATABASE_URL!,
//   authToken: process.env.TURSO_AUTH_TOKEN!,
// });

// export async function GET() {
//   try {
//     const result = await client.execute({
//       sql: `
//         SELECT 
//           c.id,
//           c.name,
//           c.slug,
//           c.description,
//           c.display_order,
//           c.parent_id,
//           (
//             SELECT COUNT(DISTINCT bpc.post_id)
//             FROM blog_post_categories bpc
//             JOIN blog_posts bp ON bpc.post_id = bp.id
//             WHERE bpc.category_id = c.id
//             AND bp.status = 'published'
//             AND (bp.is_deleted IS NULL OR bp.is_deleted = FALSE)
//           ) as post_count,
//           parent.name as parent_name,
//           parent.slug as parent_slug
//         FROM blog_categories c
//         LEFT JOIN blog_categories parent ON c.parent_id = parent.id
//         WHERE (c.is_deleted IS NULL OR c.is_deleted = FALSE)
//         ORDER BY c.display_order ASC, c.name ASC
//       `,
//       args: [] // Add empty args array
//     });

//     const categories = result.rows.map(row => ({
//       id: String(row.id),
//       name: String(row.name),
//       slug: String(row.slug),
//       description: row.description ? String(row.description) : undefined,
//       displayOrder: Number(row.display_order || 0),
//       postCount: Number(row.post_count || 0),
//       parent: row.parent_id ? {
//         id: String(row.parent_id),
//         name: String(row.parent_name),
//         slug: String(row.parent_slug)
//       } : undefined
//     }));

//     return NextResponse.json(categories);
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch categories' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: Request) {
//   try {
//     const { isAuthorized, user, error } = await validateUserAccess(request, [ROLES.ADMIN, ROLES.SUPERADMIN]);
    
//     if (!isAuthorized || !user) {
//       return NextResponse.json(
//         { error: error || 'Unauthorized' },
//         { status: error === 'Unauthorized' ? 401 : 403 }
//       );
//     }

//     const body = await request.json();
//     const {
//       name,
//       slug: customSlug,
//       description,
//       parentId,
//       displayOrder = 0
//     } = body;

//     if (!name) {
//       return NextResponse.json(
//         { error: 'Name is required' },
//         { status: 400 }
//       );
//     }

//     const slug = customSlug || slugify(name, { lower: true, strict: true });

//     // Check if slug already exists
//     const existingCategory = await client.execute({
//       sql: `
//         SELECT id 
//         FROM blog_categories 
//         WHERE slug = ? 
//         AND (is_deleted IS NULL OR is_deleted = FALSE)
//       `,
//       args: [slug]
//     });

//     if (existingCategory.rows.length > 0) {
//       return NextResponse.json(
//         { error: 'Category with this slug already exists' },
//         { status: 409 }
//       );
//     }

//     const id = nanoid();

//     // Create category
//     await client.execute({
//       sql: `
//         INSERT INTO blog_categories (
//           id,
//           name,
//           slug,
//           description,
//           parent_id,
//           display_order,
//           created_at,
//           updated_at,
//           is_deleted
//         ) VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, FALSE)
//       `,
//       args: [id, name, slug, description || null, parentId || null, displayOrder]
//     });

//     return NextResponse.json({
//       id,
//       name,
//       slug,
//       description,
//       displayOrder,
//       parentId,
//       postCount: 0
//     });

//   } catch (error) {
//     console.error('Error creating category:', error);
//     return NextResponse.json(
//       { error: 'Failed to create category' },
//       { status: 500 }
//     );
//   }
// }



// src/app/api/blog/categories/route.ts
import { createClient } from '@libsql/client';
import { NextResponse } from 'next/server';
import { BlogCategory } from '@/types/blog';
import { nanoid, validateUserAccess } from '@/lib/clerk';
import { ROLES } from '@/constants/auth';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

/**
 * GET handler for fetching all blog categories
 */
export async function GET(request: Request) {
  try {
    const { isAuthorized } = await validateUserAccess(request);
    
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const result = await client.execute({
      sql: `
        SELECT 
          id, 
          name, 
          slug, 
          description,
          parent_id,
          display_order
        FROM blog_categories
        WHERE is_deleted = FALSE
        ORDER BY display_order ASC, name ASC
      `,args: []
    });

    const categories: BlogCategory[] = result.rows.map(row => ({
      id: String(row.id),
      name: String(row.name),
      slug: String(row.slug),
      description: row.description ? String(row.description) : undefined,
      parentId: row.parent_id ? String(row.parent_id) : undefined,
      displayOrder: Number(row.display_order) || 0
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new category
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
    const { name, slug, description, parentId, displayOrder = 0 } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCategory = await client.execute({
      sql: 'SELECT id FROM blog_categories WHERE slug = ? AND is_deleted = FALSE',
      args: [slug]
    });

    if (existingCategory.rows.length > 0) {
      return NextResponse.json(
        { error: 'A category with this slug already exists' },
        { status: 409 }
      );
    }

    // Create unique ID for the category
    const id = nanoid();

    // Insert new category
    await client.execute({
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
        name,
        slug,
        description || null,
        parentId || null,
        displayOrder
      ]
    });

    return NextResponse.json({
      id,
      name,
      slug,
      description,
      parentId,
      displayOrder
    });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}