import { NextRequest, NextResponse } from 'next/server';
import {
  getCategoriesByUserId,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/app/lib/db';

// GET - Fetch categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const categories = await getCategoriesByUserId(userId);
    return NextResponse.json(categories);

  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.user_id || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, name' },
        { status: 400 }
      );
    }

    const category = await createCategory({
      user_id: body.user_id,
      name: body.name,
    });

    return NextResponse.json(category, { status: 201 });

  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

// PATCH - Update a category
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await updateCategory(id, updates);
    return NextResponse.json(category);

  } catch (error) {
    console.error('PATCH /api/categories error:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a category
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    await deleteCategory(id);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('DELETE /api/categories error:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}






