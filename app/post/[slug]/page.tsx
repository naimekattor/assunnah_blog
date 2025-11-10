import { createClient, createStaticClient } from "@/lib/supabase/server"
import { getSession, getUserProfile } from "@/lib/auth"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { formatDate } from "@/lib/utils/date"

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

  return (
    <>
      <Header profile={profile} />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <h1 className="text-4xl font-bold text-balance">{post.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>By {post.profiles?.email}</span>
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

            <article className="prose prose-sm max-w-none">
              <div className="text-base leading-relaxed whitespace-pre-wrap text-foreground">{post.content}</div>
            </article>

            {(isAuthor || isMod) && post.status === "pending" && (
              <div className="flex gap-4 pt-6 border-t">
                <Button asChild variant="outline">
                  <Link href={`/dashboard/posts/${post.id}`}>Edit</Link>
                </Button>
              </div>
            )}

            <div className="border-t pt-8">
              <Button asChild variant="outline">
                <Link href="/">Back to Blog</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
