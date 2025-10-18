import { NextRequest, NextResponse } from 'next/server';
import {
  getExpensesByUserId,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpensesWithCategory,
  getTotalExpensesByUser,
} from '@/app/lib/db';

// GET - Fetch expenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const withCategory = searchParams.get('withCategory') === 'true';
    const total = searchParams.get('total') === 'true';

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get total expenses only
    if (total) {
      const totalAmount = await getTotalExpensesByUser(userId);
      return NextResponse.json({ total: totalAmount });
    }

    // Get expenses with category details
    if (withCategory) {
      const expenses = await getExpensesWithCategory(userId);
      return NextResponse.json(expenses);
    }

    // Get simple expenses list
    const expenses = await getExpensesByUserId(userId);
    return NextResponse.json(expenses);

  } catch (error) {
    console.error('GET /api/expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

// POST - Create a new expense
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.user_id || !body.amount || !body.date) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, amount, date' },
        { status: 400 }
      );
    }

    // Validate amount is positive
    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    const expense = await createExpense({
      user_id: body.user_id,
      category_id: body.category_id || null,
      amount: body.amount,
      description: body.description || null,
      date: body.date,
    });

    return NextResponse.json(expense, { status: 201 });

  } catch (error) {
    console.error('POST /api/expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}

// PATCH - Update an expense
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    // Validate amount if provided
    if (updates.amount !== undefined && updates.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      );
    }

    const expense = await updateExpense(id, updates);
    return NextResponse.json(expense);

  } catch (error) {
    console.error('PATCH /api/expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to update expense' },
      { status: 500 }
    );
  }
}

// DELETE - Delete an expense
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Expense ID is required' },
        { status: 400 }
      );
    }

    await deleteExpense(id);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('DELETE /api/expenses error:', error);
    return NextResponse.json(
      { error: 'Failed to delete expense' },
      { status: 500 }
    );
  }
}



