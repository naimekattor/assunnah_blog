import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { EditPostClient } from "./client"

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const profile = await getUserProfile()
  if (!profile) redirect("/auth/login")

  const supabase = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()

  if (!post) notFound()

  // Only author can edit
  if (post.author_id !== profile.id) {
    redirect("/dashboard")
  }

  return (
    <div className="mx-auto">
      <EditPostClient post={post} />
    </div>
  )
}
