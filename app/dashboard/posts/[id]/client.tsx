"use client"

import { PostEditor } from "@/components/post-editor"
import { updatePost } from "@/app/dashboard/actions"
import { Post } from "@/lib/types"

interface EditPostClientProps {
  post: Post
}

export function EditPostClient({ post }: EditPostClientProps) {
  const handleUpdatePost = async (data: {
    title: string
    content: string
    categoryId: string
    excerpt: string
  }) => {
    await updatePost(
      post.id, 
      data.title, 
      data.content,
      data.categoryId,
      data.excerpt
    )
  }

  return (
    <PostEditor initialPost={post} onSubmit={handleUpdatePost} />
  )
}
