"use client"

import { useState } from "react"
import type { Post, Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/date"

import { Trash2, CheckCircle2, XCircle } from "lucide-react"
import Swal from "sweetalert2"

interface ModerationTableProps {
  posts: (Post & { profiles: Profile })[]
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  onDelete?: (id: string) => Promise<void>
}

export function ModerationTable({ posts, onApprove, onReject, onDelete }: ModerationTableProps) {
  const [pendingAction, setPendingAction] = useState<{ id: string, type: 'approve' | 'reject' | 'delete' } | null>(null)

  const handleApprove = async (id: string) => {
    setPendingAction({ id, type: 'approve' })
    try {
      await onApprove(id)
    } finally {
      setPendingAction(null)
    }
  }

  const handleReject = async (id: string) => {
    setPendingAction({ id, type: 'reject' })
    try {
      await onReject(id)
    } finally {
      setPendingAction(null)
    }
  }

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "আপনি এই নিবন্ধটি ডিলিট করতে চাচ্ছেন! এটি আর ফিরে পাওয়া যাবে না।",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "oklch(0.35 0.06 183.01)", // emerald-600 approximate
      cancelButtonColor: "#f43f5e", // rose-500
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল",
      background: "#ffffff",
      color: "#0f172a",
    })

    if (result.isConfirmed) {
      setPendingAction({ id, type: 'delete' })
      try {
        if (onDelete) await onDelete(id)
      } finally {
        setPendingAction(null)
      }
    }
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <Card key={post.id} className="border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
          <CardHeader className="bg-slate-50/50 border-b border-slate-50">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-slate-900">{post.title}</CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span className="font-semibold text-primary">{post.profiles?.email}</span>
                  <span className="text-slate-400">•</span>
                  <span>{formatDate(post.created_at)}</span>
                </CardDescription>
              </div>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-wider text-[10px] font-bold">
                {post.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 italic bg-slate-50/30 p-4 rounded-xl">
                "{post.content?.replace(/<[^>]*>/g, "").substring(0, 300)}..."
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => handleApprove(post.id)}
                  disabled={pendingAction?.id === post.id}
                  className="bg-primary hover:bg-primary/90 text-white gap-2 px-6"
                >
                  <CheckCircle2 size={16} />
                  {pendingAction?.id === post.id && pendingAction.type === 'approve' ? "Approving..." : "Approve"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(post.id)}
                  disabled={pendingAction?.id === post.id}
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 gap-2"
                >
                  <XCircle size={16} />
                  {pendingAction?.id === post.id && pendingAction.type === 'reject' ? "Rejecting..." : "Reject"}
                </Button>
                
                {onDelete && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(post.id)}
                    disabled={pendingAction?.id === post.id}
                    className="ml-auto text-rose-500 hover:text-rose-700 hover:bg-rose-50 gap-2"
                  >
                    <Trash2 size={16} />
                    {pendingAction?.id === post.id && pendingAction.type === 'delete' ? "Deleting..." : "Delete"}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
