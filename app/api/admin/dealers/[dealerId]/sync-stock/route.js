import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminContext } from "@/lib/admin";
import { importDealerKitStock } from "@/lib/importers/dealerkitImporter";

export async function POST(request, { params }) {
  const supabase = createClient();
  const { isAdmin } = await getAdminContext(supabase);

  if (!isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  const { data: dealer, error: dealerError } = await supabase
    .from("dealerships")
    .select("*")
    .eq("id", params.dealerId)
    .single();

  if (dealerError || !dealer) {
    return NextResponse.redirect(new URL("/dashboard/admin/dealers?error=Dealer%20not%20found", request.url));
  }

  try {
    if (!dealer.stock_feed_url) throw new Error("No stock feed URL has been added for this dealer.");

    if ((dealer.stock_feed_type || "manual") !== "dealerkit") {
      throw new Error("Only DealerKit sync is enabled in this first version.");
    }

    const result = await importDealerKitStock({
      supabase,
      feedUrl: dealer.stock_feed_url,
      dealershipId: dealer.id,
    });

    return NextResponse.redirect(new URL(`/dashboard/admin/dealers?synced=1&message=${encodeURIComponent(result.message)}`, request.url));
  } catch (error) {
    const message = error?.message || "Stock sync failed.";

    await supabase
      .from("dealerships")
      .update({
        last_stock_sync_at: new Date().toISOString(),
        last_stock_sync_status: "failed",
        last_stock_sync_message: message,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dealer.id);

    console.error("Admin stock sync failed:", error);
    return NextResponse.redirect(new URL(`/dashboard/admin/dealers?error=${encodeURIComponent(message)}`, request.url));
  }
}
