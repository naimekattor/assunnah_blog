"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

// Simple hook/helper for consistent session ID
const getSessionId = () => {
  if (typeof window === "undefined") return null
  let sessionId = localStorage.getItem("analytics_session_id")
  if (!sessionId) {
    sessionId = "sess_" + Math.random().toString(36).substring(2, 15)
    localStorage.setItem("analytics_session_id", sessionId)
  }
  return sessionId
}

export function AnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const trackPage = async () => {
      // Don't track admin or moderation pages to keep stats focused on visitors
      if (pathname.startsWith("/admin") || pathname.startsWith("/moderation") || pathname.startsWith("/api")) {
        return
      }

      try {
        const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
        const sessionId = getSessionId()
        
        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            path: fullPath,
            referrer: document.referrer,
            sessionId: sessionId,
          }),
        })
      } catch (error) {
        // Silently fail for analytics
        console.warn("Analytics tracking failed", error)
      }
    }

    trackPage()
  }, [pathname, searchParams])

  return null
}
