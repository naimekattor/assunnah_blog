import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"

export default async function AdminPage() {
  const profile = await getUserProfile()
  if (!profile) {
    redirect("/auth/login")
  }

  const supabase = await createClient()

  // Fetch statistics
  const { data: allPosts } = await supabase.from("posts").select("*").order("created_at", { ascending: false })
  const { data: allProfiles } = await supabase.from("profiles").select("*")

  const stats = {
    totalUsers: allProfiles?.length || 0,
    totalPosts: allPosts?.length || 0,
    publishedPosts: allPosts?.filter((p) => p.status === "published").length || 0,
    pendingPosts: allPosts?.filter((p) => p.status === "pending").length || 0,
    moderators: allProfiles?.filter((p) => p.role === "moderator").length || 0,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">System statistics and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.totalPosts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{stats.publishedPosts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingPosts}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Moderators</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats.moderators}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Monitor and manage the platform</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-2">
            <p>
              <span className="font-medium">Your Role:</span> {profile.role}
            </p>
            <p>
              <span className="font-medium">Email:</span> {profile.email}
            </p>
            <p>
              <span className="font-medium">Member Since:</span> {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
            <h2 className="text-xl font-bold text-slate-800">Recent Posts Management</h2>
          </div>
        </div>
        
        {allPosts && allPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.slice(0, 9).map((post) => (
              <PostCard 
                key={post.id} 
                post={post as any} 
                showStatus={true} 
                userRole={profile.role} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">No posts found in the system.</p>
          </div>
        )}
      </div>
    </div>
  )
}
