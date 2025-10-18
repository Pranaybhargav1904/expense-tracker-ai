/**
 * Examples of how to use the database functions
 * This file demonstrates common usage patterns for all tables
 */

/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  // Users
  getAllUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  
  // Categories
  getAllCategories,
  getCategoriesByUserId,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Expenses
  getAllExpenses,
  getExpensesByUserId,
  getExpensesByCategoryId,
  getExpensesByDateRange,
  getExpenseById,
  getExpensesWithCategory,
  createExpense,
  updateExpense,
  deleteExpense,
  getTotalExpensesByUser,
  getExpensesSummaryByCategory,
  
  // AI Queries
  getAllAIQueries,
  getAIQueriesByUserId,
  getRecentAIQueries,
  getAIQueryById,
  createAIQuery,
  updateAIQuery,
  deleteAIQuery,
  searchAIQueries,
} from './index';

// ============================================
// USERS EXAMPLES
// ============================================

export async function userExamples() {
  try {
    // Create a new user
    const newUser = await createUser({
      name: 'John Doe',
      email: 'john@example.com'
    });
    console.log('Created user:', newUser);

    // Get user by email
    const user = await getUserByEmail('john@example.com');
    console.log('Found user:', user);

    // Update user
    const updatedUser = await updateUser(user.id, {
      name: 'John Updated'
    });
    console.log('Updated user:', updatedUser);

    // Get all users
    const allUsers = await getAllUsers();
    console.log('All users:', allUsers);

  } catch (error) {
    console.error('User operation error:', error);
  }
}

// ============================================
// CATEGORIES EXAMPLES
// ============================================

export async function categoryExamples(userId: string) {
  try {
    // Create a new category
    const newCategory = await createCategory({
      user_id: userId,
      name: 'Food & Dining'
    });
    console.log('Created category:', newCategory);

    // Get all categories for a user
    const userCategories = await getCategoriesByUserId(userId);
    console.log('User categories:', userCategories);

    // Update category
    const updatedCategory = await updateCategory(newCategory.id, {
      name: 'Restaurants'
    });
    console.log('Updated category:', updatedCategory);

  } catch (error) {
    console.error('Category operation error:', error);
  }
}

// ============================================
// EXPENSES EXAMPLES
// ============================================

export async function expenseExamples(userId: string, categoryId: string) {
  try {
    // Create a new expense
    const newExpense = await createExpense({
      user_id: userId,
      category_id: categoryId,
      amount: 45.50,
      description: 'Lunch at restaurant',
      date: '2025-10-16'
    });
    console.log('Created expense:', newExpense);

    // Get all expenses for a user
    const userExpenses = await getExpensesByUserId(userId);
    console.log('User expenses:', userExpenses);

    // Get expenses with category details
    const expensesWithCategories = await getExpensesWithCategory(userId);
    console.log('Expenses with categories:', expensesWithCategories);

    // Get expenses by date range
    const rangeExpenses = await getExpensesByDateRange(
      userId,
      '2025-10-01',
      '2025-10-31'
    );
    console.log('October expenses:', rangeExpenses);

    // Get total expenses
    const total = await getTotalExpensesByUser(userId);
    console.log('Total expenses:', total);

    // Get summary by category
    const summary = await getExpensesSummaryByCategory(userId);
    console.log('Expenses summary:', summary);

    // Update expense
    const updatedExpense = await updateExpense(newExpense.id, {
      amount: 50.00,
      description: 'Dinner at restaurant'
    });
    console.log('Updated expense:', updatedExpense);

  } catch (error) {
    console.error('Expense operation error:', error);
  }
}

// ============================================
// AI QUERIES EXAMPLES
// ============================================

export async function aiQueryExamples(userId: string) {
  try {
    // Create a new AI query
    const newQuery = await createAIQuery({
      user_id: userId,
      query_text: 'What were my total expenses last month?',
      ai_response: 'Your total expenses last month were $1,234.56'
    });
    console.log('Created AI query:', newQuery);

    // Get recent AI queries (last 10)
    const recentQueries = await getRecentAIQueries(userId, 10);
    console.log('Recent queries:', recentQueries);

    // Search AI queries
    const searchResults = await searchAIQueries(userId, 'expenses');
    console.log('Search results:', searchResults);

    // Get all AI queries for user
    const allQueries = await getAIQueriesByUserId(userId);
    console.log('All AI queries:', allQueries);

  } catch (error) {
    console.error('AI query operation error:', error);
  }
}

// ============================================
// COMPLETE WORKFLOW EXAMPLE
// ============================================

export async function completeWorkflowExample() {
  try {
    // 1. Create a user
    const user = await createUser({
      name: 'Jane Smith',
      email: 'jane@example.com'
    });

    // 2. Create categories for the user
    const foodCategory = await createCategory({
      user_id: user.id,
      name: 'Food'
    });

    const transportCategory = await createCategory({
      user_id: user.id,
      name: 'Transportation'
    });

    // 3. Add expenses
    await createExpense({
      user_id: user.id,
      category_id: foodCategory.id,
      amount: 25.00,
      description: 'Grocery shopping',
      date: '2025-10-15'
    });

    await createExpense({
      user_id: user.id,
      category_id: transportCategory.id,
      amount: 15.00,
      description: 'Uber ride',
      date: '2025-10-15'
    });

    // 4. Get expenses with categories
    const expenses = await getExpensesWithCategory(user.id);
    console.log('All expenses:', expenses);

    // 5. Get total
    const total = await getTotalExpensesByUser(user.id);
    console.log('Total spent:', total);

    // 6. Save AI query
    await createAIQuery({
      user_id: user.id,
      query_text: 'How much did I spend today?',
      ai_response: `You spent $${total} today.`
    });

    return user;
  } catch (error) {
    console.error('Workflow error:', error);
    throw error;
  }
}


