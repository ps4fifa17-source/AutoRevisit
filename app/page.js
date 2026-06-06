import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Car,
  UserCheck,
  FileText,
  Send,
  BarChart2,
  Repeat,
  Star,
  MessageCircle,
  Eye,
  Zap,
  CheckCircle,
  TrendingUp,
  Bell,
  Shield,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f5f2ec] soft-grid font-sans">

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#f5f2ec]/90 backdrop-blur-md border-b border-black/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="AutoRevisit" width={32} height={32} className="rounded-md" />
            <span className="font-bold text-lg text-[#111] tracking-tight">AutoRevisit</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-[#111] px-4 py-2 rounded-xl hover:bg-black/5 transition-colors"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="btn-acid text-sm font-semibold px-4 py-2 rounded-xl bg-[#c7fd62] text-[#111] hover:bg-[#b8f04e] transition-colors"
            >
              Start setup
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#111] text-[#c7fd62] text-xs font-semibold px-3 py-1.5 rounded-full mb-8">
              <Zap size={12} />
              Built for car dealerships
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111] leading-[1.05] tracking-tight mb-4">
              The sale isn't lost when a buyer leaves.
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#c7fd62] bg-[#111] px-3 py-1 inline rounded-lg leading-tight mb-6">
              It's won by the dealership they remember the most.
            </h2>
            <p className="text-lg font-semibold text-[#111] mt-6 mb-2">AutoRevisit helps make sure that's you.</p>
            <p className="text-base text-[#444] mb-10 max-w-lg">
              Create personalised customer pages that keep buyers engaged, informed and coming back after they leave the forecourt, enquiry or website.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/signup"
                className="flex items-center gap-2 bg-[#c7fd62] text-[#111] font-bold px-6 py-3 rounded-xl hover:bg-[#b8f04e] transition-colors text-sm"
              >
                Start setup <ArrowRight size={16} />
              </Link>
              <a
                href="#how-it-works"
                className="flex items-center gap-2 bg-[#111] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#222] transition-colors text-sm"
              >
                See how it works
              </a>
            </div>
          </div>

          {/* Hero mockup */}
          <div className="relative">
            <div className="bg-[#111] rounded-3xl p-5 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                <div className="ml-auto text-xs text-white/40">Customer Page Preview</div>
              </div>
              {/* Journey steps */}
              <div className="space-y-2.5">
                {[
                  { icon: Car, label: "Buyer views vehicle", sub: "BMW 3 Series · £28,900", active: false, done: true },
                  { icon: Eye, label: "Leaves to compare", sub: "Checking 3 other dealers...", active: false, done: true },
                  { icon: FileText, label: "Receives personalised page", sub: "AutoRevisit page sent via WhatsApp", active: true, done: false },
                  { icon: Repeat, label: "Reopens the page", sub: "Viewed 4× in 2 days", active: false, done: false },
                  { icon: MessageCircle, label: "Returns to dealer", sub: "Ready to proceed", active: false, done: false },
                ].map(({ icon: Icon, label, sub, active, done }, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all ${
                      active
                        ? "bg-[#c7fd62] text-[#111]"
                        : done
                        ? "bg-white/5 text-white/50"
                        : "bg-white/8 text-white/70"
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? "bg-[#111]" : "bg-white/10"}`}>
                      <Icon size={15} className={active ? "text-[#c7fd62]" : ""} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{label}</div>
                      <div className={`text-[10px] truncate ${active ? "text-[#111]/60" : "opacity-50"}`}>{sub}</div>
                    </div>
                    {done && <CheckCircle size={14} className="ml-auto flex-shrink-0 text-[#c7fd62]" />}
                    {active && <div className="ml-auto w-2 h-2 rounded-full bg-[#111] flex-shrink-0 animate-pulse"></div>}
                  </div>
                ))}
              </div>
              {/* Mini stats */}
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[
                  { label: "Page opens", value: "4×" },
                  { label: "Time spent", value: "3m 12s" },
                  { label: "CTA clicks", value: "2" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-white/5 rounded-xl p-2.5 text-center">
                    <div className="text-[#c7fd62] font-black text-lg leading-none">{value}</div>
                    <div className="text-white/40 text-[10px] mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -top-3 -right-3 bg-[#c7fd62] text-[#111] text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              🔔 Buyer just reopened
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="bg-[#111] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/60 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              The problem
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight mb-4">
              Most follow-ups are forgettable.
            </h2>
            <p className="text-white/50 text-base">
              Dealers send a plain link or a generic message. The buyer reads it once, then keeps comparing.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { headline: "Buyers rarely buy immediately.", body: "They leave to think, sleep on it, compare." },
              { headline: "They forget who you are.", body: "Every dealership starts to blend together after a few days." },
              { headline: "Follow-ups feel generic.", body: "A plain WhatsApp message doesn't make you stand out." },
              { headline: "Interest fades fast.", body: "The longer the gap, the colder the lead." },
            ].map(({ headline, body }) => (
              <div key={headline} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white font-bold text-sm mb-2">{headline}</p>
                <p className="text-white/40 text-sm">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#111] text-[#c7fd62] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              The solution
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-[#111] leading-tight max-w-2xl mx-auto">
              Give every serious buyer a page worth coming back to.
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                icon: UserCheck,
                title: "Personalised to the buyer",
                body: "Each page is built around one customer. Their name, their situation, why this vehicle is right for them.",
              },
              {
                icon: Car,
                title: "Personalised to the vehicle",
                body: "Finance figures, photos, specs, trust signals — everything the buyer needs without hunting for it.",
              },
              {
                icon: TrendingUp,
                title: "Built to convert",
                body: "Clear next steps, WhatsApp actions, and live tracking so your sales team knows exactly when to follow up.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-[#111] text-white rounded-2xl p-6 flex flex-col gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#c7fd62] flex items-center justify-center">
                  <Icon size={20} className="text-[#111]" />
                </div>
                <h3 className="font-bold text-base">{title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-[#111] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/60 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              How it works
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Four steps. Minutes, not hours.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { step: "01", icon: Car, title: "Select the vehicle", body: "Choose the car from your inventory or enter the details manually." },
              { step: "02", icon: UserCheck, title: "Add customer context", body: "Tell AutoRevisit about the buyer — their needs, budget, situation." },
              { step: "03", icon: FileText, title: "AutoRevisit builds the page", body: "A personalised, branded page is generated ready to send." },
              { step: "04", icon: Send, title: "Send, track and follow up", body: "Share via WhatsApp or link. Track opens, time spent and clicks." },
            ].map(({ step, icon: Icon, title, body }) => (
              <div key={step} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-white/10 font-black text-3xl">{step}</div>
                <div className="w-10 h-10 rounded-xl bg-[#c7fd62] flex items-center justify-center mb-4">
                  <Icon size={20} className="text-[#111]" />
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PAGE STYLE SHOWCASE */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-[#111] leading-tight mb-4">
              Different buyers need different follow-ups.
            </h2>
            <p className="text-[#444] text-base max-w-xl mx-auto">
              AutoRevisit adapts the page style, tone and content to match the customer's situation.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: "Finance", accent: "#c7fd62", icon: "£" },
              { label: "Family", accent: "#ffd166", icon: "👨‍👩‍👧" },
              { label: "First Car", accent: "#a0c4ff", icon: "🎓" },
              { label: "Performance", accent: "#ff6b6b", icon: "⚡" },
              { label: "Premium", accent: "#e0c9ff", icon: "✦" },
              { label: "Executive", accent: "#c9f0d5", icon: "◆" },
            ].map(({ label, accent, icon }) => (
              <div
                key={label}
                className="bg-[#111] rounded-2xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-default"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ backgroundColor: accent }}
                >
                  {icon}
                </div>
                <span className="text-white text-xs font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DEALER BENEFITS */}
      <section className="bg-[#111] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Everything your team needs.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Bell, title: "Stay front of mind", body: "Your dealership stays visible long after the buyer walks away." },
              { icon: Repeat, title: "Increase return visits", body: "Buyers come back to the page — and back to you." },
              { icon: Star, title: "Make follow-up feel premium", body: "Stand out from the plain message every other dealer sends." },
              { icon: BarChart2, title: "Track buyer activity", body: "See exactly when buyers open the page, how long they spend, what they click." },
              { icon: Zap, title: "Turn interest into action", body: "Clear CTAs built into every page make it easy for buyers to take the next step." },
              { icon: Users, title: "Help sales teams follow up smarter", body: "Real-time signals tell your team when to call, when to hold back." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#c7fd62] flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-[#111]" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm mb-1">{title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111] leading-tight mb-4">
            The sale isn't lost when a buyer leaves.
          </h2>
          <h3 className="text-3xl sm:text-4xl font-black text-[#111] leading-tight mb-8">
            It's won by the dealership they{" "}
            <span className="bg-[#c7fd62] px-2 rounded-lg">remember the most.</span>
          </h3>
          <p className="text-[#444] text-lg mb-10">AutoRevisit helps make sure that's you.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-[#111] text-white font-bold px-8 py-4 rounded-xl hover:bg-[#222] transition-colors text-base"
            >
              Start setup <ArrowRight size={18} />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 bg-white border border-black/15 text-[#111] font-semibold px-8 py-4 rounded-xl hover:bg-black/5 transition-colors text-base"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Image src="/logo.png" alt="AutoRevisit" width={24} height={24} className="rounded-md" />
            <span className="font-bold text-sm text-[#111]">AutoRevisit</span>
          </div>
          <p className="text-xs text-[#888]">© {new Date().getFullYear()} AutoRevisit. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs text-[#888] hover:text-[#111] transition-colors">Login</Link>
            <Link href="/signup" className="text-xs text-[#888] hover:text-[#111] transition-colors">Sign up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}