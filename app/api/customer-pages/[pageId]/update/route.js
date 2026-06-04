import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { computePublicMode } from "@/lib/pageMode";

function buildTopReasons(form) {
  return [1, 2, 3]
    .map((i) => ({
      title: String(form.get(`reason${i}Title`) || "").trim(),
      text: String(form.get(`reason${i}Text`) || "").trim(),
    }))
    .filter((item) => item.title || item.text);
}

export async function POST(request, { params }) {
  const supabase = createClient();
  const form = await request.formData();

  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return NextResponse.redirect(new URL("/login", request.url));

  const { data: profile } = await supabase.from("profiles").select("dealership_id").eq("id", auth.user.id).single();
  if (!profile?.dealership_id) return NextResponse.redirect(new URL("/dashboard/live-pages", request.url));

  const pageType = String(form.get("page_type") || "revisit");
  const pushAngle = String(form.get("push_angle") || "reassurance");
  const designStyle = String(form.get("design_style") || "clean_light");
  const whoFor = String(form.get("who_for") || "themselves");
  const greeting = String(form.get("greeting") || "");
  const heroSubtitle = String(form.get("heroSubtitle") || "");
  const heroTitle = String(form.get("heroTitle") || "");
  const topReasons = buildTopReasons(form);

  const questions = [form.get("question1"), form.get("question2"), form.get("question3")]
    .map((q) => String(q || "").trim())
    .filter(Boolean);

  const publicMode = computePublicMode({ pageType, pushAngle, designStyle });

  const ai_microcopy = {
    greeting,
    subline: heroSubtitle,
    heroSubtitle,
    heroTitle,
    topReasons,
    whyThisVehicleTitle: String(form.get("whyThisVehicleTitle") || ""),
    whyThisVehicleText: String(form.get("whyThisVehicleText") || ""),
    ownershipTitle: String(form.get("ownershipTitle") || ""),
    ownershipText: String(form.get("ownershipText") || ""),
    reassuranceTitle: String(form.get("reassuranceTitle") || ""),
    reassuranceText: String(form.get("reassuranceText") || ""),
    questions,
    primaryCta: String(form.get("primaryCta") || "Message us"),
    secondaryCta: String(form.get("secondaryCta") || "Book a viewing"),
    quickCards: topReasons,
    fitTitle: String(form.get("whyThisVehicleTitle") || ""),
    fitText: String(form.get("whyThisVehicleText") || ""),
    moneyTitle: String(form.get("ownershipTitle") || ""),
    moneyText: String(form.get("ownershipText") || ""),
  };

  await supabase
    .from("customer_pages")
    .update({
      title: greeting,
      intro_message: heroSubtitle,
      ai_headline: heroTitle,
      page_mood: publicMode,
      customer_goal: publicMode,
      design_style: designStyle,
      push_angle: pushAngle,
      page_goal: pushAngle,
      who_for: whoFor,
      buying_for: whoFor,
      target_customer: whoFor,
      ai_cta: ai_microcopy.primaryCta,
      ai_microcopy,
      ai_sections: { ...ai_microcopy, push_angle: pushAngle, design_style: designStyle, who_for: whoFor },
      ai_short_cards: topReasons,
      ai_selling_points: topReasons.map((card) => `${card.title}: ${card.text}`),
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.pageId)
    .eq("dealership_id", profile.dealership_id);

  return NextResponse.redirect(new URL("/dashboard/live-pages", request.url));
}
