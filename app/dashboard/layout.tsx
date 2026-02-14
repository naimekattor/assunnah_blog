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
      <main className="min-h-screen bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 pb-20">{children}</div>
      </main>
    </>
  )
}
