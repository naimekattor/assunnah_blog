import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PostCard } from "@/components/post-card"

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
    <div className="space-y-8 ">
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">Welcome back, {profile.email}</p>
          </div>
          <Button asChild size="lg">
            <Link href="/dashboard/create">Create New Post</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">Total Posts</p>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">Published</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{stats.published}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <p className="text-sm font-medium text-muted-foreground">Rejected</p>
          <p className="text-2xl font-bold text-red-600 mt-2">{stats.rejected}</p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Your Posts</h2>
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} showStatus={true} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/50 rounded-lg">
            <p className="text-muted-foreground mb-4">No posts yet</p>
            <Button asChild>
              <Link href="/dashboard/create">Create Your First Post</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
