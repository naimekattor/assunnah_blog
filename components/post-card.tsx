"use client"

import Link from "next/link"
import type { Post } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import { deletePost } from "@/app/dashboard/actions"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Swal from "sweetalert2"

interface PostCardProps {
  post: Post
  showStatus?: boolean
  isDashboard?: boolean
  userRole?: string
}

export function PostCard({ post, showStatus, isDashboard, userRole }: PostCardProps) {
  const router = useRouter()
  const isPrivileged = userRole === "admin" || userRole === "moderator"
  const canDelete = isDashboard || isPrivileged
  const canEdit = isDashboard || userRole === "admin"
  const statusColors: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    published: "bg-primary/10 text-primary border-primary/20",
    rejected: "bg-rose-50 text-rose-700 border-rose-200",
    draft: "bg-slate-50 text-slate-700 border-slate-200",
  }

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি এই নিবন্ধটি মুছে ফেলতে চাচ্ছেন! এটি আর ফিরে পাওয়া যাবে না।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "oklch(0.35 0.06 183.01)", // emerald-600 approximate
      cancelButtonColor: "#f43f5e", // rose-500
      confirmButtonText: "হ্যাঁ, মুছে ফেলুন!",
      cancelButtonText: "বাতিল",
      background: "#ffffff",
      color: "#0f172a",
    })

    if (result.isConfirmed) {
      try {
        await deletePost(post.id)
        toast.success("নিবন্ধটি মুছে ফেলা হয়েছে")
        router.refresh()
      } catch (error) {
        toast.error("মুছে ফেলতে সমস্যা হয়েছে")
      }
    }
  }

  const firstImageMatch = post.content?.match(/<img[^>]+src="([^">]+)"/)
  const firstImage = firstImageMatch ? firstImageMatch[1] : null

  return (
    <article className="group bg-background border border-slate-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="flex flex-col h-full">
        {/* Image Area */}
        {firstImage && (
          <div className="h-48 bg-slate-100 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={firstImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {showStatus && (
              <div className="absolute top-3 right-3">
                <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded-lg border backdrop-blur-sm ${statusColors[post.status] || statusColors.draft}`}>
                  {post.status === 'published' ? 'প্রকাশিত' : 
                   post.status === 'pending' ? 'অপেক্ষমাণ' : 
                   post.status === 'rejected' ? 'বাতিল' : 'খসড়া'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <div className="mb-2">
            {post.category && (
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                {post.category}
              </span>
            )}
          </div>

          <Link href={`/post/${post.slug}`} className="mb-3">
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary transition line-clamp-2 leading-snug">
              {post.title}
            </h3>
          </Link>

          <p className="text-slate-500 text-xs mb-4 line-clamp-2 leading-relaxed flex-1">
            {post.excerpt || post.content?.replace(/<[^>]*>/g, "").substring(0, 100)}...
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
            <div className="text-[10px] text-slate-400">
              {/* <p className="font-semibold text-slate-700">{post.author_email || "অজানা লেখক"}</p> */}
              <p>{new Date(post.published_at || post.created_at).toLocaleDateString("bn-BD")}</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Link
                href={`/post/${post.slug}`}
                className="text-primary hover:text-primary/80 font-bold text-xs transition flex items-center gap-1"
              >
                বিস্তারিত →
              </Link>

              {canDelete && (
                <div className="flex items-center gap-1 border-l border-slate-100 pl-3">
                  {canEdit && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full" asChild title="এডিট করুন">
                      <Link href={`/dashboard/posts/${post.id}/edit`}>
                        <Edit size={14} />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-full" onClick={handleDelete} title="ডিলিট করুন">
                    <Trash2 size={14} />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}