"use client"

import { PostEditor } from "@/components/post-editor"
import { updatePost } from "@/app/dashboard/actions"
import type { Post } from "@/lib/types"

export function EditPostClient({ post }: { post: Post }) {
  const handleUpdatePost = async (data: {
    title: string
    content: string
    categoryId: string
    excerpt: string
  }) => {
    await updatePost(post.id, data.title, data.content, data.categoryId, data.excerpt)
  }

  return <PostEditor initialPost={post} onSubmit={handleUpdatePost} />
}
