import { createClient } from "@/lib/supabase/server"
import { getUserProfile } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const profile = await getUserProfile()

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get("status")

  // We'll handle author info joining in the application
  let query = supabase.from("posts").select("*, author_id")

  if (status === "published") {
    query = query.eq("status", "published")
  } else if (status === "pending" && profile?.role !== "user") {
    query = query.eq("status", "pending")
  } else if (profile) {
    query = query.eq("author_id", profile.id)
  } else {
    query = query.eq("status", "published")
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data })
}
