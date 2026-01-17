import { createClient, createAdminClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { ModerationTable } from "@/components/moderation-table"

async function approvePost(id: string) {
  "use server"

  const profile = await getUserProfile()
  if (!profile || (profile.role !== "moderator" && profile.role !== "admin")) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("posts")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/moderation")
}

async function rejectPost(id: string) {
  "use server"

  const profile = await getUserProfile()
  if (!profile || (profile.role !== "moderator" && profile.role !== "admin")) {
    throw new Error("Unauthorized")
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from("posts")
    .update({
      status: "rejected",
    })
    .eq("id", id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath("/moderation")
}

export default async function ModerationPage() {
  const profile = await getUserProfile()
  if (!profile) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Fetch pending posts without nested profile expansion
  const { data: pendingPosts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching posts:", error)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Moderation Queue</h1>
        <p className="text-muted-foreground mt-2">Review and approve pending posts</p>
      </div>

      {pendingPosts && pendingPosts.length > 0 ? (
        <ModerationTable posts={pendingPosts} onApprove={approvePost} onReject={rejectPost} />
      ) : (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground">No pending posts</p>
        </div>
      )}
    </div>
  )
}
