# Database Setup Guide

This guide will help you connect your Next.js application to your Supabase database.

## ✅ What's Already Done

1. ✅ Database tables created in Supabase:
   - `users` - User profiles
   - `categories` - Expense categories
   - `expenses` - Expense records
   - `ai_queries` - AI query history

2. ✅ Database connection code created:
   - TypeScript types for all tables
   - CRUD functions for each table
   - API routes for all endpoints
   - Usage examples and documentation

## 🚀 Quick Setup (3 Steps)

### Step 1: Set Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to your Supabase project
   - Navigate to **Settings** → **API**
   - Copy **Project URL** and **anon/public key**

3. Update `.env.local` with your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### Step 2: Test the Connection

Run the development server:
```bash
npm run dev
```

The application should now be able to connect to your Supabase database!

### Step 3: Test with Sample Data

You can use the test API route or create a simple test:

```typescript
// Create a test file or use the browser console
import { createUser } from '@/app/lib/db';

const testConnection = async () => {
  try {
    const user = await createUser({
      name: 'Test User',
      email: 'test@example.com'
    });
    console.log('✅ Database connection successful!', user);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

testConnection();
```

## 📁 Project Structure

```
expense-tracker-ai/
├── src/app/
│   ├── api/                    # API Routes
│   │   ├── users/route.ts      # User endpoints
│   │   ├── categories/route.ts # Category endpoints
│   │   ├── expenses/route.ts   # Expense endpoints
│   │   └── ai-queries/route.ts # AI query endpoints
│   │
│   └── lib/                    # Database layer
│       ├── supabaseClient.ts   # Supabase client
│       ├── types.ts            # TypeScript types
│       └── db/
│           ├── index.ts        # Main export
│           ├── users.ts        # User functions
│           ├── categories.ts   # Category functions
│           ├── expenses.ts     # Expense functions
│           ├── aiQueries.ts    # AI query functions
│           ├── examples.ts     # Usage examples
│           └── README.md       # Documentation
```

## 🔌 API Endpoints

All endpoints are now available at:

### Users
- `GET /api/users` - Get all users
- `GET /api/users?id={id}` - Get user by ID
- `GET /api/users?email={email}` - Get user by email
- `POST /api/users` - Create user
- `PATCH /api/users` - Update user
- `DELETE /api/users?id={id}` - Delete user

### Categories
- `GET /api/categories?userId={userId}` - Get user's categories
- `POST /api/categories` - Create category
- `PATCH /api/categories` - Update category
- `DELETE /api/categories?id={id}` - Delete category

### Expenses
- `GET /api/expenses?userId={userId}` - Get user's expenses
- `GET /api/expenses?userId={userId}&withCategory=true` - Get expenses with category info
- `GET /api/expenses?userId={userId}&total=true` - Get total expenses
- `POST /api/expenses` - Create expense
- `PATCH /api/expenses` - Update expense
- `DELETE /api/expenses?id={id}` - Delete expense

### AI Queries
- `GET /api/ai-queries?userId={userId}` - Get user's queries
- `GET /api/ai-queries?userId={userId}&limit=10` - Get recent queries
- `GET /api/ai-queries?userId={userId}&search={text}` - Search queries
- `POST /api/ai-queries` - Create query
- `DELETE /api/ai-queries?id={id}` - Delete query

## 💻 Usage Examples

### Using API Routes (Client-side)

```typescript
// Fetch expenses
const response = await fetch('/api/expenses?userId=user-id');
const expenses = await response.json();

// Create expense
const response = await fetch('/api/expenses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'user-id',
    category_id: 'category-id',
    amount: 50.00,
    description: 'Lunch',
    date: '2025-10-16'
  })
});
```

### Using Database Functions Directly (Server-side)

```typescript
import { createExpense, getExpensesByUserId } from '@/app/lib/db';

// In a Server Component or API route
const expenses = await getExpensesByUserId(userId);

const newExpense = await createExpense({
  user_id: userId,
  category_id: categoryId,
  amount: 50.00,
  description: 'Lunch',
  date: '2025-10-16'
});
```

## 🔍 Testing the Setup

### Option 1: Using the Test API Route

Visit: `http://localhost:3000/api/test`

### Option 2: Test from Browser Console

Open browser console and run:

```javascript
// Test creating a user
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com'
  })
})
  .then(res => res.json())
  .then(data => console.log('User created:', data));
```

### Option 3: Create a Test Page

Create `src/app/test-db/page.tsx`:

```typescript
'use client';

import { useState } from 'react';

export default function TestDB() {
  const [result, setResult] = useState('');

  const testConnection = async () => {
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com'
        })
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult('Error: ' + error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Database Connection Test</h1>
      <button 
        onClick={testConnection}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Connection
      </button>
      <pre className="mt-4 p-4 bg-gray-100 rounded">
        {result || 'Click the button to test'}
      </pre>
    </div>
  );
}
```

Visit: `http://localhost:3000/test-db`

## 🛠️ Troubleshooting

### Error: "Missing environment variables"
- Make sure `.env.local` exists and contains valid Supabase credentials
- Restart your development server after creating/updating `.env.local`

### Error: "Failed to fetch"
- Check that your Supabase project is active
- Verify the API keys are correct
- Check Supabase project URL is correct

### Error: "Row Level Security policy violation"
- You may need to configure RLS policies in Supabase
- For development, you can disable RLS or create permissive policies

### Connection works but queries fail
- Verify table names match exactly (case-sensitive)
- Check that tables exist in Supabase Table Editor
- Review Supabase logs for detailed error messages

## 🔐 Security Notes

1. **Row Level Security (RLS)**: Consider enabling RLS policies in Supabase for production
2. **API Keys**: Never commit `.env.local` to git (already in `.gitignore`)
3. **Validation**: API routes include basic validation, but add more as needed
4. **Authentication**: Implement proper user authentication before deploying

## 📚 Next Steps

1. ✅ Set up environment variables
2. ✅ Test database connection
3. 🔲 Set up authentication (Supabase Auth)
4. 🔲 Configure Row Level Security policies
5. 🔲 Build your UI components
6. 🔲 Integrate with AI features

## 📖 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Your database is now fully connected and ready to use! 🎉**

For detailed function documentation, see: `src/app/lib/db/README.md`







