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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "সুন্নাহ প্রবন্ধ | বিশুদ্ধ ইসলামিক জ্ঞান",
    template: "%s | সুন্নাহ প্রবন্ধ"
  },
  description: "বিশুদ্ধ ইসলামিক জ্ঞান এবং ওলামায়ে কেরামের গবেষণালব্ধ প্রবন্ধের একটি নির্ভরযোগ্য প্লাটফর্ম। কুরআন ও সুন্নাহর আলোকে জীবন গড়ার পাথেয়।",
  keywords: ["islamic blog", "quran", "sunnah", "hadith", "bangla islamic articles", "ইসলামিক প্রবন্ধ"],
  authors: [{ name: "NaimEkattor" }],
  creator: "NaimEkattor",
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: "/",
    siteName: "সুন্নাহ প্রবন্ধ",
    title: "সুন্নাহ প্রবন্ধ | বিশুদ্ধ ইসলামিক জ্ঞান",
    description: "বিশুদ্ধ ইসলামিক জ্ঞান এবং ওলামায়ে কেরামের গবেষণালব্ধ প্রবন্ধের একটি নির্ভরযোগ্য প্লাটফর্ম।",
    images: [
      {
        url: "/og-image.jpg", // Needs a real image in public/
        width: 1200,
        height: 630,
        alt: "Sunnah Probondho",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "সুন্নাহ প্রবন্ধ | বিশুদ্ধ ইসলামিক জ্ঞান",
    description: "বিশুদ্ধ ইসলামিক জ্ঞান এবং ওলামায়ে কেরামের গবেষণালব্ধ প্রবন্ধের একটি নির্ভরযোগ্য প্লাটফর্ম।",
    creator: "@naim_ekattor",
  },
  robots: {
    index: true,
    follow: true,
  },
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
