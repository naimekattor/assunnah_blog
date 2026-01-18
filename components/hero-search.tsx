"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export function HeroSearch() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/blogs?search=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="relative max-w-2xl mx-auto mt-8">
      <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-sm hover:shadow-md transition-all duration-300 border-2 border-transparent hover:border-primary/20 p-1 mx-4">
        <div className="flex items-center w-full px-4 py-2">
          <Search className="h-5 w-5 text-muted-foreground mr-3 flex-shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent border-none outline-none text-slate-700 placeholder:text-muted-foreground"
            placeholder="কুরআন, হাদীস কিংবা যে কোনো বিষয় সহজেই খুঁজে নিন..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  )
}
