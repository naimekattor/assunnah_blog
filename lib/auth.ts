import { createClient } from "@/lib/supabase/server"

export async function getSession() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return profile
}

export async function isAdmin() {
  const profile = await getUserProfile()
  return profile?.role === "admin"
}

export async function isModerator() {
  const profile = await getUserProfile()
  return profile?.role === "moderator" || profile?.role === "admin"
}
