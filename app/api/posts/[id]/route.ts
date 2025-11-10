import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const profile = await getUserProfile()

  const { data: post, error } = await supabase.from("posts").select("*, profiles(*)").eq("id", id).single()

  if (error) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  // Check authorization
  if (post.status !== "published" && (!profile || (post.author_id !== profile.id && profile.role === "user"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  return NextResponse.json({ data: post })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getUserProfile()

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()
  const body = await request.json()

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single()

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  // Check authorization
  if (post.author_id !== profile.id && profile.role === "user") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data, error } = await supabase.from("posts").update(body).eq("id", id).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const profile = await getUserProfile()

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = await createClient()

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single()

  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 })
  }

  // Check authorization
  if (post.author_id !== profile.id && profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { error } = await supabase.from("posts").delete().eq("id", id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: "Post deleted" })
}
