-- Fix posts policies to use auth.jwt() instead of recursive subqueries
-- Drop recursive policies
drop policy if exists "posts_select_mod_admin" on public.posts;
drop policy if exists "posts_update_mod_admin" on public.posts;
drop policy if exists "posts_delete_admin" on public.posts;

-- Re-create with non-recursive checks using auth.jwt()
-- Moderators and admins can see all posts using JWT claims
create policy "posts_select_mod_admin"
  on public.posts for select
  using (
    auth.jwt() ->> 'user_role' in ('moderator', 'admin')
  );

-- Admins and moderators can update post status using JWT claims
create policy "posts_update_mod_admin"
  on public.posts for update
  using (
    auth.jwt() ->> 'user_role' in ('moderator', 'admin')
  );

-- Admins can delete any post using JWT claims
create policy "posts_delete_admin"
  on public.posts for delete
  using (
    auth.jwt() ->> 'user_role' = 'admin'
  );
