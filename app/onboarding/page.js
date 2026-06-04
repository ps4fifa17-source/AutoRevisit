"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { useRouter } from "next/navigation";
import { Building2, ArrowRight } from "lucide-react";

export default function OnboardingPage() {
  const supabase = createClient();
  const router = useRouter();

  const [form, setForm] = useState({
    dealershipName: "",
    yourName: "",
    phone: "",
    email: "",
    website: "",
    primaryColor: "#FFC400"
  });

  async function saveDealer() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return alert("You need to log in first.");

    const slug = slugify(form.dealershipName) + "-" + Math.floor(Math.random() * 10000);

    const { data: dealer, error: dealerError } = await supabase
      .from("dealerships")
      .insert({
        name: form.dealershipName,
        slug,
        phone: form.phone,
        email: form.email,
        website: form.website,
        primary_color: form.primaryColor,
        subscription_status: "pending",
        setup_status: "pending",
        stock_import_status: "not_started"
      })
      .select()
      .single();

    if (dealerError) return alert(dealerError.message);

    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        id: auth.user.id,
        dealership_id: dealer.id,
        name: form.yourName,
        email: auth.user.email,
        role: "owner"
      });

    if (profileError) return alert(profileError.message);

    await supabase.from("dealership_branding").insert({
      dealership_id: dealer.id,
      accent_color: form.primaryColor
    });

    router.push("/setup-pending");
  }

  return (
    <main className="min-h-screen p-5 soft-grid flex items-center justify-center">
      <div className="max-w-5xl w-full grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
        <section className="dark-card p-8 md:p-10">
          <div className="h-16 w-16 rounded-3xl bg-acid text-ink flex items-center justify-center mb-8">
            <Building2 size={30} />
          </div>
          <h1 className="text-6xl font-black tracking-tight leading-[0.9]">Build your dealer identity.</h1>
          <p className="text-white/60 text-lg mt-6">
            This starts your dealership workspace. Once setup is active, your dashboard unlocks.
          </p>
        </section>

        <section className="card p-7 md:p-10">
          <p className="badge mb-5">Setup</p>
          <h2 className="text-4xl font-black">Dealership details</h2>

          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <input className="input md:col-span-2" placeholder="Dealership name" onChange={(e) => setForm({...form, dealershipName: e.target.value})} />
            <input className="input md:col-span-2" placeholder="Your name" onChange={(e) => setForm({...form, yourName: e.target.value})} />
            <input className="input" placeholder="Phone / WhatsApp" onChange={(e) => setForm({...form, phone: e.target.value})} />
            <input className="input" placeholder="Dealer email" onChange={(e) => setForm({...form, email: e.target.value})} />
            <input className="input md:col-span-2" placeholder="Website / stock URL" onChange={(e) => setForm({...form, website: e.target.value})} />

            <div className="md:col-span-2 rounded-3xl bg-white/70 border border-line p-4">
              <label className="font-black">Brand colour</label>
              <p className="text-ink/50 text-sm mt-1 mb-3">This colour appears on customer pages.</p>
              <input className="w-full h-14 rounded-2xl" type="color" value={form.primaryColor} onChange={(e) => setForm({...form, primaryColor: e.target.value})} />
            </div>
          </div>

          <button className="btn w-full mt-6" onClick={saveDealer}>
            Create dealership workspace <ArrowRight size={18} className="ml-2" />
          </button>
        </section>
      </div>
    </main>
  );
}
