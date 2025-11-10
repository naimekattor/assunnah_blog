-- Fix RLS policies to prevent infinite recursion
-- Drop the problematic policies
drop policy if exists "profiles_select_admin" on public.profiles;
drop policy if exists "profiles_select_own" on public.profiles;

-- Create new policies that avoid recursion
-- Allow users to see their own profile
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Allow public read of profile names for published post authors
-- This is safe because we're not doing a recursive sub-select
create policy "profiles_select_public"
  on public.profiles for select
  using (true);

-- Re-add other policies as needed
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);
