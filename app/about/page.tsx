import { getSession, getUserProfile } from "@/lib/auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Mail, BookOpen, Award, ExternalLink } from "lucide-react"

export default async function AboutPage() {
  const session = await getSession()
  const profile = session ? await getUserProfile() : null

  return (
    <div className="flex flex-col min-h-screen">
      <Header profile={profile} />
      <main className="flex-1 bg-slate-50">
        {/* Page Header */}
        <section className="relative bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-950 text-white py-16 overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                    backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                    }}
                ></div>
            </div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 font-arabic">আমাদের সম্পর্কে</h1>
                <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                    বিশুদ্ধ ইসলামিক জ্ঞান এবং ওলামায়ে কেরামের গবেষণালব্ধ প্রবন্ধের একটি নির্ভরযোগ্য প্লাটফর্ম
                </p>
            </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Mission Section */}
            <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-slate-800 border-l-4 border-primary pl-4">আমাদের লক্ষ্য ও উদ্দেশ্য</h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        ইন্টারনেটের এই বিশাল জগতে সঠিক ইসলামিক তথ্যের প্রাপ্যতা নিশ্চিত করা আমাদের মূল লক্ষ্য। 
                        আমরা চাই বাংলাভাষী পাঠকদের কাছে কুরআন ও সুন্নাহর বিশুদ্ধ জ্ঞান পৌঁছে দিতে।
                    </p>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        আমাদের এই প্লাটফর্মে আপনারা পাবেন সমসাময়িক বিষয়ের উপর শরীয়াহ ভিত্তিক বিশ্লেষণ, 
                        জীবনঘনিষ্ঠ মাসআলা, এবং আত্মশুদ্ধিমূলক প্রবন্ধ।
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                            <BookOpen className="w-8 h-8 text-primary mb-2" />
                            <h3 className="font-semibold text-slate-900">বিশুদ্ধ জ্ঞান</h3>
                            <p className="text-sm text-slate-500">কুরআন ও সুন্নাহ ভিত্তিক</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                            <Award className="w-8 h-8 text-amber-500 mb-2" />
                            <h3 className="font-semibold text-slate-900">গবেষণালব্ধ</h3>
                            <p className="text-sm text-slate-500">ওলামায়ে কেরামের দ্বারা বাছাকৃত</p>
                        </div>
                    </div>
                </div>
                <div className="relative h-[400px] bg-emerald-100 rounded-2xl overflow-hidden shadow-xl">
                    {/* Placeholder for About Us Image */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-800 to-teal-600 flex items-center justify-center">
                         <span className="text-white/20 text-9xl font-bold select-none">হকপথ</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-8">
                        <p className="text-white font-medium text-lg">"তোমাদের মধ্যে এমন একদল হোক যারা কল্যাণের দিকে আহ্বান করবে..."</p>
                        <p className="text-emerald-200 text-sm mt-1">- সূরা আল-ইমরান, ১০৪</p>
                    </div>
                </div>
            </div>

            {/* Scholar Section */}
            <section className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-primary/5 px-6 py-12 md:p-16 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">আমাদের প্রধান উপদেষ্টা</h2>
                    <p className="text-slate-600">যাদের দিকনির্দেশনায় এই প্লাটফর্মটি পরিচালিত</p>
                </div>
                
                <section
  className="max-w-4xl mx-auto -mt-10 px-6 pb-16"
  itemScope
  itemType="https://schema.org/Person"
>
  <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
    
    {/* Scholar Image Area */}
    <div className="md:w-1/3 bg-slate-200 min-h-[300px] relative group">
      <div className="absolute inset-0 bg-slate-300 flex items-center justify-center">
        <svg
          className="w-32 h-32 text-slate-400"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />

      <div className="absolute bottom-4 left-4 text-white">
        <span className="text-xs font-semibold bg-primary px-2 py-1 rounded inline-block">
          Founder
        </span>
      </div>
    </div>

    {/* Scholar Info */}
    <div className="md:w-2/3 p-8">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1
            className="text-2xl font-bold text-slate-900 mb-1"
            itemProp="name"
          >
            মুফতি আব্দুর রহমান নাঈম
          </h1>

          <p
            className="text-primary font-medium"
            itemProp="jobTitle"
          >
            ইফতা বিভাগ, দারুল উলূম দেউবন্দ
          </p>
        </div>

        <div className="flex gap-2">
          <button
            aria-label="Email"
            className="p-2 text-slate-400 hover:text-primary transition rounded-full hover:bg-slate-50"
          >
            <Mail size={20} />
          </button>
          <button
            aria-label="External Profile"
            className="p-2 text-slate-400 hover:text-primary transition rounded-full hover:bg-slate-50"
          >
            <ExternalLink size={20} />
          </button>
        </div>
      </div>

      {/* Bio */}
      <div className="space-y-4 text-slate-600" itemProp="description">
        <p>
          <strong>মুফতি আব্দুর রহমান নাঈম</strong> বাংলাদেশের একজন বিশিষ্ট
          ইসলামী চিন্তাবিদ, গবেষক ও মুফতি। তিনি দীর্ঘ দুই দশকেরও বেশি সময় ধরে
          কুরআন, হাদীস ও ফিকহ বিষয়ক গবেষণায় নিয়োজিত আছেন।
        </p>

        <p>
          তিনি ভারতের বিশ্বখ্যাত <span itemProp="alumniOf">দারুল উলূম দেউবন্দ</span>
          থেকে ইফতা সম্পন্ন করেন এবং বর্তমানে ইসলামিক গবেষণা, দাওয়াহ ও
          সমসাময়িক শরয়ী সমস্যার সমাধানে সক্রিয়ভাবে কাজ করে যাচ্ছেন।
        </p>
      </div>

      {/* Research Areas */}
      <div className="mt-6 pt-6 border-t border-slate-100">
        <h2 className="font-semibold text-slate-900 mb-2">
          গবেষণার ক্ষেত্রসমূহ
        </h2>

        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
            ফিকহুল মুআমালাত
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
            তাজবীদ ও কিরাআত
          </span>
          <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
            সমসাময়িক ইসলামী অর্থনীতি
          </span>
        </div>
      </div>
    </div>
  </div>
</section>

            </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
