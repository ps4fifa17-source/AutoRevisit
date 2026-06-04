"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {
    if (!email || !password) return alert("Add email and password.");
    if (password.length < 6) return alert("Password must be at least 6 characters.");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) return alert(error.message);

    router.push("/onboarding");
  }

  return (
    <main className="min-h-screen p-5 soft-grid flex items-center justify-center">
      <div className="max-w-5xl w-full grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <section className="dark-card p-8 md:p-10">
          <div className="badge mb-8">Dealer setup</div>
          <h1 className="text-6xl font-black leading-[0.9] tracking-tight">Start your workspace.</h1>
          <p className="text-white/60 text-lg mt-6">
            Create your dealer account, then we prepare your workspace before the dashboard unlocks.
          </p>
        </section>

        <section className="card p-7 md:p-10">
          <div className="h-14 w-14 rounded-3xl bg-acid flex items-center justify-center mb-8">
            <Mail />
          </div>

          <h2 className="text-4xl font-black">Create account</h2>
          <p className="text-ink/55 mt-3">
            Use email and password. No magic links, no waiting.
          </p>

          <input
            className="input mt-8"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input mt-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn w-full mt-4" onClick={signUp}>
            Create workspace <ArrowRight size={18} className="ml-2" />
          </button>

          <p className="text-ink/45 mt-6">
            Already set up? <Link href="/login" className="font-black text-ink">Login here</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
