import type React from "react"
import { redirect } from "next/navigation"
import { getUserProfile } from "@/lib/auth"
import type { UserRole } from "@/lib/types"

interface ProtectedPageProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export async function ProtectedPage({ children, requiredRole }: ProtectedPageProps) {
  const profile = await getUserProfile()

  if (!profile) {
    redirect("/auth/login")
  }

  if (requiredRole) {
    const roleHierarchy = { user: 0, moderator: 1, admin: 2 }
    const userLevel = roleHierarchy[profile.role]
    const requiredLevel = roleHierarchy[requiredRole]

    if (userLevel < requiredLevel) {
      redirect("/dashboard")
    }
  }

  return <>{children}</>
}
