import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { Users, FileText, CheckCircle, Clock, Shield, Eye, BarChart3, ArrowUpRight, Globe } from "lucide-react"

export default async function AdminPage() {
  const profile = await getUserProfile()
  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  // Fetch statistics with count optimization
  const { count: totalPosts } = await supabase.from("posts").select("*", { count: "exact", head: true })
  const { count: publishedCount } = await supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "published")
  const { count: pendingCount } = await supabase.from("posts").select("*", { count: "exact", head: true }).eq("status", "pending")
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { count: moderatorCount } = await supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "moderator")
  
  // For recent management, we still need the list
  const { data: recentPosts } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(9)

  // Fetch Analytics Data (keep last 100 for current session-based aggregated stats)
  const { data: pageViews } = await supabase
    .from("page_views")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100)

  const aggregateStats = {
    totalViews: pageViews?.length || 0,
    uniqueVisitors: new Set(pageViews?.map(v => v.session_id)).size || 0,
  }

  const stats = {
    totalUsers: totalUsers || 0,
    totalPosts: totalPosts || 0,
    publishedPosts: publishedCount || 0,
    pendingPosts: pendingCount || 0,
    moderators: moderatorCount || 0,
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">System statistics and management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600" },
          { label: "Total Posts", value: stats.totalPosts, icon: FileText, color: "text-emerald-600" },
          { label: "Published", value: stats.publishedPosts, icon: CheckCircle, color: "text-green-600" },
          { label: "Pending", value: stats.pendingPosts, icon: Clock, color: "text-amber-600" },
          { label: "Moderators", value: stats.moderators, icon: Shield, color: "text-purple-600" },
        ].map((item, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-primary rounded-full"></div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" /> Site Analytics
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Recent Visitor Activity
              </CardTitle>
              <CardDescription>Live stream of page views and interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Page Path</th>
                      <th className="px-4 py-3">Device / Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageViews && pageViews.length > 0 ? (
                      pageViews.map((view) => (
                        <tr key={view.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                            {new Date(view.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700 max-w-[200px] truncate">
                            {view.path}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400 truncate max-w-[150px]">
                            {view.user_agent?.split(')')[0].split('(')[1] || "Mobile Device"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-4 py-10 text-center text-slate-400 italic">
                          No visitor data available yet...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black">{aggregateStats.uniqueVisitors}</div>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Last 100 views</p>
                  </div>
                  <Users className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Page Impressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black">{aggregateStats.totalViews}</div>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">Total hits captured</p>
                  </div>
                  <Eye className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
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
        
        {recentPosts && recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
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
