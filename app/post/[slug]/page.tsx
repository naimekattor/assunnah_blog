import { createClient, createStaticClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { getSession, getUserProfile } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { formatDate } from "@/lib/utils/date"
import { DeletePostButton } from "@/components/delete-post-button"
import "@/styles/tiptap-bundle.scss"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  // Use static client for build-time generation (no cookies needed)
  const supabase = createStaticClient()
  const { data: posts } = await supabase.from("posts").select("slug").eq("status", "published")

  return (
    posts?.map((post) => ({
      slug: post.slug,
    })) || []
  )
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = createStaticClient()
  
  const { data: post } = await supabase
    .from("posts")
    .select("title, excerpt, content, published_at, created_at")
    .eq("slug", slug)
    .single()

  if (!post) {
    return {
      title: "নিবন্ধ পাওয়া যায়নি",
    }
  }

  // Extract first image for OG Image
  const firstImageMatch = post.content?.match(/<img[^>]+src="([^">]+)"/)
  const ogImage = firstImageMatch ? firstImageMatch[1] : "/og-image.jpg"
  
  // Clean excerpt
  const description = post.excerpt || post.content.replace(/<[^>]*>/g, "").substring(0, 160)

  return {
    title: post.title,
    description: description,
    openGraph: {
      title: post.title,
      description: description,
      type: "article",
      publishedTime: post.published_at || post.created_at,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: description,
      images: [ogImage],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  const session = await getSession()
  const profile = session ? await getUserProfile() : null

  const supabase = await createClient()

  const { data: post } = await supabase.from("posts").select("*, profiles(*)").eq("slug", slug).single()

  if (!post) {
    notFound()
  }

  // Check access: published posts are public, pending/rejected only visible to author or mods
  if (post.status !== "published") {
    if (!session || (post.author_id !== profile?.id && profile?.role === "user")) {
      notFound()
    }
  }

  const isAuthor = profile?.id === post.author_id
  const isMod = profile?.role === "moderator" || profile?.role === "admin"

  // Fetch related posts
  let relatedPosts: any[] = []
  if (post.category_id) {
    const { data } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, content, created_at")
      .eq("status", "published")
      .eq("category_id", post.category_id)
      .neq("id", post.id)
      .limit(3)
    
    relatedPosts = data || []
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header profile={profile} />
      <main className="flex-1 bg-white pb-12">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-6 max-w-2xl">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h1 className="text-4xl font-bold leading-12 text-balance">{post.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {/* <span>By {post.profiles?.email}</span> */}
                    <span>{formatDate(post.published_at || post.created_at)}</span>
                  </div>
                </div>
              </div>

              {post.status !== "published" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm font-medium text-yellow-800">Status: {post.status}</p>
                  {post.status === "rejected" && (
                    <p className="text-sm text-yellow-700 mt-1">This post has been rejected by moderators</p>
                  )}
                </div>
              )}
            </div>

            <article className="max-w-none">
              <div 
                className="tiptap ProseMirror simple-editor text-base leading-relaxed text-foreground"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {(isAuthor || isMod) && (
              <div className="flex flex-wrap gap-4 pt-6 border-t">
                {post.status === "pending" && (
                  <Button asChild variant="outline">
                    <Link href={`/dashboard/posts/${post.id}/edit`}>Edit</Link>
                  </Button>
                )}
                
                <DeletePostButton 
                  postId={post.id} 
                  redirectUrl="/blogs" 
                  variant="outline"
                  className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100"
                />
              </div>
            )}

            <div className="border-t pt-8">
              <Button asChild variant="outline">
                <Link href="/">Back to Blog</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Related Posts Section */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="bg-slate-50 border-t border-slate-200 py-16 mt-8">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
               <h2 className="text-2xl font-bold text-slate-900 mb-8 border-l-4 border-primary pl-4">
                 আরও পড়ুন (সম্পর্কিত নিবন্ধ)
               </h2>
               <div className="grid md:grid-cols-3 gap-6">
                 {relatedPosts.map((rPost) => {
                    const imgMatch = rPost.content?.match(/<img[^>]+src="([^">]+)"/)
                    const src = imgMatch ? imgMatch[1] : null
                    
                    return (
                        <div key={rPost.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition group">
                        <Link href={`/post/${rPost.slug}`} className="block">
                            {src && (
                                <div className="h-40 bg-slate-100 relative overflow-hidden">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={src} alt={rPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                </div>
                            )}
                            <div className="p-4">
                            <h3 className="font-bold text-slate-800 line-clamp-2 group-hover:text-primary transition mb-2">
                                {rPost.title}
                            </h3>
                            <p className="text-slate-500 text-sm line-clamp-2">
                                {rPost.excerpt || "..."}
                            </p>
                            </div>
                        </Link>
                        </div>
                    )
                 })}
               </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
