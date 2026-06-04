"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import DashboardNav from "@/components/DashboardNav";
import { getPlan } from "@/lib/plans";
import { Save, ArrowLeft, Search, ShieldCheck, Camera, Lock } from "lucide-react";
import Link from "next/link";

export default function NewVehiclePage() {
  const supabase = createClient();
  const router = useRouter();
  const [planName, setPlanName] = useState("starter");
  const [lookupReg, setLookupReg] = useState("");
  const [lookupMessage, setLookupMessage] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);
  const [dvlaData, setDvlaData] = useState({});
  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    reg: "",
    price: "",
    monthly_price: "",
    mileage: "",
    fuel_type: "",
    transmission: "",
    description: "",
    tags: "",
    colour: "",
    engine_capacity: "",
    co2_emissions: "",
    tax_status: "",
    mot_status: "",
  });

  useEffect(() => { loadPlan(); }, []);

  async function loadPlan() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("dealership_id, role, test_plan, dealerships(plan_name)")
      .eq("id", auth.user.id)
      .single();

    const effectivePlan = profile?.role === "admin" && profile?.test_plan
      ? profile.test_plan
      : profile?.dealerships?.plan_name || "starter";

    setPlanName(effectivePlan);
  }

  const plan = getPlan(planName);

  function update(key, value) {
    setForm({ ...form, [key]: value });
  }

  async function lookupVehicle() {
    if (!plan.regLookup) {
      alert("Registration lookup is included in Professional and Premium.");
      return;
    }

    setLookupLoading(true);
    setLookupMessage("");

    const res = await fetch("/api/vehicle-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reg: lookupReg }),
    });

    const data = await res.json();

    if (data.error) {
      setLookupMessage(data.error);
    } else if (data.success && data.vehicle) {
      setLookupMessage("Vehicle found. Add model if needed, price, mileage and photos.");
      setDvlaData(data.raw || {});
      setForm((c) => ({
        ...c,
        reg: data.vehicle.reg || c.reg,
        make: data.vehicle.make || c.make,
        year: data.vehicle.year || c.year,
        fuel_type: data.vehicle.fuel_type || c.fuel_type,
        colour: data.vehicle.colour || c.colour,
        engine_capacity: data.vehicle.engine_capacity || c.engine_capacity,
        co2_emissions: data.vehicle.co2_emissions || c.co2_emissions,
        tax_status: data.vehicle.tax_status || c.tax_status,
        mot_status: data.vehicle.mot_status || c.mot_status,
      }));
    } else {
      setLookupMessage(data.message || "Lookup checked. Manual entry still works.");
      setForm((c) => ({ ...c, reg: data.reg || lookupReg.toUpperCase() }));
    }

    setLookupLoading(false);
  }

  async function uploadPhotos(files) {
    if (!files?.length) return;

    setUploading(true);

    const fd = new FormData();
    Array.from(files).forEach((file) => fd.append("photos", file));

    const res = await fetch("/api/vehicle-photos/upload", { method: "POST", body: fd });
    const data = await res.json();

    if (data.error) alert(data.error);
    else setImageUrls((current) => [...current, ...(data.urls || [])]);

    setUploading(false);
  }

  async function saveVehicle() {
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) return alert("Not logged in");

    const { data: profile } = await supabase
      .from("profiles")
      .select("dealership_id")
      .eq("id", auth.user.id)
      .single();

    if (!profile?.dealership_id) return alert("No dealership profile found");

    const tags = form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const verifiedFacts = { ...form, features: tags };

    const { error } = await supabase.from("vehicles").insert({
      dealership_id: profile.dealership_id,
      ...form,
      vrm: form.reg,
      image_urls: imageUrls,
      tags,
      features: tags,
      verified_facts: verifiedFacts,
      dvla_data: dvlaData,
      lookup_source: Object.keys(dvlaData || {}).length ? "dvla" : "manual",
      registration_lookup_status: Object.keys(dvlaData || {}).length ? "found" : "manual",
      status: "available",
    });

    if (error) return alert(error.message);

    router.push("/dashboard/vehicles");
  }

  const title = [form.year, form.make, form.model].filter(Boolean).join(" ") || "Vehicle preview";

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <Link href="/dashboard/vehicles" className="btn-secondary w-fit">
            <ArrowLeft size={18} className="mr-2" /> Back to vehicles
          </Link>

          <div className="dark-card p-8 md:p-10">
            <p className="text-acid font-black mb-4">Vehicle setup</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Add stock properly.</h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">
              Current package: {plan.name}. Reg lookup is {plan.regLookup ? "unlocked" : "locked"}.
            </p>
          </div>

          <section className="card p-7">
            <p className="badge mb-4">Registration lookup</p>
            <div className="grid md:grid-cols-[1fr_auto] gap-3">
              <input className="input uppercase" placeholder="Enter registration" value={lookupReg} onChange={(e) => setLookupReg(e.target.value)} />
              <button onClick={lookupVehicle} className="btn-acid" disabled={lookupLoading || !plan.regLookup}>
                {plan.regLookup ? <Search size={18} className="mr-2" /> : <Lock size={18} className="mr-2" />}
                {lookupLoading ? "Checking..." : plan.regLookup ? "Find vehicle" : "Pro feature"}
              </button>
            </div>
            {!plan.regLookup && (
              <p className="text-sm text-ink/50 mt-3">Starter users can still add vehicles manually. Reg lookup unlocks on Professional.</p>
            )}
            {lookupMessage && (
              <div className="rounded-3xl bg-white/75 border border-ink/10 p-4 mt-4 flex gap-3">
                <ShieldCheck className="shrink-0" />
                <p className="text-ink/60">{lookupMessage}</p>
              </div>
            )}
          </section>

          <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-5">
            <aside className="card overflow-hidden h-fit">
              <div className="h-72 bg-ink/8">
                {imageUrls[0] ? <img src={imageUrls[0]} className="h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center font-black text-ink/35">Main photo preview</div>}
              </div>
              <div className="p-6">
                <p className="text-xs font-black text-ink/40">{form.reg || "NO REG"}</p>
                <h2 className="text-3xl font-black mt-1">{title}</h2>
                <p className="text-ink/55 mt-2">{[form.fuel_type, form.transmission, form.mileage].filter(Boolean).join(" • ")}</p>
              </div>
            </aside>

            <section className="card p-7 md:p-9">
              <p className="badge mb-5">Photos</p>
              <label className="rounded-3xl border border-dashed border-ink/20 bg-white/60 p-7 flex flex-col items-center justify-center text-center cursor-pointer">
                <Camera size={34} />
                <p className="font-black mt-3">{uploading ? "Uploading..." : "Upload multiple vehicle photos"}</p>
                <p className="text-ink/50 text-sm mt-1">Use camera roll on phone or select files on desktop.</p>
                <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadPhotos(e.target.files)} />
              </label>

              {!!imageUrls.length && (
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {imageUrls.map((url) => (
                    <button key={url} onClick={() => setImageUrls((c) => c.filter((x) => x !== url))} type="button" className="relative group">
                      <img src={url} className="h-28 w-full object-cover rounded-2xl" />
                      <span className="absolute inset-0 rounded-2xl bg-black/45 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs font-black">Remove</span>
                    </button>
                  ))}
                </div>
              )}

              <p className="badge mt-8 mb-5">Vehicle details</p>
              <div className="grid md:grid-cols-3 gap-4">
                {[["make","Make"],["model","Model"],["year","Year"],["reg","Registration"],["price","Price"],["monthly_price","Monthly price"],["mileage","Mileage"],["fuel_type","Fuel type"],["transmission","Transmission"],["colour","Colour"],["engine_capacity","Engine CC"],["co2_emissions","CO2"],["tax_status","Tax status"],["mot_status","MOT status"]].map(([key,label]) => (
                  <input key={key} className="input" placeholder={label} value={form[key] || ""} onChange={(e) => update(key, e.target.value)} />
                ))}
                <input className="input md:col-span-3" placeholder="Features, comma separated" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
                <textarea className="input md:col-span-3 min-h-[150px]" placeholder="Description" value={form.description} onChange={(e) => update("description", e.target.value)} />
              </div>

              <button onClick={saveVehicle} className="btn-acid mt-6">
                <Save size={18} className="mr-2" /> Save vehicle
              </button>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
