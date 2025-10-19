import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabaseClient';

// Debug endpoint to check user IDs and expenses
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (usersError) throw usersError;

    // Get all expenses
    const { data: expenses, error: expensesError } = await supabase
      .from('expenses')
      .select('*')
      .order('created_at', { ascending: false });

    if (expensesError) throw expensesError;

    // Get expenses for specific user if provided
    let userExpenses = null;
    if (userId) {
      const { data: userExp, error: userExpError } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId);

      if (userExpError) throw userExpError;
      userExpenses = userExp;
    }

    return NextResponse.json({
      currentUserId: userId,
      totalUsers: users?.length || 0,
      users: users?.map(u => ({ id: u.id, email: u.email, name: u.name })) || [],
      totalExpenses: expenses?.length || 0,
      allExpenses: expenses || [],
      userExpenses: userExpenses,
      message: userExpenses 
        ? `Found ${userExpenses.length} expenses for user ${userId}`
        : 'Provide ?userId=xxx to check specific user expenses'
    });

  } catch (error) {
    console.error('Debug error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

