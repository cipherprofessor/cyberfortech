// src/app/api/forum/categories/[id]/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const tx = await client.transaction();
  
  try {
    const { id } = params;
    const body = await request.json();
    const {
      name,
      description,
      icon,
      color,
      display_order,
      is_active
    } = body;

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const { rows: [existingCategory] } = await client.execute({
      sql: `SELECT id FROM forum_categories WHERE id = ? AND is_deleted = FALSE`,
      args: [id]
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Update category
    await tx.execute({
      sql: `
        UPDATE forum_categories 
        SET 
          name = ?,
          description = ?,
          icon = ?,
          color = ?,
          display_order = ?,
          is_active = ?,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `,
      args: [
        name.trim(),
        description?.trim() || null,
        icon?.trim() || null,
        color?.trim() || null,
        display_order || 0,
        is_active === undefined ? true : is_active,
        id
      ]
    });

    // Commit transaction
    await tx.commit();

    // Fetch updated category with stats
    const { rows: [category] } = await client.execute({
      sql: `
        SELECT 
          c.*,
          s.total_topics,
          s.total_posts,
          s.last_post_at
        FROM forum_categories c
        LEFT JOIN forum_category_stats s ON c.id = s.category_id
        WHERE c.id = ?
      `,
      args: [id]
    });

    return NextResponse.json({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      display_order: Number(category.display_order),
      is_active: Boolean(category.is_active),
      total_topics: Number(category.total_topics),
      total_posts: Number(category.total_posts),
      last_post_at: category.last_post_at,
      created_at: category.created_at,
      updated_at: category.updated_at
    });

  } catch (error: any) {
    // Rollback transaction on error
    await tx.rollback();
    
    console.error('Error updating category:', error);
    
    const errorMessage = error.message?.includes('UNIQUE constraint failed')
      ? 'A category with this name already exists'
      : 'Failed to update category';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// GET single category
// export async function GET(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;

//     const { rows: [category] } = await client.execute({
//       sql: `
//         SELECT 
//           c.*,
//           s.total_topics,
//           s.total_posts,
//           s.last_post_at,
//           COALESCE(json_group_array(
//             CASE 
//               WHEN sub.id IS NOT NULL 
//               THEN json_object(
//                 'id', sub.id,
//                 'name', sub.name
//               )
//               ELSE NULL 
//             END
//           ), '[]') as subCategories
//         FROM forum_categories c
//         LEFT JOIN forum_category_stats s ON c.id = s.category_id
//         LEFT JOIN forum_subcategories sub ON c.id = sub.category_id AND sub.is_deleted = FALSE
//         WHERE c.id = ? AND c.is_deleted = FALSE
//         GROUP BY c.id
//       `,
//       args: [id]
//     });

//     if (!category) {
//       return NextResponse.json(
//         { error: 'Category not found' },
//         { status: 404 }
//       );
//     }

//     // Process subcategories
//     let subCategories = [];
//     try {
//       const parsedSubs = category.subCategories ? JSON.parse(category.subCategories.toString()) : [];
//       subCategories = parsedSubs
//         .filter(Boolean)
//         .map((sub: any) => ({
//           id: String(sub.id),
//           name: String(sub.name)
//         }));
//     } catch (error) {
//       console.error('Error parsing subcategories:', error);
//     }

//     return NextResponse.json({
//       id: category.id,
//       name: category.name,
//       description: category.description,
//       icon: category.icon,
//       color: category.color,
//       display_order: Number(category.display_order),
//       is_active: Boolean(category.is_active),
//       total_topics: Number(category.total_topics),
//       total_posts: Number(category.total_posts),
//       last_post_at: category.last_post_at,
//       created_at: category.created_at,
//       updated_at: category.updated_at,
//       subCategories
//     });

//   } catch (error) {
//     console.error('Error fetching category:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch category' },
//       { status: 500 }
//     );
//   }
// }

// src/app/api/forum/categories/[id]/route.ts


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Ensure params.id exists
    if (!params?.id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const categoryId = params.id;

    // Get category details
    const { rows: [category] } = await client.execute({
      sql: `
        SELECT id, name, description, is_deleted
        FROM forum_categories
        WHERE id = ? AND is_deleted = FALSE
      `,
      args: [categoryId]
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }


    // Get topics for this category with author details
    const { rows: topics } = await client.execute({
      sql: `
        SELECT 
          t.id,
          t.title,
          t.content,
          t.views,
          t.is_pinned,
          t.is_locked,
          t.created_at,
          t.updated_at,
          t.author_id,
          t.author_name,
          t.author_email,
          t.author_image,
          t.category_id,
          t.subcategory_id,
          c.name as category_name,
          sc.name as subcategory_name,
          (SELECT COUNT(*) FROM forum_posts WHERE topic_id = t.id AND is_deleted = FALSE) as reply_count
        FROM forum_topics t
        LEFT JOIN forum_categories c ON t.category_id = c.id
        LEFT JOIN forum_subcategories sc ON t.subcategory_id = sc.id
        WHERE t.category_id = ? 
        AND t.is_deleted = FALSE
        ORDER BY t.is_pinned DESC, t.created_at DESC
      `,
      args: [categoryId]
    });

    return NextResponse.json({
      category,
      topics: topics.map(topic => ({
        ...topic,
        created_at: topic.created_at || new Date().toISOString(),
        updated_at: topic.updated_at || new Date().toISOString(),
        author_name: topic.author_name || 'Anonymous',
        author_image: topic.author_image || null,
        reply_count: Number(topic.reply_count) || 0,
        views: Number(topic.views) || 0
      }))
    });

  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}