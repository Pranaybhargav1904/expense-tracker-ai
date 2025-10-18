import { supabase } from '../supabaseClient';
import type { Expense, ExpenseInsert, ExpenseUpdate } from '../types';

// Get all expenses
export async function getAllExpenses() {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Expense[];
}

// Get expenses by user ID
export async function getExpensesByUserId(userId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Expense[];
}

// Get expenses by category ID
export async function getExpensesByCategoryId(categoryId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('category_id', categoryId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Expense[];
}

// Get expenses by user ID with date range
export async function getExpensesByDateRange(
  userId: string,
  startDate: string,
  endDate: string
) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false });

  if (error) throw error;
  return data as Expense[];
}

// Get expense by ID
export async function getExpenseById(id: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Expense;
}

// Get expenses with category details (joined)
export async function getExpensesWithCategory(userId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      *,
      categories (
        id,
        name
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (error) throw error;
  return data;
}

// Create a new expense
export async function createExpense(expense: ExpenseInsert) {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();

  if (error) throw error;
  return data as Expense;
}

// Update an expense
export async function updateExpense(id: string, updates: ExpenseUpdate) {
  const { data, error } = await supabase
    .from('expenses')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Expense;
}

// Delete an expense
export async function deleteExpense(id: string) {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Get total expenses by user
export async function getTotalExpensesByUser(userId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select('amount')
    .eq('user_id', userId);

  if (error) throw error;
  
  const total = data.reduce((sum, expense) => sum + Number(expense.amount), 0);
  return total;
}

// Get expenses summary by category
export async function getExpensesSummaryByCategory(userId: string) {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      category_id,
      amount,
      categories (
        name
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}


