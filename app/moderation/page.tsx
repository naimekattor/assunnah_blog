import { createClient, createAdminClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { ModerationTable } from "@/components/moderation-table"
import { deletePost } from "../dashboard/actions"

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

async function handleDelete(id: string) {
  "use server"
  await deletePost(id)
  revalidatePath("/moderation")
}

export default async function ModerationPage() {
  const profile = await getUserProfile()
  if (!profile || (profile.role !== "moderator" && profile.role !== "admin")) {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  // Fetch pending posts with profiles
  const { data: pendingPosts, error } = await supabase
    .from("posts")
    .select("*, profiles(*)")
    .eq("status", "pending")
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error fetching posts:", error)
  }

  return (
    <div className="space-y-10">
      <div>
         <div className="flex items-center gap-3 mb-2">
            <div className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
              Moderation
            </div>
         </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 font-arabic">মডারেশন কিউ</h1>
        <p className="text-slate-500 mt-2">অপেক্ষমাণ পোস্টগুলো রিভিউ করুন এবং অনুমোদন দিন</p>
      </div>

      {pendingPosts && pendingPosts.length > 0 ? (
        <ModerationTable 
          posts={pendingPosts as any} 
          onApprove={approvePost} 
          onReject={rejectPost} 
          onDelete={handleDelete}
        />
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">বর্তমানে কোনো পোস্ট মডারেশনের জন্য অপেক্ষমাণ নেই</p>
        </div>
      )}
    </div>
  )
}
