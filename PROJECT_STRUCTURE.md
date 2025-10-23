# Project Structure

This document explains the organization and purpose of each file in the Interview Experience Platform.

## Directory Overview

```
fried-rice/
├── app/                          # Next.js App Router pages and layouts
│   ├── admin/                    # Admin dashboard
│   │   └── page.tsx              # Admin interface for managing submissions
│   ├── api/                      # API routes
│   │   ├── admin/                # Admin-only API endpoints
│   │   │   ├── export/           # CSV export endpoint
│   │   │   │   └── route.ts
│   │   │   └── submissions/      # Admin CRUD operations
│   │   │       └── route.ts
│   │   ├── experiences/          # Public experiences endpoint
│   │   │   └── route.ts
│   │   └── submissions/          # Public submission endpoint
│   │       └── route.ts
│   ├── submit/                   # Submission form page
│   │   └── page.tsx
│   ├── globals.css               # Global styles and Tailwind config
│   ├── layout.tsx                # Root layout with metadata
│   └── page.tsx                  # Homepage with search/browse
├── components/                   # React components
│   └── ui/                       # shadcn/ui components
│       ├── badge.tsx
│       ├── button.tsx
│       ├── card.tsx
│       ├── checkbox.tsx
│       ├── dialog.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── select.tsx
│       ├── sonner.tsx            # Toast notifications
│       ├── table.tsx
│       └── textarea.tsx
├── lib/                          # Utility functions and configurations
│   ├── database.types.ts         # TypeScript types for Supabase tables
│   ├── supabase-admin.ts         # Server-side Supabase client (admin)
│   ├── supabase.ts               # Client-side Supabase client
│   └── utils.ts                  # Utility functions (cn helper)
├── public/                       # Static assets
├── .env.local.example            # Example environment variables
├── .gitignore                    # Git ignore rules
├── components.json               # shadcn/ui configuration
├── eslint.config.mjs             # ESLint configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── postcss.config.mjs            # PostCSS configuration
├── QUICKSTART.md                 # Quick start guide
├── README.md                     # Main documentation
├── supabase-migration.sql        # Database schema SQL
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Key Files Explained

### Application Pages

#### `app/page.tsx` - Homepage
- **Purpose**: Public search and browse interface
- **Features**:
  - Displays all approved interview experiences
  - Keyword search across questions, tips, position, company
  - Company filter dropdown
  - Keyword highlighting in search results
  - Responsive card layout
- **Data Flow**: Fetches from `/api/experiences` (approved only)

#### `app/submit/page.tsx` - Submission Form
- **Purpose**: Allow students to submit their interview experiences
- **Features**:
  - Form validation with Zod schema
  - Required consent checkbox
  - Timeline fields (applied, interviewed, result dates)
  - Interview type breakdown (phone, technical, behavioral, other)
  - Success confirmation screen
- **Data Flow**: Posts to `/api/submissions`

#### `app/admin/page.tsx` - Admin Dashboard
- **Purpose**: Review, approve, edit, and delete submissions
- **Features**:
  - Simple password authentication (localStorage)
  - Stats cards (pending, approved, rejected, total)
  - Filterable submissions table
  - View full submission details
  - Edit any field in submissions
  - Approve/reject workflow
  - Delete submissions
  - CSV export button
- **Authentication**: Uses `ADMIN_PASSWORD` from environment variables

### API Routes

#### `app/api/submissions/route.ts` - Public Submission
- **Method**: POST
- **Purpose**: Accept new interview experience submissions
- **Validation**: Zod schema validation
- **Security**: Public access, creates pending submissions
- **Returns**: Success message and created record

#### `app/api/experiences/route.ts` - Public Experiences
- **Method**: GET
- **Purpose**: Fetch approved experiences for public view
- **Query Params**:
  - `keyword`: Search term (optional)
  - `company`: Company filter (optional)
- **Security**: Only returns approved submissions (RLS enforced)

#### `app/api/admin/submissions/route.ts` - Admin CRUD
- **Methods**: GET, PATCH, DELETE
- **Purpose**: Admin operations on submissions
- **Authentication**: Requires `Authorization: Bearer <password>` header
- **GET**: Fetch all submissions (any status)
- **PATCH**: Update submission (approve, reject, edit)
- **DELETE**: Remove submission permanently

#### `app/api/admin/export/route.ts` - CSV Export
- **Method**: GET
- **Purpose**: Export approved submissions to CSV file
- **Authentication**: Requires admin password
- **Returns**: CSV file download

### Database & Configuration

#### `lib/database.types.ts`
- **Purpose**: TypeScript type definitions for Supabase tables
- **Structure**: Mirrors Supabase database schema
- **Usage**: Provides type safety throughout the application

#### `lib/supabase.ts`
- **Purpose**: Client-side Supabase client
- **Usage**: Used in browser for public operations
- **Auth**: Uses anon key (respects RLS policies)

#### `lib/supabase-admin.ts`
- **Purpose**: Server-side Supabase client
- **Usage**: Used in API routes for admin operations
- **Auth**: Uses service role key (bypasses RLS)

#### `supabase-migration.sql`
- **Purpose**: Database schema and initial setup
- **Contents**:
  - Table creation (`interview_experiences`)
  - Indexes for performance
  - Full-text search indexes
  - Triggers for `updated_at`
  - Row Level Security (RLS) policies
  - Public read access for approved entries
  - Public insert access for submissions

### UI Components

All UI components in `components/ui/` are from shadcn/ui:
- **Installed via CLI**: `npx shadcn@latest add <component>`
- **Customizable**: Can modify any component
- **Accessible**: Built with Radix UI primitives
- **Styled**: Uses Tailwind CSS

## Data Flow

### Submission Flow
```
User fills form → POST /api/submissions
                ↓
          Validate with Zod
                ↓
    Insert to Supabase (status: pending)
                ↓
          Return success
```

### Approval Flow
```
Admin logs in → GET /api/admin/submissions
                ↓
          View pending submissions
                ↓
    Click approve → PATCH /api/admin/submissions
                ↓
          Update status to 'approved'
                ↓
          Refresh submissions list
```

### Public View Flow
```
User visits homepage → GET /api/experiences
                ↓
    Fetch approved submissions (RLS filtered)
                ↓
        Apply keyword/company filters (client-side)
                ↓
        Display with highlighting
```

## Security Layers

### Row Level Security (RLS)
- **Enforced by**: Supabase/PostgreSQL
- **Public Read**: Only approved submissions
- **Public Insert**: Anyone can submit (creates as pending)
- **Admin Operations**: Bypass RLS using service role key

### Admin Authentication
- **Method**: Simple password comparison
- **Storage**: Password in environment variable
- **Token**: Stored in localStorage (browser)
- **Validation**: Checked on each admin API request

### Environment Variables
- **Public**: `NEXT_PUBLIC_*` - safe to expose to browser
- **Private**: Service role key and admin password - server only
- **Protection**: `.env.local` in `.gitignore`

## Development Workflow

### Adding a New Field

1. **Update Database** (`supabase-migration.sql`):
   ```sql
   ALTER TABLE interview_experiences
   ADD COLUMN new_field VARCHAR(255);
   ```

2. **Update Types** (`lib/database.types.ts`):
   ```typescript
   new_field: string
   ```

3. **Update Form** (`app/submit/page.tsx`):
   - Add field to Zod schema
   - Add input to form JSX

4. **Update Display** (`app/page.tsx`):
   - Add field to card display

5. **Update Admin** (`app/admin/page.tsx`):
   - Add field to view/edit dialogs

### Modifying Search

Edit `app/page.tsx` → `filterExperiences()` function:
```typescript
filtered = filtered.filter((exp) =>
  exp.interview_questions.toLowerCase().includes(keyword) ||
  exp.advice_tips.toLowerCase().includes(keyword) ||
  exp.new_field.toLowerCase().includes(keyword) // Add new field
);
```

### Changing Theme

Edit `app/globals.css`:
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... modify color variables ... */
  }
}
```

## Best Practices

### Type Safety
- Always use TypeScript types from `database.types.ts`
- Validate with Zod schemas on both client and server
- Let TypeScript catch errors at compile time

### Error Handling
- Use try-catch in API routes
- Return appropriate HTTP status codes
- Log errors to console for debugging
- Show user-friendly messages with toast notifications

### Performance
- Use database indexes for frequently queried fields
- Client-side filtering for small datasets
- Lazy load or paginate for large result sets

### Security
- Never expose service role key to client
- Validate all inputs with Zod
- Use RLS for public access control
- Sanitize data before displaying (React does this automatically)

## Extending the Application

### Add User Authentication
1. Enable Supabase Auth
2. Replace admin password with proper auth
3. Add user roles (admin, moderator, etc.)
4. Link submissions to user accounts

### Add More Features
- **Comments**: Allow feedback on experiences
- **Ratings**: Star ratings for helpfulness
- **Tags**: Categorize experiences (frontend, backend, etc.)
- **Analytics**: Track popular companies/positions
- **Email Notifications**: Alert admins of new submissions

### Improve Search
- **Fuzzy Search**: Use fuse.js for better matching
- **Advanced Filters**: Date ranges, multiple companies
- **Sorting**: By date, company, popularity
- **Pagination**: Load results in batches

## Testing

### Manual Testing Checklist
- [ ] Submit a new experience
- [ ] Approve submission as admin
- [ ] View approved submission on homepage
- [ ] Search by keyword
- [ ] Filter by company
- [ ] Edit a submission
- [ ] Delete a submission
- [ ] Export to CSV
- [ ] Test on mobile device

### Error Scenarios to Test
- [ ] Submit without consent
- [ ] Submit with invalid LinkedIn URL
- [ ] Submit with missing required fields
- [ ] Access admin without password
- [ ] Access admin with wrong password
- [ ] Delete non-existent submission

## Performance Considerations

### Database
- Indexes on `company`, `status`, `created_at`
- Full-text search indexes on `interview_questions` and `advice_tips`
- Compound indexes for common query patterns

### Frontend
- Client-side filtering for approved entries
- Lazy load images/avatars if added
- Debounce search input
- Virtualize large lists if needed

### API
- Return only necessary fields
- Use Supabase's built-in pagination
- Cache frequently accessed data
- Rate limit submissions if needed

## Troubleshooting

### Common Development Issues

**Environment variables not loading**
- Restart dev server after changing `.env.local`
- Check for typos in variable names
- Ensure no trailing spaces in values

**Database connection errors**
- Verify Supabase URL and keys
- Check Supabase project is running
- Review RLS policies if access denied

**TypeScript errors**
- Some Supabase type errors are expected
- Use type assertions when necessary
- Update `database.types.ts` if schema changes

**Build errors**
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check for syntax errors in recent changes

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Validation](https://zod.dev)

## License

MIT - Feel free to modify and distribute as needed.
