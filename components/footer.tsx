import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Youtube, Mail, MapPin } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-emerald-900/30 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
               {/* Using text logo for now if image not consistently available, or the same image as header */}
               <span className="text-2xl font-bold text-white font-arabic">হকপথ</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              বিশুদ্ধ ইসলামিক জ্ঞান এবং ওলামায়ে কেরামের গবেষণালব্ধ প্রবন্ধের একটি নির্ভরযোগ্য প্লাটফর্ম। 
              আমরা কুরআন ও সুন্নাহর আলোকে জীবন গড়ার পাথেয় হতে চাই।
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition transform hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition transform hover:scale-110">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-emerald-400 transition transform hover:scale-110">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold mb-6 relative inline-block">
              বিভাগসমূহ
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/blogs?category=quraner-alo" className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full"></span>
                  কোরআনের আলো
                </Link>
              </li>
              <li>
                <Link href="/blogs?category=masala-masayel" className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full"></span>
                  মাসআলা মাসায়েল
                </Link>
              </li>
              <li>
                <Link href="/blogs?category=probondho-somuho" className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full"></span>
                  প্রবন্ধ সমূহ
                </Link>
              </li>
              <li>
                <Link href="/blogs?category=bishoy-bhittik-boyan" className="text-slate-400 hover:text-emerald-400 transition flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full"></span>
                  বিষয়ভিত্তিক বয়ান
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 relative inline-block">
              প্রয়োজনীয় লিংক
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-emerald-400 transition">
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-slate-400 hover:text-emerald-400 transition">
                  সকল নিবন্ধ
                </Link>
              </li>
              {/* <li>
                <Link href="/contact" className="text-slate-400 hover:text-emerald-400 transition">
                  যোগাযোগ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-slate-400 hover:text-emerald-400 transition">
                  গোপনীয়তা নীতি
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-bold mb-6 relative inline-block">
              যোগাযোগ
              <span className="absolute -bottom-2 left-0 w-12 h-1 bg-emerald-500 rounded-full"></span>
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                <span>মিরপুর, ঢাকা-১২১৬,<br />বাংলাদেশ</span>
              </li>
              {/* <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-emerald-500" />
                <a href="mailto:info@hokpath.com" className="hover:text-emerald-400 transition">
                  info@hokpath.com
                </a>
              </li> */}
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>&copy; {currentYear} হকপথ। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            Developed by <a href="https://naimworld.netlify.app" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:text-emerald-400">NaimEkattor</a>
          </p>
        </div>
      </div>
    </footer>
  )
}
