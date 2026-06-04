"use client";

import { useEffect, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import CopyLinkButton from "@/components/CopyLinkButton";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import { HeartHandshake, ArrowRight } from "lucide-react";

export default function ThankYouBuilderPage() {
  const supabase = createClient();

  const [vehicles, setVehicles] = useState([]);
  const [createdLink, setCreatedLink] = useState("");
  const [form, setForm] = useState({
    customer_name: "",
    vehicle_id: "",
    message: "Thank you again for choosing us. We hope you enjoy your new vehicle — if you need anything at all, our team is always here to help.",
    handover_image_url: "",
    review_url: "",
  });

  useEffect(() => { loadVehicles(); }, []);

  async function loadVehicles() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { data: profile } = await supabase.from("profiles").select("dealership_id").eq("id", auth.user.id).single();
    if (!profile?.dealership_id) return;

    const { data } = await supabase.from("vehicles").select("*").eq("dealership_id", profile.dealership_id).order("created_at", { ascending: false });
    setVehicles(data || []);
  }

  async function createThankYouPage() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return alert("Not logged in");

    const { data: profile } = await supabase
      .from("profiles")
      .select("dealership_id, dealerships(slug)")
      .eq("id", auth.user.id)
      .single();

    if (!profile?.dealership_id) return alert("No dealership found");
    if (!form.customer_name) return alert("Add customer name");

    const { data: customer } = await supabase
      .from("customers")
      .insert({
        dealership_id: profile.dealership_id,
        first_name: form.customer_name,
        customer_type: "Purchased",
      })
      .select()
      .single();

    const slug = `${slugify(form.customer_name)}-thanks-${Date.now().toString().slice(-5)}`;

    const { data: page, error } = await supabase
      .from("thank_you_pages")
      .insert({
        dealership_id: profile.dealership_id,
        customer_id: customer?.id || null,
        vehicle_id: form.vehicle_id || null,
        slug,
        title: `Thank you ${form.customer_name}`,
        message: form.message,
        handover_image_url: form.handover_image_url,
        review_url: form.review_url,
      })
      .select()
      .single();

    if (error) return alert(error.message);

    const site = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    setCreatedLink(`${site}/t/${profile.dealerships.slug}/${page.slug}`);
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <div className="dark-card p-8 md:p-10">
            <p className="text-acid font-black mb-4">Post-handover</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
              Create a simple thank you page.
            </h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">
              Lightweight, branded and reassuring. No complicated ownership portal.
            </p>
          </div>

          {createdLink ? (
            <section className="card p-7">
              <div className="h-14 w-14 rounded-3xl bg-acid flex items-center justify-center">
                <HeartHandshake />
              </div>
              <h2 className="text-4xl font-black mt-5">Thank you page ready</h2>
              <p className="text-ink/55 mt-2 break-all">{createdLink}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href={createdLink} target="_blank" rel="noreferrer" className="btn">Preview</a>
                <CopyLinkButton value={createdLink} />
              </div>
            </section>
          ) : (
            <section className="card p-7">
              <p className="badge mb-4">Page details</p>
              <div className="grid md:grid-cols-2 gap-4">
                <input className="input" placeholder="Customer first name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                <select className="input" value={form.vehicle_id} onChange={(e) => setForm({ ...form, vehicle_id: e.target.value })}>
                  <option value="">Select vehicle optional</option>
                  {vehicles.map((car) => (
                    <option key={car.id} value={car.id}>{[car.year, car.make, car.model].filter(Boolean).join(" ")}</option>
                  ))}
                </select>
                <input className="input md:col-span-2" placeholder="Handover image URL optional" value={form.handover_image_url} onChange={(e) => setForm({ ...form, handover_image_url: e.target.value })} />
                <input className="input md:col-span-2" placeholder="Review URL optional" value={form.review_url} onChange={(e) => setForm({ ...form, review_url: e.target.value })} />
                <textarea className="input md:col-span-2 min-h-[140px]" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>

              <button onClick={createThankYouPage} className="btn-acid mt-6">
                Create thank you page <ArrowRight size={18} className="ml-2" />
              </button>
            </section>
          )}
        </section>
      </div>
    </main>
  );
}
