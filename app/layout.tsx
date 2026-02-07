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

  alternates: {
    canonical: '/',
    
    languages: {
      'bn-BD': '/',
      'bn': '/', 
      'en-US': '/en', 
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    
    // For Islamic content, you might want to be more restrictive on some pages
    // noarchive: false, // Set to true for sensitive content
    // nosnippet: false, // Set to true if you don't want snippets in search
    
    googleBot: {
      index: true,
      follow: true,
      
      // Image indexing - IMPORTANT for visual content
      noimageindex: false, // Keep false to allow image search
      
      // Video preview settings
      'max-video-preview': -1, // Unlimited video preview
      
      // Image preview - keep large for better CTR
      'max-image-preview': 'large',
      
      // Snippet length
      'max-snippet': -1, // Unlimited snippet
      
      // Additional GoogleBot directives for better crawling
      'notranslate': true, // Don't auto-translate Bangla content
      'nositelinkssearchbox': false, // Allow sitelinks search box
      'indexifembedded': true, // Index even if embedded
      
      
    },
  },
  
  // Titles with better Bangla SEO keywords
  title: {
    default: "হকপথ | বিশুদ্ধ ইসলামিক জ্ঞান - হাদিস ও কুরআনের শিক্ষা",
    template: "%s | হকপথ - বিশুদ্ধ ইসলাম"
  },
  
  // Enhanced description with more Bangla keywords
  description: "বিশুদ্ধ ইসলামিক জ্ঞান, হাদিস, কুরআন তাফসীর এবং ওলামায়ে কেরামের গবেষণালব্ধ প্রবন্ধের একটি নির্ভরযোগ্য প্লাটফর্ম। বাংলা ইসলামিক বই, ইসলামিক প্রশ্নোত্তর, ফিকহ ও আকিদা বিষয়ক বিশুদ্ধ জ্ঞান।",
  
  // Improved keywords - include more Bangla terms
  keywords: [
    "ইসলামিক প্রবন্ধ", 
    "হকপথ", 
    "হাদিস", 
    "কুরআন", 
    "ইসলামিক জ্ঞান", 
    "বাংলা ইসলাম", 
    "ইসলামিক বই", 
    "ফিকহ", 
    "আকিদা",
    "প্রশ্নোত্তর",
    "তাফসীর",
    "সালাফ",
    "মাওলানা",
    "মুফতি",
    "ওলামা"
  ],
  
  // Add Bangladeshi location info
  authors: [{ 
    name: "NaimEkattor",
    url: "https://www.facebook.com/naimekattor" // Add social profile
  }],
  creator: "NaimEkattor",
  publisher: "হকপথ",
  
  // IMPORTANT: Add geographic metadata
  other: {
    "geo.region": "BD",
    "geo.placename": "Bangladesh",
    "geo.position": "23.6850;90.3563",
    "ICBM": "23.6850, 90.3563",
    "content-language": "bn-BD",
    "distribution": "global",
    "audience": "all",
    "rating": "general",
    "revisit-after": "1 days",
  },
  
  openGraph: {
    type: "website",
    locale: "bn_BD", // Correct locale
    alternateLocale: "bn", // Add alternate
    url: "/",
    siteName: "হকপথ - বিশুদ্ধ ইসলামিক জ্ঞান",
    title: "হকপথ | বিশুদ্ধ ইসলামিক জ্ঞান - হাদিস ও কুরআনের শিক্ষা",
    description: "বাংলা ভাষায় বিশুদ্ধ ইসলামিক জ্ঞান, হাদিস, কুরআন তাফসীর এবং ওলামায়ে কেরামের গবেষণালব্ধ প্রবন্ধ।",
    images: [
      {
        url: "/og-image.png", // MUST create this file in public/
        width: 1200,
        height: 630,
        alt: "হকপথ - বিশুদ্ধ ইসলামিক জ্ঞান",
        type: "image/jpeg",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "হকপথ | বিশুদ্ধ ইসলামিক জ্ঞান - হাদিস ও কুরআনের শিক্ষা",
    description: "বাংলা ভাষায় বিশুদ্ধ ইসলামিক জ্ঞান, হাদিস, কুরআন তাফসীর এবং ওলামায়ে কেরামের গবেষণালব্ধ প্রবন্ধ।",
    creator: "@naimekattor",
    site: "@hokpath", 
    images: ["/og-image.png"], 
  },
  
  
  
  // Add viewport (though typically in layout)
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  
  
  
  // Category for Islamic content
  category: "religion",
}

import { AnalyticsTracker } from "@/components/analytics-tracker"
import { Suspense } from "react"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <body className={notoSerifBengali.className}>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
