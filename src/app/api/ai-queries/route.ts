import { NextRequest, NextResponse } from 'next/server';
import {
  getAIQueriesByUserId,
  getRecentAIQueries,
  createAIQuery,
  deleteAIQuery,
  searchAIQueries,
} from '@/app/lib/db';

// GET - Fetch AI queries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Search queries
    if (search) {
      const queries = await searchAIQueries(userId, search);
      return NextResponse.json(queries);
    }

    // Get recent queries with limit
    if (limit) {
      const queries = await getRecentAIQueries(userId, parseInt(limit));
      return NextResponse.json(queries);
    }

    // Get all queries for user
    const queries = await getAIQueriesByUserId(userId);
    return NextResponse.json(queries);

  } catch (error) {
    console.error('GET /api/ai-queries error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI queries' },
      { status: 500 }
    );
  }
}

// POST - Create a new AI query
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.user_id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const aiQuery = await createAIQuery({
      user_id: body.user_id,
      query_text: body.query_text || null,
      ai_response: body.ai_response || null,
    });

    return NextResponse.json(aiQuery, { status: 201 });

  } catch (error) {
    console.error('POST /api/ai-queries error:', error);
    return NextResponse.json(
      { error: 'Failed to create AI query' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an AI query
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'AI Query ID is required' },
        { status: 400 }
      );
    }

    await deleteAIQuery(id);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('DELETE /api/ai-queries error:', error);
    return NextResponse.json(
      { error: 'Failed to delete AI query' },
      { status: 500 }
    );
  }
}






