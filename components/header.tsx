"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X } from "lucide-react"
import type { Profile } from "@/lib/types"
import Image from "next/image"

interface HeaderProps {
  profile?: Profile | null
}

export function Header({ profile }: HeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isActive = (href: string) => {
    const [path, query] = href.split('?')
    if (pathname !== path) return false
    if (!query) return true
    
    const params = new URLSearchParams(query)
    for (const [key, value] of params.entries()) {
      if (searchParams.get(key) !== value) return false
    }
    return true
  }

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 py-3">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            <Image src={"/logo2.png"} width={100} height={60} alt="logo"/>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              href="/blogs?category=masala-masayel" 
              className={cn("text-lg font-medium transition", isActive("/blogs?category=masala-masayel") ? "text-primary font-bold" : "text-slate-700 hover:text-primary")}
            >
              মাসআলা মাসায়েল
            </Link>
            <Link 
              href="/blogs?category=quraner-alo" 
              className={cn("text-lg font-medium transition", isActive("/blogs?category=quraner-alo") ? "text-primary font-bold" : "text-slate-700 hover:text-primary")}
            >
              কোরআনের আলো
            </Link>
            <Link 
              href="/blogs?category=probondho-somuho" 
              className={cn("text-lg font-medium transition", isActive("/blogs?category=probondho-somuho") ? "text-primary font-bold" : "text-slate-700 hover:text-primary")}
            >
              প্রবন্ধ সমূহ
            </Link>
            <Link 
              href="/blogs?category=bishoy-bhittik-boyan" 
              className={cn("text-lg font-medium transition", isActive("/blogs?category=bishoy-bhittik-boyan") ? "text-primary font-bold" : "text-slate-700 hover:text-primary")}
            >
              বিষয়ভিত্তিক বয়ান
            </Link>
            <Link 
              href="/blogs?category=others" 
              className={cn("text-lg font-medium transition", isActive("/blogs?category=others") ? "text-primary font-bold" : "text-slate-700 hover:text-primary")}
            >
            অন্যান্য
            </Link>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            {profile ? (
              <>
                <Link href="/dashboard" className="text-lg font-medium text-slate-700 hover:text-blue-600 transition">
                  ড্যাশবোর্ড
                </Link>
                {profile.role === "moderator" || profile.role === "admin" ? (
                  <Link href="/moderation" className="text-lg font-medium text-slate-700 hover:text-blue-600 transition">
                    মডারেশন
                  </Link>
                ) : null}
                {profile.role === "admin" ? (
                  <Link href="/admin" className="text-lg font-medium text-slate-700 hover:text-blue-600 transition">
                    অ্যাডমিন
                  </Link>
                ) : null}
                <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                  {profile.role}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout} disabled={isLoading}>
                  {isLoading ? "বের হচ্ছি..." : "বের হন"}
                </Button>
              </>
            ) : (
              <>
                {/* <Button asChild variant="outline" size="sm">
                  <Link href="/auth/login">প্রবেশ করুন</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Link href="/auth/sign-up">যোগ দিন</Link>
                </Button> */}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="মেনু"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-200">
            <Link href="/" className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition">
              হোমপেজ
            </Link>
            <Link href="/blogs?category=masala-masayel" className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition">
              মাসআলা মাসায়েল
            </Link>
            <Link href="/blogs?category=quraner-alo" className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition">
              কোরআনের আলো
            </Link>
            <Link href="/blogs?category=probondho-somuho" className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition">
              প্রবন্ধ সমূহ
            </Link>
            <Link href="/blogs?category=bishoy-bhittik-boyan" className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition">
              বিষয়ভিত্তিক বয়ান
            </Link>
            <Link href="/blogs?category=others" className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition">
              অন্যান্য
            </Link>
            {profile ? (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition">
                  ড্যাশবোর্ড
                </Link>
                {profile.role === "moderator" || profile.role === "admin" ? (
                  <Link href="/moderation" className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition">
                    মডারেশন
                  </Link>
                ) : null}
                {profile.role === "admin" ? (
                  <Link href="/admin" className="block px-4 py-2 text-sm font-medium hover:bg-slate-100 rounded transition">
                    অ্যাডমিন
                  </Link>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "বের হচ্ছি..." : "বের হন"}
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/auth/login">প্রবেশ করুন</Link>
                </Button>
                <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/auth/sign-up">যোগ দিন</Link>
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}