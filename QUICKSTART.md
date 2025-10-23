# Quick Start Guide

This guide will help you get the Interview Experience Platform up and running in minutes.

## Prerequisites

- Node.js 20+ installed on your machine
- A Supabase account (sign up for free at https://supabase.com)

## Step-by-Step Setup

### 1. Set Up Supabase Database

1. **Create a new Supabase project**
   - Go to https://supabase.com
   - Click "New Project"
   - Choose an organization or create one
   - Set project name, database password, and region
   - Wait ~2 minutes for setup to complete

2. **Run the database migration**
   - In your Supabase project dashboard, go to **SQL Editor**
   - Click "New Query"
   - Open the file `supabase-migration.sql` in this repository
   - Copy and paste the entire contents
   - Click "Run" to execute the SQL
   - You should see "Success. No rows returned"

3. **Get your API credentials**
   - Go to **Settings** → **API** in your Supabase dashboard
   - You'll need three values:
     - **Project URL**: Found under "Project URL"
     - **anon/public key**: Found under "Project API keys" (labeled "anon public")
     - **service_role key**: Found under "Project API keys" (click "Reveal" to see it)
   - ⚠️ Keep the service_role key secret - never commit it to git!

### 2. Configure the Application

1. **Create environment file**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Edit `.env.local`** with your credentials:
   ```env
   # From Supabase Settings → API
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   
   # Choose a strong password for admin access
   ADMIN_PASSWORD=your_secure_password_here
   ```

### 3. Install and Run

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   - Go to http://localhost:3000
   - You should see the interview experiences homepage

### 4. Test the Application

#### Submit a Test Experience

1. Go to http://localhost:3000/submit
2. Fill out the form with test data:
   - Student Name: "John Doe"
   - LinkedIn: "https://linkedin.com/in/johndoe"
   - Company: "Google"
   - Position: "Software Engineering Intern"
   - Add some interview questions and advice
   - Check the consent box
3. Click "Submit Experience"
4. You should see a success message

#### Review as Admin

1. Go to http://localhost:3000/admin
2. Enter your admin password (from `.env.local`)
3. You should see the pending submission
4. Click the checkmark icon (✓) to approve it
5. The submission is now approved

#### View Public Page

1. Go to http://localhost:3000
2. You should now see the approved experience
3. Try searching for keywords (e.g., "Google", "intern")
4. Test the company filter dropdown

## Common Issues

### "Failed to fetch experiences"

**Solution:**
- Check that your Supabase URL and anon key are correct in `.env.local`
- Verify you ran the migration SQL successfully
- Check browser console (F12) for specific errors
- Restart the dev server: `Ctrl+C` then `npm run dev`

### "Unauthorized" in admin panel

**Solution:**
- Make sure the password you're entering matches `ADMIN_PASSWORD` in `.env.local`
- Clear browser localStorage: Open browser console (F12) and run `localStorage.clear()`
- Restart the dev server after changing `.env.local`

### Submissions don't appear on homepage

**Solution:**
- Remember that submissions start as "pending"
- Only "approved" submissions appear on the public homepage
- Log into the admin panel and approve the submission

### TypeScript errors

**Solution:**
- Some Supabase type errors are expected and can be ignored
- The application will still function correctly
- If you see runtime errors, check the browser console

## Next Steps

### Deploy to Production

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
     - `ADMIN_PASSWORD`
   - Click "Deploy"

### Customize the Application

- **Change colors**: Edit `app/globals.css`
- **Modify branding**: Update text in `app/layout.tsx` and `app/page.tsx`
- **Add fields**: See README.md for instructions
- **Change search behavior**: Edit `filterExperiences` function in `app/page.tsx`

## Need Help?

- Check the full [README.md](./README.md) for detailed documentation
- Review the [Supabase migration SQL](./supabase-migration.sql) to understand the database schema
- Check your browser console (F12) for error messages
- Open an issue on GitHub if you encounter problems

## Security Reminders

- ✅ `.env.local` is in `.gitignore` - your secrets are safe
- ✅ Public users can only read approved submissions (via RLS)
- ✅ Admin operations use service role key (bypasses RLS)
- ⚠️ For production, consider using Supabase Auth instead of simple password
- ⚠️ Change `ADMIN_PASSWORD` to something strong and unique

## Success!

If you can:
1. ✅ Submit an experience through the form
2. ✅ Log into the admin panel
3. ✅ Approve a submission
4. ✅ See it appear on the homepage

Then you're all set! 🎉

The application is now ready to collect and share student interview experiences.
