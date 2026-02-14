"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Menu, X, Search } from "lucide-react"
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
  const [isSearchOpen, setIsSearchOpen] = useState(false)

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
    <header className="sticky top-0 z-50
    bg-white/60
    backdrop-blur-xl backdrop-saturate-200
    
    shadow-[0_8px_30px_rgba(0,0,0,0.05)]
    py-3">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          {profile && (
  <div className="hidden md:flex items-center gap-4">
    <Link href="/dashboard" className="text-lg font-medium text-slate-700 hover:text-primary transition">
      ড্যাশবোর্ড
    </Link>

    {(profile.role === "moderator" || profile.role === "admin") && (
      <Link href="/moderation" className="text-lg font-medium text-slate-700 hover:text-primary transition">
        মডারেশন
      </Link>
    )}

    {profile.role === "admin" && (
      <Link href="/admin" className="text-lg font-medium text-slate-700 hover:text-primary transition">
        অ্যাডমিন
      </Link>
    )}

    <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
      {profile.role}
    </span>

    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? "বের হচ্ছি..." : "বের হন"}
    </Button>
  </div>
)}


          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="অনুসন্ধান"
            >
              <Search size={24} />
            </button>
            <button
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="মেনু"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-3 px-1 pb-4 animate-in slide-in-from-top-2 fade-in-20">
            <div className="relative">
              <input
                type="text"
                placeholder="অনুসন্ধান করুন..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary bg-slate-50"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement
                    if (target.value.trim()) {
                      router.push(`/blogs?search=${encodeURIComponent(target.value.trim())}`)
                      setIsSearchOpen(false)
                    }
                  }
                }}
              />
              <Search className="absolute left-3 top-2.5 text-slate-400 h-5 w-5" />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-slate-200">
            <Link 
              href="/" 
              onClick={() => setIsMenuOpen(false)}
              className={cn("block px-4 py-2 text-sm font-medium transition rounded-lg", isActive("/") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 text-slate-700")}
            >
              হোমপেজ
            </Link>
            <Link 
              href="/blogs?category=masala-masayel" 
              onClick={() => setIsMenuOpen(false)}
              className={cn("block px-4 py-2 text-sm font-medium transition rounded-lg", isActive("/blogs?category=masala-masayel") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 text-slate-700")}
            >
              মাসআলা মাসায়েল
            </Link>
            <Link 
              href="/blogs?category=quraner-alo" 
              onClick={() => setIsMenuOpen(false)}
              className={cn("block px-4 py-2 text-sm font-medium transition rounded-lg", isActive("/blogs?category=quraner-alo") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 text-slate-700")}
            >
              কোরআনের আলো
            </Link>
            <Link 
              href="/blogs?category=probondho-somuho" 
              onClick={() => setIsMenuOpen(false)}
              className={cn("block px-4 py-2 text-sm font-medium transition rounded-lg", isActive("/blogs?category=probondho-somuho") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 text-slate-700")}
            >
              প্রবন্ধ সমূহ
            </Link>
            <Link 
              href="/blogs?category=bishoy-bhittik-boyan" 
              onClick={() => setIsMenuOpen(false)}
              className={cn("block px-4 py-2 text-sm font-medium transition rounded-lg", isActive("/blogs?category=bishoy-bhittik-boyan") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 text-slate-700")}
            >
              বিষয়ভিত্তিক বয়ান
            </Link>
            <Link 
              href="/about" 
              onClick={() => setIsMenuOpen(false)}
              className={cn("block px-4 py-2 text-sm font-medium transition rounded-lg", isActive("/about") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 text-slate-700")}
            >
              আমাদের সম্পর্কে
            </Link>

            {profile ? (
              <>
                <Link 
                  href="/dashboard" 
                  onClick={() => setIsMenuOpen(false)}
                  className={cn("block px-4 py-2 text-sm font-medium transition rounded-lg", isActive("/dashboard") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 text-slate-700")}
                >
                  ড্যাশবোর্ড
                </Link>
                {profile.role === "moderator" || profile.role === "admin" ? (
                  <Link 
                    href="/moderation" 
                    onClick={() => setIsMenuOpen(false)}
                    className={cn("block px-4 py-2 text-sm font-medium transition rounded-lg", isActive("/moderation") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 text-slate-700")}
                  >
                    মডারেশন
                  </Link>
                ) : null}
                {profile.role === "admin" ? (
                  <Link 
                    href="/admin" 
                    onClick={() => setIsMenuOpen(false)}
                    className={cn("block px-4 py-2 text-sm font-medium transition rounded-lg", isActive("/admin") ? "bg-primary/10 text-primary font-bold" : "hover:bg-slate-100 text-slate-700")}
                  >
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
                {/* <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/auth/login">প্রবেশ করুন</Link>
                </Button>
                <Button asChild size="sm" className="w-full bg-primary hover:bg-primary/90">
                  <Link href="/auth/sign-up">যোগ দিন</Link>
                </Button> */}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}