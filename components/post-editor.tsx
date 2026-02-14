"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Post } from "@/lib/types"
import { CategorySelect } from "@/components/category-select"
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor"

interface PostEditorProps {
  initialPost?: Post
  onSubmit: (data: { 
    title: string
    content: string
    categoryId: string
    excerpt: string
  }) => Promise<void>
}

export function PostEditor({ initialPost, onSubmit }: PostEditorProps) {
  const [title, setTitle] = useState(initialPost?.title || "")
  const [content, setContent] = useState(initialPost?.content || "")
  const [categoryId, setCategoryId] = useState(initialPost?.category_id || "")
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleContentChange = (html: string) => {
    setContent(html)
    
    // Auto-generate excerpt from content if not manually set
    if (!excerpt) {
      const text = html.replace(/<[^>]*>/g, "").substring(0, 200)
      setExcerpt(text)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !categoryId) {
      setError("শিরোনাম, বিষয়বস্তু এবং বিভাগ প্রয়োজন (Title, content, and category are required)")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      await onSubmit({ 
        title, 
        content, 
        categoryId,
        excerpt: excerpt || content.replace(/<[^>]*>/g, "").substring(0, 200)
      })
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {initialPost ? "পোস্ট সম্পাদনা করুন" : "নতুন পোস্ট তৈরি করুন"}
        </CardTitle>
        <CardDescription>
          আপনার বিষয়বস্তু লিখুন এবং প্রকাশ করুন
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">শিরোনাম (Title) <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              placeholder="পোস্টের শিরোনাম লিখুন..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg"
            />
          </div>

          <CategorySelect
            value={categoryId}
            onChange={setCategoryId}
            required
          />

          <div className="space-y-2">
            <Label htmlFor="content">বিষয়বস্তু (Content) <span className="text-destructive">*</span></Label>
            <div className="border rounded-lg overflow-hidden">
              <SimpleEditor
                initialContent={content}
                onChangeAction={handleContentChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">সারাংশ (Excerpt)</Label>
            <Textarea
              id="excerpt"
              placeholder="পোস্টের সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              যদি খালি রাখা হয়, তাহলে স্বয়ংক্রিয়ভাবে বিষয়বস্তু থেকে তৈরি হবে
            </p>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading} size="lg" className="text-white">
              {isLoading ? "সংরক্ষণ করা হচ্ছে..." : initialPost ? "পোস্ট আপডেট করুন" : "পোস্ট তৈরি করুন"}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.back()} className="text-black">
              বাতিল করুন
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
