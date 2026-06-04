import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function commaList(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function jsonList(value) {
  try {
    const parsed = JSON.parse(String(value || "[]"));
    return Array.isArray(parsed) ? parsed.filter(Boolean) : [];
  } catch {
    return [];
  }
}

export async function POST(request, { params }) {
  const supabase = createClient();
  const form = await request.formData();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: profile } = await supabase
    .from("profiles")
    .select("dealership_id")
    .eq("id", auth.user.id)
    .single();

  if (!profile?.dealership_id) {
    return NextResponse.redirect(new URL("/dashboard/vehicles", request.url));
  }

  const tags = commaList(form.get("tags"));
  const imageUrls = jsonList(form.get("image_urls_json"));

  const vehicleUpdate = {
    make: form.get("make"),
    model: form.get("model"),
    year: form.get("year"),
    reg: form.get("reg"),
    vrm: form.get("reg"),
    price: form.get("price"),
    monthly_price: form.get("monthly_price"),
    mileage: form.get("mileage"),
    fuel_type: form.get("fuel_type"),
    transmission: form.get("transmission"),
    colour: form.get("colour"),
    engine_capacity: form.get("engine_capacity"),
    co2_emissions: form.get("co2_emissions"),
    tax_status: form.get("tax_status"),
    mot_status: form.get("mot_status"),
    description: form.get("description"),
    image_urls: imageUrls,
    tags,
    features: tags,
    verified_facts: {
      make: form.get("make"),
      model: form.get("model"),
      year: form.get("year"),
      reg: form.get("reg"),
      price: form.get("price"),
      monthly_price: form.get("monthly_price"),
      mileage: form.get("mileage"),
      fuel_type: form.get("fuel_type"),
      transmission: form.get("transmission"),
      colour: form.get("colour"),
      engine_capacity: form.get("engine_capacity"),
      co2_emissions: form.get("co2_emissions"),
      tax_status: form.get("tax_status"),
      mot_status: form.get("mot_status"),
      features: tags,
    },
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("vehicles")
    .update(vehicleUpdate)
    .eq("id", params.vehicleId)
    .eq("dealership_id", profile.dealership_id);

  if (error) {
    console.error("Update vehicle failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/dashboard/vehicles", request.url));
}
