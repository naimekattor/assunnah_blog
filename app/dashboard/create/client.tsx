"use client"

import { PostEditor } from "@/components/post-editor"
import { createPost } from "@/app/dashboard/actions"

export function CreatePostClient() {
  const handleCreatePost = async (data: {
    title: string
    content: string
    categoryId: string
    excerpt: string
  }) => {
    await createPost(data.title, data.content, data.categoryId, data.excerpt)
  }

  return (
    <PostEditor onSubmit={handleCreatePost} />
  )
}
