import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
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
    return NextResponse.redirect(new URL("/dashboard/settings", request.url));
  }

  const { error } = await supabase
    .from("dealerships")
    .update({
      name: form.get("name"),
      phone: form.get("phone"),
      email: form.get("email"),
      whatsapp: form.get("whatsapp"),
      website: form.get("website"),
      stock_source_url: form.get("stock_source_url"),
      logo_url: form.get("logo_url"),
      primary_color: form.get("primary_color"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", profile.dealership_id);

  if (error) {
    console.error("Settings update failed:", error);
  }

  return NextResponse.redirect(new URL("/dashboard/settings", request.url));
}
