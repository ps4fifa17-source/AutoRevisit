import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/admin";

export async function POST(request) {
  const supabase = createClient();
  const { isAdmin, user } = await getAdminContext(supabase);

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const form = await request.formData();
  const testPlan = form.get("test_plan") || null;

  await supabase
    .from("profiles")
    .update({ test_plan: testPlan === "clear" ? null : testPlan })
    .eq("id", user.id);

  return NextResponse.redirect(new URL("/dashboard/admin", request.url));
}
