-- Create a helper function to safely check user role without recursion
create or replace function public.user_has_role(user_id uuid, required_role text)
returns boolean
language plpgsql
security definer
as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = user_id and role = required_role
  );
end;
$$;

-- Now recreate ALL RLS policies using this helper to avoid recursion
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
drop policy if exists "posts_insert_own" on public.posts;
drop policy if exists "posts_update_own" on public.posts;
drop policy if exists "posts_update_mod_admin" on public.posts;
drop policy if exists "posts_delete_own" on public.posts;
drop policy if exists "posts_delete_admin" on public.posts;

-- === PROFILES POLICIES (allow public read for author info) ===
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- === POSTS POLICIES ===
-- Published posts visible to all
create policy "posts_select_published"
  on public.posts for select
  using (status = 'published');

-- Users see their own posts
create policy "posts_select_own"
  on public.posts for select
  using (author_id = auth.uid());

-- Authenticated users can see pending posts (they'll see their own + moderation queue via separate admin views)
create policy "posts_select_pending_authenticated"
  on public.posts for select
  using (auth.uid() is not null and (status = 'pending' or status = 'rejected'));

-- Users can insert posts
create policy "posts_insert_own"
  on public.posts for insert
  with check (author_id = auth.uid());

-- Users can update own pending posts
create policy "posts_update_own"
  on public.posts for update
  using (author_id = auth.uid() and status = 'pending');

-- Admins can update any post (using helper function)
create policy "posts_update_admin"
  on public.posts for update
  using (public.user_has_role(auth.uid(), 'admin'));

-- Moderators can update pending posts (using helper function)
create policy "posts_update_moderator"
  on public.posts for update
  using (public.user_has_role(auth.uid(), 'moderator') and status = 'pending');

-- Users can delete own pending posts
create policy "posts_delete_own"
  on public.posts for delete
  using (author_id = auth.uid() and status = 'pending');

-- Admins can delete any post (using helper function)
create policy "posts_delete_admin"
  on public.posts for delete
  using (public.user_has_role(auth.uid(), 'admin'));
