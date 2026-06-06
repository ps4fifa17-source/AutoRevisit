import { createClient } from "@/lib/supabase/server";
import PageModeRenderer from "@/components/public-pages/PageModeRenderer";
import { getPlan } from "@/lib/plans";
import { fallbackSalesCopy, cleanVehicleFacts, vehicleTitleFromFacts } from "@/lib/aiPageBrain";
import { resolvePublicMode } from "@/lib/pageMode";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

  let { data: page } = await supabase
    .from("customer_pages")
    .select("*, customers(*)")
    .eq("slug", params.pageSlug)
    .eq("dealership_id", dealer.id)
    .in("status", ["live", "active", "published"])
    .is("deleted_at", null)
    .maybeSingle();

  // Fallback for older rows where status was saved differently or left blank.
  // RLS still controls what can be read publicly.
  if (!page) {
    const fallback = await supabase
      .from("customer_pages")
      .select("*, customers(*)")
      .eq("slug", params.pageSlug)
      .eq("dealership_id", dealer.id)
      .is("deleted_at", null)
      .maybeSingle();

    page = fallback.data;
  }

  if (!page) {
    return (
      <main className="min-h-screen p-6 flex items-center justify-center bg-[#fffdf8] text-[#111315]">
        <div className="max-w-md rounded-[32px] border border-black/10 bg-white/80 p-7 shadow-xl">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-black/35">AutoRevisit</p>
          <h1 className="text-3xl font-black mt-3">Page not found</h1>
          <p className="text-black/55 mt-2">This customer page may have been deleted, paused or the link may be incorrect.</p>
        </div>
      </main>
    );
  }

  const { data: pageVehicles } = await supabase
    .from("customer_page_vehicles")
    .select("*, vehicles(*)")
    .eq("customer_page_id", page.id)
    .order("display_order", { ascending: true });

  const vehicle = pageVehicles?.[0]?.vehicles || {};
  const mode = resolvePublicMode(page);

  const plan = getPlan(dealer.plan_name || "starter");
  const planKey = String(dealer.plan_name || dealer.plan || "").toLowerCase();

  const showWatermark =
    planKey !== "premium" &&
    planKey !== "enterprise" &&
    !dealer.remove_branding;

  const publicUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/p/${params.dealerSlug}/${params.pageSlug}`;
  const vehicleFacts = cleanVehicleFacts(vehicle);
  const dealerPhone = (dealer.whatsapp || dealer.phone || "").replace(/[^0-9]/g, "");

  const fallbackMsg = `Hi, thanks for taking another look at the ${vehicleTitleFromFacts(vehicleFacts)}. Here is the page again: ${publicUrl}`;
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
