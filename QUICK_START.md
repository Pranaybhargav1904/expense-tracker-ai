# 🚀 Quick Start - Database Connection

Your expense tracker is now fully connected to Supabase! Here's everything you need to know.

## ⚡ Getting Started (2 Minutes)

### 1. Add Your Supabase Credentials

Create a file called `.env.local` in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these from: **Supabase Dashboard → Settings → API**

### 2. Start Your App

```bash
npm run dev
```

Visit: http://localhost:3000

## 📚 What You Got

### ✅ Database Functions (src/app/lib/db/)

Ready-to-use functions for all 4 tables:

**Users:**
```typescript
import { createUser, getUserById, updateUser } from '@/app/lib/db';

const user = await createUser({ name: 'John', email: 'john@email.com' });
```

**Categories:**
```typescript
import { createCategory, getCategoriesByUserId } from '@/app/lib/db';

const category = await createCategory({ user_id: userId, name: 'Food' });
```

**Expenses:**
```typescript
import { createExpense, getExpensesByUserId } from '@/app/lib/db';

const expense = await createExpense({
  user_id: userId,
  category_id: categoryId,
  amount: 25.50,
  description: 'Lunch',
  date: '2025-10-16'
});
```

**AI Queries:**
```typescript
import { createAIQuery, getRecentAIQueries } from '@/app/lib/db';

await createAIQuery({
  user_id: userId,
  query_text: 'What did I spend on food?',
  ai_response: 'You spent $150 on food this month'
});
```

### ✅ API Routes (src/app/api/)

RESTful endpoints for all tables:

```bash
# Users
GET    /api/users
POST   /api/users
PATCH  /api/users
DELETE /api/users?id={id}

# Categories
GET    /api/categories?userId={userId}
POST   /api/categories
PATCH  /api/categories
DELETE /api/categories?id={id}

# Expenses
GET    /api/expenses?userId={userId}
POST   /api/expenses
PATCH  /api/expenses
DELETE /api/expenses?id={id}

# AI Queries
GET    /api/ai-queries?userId={userId}
POST   /api/ai-queries
DELETE /api/ai-queries?id={id}
```

### ✅ TypeScript Types (src/app/lib/types.ts)

Full type safety:
```typescript
import type { User, Category, Expense, AIQuery } from '@/app/lib/types';
```

## 🎯 Common Use Cases

### Use Case 1: Server Component (Direct DB Access)

```typescript
// app/dashboard/page.tsx
import { getExpensesByUserId, getCategoriesByUserId } from '@/app/lib/db';

export default async function Dashboard({ userId }: { userId: string }) {
  const expenses = await getExpensesByUserId(userId);
  const categories = await getCategoriesByUserId(userId);
  
  return (
    <div>
      <h1>Your Expenses</h1>
      {expenses.map(exp => (
        <div key={exp.id}>{exp.description}: ${exp.amount}</div>
      ))}
    </div>
  );
}
```

### Use Case 2: Client Component (API Route)

```typescript
'use client';

import { useEffect, useState } from 'react';

export default function ExpenseList({ userId }: { userId: string }) {
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    fetch(`/api/expenses?userId=${userId}`)
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, [userId]);

  return (
    <div>
      {expenses.map(exp => (
        <div key={exp.id}>{exp.description}: ${exp.amount}</div>
      ))}
    </div>
  );
}
```

### Use Case 3: Form Submission

```typescript
'use client';

import { useState } from 'react';

export default function AddExpenseForm({ userId }: { userId: string }) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: userId,
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString().split('T')[0]
      })
    });

    if (response.ok) {
      alert('Expense added!');
      setAmount('');
      setDescription('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        value={amount} 
        onChange={e => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <input 
        type="text" 
        value={description} 
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
      />
      <button type="submit">Add Expense</button>
    </form>
  );
}
```

## 📖 Full Documentation

- **Database Functions**: `src/app/lib/db/README.md`
- **Setup Guide**: `DATABASE_SETUP.md`
- **Code Examples**: `src/app/lib/db/examples.ts`

## 🧪 Testing

### Quick Test in Browser Console

```javascript
// Create a user
fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Test', email: 'test@email.com' })
})
  .then(r => r.json())
  .then(console.log);
```

## 🎉 You're Ready!

Your database is fully connected and ready to use. Start building your UI!

**Need Help?**
- Check `DATABASE_SETUP.md` for troubleshooting
- See `src/app/lib/db/README.md` for all available functions
- Review `src/app/lib/db/examples.ts` for code examples






