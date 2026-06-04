import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/slug";
import { getEffectivePlan, canCreateLivePage } from "@/lib/planAccess";

export async function POST(request, { params }) {
  const supabase = createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: profile } = await supabase
    .from("profiles")
    .select("dealership_id, role, test_plan")
    .eq("id", auth.user.id)
    .single();

  if (!profile?.dealership_id) {
    return NextResponse.redirect(new URL("/dashboard/live-pages", request.url));
  }

  const { data: dealer } = await supabase
    .from("dealerships")
    .select("plan_name")
    .eq("id", profile.dealership_id)
    .single();

  const plan = getEffectivePlan(dealer, profile);
  const limitCheck = await canCreateLivePage(supabase, profile.dealership_id, plan);

  if (!limitCheck.allowed) {
    return NextResponse.redirect(new URL("/dashboard/live-pages?error=page_limit", request.url));
  }

  const { data: original } = await supabase
    .from("customer_pages")
    .select("*")
    .eq("id", params.pageId)
    .eq("dealership_id", profile.dealership_id)
    .single();

  if (!original) {
    return NextResponse.redirect(new URL("/dashboard/live-pages", request.url));
  }

  const { data: links } = await supabase
    .from("customer_page_vehicles")
    .select("*")
    .eq("customer_page_id", original.id)
    .order("display_order", { ascending: true });

  const copy = { ...original };
  delete copy.id;
  delete copy.created_at;
  delete copy.updated_at;
  delete copy.deleted_at;

  copy.slug = `${slugify(original.title || "page")}-copy-${Date.now().toString().slice(-5)}`;
  copy.status = "live";
  copy.title = original.title?.includes("Copy") ? original.title : `${original.title || "Customer page"} Copy`;

  const { data: duplicated, error } = await supabase
    .from("customer_pages")
    .insert(copy)
    .select()
    .single();

  if (!error && duplicated?.id && links?.length) {
    await supabase.from("customer_page_vehicles").insert(
      links.map((link) => ({
        customer_page_id: duplicated.id,
        vehicle_id: link.vehicle_id,
        display_order: link.display_order || 0,
      }))
    );
  }

  return NextResponse.redirect(new URL("/dashboard/live-pages", request.url));
}
