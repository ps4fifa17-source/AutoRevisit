import { getPlan, normalisePlan } from "@/lib/plans";

export function isAdminProfile(profile) {
  return profile?.role === "admin";
}

export function getEffectivePlanName(dealer, profile) {
  if (isAdminProfile(profile) && profile?.test_plan) {
    return normalisePlan(profile.test_plan);
  }

  return normalisePlan(dealer?.plan_name || "starter");
}

export function getEffectivePlan(dealer, profile) {
  return getPlan(getEffectivePlanName(dealer, profile));
}

export function shouldShowWatermark(dealer, profile) {
  const plan = getEffectivePlan(dealer, profile);

  // Starter and Professional always show the AutoRevisit watermark.
  // Premium is the only plan where branding is removed.
  return !plan.removeBranding;
}

export async function countLivePages(supabase, dealershipId) {
  const { count, error } = await supabase
    .from("customer_pages")
    .select("*", { count: "exact", head: true })
    .eq("dealership_id", dealershipId)
    .eq("status", "live")
    .is("deleted_at", null);

  if (error) return 0;
  return count || 0;
}

export async function canCreateLivePage(supabase, dealershipId, plan) {
  if (plan.livePagesLimit === Infinity) {
    return { allowed: true, used: 0, limit: Infinity };
  }

  const used = await countLivePages(supabase, dealershipId);

  return {
    allowed: used < plan.livePagesLimit,
    used,
    limit: plan.livePagesLimit,
  };
}
