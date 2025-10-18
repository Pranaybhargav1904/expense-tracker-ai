# Database Functions Documentation

This directory contains all the database connection and CRUD functions for your Expense Tracker application.

## 📁 File Structure

```
lib/
├── supabaseClient.ts       # Supabase client configuration
├── types.ts                # TypeScript types for all tables
└── db/
    ├── index.ts            # Main export file
    ├── users.ts            # User table functions
    ├── categories.ts       # Categories table functions
    ├── expenses.ts         # Expenses table functions
    ├── aiQueries.ts        # AI Queries table functions
    ├── examples.ts         # Usage examples
    └── README.md           # This file
```

## 🚀 Quick Start

### Import Functions

```typescript
// Import all functions from a single entry point
import {
  createUser,
  getUserById,
  createCategory,
  createExpense,
  getExpensesWithCategory
} from '@/app/lib/db';

// Or import from specific modules
import { createUser, getUserById } from '@/app/lib/db/users';
```

### Environment Setup

Make sure you have these environment variables set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📚 Available Functions

### Users Table

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `getAllUsers()` | Get all users | - | `Promise<User[]>` |
| `getUserById(id)` | Get user by ID | `id: string` | `Promise<User>` |
| `getUserByEmail(email)` | Get user by email | `email: string` | `Promise<User>` |
| `createUser(user)` | Create new user | `user: UserInsert` | `Promise<User>` |
| `updateUser(id, updates)` | Update user | `id: string, updates: UserUpdate` | `Promise<User>` |
| `deleteUser(id)` | Delete user | `id: string` | `Promise<boolean>` |

### Categories Table

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `getAllCategories()` | Get all categories | - | `Promise<Category[]>` |
| `getCategoriesByUserId(userId)` | Get user's categories | `userId: string` | `Promise<Category[]>` |
| `getCategoryById(id)` | Get category by ID | `id: string` | `Promise<Category>` |
| `createCategory(category)` | Create new category | `category: CategoryInsert` | `Promise<Category>` |
| `updateCategory(id, updates)` | Update category | `id: string, updates: CategoryUpdate` | `Promise<Category>` |
| `deleteCategory(id)` | Delete category | `id: string` | `Promise<boolean>` |

### Expenses Table

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `getAllExpenses()` | Get all expenses | - | `Promise<Expense[]>` |
| `getExpensesByUserId(userId)` | Get user's expenses | `userId: string` | `Promise<Expense[]>` |
| `getExpensesByCategoryId(categoryId)` | Get expenses by category | `categoryId: string` | `Promise<Expense[]>` |
| `getExpensesByDateRange(userId, start, end)` | Get expenses in date range | `userId: string, startDate: string, endDate: string` | `Promise<Expense[]>` |
| `getExpenseById(id)` | Get expense by ID | `id: string` | `Promise<Expense>` |
| `getExpensesWithCategory(userId)` | Get expenses with category info | `userId: string` | `Promise<any[]>` |
| `createExpense(expense)` | Create new expense | `expense: ExpenseInsert` | `Promise<Expense>` |
| `updateExpense(id, updates)` | Update expense | `id: string, updates: ExpenseUpdate` | `Promise<Expense>` |
| `deleteExpense(id)` | Delete expense | `id: string` | `Promise<boolean>` |
| `getTotalExpensesByUser(userId)` | Get total expenses amount | `userId: string` | `Promise<number>` |
| `getExpensesSummaryByCategory(userId)` | Get expenses grouped by category | `userId: string` | `Promise<any[]>` |

### AI Queries Table

| Function | Description | Parameters | Returns |
|----------|-------------|------------|---------|
| `getAllAIQueries()` | Get all AI queries | - | `Promise<AIQuery[]>` |
| `getAIQueriesByUserId(userId)` | Get user's AI queries | `userId: string` | `Promise<AIQuery[]>` |
| `getRecentAIQueries(userId, limit)` | Get recent queries | `userId: string, limit?: number` | `Promise<AIQuery[]>` |
| `getAIQueryById(id)` | Get query by ID | `id: string` | `Promise<AIQuery>` |
| `createAIQuery(query)` | Create new AI query | `query: AIQueryInsert` | `Promise<AIQuery>` |
| `updateAIQuery(id, updates)` | Update AI query | `id: string, updates: AIQueryUpdate` | `Promise<AIQuery>` |
| `deleteAIQuery(id)` | Delete AI query | `id: string` | `Promise<boolean>` |
| `searchAIQueries(userId, text)` | Search queries by text | `userId: string, searchText: string` | `Promise<AIQuery[]>` |

## 💡 Usage Examples

### Create a User

```typescript
import { createUser } from '@/app/lib/db';

const user = await createUser({
  name: 'John Doe',
  email: 'john@example.com'
});
```

### Add a Category

```typescript
import { createCategory } from '@/app/lib/db';

const category = await createCategory({
  user_id: userId,
  name: 'Food & Dining'
});
```

### Add an Expense

```typescript
import { createExpense } from '@/app/lib/db';

const expense = await createExpense({
  user_id: userId,
  category_id: categoryId,
  amount: 45.50,
  description: 'Lunch at restaurant',
  date: '2025-10-16'
});
```

### Get Expenses with Categories

```typescript
import { getExpensesWithCategory } from '@/app/lib/db';

const expenses = await getExpensesWithCategory(userId);
// Returns expenses with nested category information
```

### Get Total Expenses

```typescript
import { getTotalExpensesByUser } from '@/app/lib/db';

const total = await getTotalExpensesByUser(userId);
console.log(`Total spent: $${total}`);
```

### Add AI Query Log

```typescript
import { createAIQuery } from '@/app/lib/db';

await createAIQuery({
  user_id: userId,
  query_text: 'What were my expenses last month?',
  ai_response: 'Your total expenses last month were $1,234.56'
});
```

## 🔧 Using in API Routes

```typescript
// app/api/expenses/route.ts
import { NextResponse } from 'next/server';
import { createExpense, getExpensesByUserId } from '@/app/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }
    
    const expenses = await getExpensesByUserId(userId);
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch expenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const expense = await createExpense(body);
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create expense' },
      { status: 500 }
    );
  }
}
```

## 🔧 Using in React Components

```typescript
'use client';

import { useEffect, useState } from 'react';
import { getExpensesWithCategory } from '@/app/lib/db';

export default function ExpenseList({ userId }: { userId: string }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadExpenses() {
      try {
        const data = await getExpensesWithCategory(userId);
        setExpenses(data);
      } catch (error) {
        console.error('Error loading expenses:', error);
      } finally {
        setLoading(false);
      }
    }

    loadExpenses();
  }, [userId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {expenses.map((expense) => (
        <div key={expense.id}>
          <p>{expense.description}</p>
          <p>${expense.amount}</p>
          <p>{expense.categories?.name}</p>
        </div>
      ))}
    </div>
  );
}
```

## 🛡️ Error Handling

All functions throw errors that you should handle:

```typescript
try {
  const user = await getUserById(userId);
} catch (error) {
  console.error('Error fetching user:', error);
  // Handle error appropriately
}
```

## 📝 TypeScript Types

All types are available in `types.ts`:

```typescript
import type {
  User,
  Category,
  Expense,
  AIQuery,
  UserInsert,
  CategoryInsert,
  ExpenseInsert,
  AIQueryInsert
} from '@/app/lib/types';
```

## 🎯 Best Practices

1. **Always handle errors** - Wrap database calls in try-catch blocks
2. **Use TypeScript types** - Import and use the provided types for type safety
3. **Validate data** - Validate input before passing to database functions
4. **Use transactions** - For complex operations involving multiple tables
5. **Index optimization** - Ensure your queries use indexed columns for performance

## 📖 More Examples

For comprehensive examples, see `examples.ts` which includes:
- Complete workflow examples
- Error handling patterns
- Complex queries with joins
- Batch operations

---

**Note:** All database operations are asynchronous and return Promises. Make sure to use `async/await` or `.then()/.catch()` when calling these functions.



