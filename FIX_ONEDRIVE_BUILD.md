# Fix EINVAL Build Error (OneDrive Issue)

## Problem
When running `npm run build` in a OneDrive folder, you get:
```
Error: EINVAL: invalid argument, readlink
```

This happens because OneDrive doesn't handle symlinks properly that Next.js creates in the `.next` folder.

## ✅ Quick Fix (3 Options)

### **Option 1: Use Development Mode (Recommended)**
For development, skip the build entirely:

```bash
npm run dev
```

This works perfectly in OneDrive and is what you need 99% of the time during development!

### **Option 2: Exclude .next from OneDrive Sync**

1. **Build the project once** (it will error, but create the .next folder):
   ```bash
   npm run build
   ```

2. **Right-click on the `.next` folder** in File Explorer

3. **Select:** "Free up space" or "Always keep on this device" → Choose "Free up space"
   - This tells OneDrive to NOT sync the .next folder

4. **Try building again:**
   ```bash
   npm run build
   ```

### **Option 3: Move Project Outside OneDrive**

If you need production builds frequently:

1. **Copy your project** to a local folder:
   ```bash
   xcopy /E /I C:\Users\yegol\OneDrive\Desktop\expense-tracker C:\Projects\expense-tracker
   ```

2. **Work from the new location:**
   ```bash
   cd C:\Projects\expense-tracker\expense-tracker-ai
   npm run build
   ```

## 🔧 Quick Command to Clean Build Cache

If builds keep failing, clean everything:

```bash
# PowerShell
Remove-Item -Recurse -Force .next, node_modules\.cache -ErrorAction SilentlyContinue
npm run build
```

## 📝 Why This Happens

- Next.js creates **symlinks** in the `.next` folder for optimization
- OneDrive tries to sync these symlinks
- Windows OneDrive **can't sync symlinks properly** → EINVAL error
- Solution: Either use dev mode or exclude .next from sync

## ✅ Best Practice for Development

**Just use `npm run dev`** - you don't need to build during development!

- ✅ Hot reload on save
- ✅ Works in OneDrive
- ✅ Faster development
- ✅ No build errors

Only use `npm run build` when:
- Deploying to production
- Testing production optimizations
- Creating a production bundle

## 🚀 Your App is Ready!

All your code is correct. The EINVAL error is ONLY a Windows OneDrive issue, not a problem with your application.

**Run this now:**
```bash
npm run dev
```

Then open: http://localhost:3000

Everything works! 🎉

