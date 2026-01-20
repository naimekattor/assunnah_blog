"use server"

import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { generateUniqueSlug } from "@/lib/utils/slug"

export async function createPost(
  title: string,
  content: string,
  categoryId: string,
  excerpt: string
) {
  const profile = await getUserProfile()
  if (!profile) {
    throw new Error("Unauthorized")
  }

  const supabase = await createClient()
  const slug = await generateUniqueSlug(title, supabase)

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: profile.id,
      title,
      content,
      category_id: categoryId,
      excerpt,
      slug,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function updatePost(
  id: string,
  title: string,
  content: string,
  categoryId: string,
  excerpt: string
) {
  const profile = await getUserProfile()
  if (!profile) {
    throw new Error("Unauthorized")
  }

  const supabase = await createClient()

  const { data: existingPost } = await supabase.from("posts").select("*").eq("id", id).single()

  if (!existingPost || existingPost.author_id !== profile.id) {
    throw new Error("Not found or unauthorized")
  }

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      content,
      category_id: categoryId,
      excerpt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}

export async function deletePost(id: string) {
  const profile = await getUserProfile()
  if (!profile) {
    throw new Error("Unauthorized")
  }

  const supabase = await createClient()

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single()

  if (!post) {
    throw new Error("Post not found")
  }

  const isAuthor = post.author_id === profile.id
  const isPrivileged = profile.role === "admin" || profile.role === "moderator"

  if (!isAuthor && !isPrivileged) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    throw new Error(error.message)
  }
}
