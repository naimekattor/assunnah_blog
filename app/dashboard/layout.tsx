import type React from "react"
import { getSession, getUserProfile } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
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
