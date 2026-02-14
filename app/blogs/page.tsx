import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PostCard } from "@/components/post-card"
import { getSession, getUserProfile } from "@/lib/auth"

interface BlogsPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function BlogsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const session = await getSession()
  const profile = session ? await getUserProfile() : null
  const supabase = await createClient()

  const categorySlug = typeof searchParams.category === "string" ? searchParams.category : null
  const searchQuery = typeof searchParams.search === "string" ? searchParams.search : null

  let query = supabase
    .from("posts")
    .select(`
      *,
      categories (
        name_bn,
        slug
      )
    `)
    .eq("status", "published")

  if (categorySlug) {
    // first find the category id
    const { data: category } = await supabase
      .from("categories")
      .select("id, name_bn")
      .eq("slug", categorySlug)
      .single()
    
    if (category) {
      query = query.eq("category_id", category.id)
    }
  }

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`)
  }

  const { data: posts } = await query.order("published_at", { ascending: false })

  // Get current category name for display
  let currentCategoryName = "সকল নিবন্ধ"
  if (searchQuery) {
    currentCategoryName = `অনুসন্ধানের ফলাফল: "${searchQuery}"`
  } else if (categorySlug && posts && posts.length > 0) {
     // Try to get name from first post
     currentCategoryName = posts[0].categories?.name_bn || categorySlug
  } else if (categorySlug) {
    // If no posts, fetch category name separately
    const { data: category } = await supabase
      .from("categories")
      .select("name_bn")
      .eq("slug", categorySlug)
      .single()
    if (category) currentCategoryName = category.name_bn
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header profile={profile} />
      <main className="flex-1 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {currentCategoryName}
            </h1>
            <Button asChild variant="outline">
               <Link href="/">হোমপেজ এ ফিরে যান</Link>
            </Button>
          </div>

          {!posts || posts.length === 0 ? (
            <div className="text-center py-20 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-xl text-slate-600">এই বিভাগে এখনো কোনো নিবন্ধ নেই।</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {posts.map((post) => (
                <PostCard 
                  key={post.id} 
                  post={{
                    ...post,
                    category: (post.categories as any)?.name_bn
                  }} 
                  userRole={profile?.role}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
