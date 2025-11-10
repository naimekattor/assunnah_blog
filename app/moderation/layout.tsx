import type React from "react"
import { getSession, getUserProfile, isModerator } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Header } from "@/components/header"

export default async function ModerationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    redirect("/auth/login")
  }

  const isMod = await isModerator()
  if (!isMod) {
    redirect("/dashboard")
  }

  const profile = await getUserProfile()

  return (
    <>
      <Header profile={profile} />
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </>
  )
}
