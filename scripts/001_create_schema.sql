-- Create tables for the blog platform

-- Users table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text not null default 'user' check (role in ('user', 'moderator', 'admin')),
  created_at timestamp with time zone default now()
);

-- Posts table
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text not null unique,
  content text not null,
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  created_at timestamp with time zone default now(),
  published_at timestamp with time zone,
  updated_at timestamp with time zone default now()
);

-- Create indexes for performance
create index if not exists idx_posts_status on public.posts(status);
create index if not exists idx_posts_author_id on public.posts(author_id);
create index if not exists idx_posts_slug on public.posts(slug);
create index if not exists idx_profiles_role on public.profiles(role);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.posts enable row level security;

-- RLS Policies for profiles table
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_select_admin"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- RLS Policies for posts table
-- Users can see their own posts (any status)
create policy "posts_select_own"
  on public.posts for select
  using (author_id = auth.uid());

-- Published posts are visible to everyone (public read)
create policy "posts_select_published"
  on public.posts for select
  using (status = 'published');

-- Moderators and admins can see all posts
create policy "posts_select_mod_admin"
  on public.posts for select
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin')
    )
  );

-- Users can insert their own posts
create policy "posts_insert_own"
  on public.posts for insert
  with check (author_id = auth.uid());

-- Users can update their own posts if pending
create policy "posts_update_own"
  on public.posts for update
  using (author_id = auth.uid() and status = 'pending');

-- Admins and moderators can update any post status
create policy "posts_update_mod_admin"
  on public.posts for update
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role in ('moderator', 'admin')
    )
  );

-- Users can delete their own pending posts
create policy "posts_delete_own"
  on public.posts for delete
  using (author_id = auth.uid() and status = 'pending');

-- Admins can delete any post
create policy "posts_delete_admin"
  on public.posts for delete
  using (
    exists (
      select 1 from public.profiles where id = auth.uid() and role = 'admin'
    )
  );
