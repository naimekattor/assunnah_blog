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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-arabic">আমাদের সম্পর্কে</h1>
            <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
              বিশুদ্ধ ইসলামিক জ্ঞান এবং ওলামায়ে কেরামের গবেষণালব্ধ প্রবন্ধের একটি নির্ভরযোগ্য প্লাটফর্ম
            </p>
          </div>
        </section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
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
               
              

                {/* Scholar Info - Updated with provided text */}
                <div className="md:w-2/3 p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1
                        className="text-2xl font-bold text-slate-900 mb-1"
                        itemProp="name"
                      >
                        মুফতি আব্দুর রহমান নাঈম কাসেমী
                      </h1>
                      <p
                        className="text-primary font-medium"
                        itemProp="jobTitle"
                      >
                        মুহাদ্দিস ও উচ্চতর হাদিস গবেষণা বিভাগের উস্তায, দারুল উলূম ঢাকা, মিরপুর-১৩ । ইমাম ও খতিব, গাউছিয়া জামে মসজিদ, মিরপুর-২
                      </p>
                    </div>
                    {/* <div className="flex gap-2">
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
                    </div> */}
                  </div>

                  {/* Bio - Replaced with full provided text */}
                  <div className="space-y-4 text-slate-600 leading-relaxed" itemProp="description">
                    <p>
                      মুফতি আব্দুর রহমান নাঈম কাসেমী একজন প্রাজ্ঞ আলেম ও গবেষক, যিনি ১৯৯২ সালে গফরগাঁও উপজেলার লামকাইন গ্রামের এক সম্ভ্রান্ত ও ধর্মপরায়ণ পরিবারে জন্মগ্রহণ করেন। তাঁর পিতা আলহাজ রফিকুল ইসলাম একজন শিক্ষানুরাগী ও মাদরাসা-মসজিদপ্রেমিক মানুষ, যিনি দীর্ঘকাল মহির খারুয়া রা.নি. মাধ্যমিক বিদ্যালয়ে প্রধান শিক্ষক হিসেবে দায়িত্ব পালন করেন। মাতা মোছা. আয়েশা আক্তার একজন গৃহিণী। তাঁর দাদা মরহুম হাজী মুতালেব ছিলেন ওই এলাকার সুপরিচিত ইমাম ও সমাজসেবক, যিনি আজীবন মসজিদের খেদমতে নিয়োজিত ছিলেন এবং সবার প্রিয় ছিলেন।
                    </p>
                    <p>
                      তিনি গ্রামের মক্তব ও মাদরাসায় প্রাথমিক ও মাধ্যমিক স্তরের পড়াশোনা শেষ করেন। এরপর জামিয়া হুসাইনিয়া আজাদাবাদ, মিরপুর-১, ঢাকা থেকে ২০১২-১৩ সনে দাওরায়ে হাদিস এবং ২০১৪ সনে উচ্চতর ইসলামি আইন গবেষণা ও ফাতওয়া কোর্স সম্পন্ন করেন। উচ্চতর আরবি ভাষা সাহিত্য কোর্স সম্পন্ন করেন ঢাকার জামিয়াতুন নূর থেকে। এরপর উচ্চতর দীনি শিক্ষা গ্রহণের লক্ষ্যে ভারতের ঐতিহাসিক দীনি শিক্ষাকেন্দ্র দারুল উলূম দেওবন্দে ভর্তি হন। সেখানে তিনি হাদিস, ফিকাহ, তাফসিরসহ ইসলামি জ্ঞানের নানা শাখায় সুগভীরতা অর্জন করেন। তাঁর উস্তাদদের মধ্যে অনেক বরেণ্য ও আন্তর্জাতিক খ্যাতিসম্পন্ন বুজুর্গ আলেম ও মুহাদ্দিস রয়েছেন।
                    </p>
                    <p>
                      ২০১৮-১৯ শিক্ষাবর্ষে আনুষ্ঠানিকভাবে উচ্চতর পড়াশোনা সম্পন্ন করে স্বদেশে প্রত্যাবর্তনের পর তিনি কুরআন, হাদিস, ফিকাহ, তাফসির, আকিদা এবং দাওয়াহসহ দ্বীনের বিভিন্ন গুরুত্বপূর্ণ খেদমতে আত্মনিয়োগ করেন।
                    </p>
                    <p>
                      বর্তমানে তিনি রাজধানী ঢাকার সুপ্রাচীন দ্বীনি বিদ্যাপীঠ দারুল উলূম ঢাকা, মিরপুর-১৩ -এর স্বনামধন্য মুহাদ্দিস ও উচ্চতর হাদিস গবেষণা বিভাগের উস্তায হিসেবে দায়িত্ব পালন করছেন। পাশাপাশি ঐতিহ্যবাহী গাউছিয়া জামে মসজিদ, মিরপুর-২, ঢাকার ইমাম ও খতিব হিসেবে দায়িত্ব পালন করছেন। একই সঙ্গে তিনি বেশ কিছু মাদরাসার পৃষ্ঠপোষকতা ও সেবামূলক সংস্থার উপদেষ্টা হিসেবে কাজ করছেন।
                    </p>
                    <p>
                      তিনি লেখালেখি ও অন্যান্য মাধ্যমে ইসলামি দাওয়াতি কার্যক্রম চালিয়ে যাচ্ছেন। বিশেষত সামাজিক ও চিন্তাশীল প্রেক্ষাপটে তরুণ সমাজ তাঁর লেখনি, বয়ান ও দিকনির্দেশনা থেকে দ্বীনি জ্ঞানে উপকৃত হচ্ছে এবং প্রেরণা পাচ্ছে। বিভিন্ন শ্রেণির পাঠক ও শ্রোতা তাঁর মাধ্যমে কুরআন-সুন্নাহভিত্তিক বিশুদ্ধ দ্বীন বুঝতে ও চর্চা করতে উৎসাহিত হচ্ছে।
                    </p>
                    <p>
                      সুলুক ও তাসাউফের জগতে মুফতি আব্দুর রহমান নাঈম কাসেমী বিশ্বের দুই বিশিষ্ট শায়েখ থেকে খেলাফত বা আধ্যাত্মিক অনুমতি লাভ করেছেন। তাঁদের একজন দারুল উলুম দেওবন্দের নামকরা মুহাদ্দিস মুফতি আব্দুল্লাহ মারুফী এবং অপরজন মসজিদে নববীর প্রাক্তন শিক্ষক আল্লামা ড. আব্দুর রহমান কাউসার মাদানী (সাহেবযাদা, আল্লামা আশেক এলাহী বুলন্দশহরী রহ.)। উভয়ের তত্ত্বাবধানে আত্মশুদ্ধি ও রূহানিয়াতের প্রশিক্ষণ নিয়ে, খিলাফত লাভের পর থেকে তিনি এ কাজের সঙ্গে নিয়মিত সম্পৃক্ত রয়েছেন।
                    </p>
                  </div>

                  {/* Research Areas - Kept as is, can be updated if needed */}
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