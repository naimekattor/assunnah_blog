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

  if (existingPost.status !== "pending") {
    throw new Error("Can only edit pending posts")
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
