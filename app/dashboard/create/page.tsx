import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PostEditor } from "@/components/post-editor"
import { createPost } from "@/app/dashboard/actions"

export default async function CreatePostPage() {
  const profile = await getUserProfile()
  if (!profile) redirect("/auth/login")

  return (
    <div className="max-w-2xl mx-auto">
      <PostEditor
        onSubmit={async (data) => {
          "use server"
          await createPost(data.title, data.content)
        }}
      />
    </div>
  )
}
