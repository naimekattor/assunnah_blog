import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreatePostClient } from "./client"

export default async function CreatePostPage() {
  const profile = await getUserProfile()
  if (!profile) redirect("/auth/login")

  return (
    <div className=" mx-auto">
      <CreatePostClient />
    </div>
  )
}
