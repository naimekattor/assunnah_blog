import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"
import { Plus, FileText } from "lucide-react"

export default async function DashboardPage() {
  const profile = await getUserProfile()
  if (!profile) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Fetch user's posts
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", profile.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching posts:", error)
  }

  const stats = {
    total: posts?.length || 0,
    published: posts?.filter((p) => p.status === "published").length || 0,
    pending: posts?.filter((p) => p.status === "pending").length || 0,
    rejected: posts?.filter((p) => p.status === "rejected").length || 0,
  }

  return (
    <div className="space-y-10">
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 font-arabic">ড্যাশবোর্ড</h1>
            <p className="text-slate-500 mt-2">আবারও স্বাগতম, {profile.email}</p>
          </div>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            <Link href="/dashboard/create" className="flex items-center gap-2">
              <Plus className="w-5 h-5" /> নতুন নিবন্ধ তৈরি করুন
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "মোট নিবন্ধ", value: stats.total, color: "bg-slate-50 text-slate-700 border-slate-100" },
          { label: "প্রকাশিত", value: stats.published, color: "bg-primary/5 text-primary border-primary/10" },
          { label: "অপেক্ষমাণ", value: stats.pending, color: "bg-amber-50 text-amber-700 border-amber-100" },
          { label: "বাতিল", value: stats.rejected, color: "bg-rose-50 text-rose-700 border-rose-100" },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} border rounded-2xl p-4 md:p-6 transition-transform hover:scale-[1.02] shadow-sm`}>
            <p className="text-xs md:text-sm font-bold uppercase tracking-wider opacity-70">{stat.label}</p>
            <p className="text-2xl md:text-4xl font-black mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800">আপনার নিবন্ধসমূহ</h2>
        </div>
        
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showStatus={true} isDashboard={true} userRole={profile.role} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
               <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500 mb-6 font-medium">এখনো কোনো নিবন্ধ তৈরি করা হয়নি</p>
            <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
              <Link href="/dashboard/create">প্রথম নিবন্ধটি লিখুন</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
