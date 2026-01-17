import type React from "react"
import type { Metadata } from "next"
import { Noto_Serif_Bengali } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const notoSerifBengali = Noto_Serif_Bengali({ 
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-bengali",
})

export const metadata: Metadata = {
  title: "Blog Platform",
  description: "A modern role-based blog platform",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <body className={notoSerifBengali.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
