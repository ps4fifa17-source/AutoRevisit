"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function login() {
    if (!email || !password) return alert("Add email and password.");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) return alert(error.message);

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen p-5 soft-grid flex items-center justify-center">
      <div className="max-w-md w-full card p-8">
        <div className="h-14 w-14 rounded-3xl bg-acid flex items-center justify-center mb-8">
          <Mail />
        </div>

        <p className="badge mb-5">Secure access</p>
        <h1 className="text-5xl font-black leading-none">Welcome back</h1>
        <p className="text-ink/55 mt-4">
          Login with email and password.
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

        <button className="btn w-full mt-4" onClick={login}>
          Login <ArrowRight size={18} className="ml-2" />
        </button>

        <p className="text-ink/45 mt-6">
          New here? <Link href="/signup" className="font-black text-ink">Create account</Link>
        </p>
      </div>
    </main>
  );
}
