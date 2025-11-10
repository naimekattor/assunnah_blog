import { createClient } from "@/lib/supabase/server"
import { getSession, getUserProfile } from "@/lib/auth"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { PostCard } from "@/components/post-card"

export default async function HomePage() {
  const session = await getSession()
  const profile = session ? await getUserProfile() : null

  const supabase = await createClient()

  // Fetch published posts - simple query
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })

  const featuredPost = posts?.[0]
  const latestPosts = posts?.slice(1) || []

  return (
    <>
      <Header profile={profile} />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-6 max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                চিন্তাশীল প্রবন্ধ ও বিশ্লেষণ
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
                গভীর চিন্তাভাবনা এবং মৌলিক বিশ্লেষণের মাধ্যমে আমরা সমসাময়িক বিষয়গুলি তুলে ধরি।
              </p>
              {!session && (
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-slate-100 font-semibold">
                    <Link href="/auth/sign-up">লেখক হিসেবে যোগ দিন</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                    <Link href="/auth/login">প্রবেশ করুন</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl  font-bold text-slate-900">প্রধান নিবন্ধ</h2>
              
              <article className="group border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="md:col-span-1 h-64 md:h-full bg-slate-100 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                      <span className="text-slate-500 text-sm">প্রধান ইমেজ</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-6 md:p-10 flex flex-col justify-center">
                    {featuredPost.category && (
                      <div className="mb-3">
                        <span className="text-xs uppercase tracking-widest font-semibold text-blue-600 border-b-2 border-blue-600 pb-2">
                          {featuredPost.category}
                        </span>
                      </div>
                    )}

                    <Link href={`/post/${featuredPost.slug}`}>
                      <h3 className="text-2xl md:text-3xl  font-bold text-slate-900 mb-4 hover:text-blue-600 transition line-clamp-3">
                        {featuredPost.title}
                      </h3>
                    </Link>

                    <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 line-clamp-2">
                      {featuredPost.excerpt || featuredPost.content?.substring(0, 150)}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="text-sm">
                        <p className="font-semibold text-slate-900">{featuredPost.author_email || "অজানা লেখক"}</p>
                        <p className="text-slate-500">
                          {new Date(featuredPost.published_at || featuredPost.created_at).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                      <Link
                        href={`/post/${featuredPost.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-semibold transition text-sm md:text-base"
                      >
                        পূর্ণ নিবন্ধ →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Latest Posts */}
        {latestPosts && latestPosts.length > 0 ? (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
            <h2 className="text-3xl md:text-4xl  font-bold text-slate-900 mb-10">সর্বশেষ নিবন্ধ</h2>
            
            {/* Featured Grid Style */}
            <div className="space-y-8">
              {latestPosts.slice(0, 3).map((post) => (
                <article key={post.id} className="group border-b border-slate-200 pb-8 hover:opacity-80 transition">
                  <div className="grid md:grid-cols-4 gap-6 items-start">
                    {/* Image */}
                    <div className="md:col-span-1 h-40 bg-slate-100 rounded overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <span className="text-slate-500 text-xs">ইমেজ</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                      {post.category && (
                        <span className="inline-block text-xs uppercase tracking-widest font-semibold text-blue-600 mb-2">
                          {post.category}
                        </span>
                      )}

                      <Link href={`/post/${post.slug}`}>
                        <h3 className="text-xl md:text-2xl  font-bold text-slate-900 mb-2 hover:text-blue-600 transition group-hover:text-blue-600 line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-slate-600 text-sm md:text-base mb-4 line-clamp-2">
                        {post.excerpt || post.content?.substring(0, 120)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          <p className="font-semibold text-slate-900">{post.author_email || "অজানা লেখক"}</p>
                          <p>{new Date(post.published_at || post.created_at).toLocaleDateString("bn-BD")}</p>
                        </div>
                        <Link
                          href={`/post/${post.slug}`}
                          className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
                        >
                          পড়ুন →
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* View All Button */}
            {latestPosts.length > 3 && (
              <div className="mt-12 text-center">
                <Button asChild variant="outline" size="lg" className="border-slate-300 text-slate-900 hover:bg-slate-50">
                  <Link href="/blogs">সকল নিবন্ধ দেখুন</Link>
                </Button>
              </div>
            )}
          </section>
        ) : (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
            <div className="text-center py-16">
              <p className="text-xl text-slate-600 font-medium">এখনো কোনো প্রকাশিত নিবন্ধ নেই</p>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        {!session && (
          <section className="bg-slate-50 border-t border-slate-200 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-3xl md:text-4xl  font-bold text-slate-900 mb-4">নতুন নিবন্ধের খবর পান</h3>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                আমাদের সর্বশেষ চিন্তাশীল নিবন্ধ এবং বিশ্লেষণ সরাসরি আপনার ইনবক্সে পান।
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="আপনার ইমেইল..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-blue-500 text-slate-900 placeholder-slate-500"
                />
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">সাবস্ক্রাইব করুন</Button>
              </div>
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-300 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold mb-3">আমাদের সম্পর্কে</h4>
                <p className="text-sm leading-relaxed">
                  চিন্তাশীল প্রবন্ধ এবং গভীর বিশ্লেষণের মাধ্যমে সমসাময়িক বিষয়গুলি নিয়ে আলোচনা।
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">দ্রুত লিঙ্ক</h4>
                <ul className="text-sm space-y-2">
                  <li><Link href="/" className="hover:text-white transition">হোমপেজ</Link></li>
                  <li><Link href="/blogs" className="hover:text-white transition">সব নিবন্ধ</Link></li>
                  <li><Link href="/about" className="hover:text-white transition">আমাদের সম্পর্কে</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">নীতিমালা</h4>
                <ul className="text-sm space-y-2">
                  <li><Link href="/privacy" className="hover:text-white transition">গোপনীয়তা নীতি</Link></li>
                  <li><Link href="/terms" className="hover:text-white transition">সেবার শর্তাবলী</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">যোগাযোগ</h4>
                <p className="text-sm">
                  ইমেইল: info@blogplatform.com<br />
                  ঢাকা, বাংলাদেশ
                </p>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-sm">
              <p>&copy; ২০২৫ চিন্তাশীল প্রবন্ধ। সর্বাধিকার সংরক্ষিত।</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}