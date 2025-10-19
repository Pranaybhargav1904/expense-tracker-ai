# Deploying to Vercel

## Required Environment Variables

To deploy this application to Vercel, you need to set up the following environment variables:

### Supabase Configuration

1. Go to your [Supabase Project Dashboard](https://supabase.com/dashboard)
2. Navigate to **Settings** → **API**
3. Copy the following values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Anon/Public Key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Important Notes:**
- Both variables should be set for **Production**, **Preview**, and **Development** environments
- The variables MUST start with `NEXT_PUBLIC_` to be accessible in the browser
- After adding the variables, you need to **redeploy** your application

### Steps to Deploy:

1. **Connect your GitHub repository** to Vercel (if not already connected)

2. **Add Environment Variables** in Vercel:
   - Go to your project settings
   - Click on "Environment Variables"
   - Add both Supabase variables
   - Select all environments (Production, Preview, Development)

3. **Redeploy**:
   - Go to the "Deployments" tab
   - Click the three dots menu on the latest deployment
   - Select "Redeploy"
   - OR push a new commit to trigger a deployment

4. **Verify**:
   - Once deployed, test the login/signup functionality
   - Check the browser console for any errors

### Troubleshooting

If you see "supabaseUrl is required" error:
- ✅ Verify environment variables are added in Vercel settings
- ✅ Ensure variable names are exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ Redeploy after adding variables
- ✅ Check that all environments are selected when adding variables

### Local Development

For local development, create a `.env.local` file in the root directory:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**Note:** Never commit `.env.local` to version control. It's already in `.gitignore`.


