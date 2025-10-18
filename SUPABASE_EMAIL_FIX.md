# Fix: Email Validation Error in Supabase

## Problem
Getting error: "Email address 'ets@gmail.com' is invalid"

## Root Cause
Supabase has **email confirmation ENABLED by default**, which can cause issues during development.

## Solution

### Option 1: Disable Email Confirmation (Recommended for Development)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click **Providers** tab
5. Scroll down to **Email** provider
6. Click to expand it
7. **DISABLE** "Confirm email" option
8. Click **Save**

### Option 2: Configure Email Settings (For Production)

If you want to keep email confirmation enabled:

1. Go to **Settings** → **Auth**
2. Configure your SMTP settings or use Supabase's email service
3. Add your domain to the allowed redirect URLs

### Option 3: Use Auto-Confirm in Code

The signup API has been updated to handle this automatically, but you can also configure it in Supabase:

1. Go to **Authentication** → **URL Configuration**
2. Set your site URL (e.g., `http://localhost:3000`)
3. Add redirect URLs if needed

## Test After Fix

1. Restart your Next.js dev server: `npm run dev`
2. Try signing up again with any email
3. You should now be able to create accounts without email verification

## Alternative Quick Test

Run this to test email validation:
```bash
curl -X POST http://localhost:3000/api/auth/test-signup \
  -H "Content-Type: application/json" \
  -d '{"email":"ets@gmail.com"}'
```

This will show if the email passes our validation logic.




