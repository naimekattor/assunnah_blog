import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
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

  const { data: posts } = await query.order("published_at", { ascending: false })

  // Get current category name for display
  let currentCategoryName = "সকল নিবন্ধ"
  if (categorySlug && posts && posts.length > 0) {
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
    <>
      <Header profile={profile} />
      <main className="min-h-screen bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <article key={post.id} className="group flex flex-col h-full border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                  <div className="h-48 bg-slate-100 overflow-hidden relative">
                    {(() => {
                      const firstImageMatch = post.content?.match(/<img[^>]+src="([^">]+)"/)
                      const firstImage = firstImageMatch ? firstImageMatch[1] : null
                      return firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={firstImage} 
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                          <span className="text-slate-500 text-sm">ইমেজ নেই</span>
                        </div>
                      )
                    })()}
                  </div>
                  
                  <div className="p-6 flex flex-col flex-1">
                    {post.categories && (
                      <span className="text-xs uppercase tracking-widest font-semibold text-primary mb-3 block">
                        {post.categories.name_bn}
                      </span>
                    )}
                    
                    <Link href={`/post/${post.slug}`} className="block mb-3">
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt || post.content?.replace(/<[^>]*>/g, "").substring(0, 150)}...
                    </p>
                    
                    <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                      <span>{new Date(post.published_at || post.created_at).toLocaleDateString("bn-BD")}</span>
                      <Link href={`/post/${post.slug}`} className="text-primary font-semibold hover:underline">
                        পড়ুন →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
