import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const supabase = createClient();
    const body = await request.json();

    if (!body.customer_page_id || !body.event_type) {
      return NextResponse.json({ error: "Missing event details" }, { status: 400 });
    }

    const { error } = await supabase.from("page_events").insert({
      customer_page_id: body.customer_page_id,
      event_type: String(body.event_type).trim().toLowerCase(),
      visitor_id: body.visitor_id || null,
      metadata: body.metadata || {},
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
