import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PostEditor } from "@/components/post-editor"
import { createPost } from "@/app/dashboard/actions"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"

export default async function CreatePostPage() {
  const profile = await getUserProfile()
  if (!profile) redirect("/auth/login")

  return (
    <div className=" mx-auto">
      <PostEditor
        onSubmit={async (data) => {
          "use server"
          await createPost(data.title, data.content)
        }}
      />
       <SimpleEditor />
    </div>
  )
}
