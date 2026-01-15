"use client"

import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function ResetPasswordForm() {
  const params = useSearchParams()
  const token = params.get("token")
  const router = useRouter()

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!token) {
      setError("অবৈধ লিঙ্ক (Invalid Link)")
      return
    }

    if (password !== confirmPassword) {
      setError("পাসওয়ার্ড মিলছে না (Passwords do not match)")
      return
    }

    if (password.length < 8) {
      setError("পাসওয়ার্ড অন্তত ৮ অক্ষরের হতে হবে (Password must be at least 8 chars)")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to reset password")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <p className="text-destructive">অনুপস্থিত টোকেন (Missing Token)</p>
        <Button asChild variant="outline">
          <Link href="/auth/forgot-password">নতুন লিঙ্কের জন্য অনুরোধ করুন</Link>
        </Button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 rounded-md bg-green-50 text-green-900 border border-green-200">
          <h3 className="font-semibold text-lg mb-2">সফল! (Success!)</h3>
          <p>আপনার পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।</p>
          <p className="text-sm mt-2">লগইন পেজে নিয়ে যাওয়া হচ্ছে...</p>
        </div>
        <Button asChild className="w-full">
          <Link href="/auth/login">এখন লগইন করুন</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="password">নতুন পাসওয়ার্ড (New Password)</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)</Label>
        <Input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-900 text-sm border border-red-200">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "পরিবর্তন করা হচ্ছে..." : "পাসওয়ার্ড পরিবর্তন করুন"}
      </Button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">পাসওয়ার্ড রিসেট (Reset Password)</CardTitle>
            <CardDescription>
              আপনার নতুন পাসওয়ার্ড সেট করুন
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="text-center">লোড হচ্ছে...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
