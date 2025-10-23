# Fried Rice

A web application for students to share and discover interview experiences, helping future applicants prepare for their interviews.


- **Framework**: Next.js 16 
- **Database**: Supabase (PostgreSQL)
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

## Setup Instructions

### 1. Prerequisites

- Node.js 20+ installed
- A Supabase account (free tier works fine)

### 2. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be set up (takes ~2 minutes)
3. Go to the SQL Editor in your Supabase dashboard
4. Copy and paste the contents of `supabase-migration.sql` and run it
5. This will create the `interview_experiences` table with proper indexes and RLS policies

### 3. Get Supabase Credentials

1. In your Supabase project, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon/public key** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

### 4. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ADMIN_PASSWORD=your_secure_admin_password_here
   ```

3. Choose a strong admin password for the `ADMIN_PASSWORD` field

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 7. Test the Application

1. **Submit an experience**: Go to http://localhost:3000/submit
2. **Access admin panel**: Go to http://localhost:3000/admin
3. **Login**: Use the password you set in `ADMIN_PASSWORD`
4. **Approve a submission**: Review and approve the test submission
5. **View public page**: Go back to http://localhost:3000 to see the approved entry

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
4. Deploy!

### Important Security Notes

- Never commit `.env.local` to git (it's in `.gitignore`)
- The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - keep it secret
- Change the `ADMIN_PASSWORD` to something strong and unique
- Admin authentication is simple password-based - for production, consider using Supabase Auth

## Usage

### For Students (Public)

1. Visit the homepage to browse approved interview experiences
2. Use the search bar to find specific topics (e.g., "system design", "binary tree")
3. Filter by company using the dropdown
4. Click "Share Your Experience" to submit your own interview story
5. Fill out the form and give consent for your name/LinkedIn to be visible
6. Your submission will be reviewed before being published

### For Administrators

1. Go to `/admin` route
2. Login with the admin password
3. Review pending submissions in the dashboard
4. Click the eye icon to view full details
5. Click the checkmark to approve or X to reject
6. Click the edit icon to modify any submission
7. Click the trash icon to delete a submission
8. Click "Export CSV" to download all approved entries

## Database Schema

### `interview_experiences` table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| student_name | VARCHAR(255) | Student's full name |
| linkedin_url | TEXT | LinkedIn profile URL |
| company | VARCHAR(255) | Company name |
| position | VARCHAR(255) | Job position/role |
| applied_date | DATE | When they applied |
| interviewed_date | DATE | When they interviewed |
| result_date | DATE | When they got results |
| phone_screens | INTEGER | Number of phone screens |
| technical_interviews | INTEGER | Number of technical interviews |
| behavioral_interviews | INTEGER | Number of behavioral interviews |
| other_interviews | INTEGER | Number of other interviews |
| interview_questions | TEXT | Questions asked during interviews |
| advice_tips | TEXT | Advice for future applicants |
| consent_given | BOOLEAN | Whether student gave consent |
| status | VARCHAR(20) | pending, approved, or rejected |
| created_at | TIMESTAMP | When submitted |
| updated_at | TIMESTAMP | Last modified |

## API Routes

### Public Routes

- `POST /api/submissions` - Submit a new experience
- `GET /api/experiences` - Get all approved experiences (with optional search/filter)

### Admin Routes (require Authorization header)

- `GET /api/admin/submissions?status=<status>` - Get all submissions
- `PATCH /api/admin/submissions` - Update a submission (approve/reject/edit)
- `DELETE /api/admin/submissions?id=<id>` - Delete a submission
- `GET /api/admin/export` - Export approved submissions to CSV

## Customization

### Changing Colors/Theme

Edit `app/globals.css` to customize the color scheme. The app uses Tailwind CSS and CSS variables for theming.

### Adding More Fields

1. Update `lib/database.types.ts` with new field
2. Add field to Supabase table via SQL
3. Update validation schema in submission form
4. Update form UI in `app/submit/page.tsx`
5. Update display in `app/page.tsx` and `app/admin/page.tsx`

### Modifying Search Behavior

The search is currently case-insensitive and searches across:
- Interview questions
- Advice/tips
- Position
- Company name

To modify, edit the `filterExperiences` function in `app/page.tsx`.

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
