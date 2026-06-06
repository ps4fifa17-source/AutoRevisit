import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/admin";

export async function POST(request, { params }) {
  const supabase = createClient();
  const { isAdmin, user } = await getAdminContext(supabase);

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const form = await request.formData();
  const approvalStatus = form.get("approval_status") || "approved";
  const feedType = form.get("stock_feed_type") || "manual";
  const feedUrl = String(form.get("stock_feed_url") || "").trim();

  const { error } = await supabase
    .from("dealerships")
    .update({
      plan_name: form.get("plan_name"),
      subscription_status: form.get("subscription_status"),
      approval_status: approvalStatus,
      admin_notes: form.get("admin_notes"),
      stock_feed_type: feedType,
      stock_feed_url: feedUrl || null,
      approved_at: approvalStatus === "approved" ? new Date().toISOString() : null,
      approved_by: approvalStatus === "approved" ? user.id : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.dealerId);

  if (error) {
    console.error("Admin dealer update failed:", error);
    return NextResponse.redirect(new URL(`/dashboard/admin/dealers?error=${encodeURIComponent(error.message)}`, request.url));
  }

  return NextResponse.redirect(new URL("/dashboard/admin/dealers?saved=1", request.url));
}
