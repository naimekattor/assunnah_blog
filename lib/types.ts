export type UserRole = "user" | "moderator" | "admin"
export type PostStatus = "pending" | "published" | "rejected"

export interface Profile {
  id: string
  email: string
  role: UserRole
  created_at: string
}

export interface Post {
  id: string
  author_id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  category_id?: string
  author_email?: string
  status: PostStatus
  created_at: string
  published_at: string | null
  updated_at: string
}

export interface PostWithAuthor extends Post {
  profiles: Profile
}
