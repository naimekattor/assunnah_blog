import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PostCard } from "@/components/post-card"
import { Users, FileText, CheckCircle, Clock, Shield, Eye, BarChart3, ArrowUpRight, Globe } from "lucide-react"
import { AnalyticsChart } from "@/components/analytics-chart"

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

  // 1. Fetch All-time total page views count
  const { count: allTimeViews } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })

  // 2. Fetch last 50 page views for the activity feed table
  const { data: pageViews } = await supabase
    .from("page_views")
    .select("id, created_at, path, user_agent")
    .order("created_at", { ascending: false })
    .limit(50)

  // 3. Fetch recent page views (up to 1000) for unique session calculation & top pages aggregation
  const { data: recentViews } = await supabase
    .from("page_views")
    .select("path, session_id")
    .order("created_at", { ascending: false })
    .limit(1000)

  const aggregateStats = {
    totalViews: allTimeViews || 0,
    uniqueVisitors: new Set(recentViews?.map(v => v.session_id) || []).size,
  }

  // 4. Aggregate top pages from recent views
  const pathMap: Record<string, number> = {}
  recentViews?.forEach(v => {
    pathMap[v.path] = (pathMap[v.path] || 0) + 1
  })
  const topPages = Object.entries(pathMap)
    .map(([path, count]) => ({ path, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // 5. Compile daily chart data for the last 7 days
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - i)
    return d.toISOString().split("T")[0] // YYYY-MM-DD
  }).reverse()

  const dailyMap: Record<string, number> = {}
  last7Days.forEach(day => {
    dailyMap[day] = 0
  })

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const { data: chartViews } = await supabase
    .from("page_views")
    .select("created_at")
    .gte("created_at", sevenDaysAgo.toISOString())

  chartViews?.forEach(v => {
    const dateStr = v.created_at.split("T")[0]
    if (dateStr in dailyMap) {
      dailyMap[dateStr]++
    }
  })

  const chartData = last7Days.map(date => {
    const d = new Date(date)
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      views: dailyMap[date]
    }
  })

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

        {/* Top level analytics layout: Chart + KPI Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <AnalyticsChart data={chartData} />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-6">
            <Card className="border-slate-100 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Unique Visitors (Recent)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black text-slate-800">{aggregateStats.uniqueVisitors}</div>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">From last 1000 views</p>
                  </div>
                  <Users className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 shadow-xs">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Impressions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-3xl font-black text-slate-800">{aggregateStats.totalViews}</div>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-bold">All-time page hits</p>
                  </div>
                  <Eye className="h-8 w-8 text-primary/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Secondary analytics details: Recent Activity + Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-slate-100 shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" /> Recent Visitor Activity
              </CardTitle>
              <CardDescription>Live stream of last 50 page views</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto max-h-[300px] overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-slate-50 text-slate-500 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3 bg-slate-50">Time</th>
                      <th className="px-4 py-3 bg-slate-50">Page Path</th>
                      <th className="px-4 py-3 bg-slate-50">Device / Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageViews && pageViews.length > 0 ? (
                      pageViews.map((view) => (
                        <tr key={view.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                          <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                            {new Date(view.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700 max-w-[200px] truncate" title={view.path}>
                            {view.path}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-400 truncate max-w-[150px]" title={view.user_agent}>
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

          <Card className="border-slate-100 shadow-xs">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-emerald-500" /> Top Visited Pages
              </CardTitle>
              <CardDescription>Most popular paths based on recent activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPages.length > 0 ? (
                  topPages.map((page, index) => (
                    <div key={page.path} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-xs font-semibold text-slate-600 shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm font-medium text-slate-700 truncate" title={page.path}>
                          {page.path === "/" ? "Home (/)" : page.path}
                        </span>
                      </div>
                      <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                        {page.count} views
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-slate-400 italic text-sm">
                    No page data aggregated yet...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
