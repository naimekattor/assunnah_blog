import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PostEditor } from "@/components/post-editor"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { updatePost } from "@/app/dashboard/actions"

interface PostPageProps {
  params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: PostPageProps) {
  const { id } = await params

  const profile = await getUserProfile()
  if (!profile) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).eq("author_id", profile.id).single()

  if (!post) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto">
      <PostEditor
        initialPost={post}
        onSubmit={async (data) => {
          await updatePost(id, data.title, data.content)
        }}
      />
    </div>
  )
}
