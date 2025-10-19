# Debug: Why Chatbot Says "No Expenses"

## Quick Check

### Step 1: Get Your User ID

1. Open your browser
2. Go to the dashboard: http://localhost:3000/dashboard
3. Open browser console (F12 or Ctrl+Shift+I)
4. Type this and press Enter:
   ```javascript
   console.log("My User ID:", localStorage.getItem('user'))
   ```
5. Copy the `id` value you see

### Step 2: Check All Data

Visit this URL in your browser (replace YOUR_USER_ID with the ID from Step 1):
```
http://localhost:3000/api/debug?userId=YOUR_USER_ID
```

This will show you:
- All users in the database
- All expenses in the database
- Expenses for your specific user ID

## Common Issues

### Issue 1: Expense has wrong user_id

**Problem:** The expense you added has a different `user_id` than your logged-in account

**Solution:** Check the `/api/debug` output. If the expense `user_id` doesn't match your user ID, you need to:

1. Either delete that expense and add it again with the correct user
2. Or update the expense's `user_id` in Supabase

### Issue 2: User doesn't exist in users table

**Problem:** Your auth user ID doesn't match any user in the `users` table

**Solution:** The chatbot should auto-create the user, but you can manually run this SQL in Supabase:

```sql
INSERT INTO users (id, email, name)
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data->>'full_name'
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM users u WHERE u.id = au.id
)
LIMIT 1;
```

## Manual Fix

If you know your user ID and want to fix the expense manually:

### Option A: Update Existing Expense (Supabase SQL Editor)

```sql
-- Replace 'your-user-id-here' with your actual user ID
UPDATE expenses 
SET user_id = 'your-user-id-here'
WHERE id = (
  SELECT id FROM expenses 
  ORDER BY created_at DESC 
  LIMIT 1
);
```

### Option B: Add New Expense with Correct User ID

Use the `/api/expenses` endpoint:

```javascript
// Run this in browser console (replace USER_ID and values)
fetch('/api/expenses', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: 'YOUR_USER_ID',
    amount: 50.00,
    description: 'Test expense',
    category_id: null, // or a valid category ID
    date: new Date().toISOString().split('T')[0]
  })
}).then(r => r.json()).then(console.log);
```

## Verify It Works

After fixing:

1. Go to: http://localhost:3000/api/debug?userId=YOUR_USER_ID
2. Verify you see your expense in the `userExpenses` array
3. Open the chatbot and ask: "Can you list my expenses?"
4. The chatbot should now show your expense! ✅

## Still Having Issues?

### Check User ID in Browser

Add this to your dashboard to see your user ID:

1. Open `src/app/dashboard/page.tsx`
2. Add this after line 30 (in the useEffect):
   ```javascript
   console.log("Current User:", user);
   ```
3. Refresh the dashboard and check the console

### Test Direct Database Query

Run in Supabase SQL Editor:

```sql
-- See all expenses
SELECT e.*, u.email 
FROM expenses e
LEFT JOIN users u ON e.user_id = u.id
ORDER BY e.created_at DESC;

-- See all auth users
SELECT id, email FROM auth.users;

-- See all users table
SELECT * FROM users;
```

## Expected Results

When working correctly:
- Your auth user ID should match a user in the `users` table
- Expenses should have `user_id` matching your user ID
- Chatbot should find and list your expenses

## Quick Test Script

Save this as `test-expenses.js` and run with node:

```javascript
// Run: node test-expenses.js YOUR_USER_ID

const userId = process.argv[2];

if (!userId) {
  console.log('Usage: node test-expenses.js YOUR_USER_ID');
  process.exit(1);
}

fetch(`http://localhost:3000/api/expenses?userId=${userId}`)
  .then(r => r.json())
  .then(data => {
    console.log('\n=== YOUR EXPENSES ===');
    console.log(`Found ${data.length} expenses\n`);
    data.forEach((exp, i) => {
      console.log(`${i + 1}. $${exp.amount} - ${exp.description || 'No description'}`);
      console.log(`   Date: ${exp.date}`);
      console.log(`   User ID: ${exp.user_id}\n`);
    });
  })
  .catch(err => console.error('Error:', err));
```

