import { createClient } from "@/lib/supabase/server";
import { getSession, getUserProfile } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { PostCard } from "@/components/post-card";
import KeepAlive from "@/components/KeepAlive";

export default async function HomePage() {
  const session = await getSession();
  const profile = session ? await getUserProfile() : null;

  const supabase = await createClient();

  // Fetch published posts - simple query
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  const featuredPost = posts?.[0];
  const latestPosts = posts?.slice(1) || [];

  return (
    <>
      <KeepAlive />
      <Header profile={profile} />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-emerald-950 via-teal-900 to-emerald-950 text-white py-24 md:py-32 overflow-hidden">
          {/* Enhanced Islamic Geometric & Arabesque Overlay - low opacity for serenity */}
          <div className="absolute inset-0 opacity-8 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(16,185,129,0.08)_0%,transparent_50%)]"></div>
            {/* Repeating subtle arabesque pattern */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              }}
            ></div>
          </div>

          {/* Larger, more elegant Crescent & Star decoration with soft glow */}
          <div className="absolute top-8 right-8 md:top-12 md:right-16 opacity-20 animate-pulse-slow">
            <svg
              className="w-40 h-40 md:w-64 md:h-64"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M50 5 A45 45 0 1 0 50 95 A38 38 0 1 1 50 5 Z"
                strokeWidth="2"
                stroke="gold"
                fill="none"
              />
              <circle cx="72" cy="28" r="5" fill="gold" />
              <circle cx="65" cy="15" r="3" fill="gold" />
            </svg>
          </div>

          {/* Subtle mosque silhouette in background for spiritual feel */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-10 w-3/4 max-w-4xl">
            <svg viewBox="0 0 600 200" fill="none">
              <path
                d="M300 180 L260 140 L280 100 L300 140 L320 100 L340 140 L300 180 Z M100 180 L140 140 L120 100 L100 140 L80 100 L60 140 L100 180 Z ..."
                fill="currentColor"
                opacity="0.3"
              />
            </svg>
          </div>

          <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
            <div className="space-y-10 max-w-6xl mx-auto text-center md:text-left">
              {/* Enhanced Bismillah with beautiful Arabic font & gold glow */}
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-700/30 to-teal-700/30 backdrop-blur-md flex items-center justify-center border border-emerald-400/30 shadow-lg shadow-emerald-900/40">
                  <svg
                    className="w-8 h-8 text-emerald-200"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <span className="text-3xl md:text-4xl font-arabic text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-amber-200 to-emerald-200 drop-shadow-lg tracking-wide">
                  بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </span>
              </div>

              {/* Main Heading - larger, with gold gradient & subtle shine */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-6xl font-bold leading-tight bg-gradient-to-r from-white via-amber-100 to-emerald-100 bg-clip-text text-transparent drop-shadow-2xl">
                  ইসলামিক জ্ঞান ও দিকনির্দেশনা
                </h1>
                <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-full mx-auto md:mx-0"></div>
              </div>

              {/* Description - more poetic & spiritual */}
              <p className="text-xl md:text-2xl text-emerald-100/90 leading-relaxed font-light max-w-3xl">
                কুরআন ও সুন্নাহর নূরে আলোকিত পথে চলুন। দুনিয়ার সৌন্দর্যের
                পাশাপাশি আখিরাতের প্রস্তুতি গ্রহণ করুন। আল্লাহর রহমত ও
                মাগফিরাতের দিকে ফিরে আসুন।
              </p>

              {/* Features - elegant pills with subtle hover/glow */}
              <div className="flex flex-wrap justify-center md:justify-start gap-5 pt-6">
                <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-lg px-6 py-3 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 shadow-md">
                  <svg
                    className="w-6 h-6 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <span className="text-base font-medium text-emerald-50">
                    কুরআন ও হাদিসের শিক্ষা
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-lg px-6 py-3 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 shadow-md">
                  <svg
                    className="w-6 h-6 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <span className="text-base font-medium text-emerald-50">
                    আমলযোগ্য জ্ঞান
                  </span>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-lg px-6 py-3 rounded-2xl border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 shadow-md">
                  <svg
                    className="w-6 h-6 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-base font-medium text-emerald-50">
                    আখিরাতের প্রস্তুতি
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Refined bottom wave with softer opacity & gold tint */}
          <div className="absolute bottom-0 left-0 right-0 opacity-15">
            <svg viewBox="0 0 1440 140" fill="none" className="w-full h-auto">
              <path
                d="M0 120L60 105C120 90 240 60 360 52.5C480 45 600 60 720 67.5C840 75 960 75 1080 67.5C1200 60 1320 45 1380 37.5L1440 30V140H0Z"
                fill="url(#waveGradient)"
              />
              <defs>
                <linearGradient
                  id="waveGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#065f46" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </section>

        {/* Featured Post */}
        {featuredPost && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl  font-bold text-slate-900">
                প্রধান নিবন্ধ
              </h2>

              <article className="group border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="md:col-span-1 h-64 md:h-full bg-slate-100 overflow-hidden relative">
                    {(() => {
                      const firstImageMatch = featuredPost.content?.match(
                        /<img[^>]+src="([^">]+)"/
                      );
                      const firstImage = firstImageMatch
                        ? firstImageMatch[1]
                        : null;
                      return firstImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={firstImage}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                          <span className="text-slate-500 text-sm">
                            প্রধান ইমেজ নেই
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Content */}
                  <div className="md:col-span-2 p-6 md:p-10 flex flex-col justify-center">
                    {featuredPost.category && (
                      <div className="mb-3">
                        <span className="text-xs uppercase tracking-widest font-semibold text-primary border-b-2 border-primary pb-2">
                          {featuredPost.category}
                        </span>
                      </div>
                    )}

                    <Link href={`/post/${featuredPost.slug}`}>
                      <h3 className="text-2xl md:text-3xl  font-bold text-slate-900 mb-4 hover:text-primary transition line-clamp-3">
                        {featuredPost.title}
                      </h3>
                    </Link>

                    <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6 line-clamp-2">
                      {featuredPost.excerpt ||
                        featuredPost.content
                          ?.replace(/<[^>]*>/g, "")
                          .substring(0, 150)}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                      <div className="text-sm">
                        <p className="font-semibold text-slate-900">
                          {featuredPost.author_email || "অজানা লেখক"}
                        </p>
                        <p className="text-slate-500">
                          {new Date(
                            featuredPost.published_at || featuredPost.created_at
                          ).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                      <Link
                        href={`/post/${featuredPost.slug}`}
                        className="text-primary hover:text-primary/80 font-semibold transition text-sm md:text-base"
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
            <h2 className="text-3xl md:text-4xl  font-bold text-slate-900 mb-10">
              সর্বশেষ নিবন্ধ
            </h2>

            {/* Featured Grid Style */}
            <div className="space-y-8">
              {latestPosts.slice(0, 3).map((post) => (
                <article
                  key={post.id}
                  className="group border-b border-slate-200 pb-8 hover:opacity-80 transition"
                >
                  <div className="grid md:grid-cols-4 gap-6 items-start">
                    {/* Image */}
                    <div className="md:col-span-1 h-40 bg-slate-100 rounded overflow-hidden relative">
                      {(() => {
                        const firstImageMatch = post.content?.match(
                          /<img[^>]+src="([^">]+)"/
                        );
                        const firstImage = firstImageMatch
                          ? firstImageMatch[1]
                          : null;
                        return firstImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={firstImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                            <span className="text-slate-500 text-xs">
                              ইমেজ নেই
                            </span>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Content */}
                    <div className="md:col-span-3">
                      {post.category && (
                        <span className="inline-block text-xs uppercase tracking-widest font-semibold text-primary mb-2">
                          {post.category}
                        </span>
                      )}

                      <Link href={`/post/${post.slug}`}>
                        <h3 className="text-xl md:text-2xl  font-bold text-slate-900 mb-2 hover:text-primary transition group-hover:text-primary line-clamp-2">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="text-slate-600 text-sm md:text-base mb-4 line-clamp-2">
                        {post.excerpt ||
                          post.content
                            ?.replace(/<[^>]*>/g, "")
                            .substring(0, 120)}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                          <p className="font-semibold text-slate-900">
                            {post.author_email || "অজানা লেখক"}
                          </p>
                          <p>
                            {new Date(
                              post.published_at || post.created_at
                            ).toLocaleDateString("bn-BD")}
                          </p>
                        </div>
                        <Link
                          href={`/post/${post.slug}`}
                          className="text-primary hover:text-primary/80 font-semibold text-sm transition"
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
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-slate-300 text-slate-900 hover:bg-slate-50"
                >
                  <Link href="/blogs">সকল নিবন্ধ দেখুন</Link>
                </Button>
              </div>
            )}
          </section>
        ) : (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-200">
            <div className="text-center py-16">
              <p className="text-xl text-slate-600 font-medium">
                এখনো কোনো প্রকাশিত নিবন্ধ নেই
              </p>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        {!session && (
          <section className="bg-slate-50 border-t border-slate-200 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h3 className="text-3xl md:text-4xl  font-bold text-slate-900 mb-4">
                নতুন নিবন্ধের খবর পান
              </h3>
              <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                আমাদের সর্বশেষ চিন্তাশীল নিবন্ধ এবং বিশ্লেষণ সরাসরি আপনার
                ইনবক্সে পান।
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="আপনার ইমেইল..."
                  className="flex-1 px-4 py-3 border border-slate-300 rounded focus:outline-none focus:border-primary text-slate-900 placeholder-slate-500"
                />
                <Button className="font-semibold">সাবস্ক্রাইব করুন</Button>
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
                  চিন্তাশীল প্রবন্ধ এবং গভীর বিশ্লেষণের মাধ্যমে সমসাময়িক
                  বিষয়গুলি নিয়ে আলোচনা।
                </p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">দ্রুত লিঙ্ক</h4>
                <ul className="text-sm space-y-2">
                  <li>
                    <Link href="/" className="hover:text-white transition">
                      হোমপেজ
                    </Link>
                  </li>
                  <li>
                    <Link href="/blogs" className="hover:text-white transition">
                      সব নিবন্ধ
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="hover:text-white transition">
                      আমাদের সম্পর্কে
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">নীতিমালা</h4>
                <ul className="text-sm space-y-2">
                  <li>
                    <Link
                      href="/privacy"
                      className="hover:text-white transition"
                    >
                      গোপনীয়তা নীতি
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white transition">
                      সেবার শর্তাবলী
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-3">যোগাযোগ</h4>
                <p className="text-sm">
                  ইমেইল: info@blogplatform.com
                  <br />
                  ঢাকা, বাংলাদেশ
                </p>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-8 text-center text-sm">
              <p>
                &copy; ২০২৫ সুন্নাহ প্রবন্ধ। সর্বাধিকার সংরক্ষিত। <Link href={"http://naimworld.netlify.app"}>NaimEkattor</Link>
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
