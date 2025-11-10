"use client"

import { useState } from "react"
import type { Post, Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/date"

interface ModerationTableProps {
  posts: (Post & { profiles: Profile })[]
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
}

export function ModerationTable({ posts, onApprove, onReject }: ModerationTableProps) {
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setUpdatingId(id)
    try {
      await onApprove(id)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleReject = async (id: string) => {
    setUpdatingId(id)
    try {
      await onReject(id)
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  By {post.profiles?.email} • {formatDate(post.created_at)}
                </CardDescription>
              </div>
              <Badge variant="outline">{post.status}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleApprove(post.id)}
                  disabled={updatingId === post.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {updatingId === post.id ? "Approving..." : "Approve"}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(post.id)}
                  disabled={updatingId === post.id}
                >
                  {updatingId === post.id ? "Rejecting..." : "Reject"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
