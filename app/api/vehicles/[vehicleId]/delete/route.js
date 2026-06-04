import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request, { params }) {
  const supabase = createClient();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("dealership_id")
    .eq("id", auth.user.id)
    .single();

  if (!profile?.dealership_id) {
    return NextResponse.redirect(new URL("/dashboard/vehicles", request.url));
  }

  const { error } = await supabase
    .from("vehicles")
    .update({
      deleted_at: new Date().toISOString(),
      status: "deleted",
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.vehicleId)
    .eq("dealership_id", profile.dealership_id);

  if (error) {
    console.error("Delete vehicle failed:", error);
  }

  return NextResponse.redirect(new URL("/dashboard/vehicles", request.url));
}
