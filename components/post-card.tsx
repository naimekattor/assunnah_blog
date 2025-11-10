import Link from "next/link"
import type { Post } from "@/lib/types"

interface PostCardProps {
  post: Post
  showStatus?: boolean
}

export function PostCard({ post, showStatus }: PostCardProps) {
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    published: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    draft: "bg-slate-50 text-slate-700 border-slate-200",
  }

  return (
    <article className="group border-b border-slate-200 pb-8 hover:opacity-80 transition">
      <div className="grid md:grid-cols-4 gap-6 items-start">
        {/* Image */}
        <div className="md:col-span-1 h-40 bg-slate-100 rounded overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <span className="text-slate-500 text-xs">ইমেজ</span>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          <div className="flex items-center gap-3 mb-2">
            {post.category && (
              <span className="inline-block text-xs uppercase tracking-widest font-semibold text-blue-600">
                {post.category}
              </span>
            )}
            {showStatus && (
              <span className={`px-2 py-1 text-xs font-semibold rounded border ${statusColors[post.status] || statusColors.draft}`}>
                {post.status}
              </span>
            )}
          </div>

          <Link href={`/post/${post.slug}`}>
            <h3 className="text-xl md:text-2xl  font-bold text-slate-900 mb-2 hover:text-blue-600 transition group-hover:text-blue-600 line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-slate-600 text-sm md:text-base mb-4 line-clamp-2">
            {post.excerpt || post.content?.substring(0, 120)}
          </p>

          <div className="flex items-center justify-between">
            <div className="text-xs text-slate-500">
              <p className="font-semibold text-slate-900">{post.author_email || "অজানা লেখক"}</p>
              <p>{new Date(post.published_at || post.created_at).toLocaleDateString("bn-BD")}</p>
            </div>
            <Link
              href={`/post/${post.slug}`}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
            >
              পড়ুন →
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}