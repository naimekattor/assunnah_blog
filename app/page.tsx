import { createClient } from "@/lib/supabase/server";
import { getSession, getUserProfile } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { PostCard } from "@/components/post-card";
import KeepAlive from "@/components/KeepAlive";
import { HeroSearch } from "@/components/hero-search";
import { Footer } from "@/components/footer";

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
    <div className="flex flex-col min-h-screen">
      <KeepAlive />
      <Header profile={profile} />
      <main className="flex-1 bg-white">
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
            <div className="space-y-10 max-w-6xl mx-auto text-center">
              {/* Enhanced Bismillah with beautiful Arabic font & gold glow */}
              <div className="flex items-center justify-center gap-4">
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
                <div className="w-32 h-1.5 bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 rounded-full mx-auto"></div>
              </div>

              {/* Description - more poetic & spiritual */}
              <p className="text-xl md:text-2xl text-emerald-100/90 leading-relaxed font-light ">
                কুরআন ও সুন্নাহর নূরে আলোকিত পথে চলুন। দুনিয়ার সৌন্দর্যের
                পাশাপাশি আখিরাতের প্রস্তুতি গ্রহণ করুন। আল্লাহর রহমত ও
                মাগফিরাতের দিকে ফিরে আসুন।
              </p>

              <HeroSearch />
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

        {/* Featured Post - Modern Magazine Style */}
        {featuredPost && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1.5 h-8 bg-emerald-500 rounded-full"></div>
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900">
                সম্পাদকীয়
              </h2>
            </div>

            <article className="group relative bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-500">
              <div className="grid lg:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="h-72 lg:h-auto bg-slate-100 overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-10">
                    {featuredPost.category && (
                      <span className="px-3 py-1.5 bg-white/90 backdrop-blur text-primary font-bold text-xs uppercase tracking-wider rounded-lg shadow-sm">
                        {featuredPost.category}
                      </span>
                    )}
                  </div>
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
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                        <span className="text-slate-500 text-sm">
                          প্রধান ইমেজ নেই
                        </span>
                      </div>
                    );
                  })()}
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>

                {/* Content Side */}
                <div className="p-8 lg:p-12 flex flex-col justify-center bg-white relative">
                  {/* Decorative background element */}
                  <div className="absolute top-0 right-0 p-12 opacity-5">
                    <svg
                      className="w-32 h-32"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.408 24h-13.408v-24h10.189c3.279 0 2.552 9.475 3.219 14.453.667-4.978-.06-14.453 3.219-14.453h10.189v24h-13.408v-11.662l-6.592 11.662zm-5.408-14.73l6-10.617c.521 3.743.028 10.347 1 10.347s.479-6.604 1-10.347l6 10.617v-8.27h-2.189c-2.433 0-1.875 7.031-2.311 10.741-.436-3.71-.122-10.741-2.311-10.741h-7.189v8.27z" />
                    </svg>
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 font-medium">
                      <span className="flex items-center gap-1 bg-primary/5 text-primary px-2 py-1 rounded">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {new Date(
                          featuredPost.published_at || featuredPost.created_at
                        ).toLocaleDateString("bn-BD")}
                      </span>
                      <span>•</span>
                      <span>{featuredPost.author_email || "অজানা লেখক"}</span>
                    </div>

                    <Link
                      href={`/post/${featuredPost.slug}`}
                      className="group-hover:text-primary transition-colors"
                    >
                      <h3 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                        {featuredPost.title}
                      </h3>
                    </Link>

                    <p className="text-slate-600 text-lg leading-relaxed mb-8 line-clamp-3">
                      {featuredPost.excerpt ||
                        featuredPost.content
                          ?.replace(/<[^>]*>/g, "")
                          .substring(0, 180)}
                      ...
                    </p>

                    <Button
                      asChild
                      className="self-start bg-slate-900 hover:bg-primary text-white px-8 py-6 rounded-xl transition-all shadow-lg hover:shadow-primary/30"
                    >
                      <Link
                        href={`/post/${featuredPost.slug}`}
                        className="flex items-center gap-2 text-lg"
                      >
                        পড়তে থাকুন{" "}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          </section>
        )}

        {/* Latest Posts - Robust Grid */}
        {latestPosts && latestPosts.length > 0 ? (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-white">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                <div>
                  <h2 className="text-xl md:text-2xl font-semibold text-slate-900  font-arabic">
                  সদ্য প্রকাশিত
                </h2>
                <p className="text-slate-500 text-lg">
                  সাম্প্রতিক সময়ের গুরুত্বপূর্ণ আলোচনা ও প্রবন্ধসমূহ
                </p>
                </div>
                
              </div>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/5 gap-2"
              >
                <Link href="/blogs" className="flex items-center">
                  সবগুলো দেখুন{" "}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.slice(0, 3).map((post) => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  userRole={profile?.role}
                />
              ))}
            </div>

            {/* View All Button - styled differently if needed, but the top link handles it */}
            {latestPosts.length > 3 && (
              <div className="mt-12 text-center md:hidden">
                <Button asChild variant="outline" className="w-full">
                  <Link href="/blogs">আরও দেখুন</Link>
                </Button>
              </div>
            )}
          </section>
        ) : (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <p className="text-xl text-slate-500">
                এই মুহূর্তে কোনো নিবন্ধ প্রকাশিত নেই। শীঘ্রই নতুন লেখা আসছে...
              </p>
            </div>
          </section>
        )}

        {/* Newsletter Section */}
        {/* {!session && (
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
        )} */}

        {/* Footer */}
      </main>
      <Footer />
    </div>
  );
}
