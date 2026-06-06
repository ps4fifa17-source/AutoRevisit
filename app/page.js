import Link from "next/link";
import { ArrowRight, Car, Send } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen soft-grid p-5 md:p-8 flex items-center justify-center">
      <section className="max-w-6xl w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-stretch">
        <div className="dark-card p-7 md:p-12 flex flex-col justify-between min-h-[620px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
              <img
                src="/logo.png"
                alt="AutoRevisit"
                className="h-4 w-4 object-contain"
              />
              <span className="font-black text-acid">AutoRevisit</span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-[0.9] mt-10 tracking-tight">
              Make every customer feel remembered.
            </h1>

            <p className="text-white/62 text-xl md:text-2xl mt-8 max-w-2xl leading-relaxed">
              Create personalised car pages that keep buyers emotionally connected after they leave the forecourt.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <Link href="/signup" className="btn-acid">
              Start setup <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link href="/login" className="rounded-full px-5 py-4 font-black bg-white/8 border border-white/10 hover:bg-white/12 transition">
              Login
            </Link>
          </div>
        </div>

        <div className="grid gap-6">
          <div className="card p-7">
            <div className="h-14 w-14 rounded-3xl bg-acid flex items-center justify-center mb-8">
              <Car />
            </div>
            <h2 className="text-4xl font-black tracking-tight">Stock in. Pages out.</h2>
            <p className="text-ink/60 mt-4 text-lg">
              Add vehicles, select a customer, choose one or multiple cars, and generate a private page instantly.
            </p>
          </div>

          <div className="card p-7">
            <div className="h-14 w-14 rounded-3xl bg-ink text-acid flex items-center justify-center mb-8">
              <Send />
            </div>
            <h2 className="text-4xl font-black tracking-tight">Built for indecision.</h2>
            <p className="text-ink/60 mt-4 text-lg">
              Perfect when customers leave with several cars in mind and need a premium way to compare later.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}