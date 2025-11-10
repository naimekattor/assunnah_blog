# Blog Platform

A modern, role-based blog platform built with Next.js 15, Supabase, and TypeScript.

## Features

- **Role-Based Access Control**
  - User: Create, edit, and manage own posts
  - Moderator: Review and approve/reject pending posts
  - Admin: Full system management and user administration

- **Post Workflow**
  - Posts default to pending status
  - Moderators/Admins review and approve for publication
  - Rejected posts visible only to author and moderators

- **Authentication**
  - Email/password authentication via Supabase Auth
  - Session-based authentication with middleware refresh
  - Automatic profile creation on signup

- **Public Blog**
  - Display published posts to all visitors
  - SEO-friendly URLs with slugs
  - Author information and publication dates

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React, TypeScript
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + shadcn/ui
- **Validation**: Built-in TypeScript types

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project
- Git

### Setup Instructions

1. **Clone the repository**
   \`\`\`bash
   git clone <repo-url>
   cd blog-platform
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Setup environment variables**
   
   Create a \`.env.local\` file:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. **Run database migrations**
   
   Execute the SQL scripts in Supabase dashboard or via CLI:
   \`\`\`bash
   # Run scripts/001_create_schema.sql
   # Run scripts/002_create_trigger.sql
   \`\`\`

5. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

\`\`\`
├── app/
│   ├── auth/                 # Authentication pages (login, signup)
│   ├── dashboard/            # User dashboard
│   ├── moderation/          # Moderation queue
│   ├── admin/               # Admin dashboard
│   ├── post/[slug]/         # Individual post display
│   ├── api/                 # API routes
│   └── page.tsx             # Home page (public blog)
├── components/
│   ├── header.tsx           # Navigation header
│   ├── post-card.tsx        # Post card component
│   ├── post-editor.tsx      # Post creation/editing form
│   ├── protected-page.tsx   # Protection wrapper
│   ├── moderation-table.tsx # Moderation queue display
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── supabase/           # Supabase client utilities
│   ├── auth.ts             # Authentication helpers
│   ├── types.ts            # TypeScript types
│   └── utils/              # Utility functions
└── scripts/
    ├── 001_create_schema.sql  # Database schema creation
    └── 002_create_trigger.sql # User profile trigger
\`\`\`

## Database Schema

### Profiles Table
- id (UUID, PK, FK to auth.users)
- email (text)
- role (enum: user, moderator, admin)
- created_at (timestamp)

### Posts Table
- id (UUID, PK)
- author_id (UUID, FK to profiles)
- title (text)
- slug (text, unique)
- content (text)
- status (enum: pending, published, rejected)
- created_at (timestamp)
- published_at (timestamp, nullable)
- updated_at (timestamp)

## Row Level Security (RLS)

All tables have RLS enabled with comprehensive policies:

- Users can view and manage only their own posts
- Published posts visible to public
- Moderators/Admins can view and manage all posts
- Only post authors can edit pending posts
- Only Admins/Moderators can change post status

## API Endpoints

### Posts
- \`GET /api/posts\` - List posts (filtered by auth level)
- \`GET /api/posts/[id]\` - Get single post
- \`PATCH /api/posts/[id]\` - Update post
- \`DELETE /api/posts/[id]\` - Delete post

### Auth
- \`GET /api/auth/callback\` - OAuth callback handler

## User Roles

### User (Default)
- Create new posts
- Edit/delete own pending posts
- View own posts (all statuses)
- Cannot moderate or manage other users

### Moderator
- All User permissions
- View all pending posts
- Approve/reject pending posts
- Cannot manage users or system settings

### Admin
- All Moderator permissions
- Full system management
- Can change user roles
- Can delete any post
- Access to admin dashboard

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

The app will automatically scale and is optimized for Vercel's infrastructure.

## Development

### Running Tests
\`\`\`bash
npm run test
\`\`\`

### Building for Production
\`\`\`bash
npm run build
npm run start
\`\`\`

### Linting
\`\`\`bash
npm run lint
\`\`\`

## Security

- Row Level Security (RLS) enforces data access rules at database level
- Authentication tokens refreshed on every request via middleware
- Email confirmation required for new accounts
- Role-based access control on all protected pages and API routes
- User data isolated per account with RLS policies

## Troubleshooting

### Email confirmation not received
- Check spam folder
- Verify email settings in Supabase dashboard
- Ensure \`emailRedirectTo\` is configured correctly

### Posts not appearing on public blog
- Verify post status is "published"
- Check that moderation approval was successful
- Confirm RLS policies are enabled

### Permission errors
- Verify user role in profiles table
- Check RLS policies are correctly configured
- Ensure middleware is running for token refresh

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
