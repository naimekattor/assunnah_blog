import type React from "react"
import { getSession, isAdmin } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"
import { getUserProfile } from "@/lib/auth"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const isAdminUser = await isAdmin()
  if (!isAdminUser) {
    redirect("/dashboard")
  }

  const profile = await getUserProfile()

  return (
    <>
      <Header profile={profile} />
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </>
  )
}
