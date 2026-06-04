import { createClient } from "@/lib/supabase/server";
import PageModeRenderer from "@/components/public-pages/PageModeRenderer";
import { getPlan } from "@/lib/plans";
import { fallbackSalesCopy, cleanVehicleFacts, vehicleTitleFromFacts } from "@/lib/aiPageBrain";
import { resolvePublicMode } from "@/lib/pageMode";

function customerFirst(page) {
  const raw = page?.customers?.first_name || page?.customer_name || "";
  return raw.trim().split(" ")[0] || "there";
}

function buildCopy(page, vehicle, mode) {
  const facts = cleanVehicleFacts(vehicle || {});
  const fallback = fallbackSalesCopy({
    customerName: customerFirst(page),
    pushAngle: page?.push_angle || mode,
    vehicleFacts: facts,
    pageUrl: "[LINK]",
    pageType: page?.page_type || "revisit",
  });

  const ai = page?.ai_microcopy || page?.ai_sections || {};
  const topReasons = ai.topReasons || ai.quickCards || page?.ai_short_cards || fallback.topReasons;

  return {
    ...fallback,
    ...ai,
    greeting: ai.greeting || page?.title || fallback.greeting,
    heroTitle: ai.heroTitle || ai.headline || page?.ai_headline || fallback.heroTitle,
    heroSubtitle: ai.heroSubtitle || ai.subline || page?.intro_message || fallback.heroSubtitle,
    whyThisVehicleTitle: ai.whyThisVehicleTitle || ai.fitTitle || fallback.whyThisVehicleTitle,
    whyThisVehicleText: ai.whyThisVehicleText || ai.fitText || fallback.whyThisVehicleText,
    topReasons,
    ownershipTitle: ai.ownershipTitle || ai.moneyTitle || fallback.ownershipTitle,
    ownershipText: ai.ownershipText || ai.moneyText || fallback.ownershipText,
    reassuranceTitle: ai.reassuranceTitle || fallback.reassuranceTitle,
    reassuranceText: ai.reassuranceText || fallback.reassuranceText,
    questions: ai.questions || fallback.questions,
    primaryCta: ai.primaryCta || page?.ai_cta || fallback.primaryCta,
    secondaryCta: ai.secondaryCta || fallback.secondaryCta,
    whatsappMessage: page?.whatsapp_message || ai.whatsappMessage || fallback.whatsappMessage,
    customerFirst: customerFirst(page),
    hello: ai.greeting || page?.title || fallback.greeting,
    headline: ai.heroTitle || ai.headline || fallback.heroTitle,
    intro: ai.heroSubtitle || ai.subline || fallback.heroSubtitle,
    reasons: topReasons,
    vehicleTitle: vehicleTitleFromFacts(facts),
  };
}

export default async function PublicCustomerPage({ params }) {
  const supabase = createClient();

  const { data: dealer } = await supabase
    .from("dealerships")
    .select("*")
    .eq("slug", params.dealerSlug)
    .single();

  if (!dealer) return <main className="min-h-screen p-6">Dealer not found</main>;

  const { data: page } = await supabase
    .from("customer_pages")
    .select("*, customers(*)")
    .eq("slug", params.pageSlug)
    .eq("dealership_id", dealer.id)
    .single();

  if (!page) return <main className="min-h-screen p-6">Page not found</main>;

  const { data: pageVehicles } = await supabase
    .from("customer_page_vehicles")
    .select("*, vehicles(*)")
    .eq("customer_page_id", page.id)
    .order("display_order", { ascending: true });

  const vehicle = pageVehicles?.[0]?.vehicles || {};
  const mode = resolvePublicMode(page);

  const plan = getPlan(dealer.plan_name || "starter");
  const showWatermark = plan.watermarkForced || page.watermark_forced || !dealer.remove_branding;

  const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/p/${params.dealerSlug}/${params.pageSlug}`;
  const vehicleFacts = cleanVehicleFacts(vehicle);
  const dealerPhone = (dealer.whatsapp || dealer.phone || "").replace(/[^0-9]/g, "");

  const fallbackMsg = `Hi, I’ve had a look at the ${vehicleTitleFromFacts(vehicleFacts)} page: ${publicUrl}`;
  const whatsappUrl = dealerPhone
    ? `https://wa.me/${dealerPhone}?text=${encodeURIComponent(page.whatsapp_message || fallbackMsg)}`
    : "#";

  return (
    <PageModeRenderer
      mode={mode}
      dealer={dealer}
      page={page}
      vehicle={vehicle}
      copy={buildCopy(page, vehicle, mode)}
      whatsappUrl={whatsappUrl}
      showWatermark={showWatermark}
    />
  );
}
