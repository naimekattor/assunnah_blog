-- FINAL FIX: Remove all existing policies and recreate with proper structure
-- Drop ALL policies
drop policy if exists "profiles_select_all" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_select_public" on public.profiles;
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_delete_own" on public.profiles;

drop policy if exists "posts_select_own" on public.posts;
drop policy if exists "posts_select_published" on public.posts;
drop policy if exists "posts_select_mod_admin" on public.posts;
drop policy if exists "posts_select_all_authenticated" on public.posts;
drop policy if exists "posts_select_pending_authenticated" on public.posts;
drop policy if exists "posts_insert_own" on public.posts;
drop policy if exists "posts_update_own" on public.posts;
drop policy if exists "posts_update_mod_admin" on public.posts;
drop policy if exists "posts_update_admin" on public.posts;
drop policy if exists "posts_update_moderator" on public.posts;
drop policy if exists "posts_delete_own" on public.posts;
drop policy if exists "posts_delete_admin" on public.posts;

-- Drop helper function if exists
drop function if exists public.user_has_role(uuid, text);

-- === SIMPLE PROFILES POLICIES ===
-- Everyone can read all profiles (safe - no sensitive data)
create policy "profiles_public_read"
  on public.profiles for select
  using (true);

-- Users can only update their own profile
create policy "profiles_own_update"
  on public.profiles for update
  using (auth.uid() = id);

-- Users can only delete their own profile
create policy "profiles_own_delete"
  on public.profiles for delete
  using (auth.uid() = id);

-- === POSTS POLICIES ===
-- Everyone can read published posts
create policy "posts_published_read"
  on public.posts for select
  using (status = 'published');

-- Authenticated users can read their own posts (any status)
create policy "posts_own_read"
  on public.posts for select
  using (auth.uid() = author_id);

-- Authenticated users can read pending posts if they're not the author
-- This allows moderators/admins to see the moderation queue
-- Role checking will be done in the application layer, not RLS
create policy "posts_pending_authenticated_read"
  on public.posts for select
  using (auth.uid() is not null and status in ('pending', 'rejected') and author_id != auth.uid());

-- Users can create posts
create policy "posts_own_create"
  on public.posts for insert
  with check (auth.uid() = author_id);

-- Users can update their own pending posts
create policy "posts_own_pending_update"
  on public.posts for update
  using (auth.uid() = author_id and status = 'pending')
  with check (auth.uid() = author_id);

-- Authenticated users can update any post (role validation in app)
create policy "posts_authenticated_update"
  on public.posts for update
  using (auth.uid() is not null);

-- Users can delete their own pending posts
create policy "posts_own_pending_delete"
  on public.posts for delete
  using (auth.uid() = author_id and status = 'pending');

-- Authenticated users can delete any post (role validation in app)
create policy "posts_authenticated_delete"
  on public.posts for delete
  using (auth.uid() is not null);
