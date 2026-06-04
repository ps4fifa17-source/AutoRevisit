/**
 * Single source of truth for public page mode (layout component key).
 * Stored on customer_pages.page_mood at create/update time.
 */

export const PUBLIC_MODES = [
  "simple",
  "finance",
  "family",
  "firstcar",
  "performance",
  "executive",
  "premium",
  "value",
  "enquiry",
];

export function computePublicMode({ pageType, pushAngle, designStyle } = {}) {
  if (pageType === "enquiry") return "enquiry";

  const style = String(designStyle || "").toLowerCase();
  const push = String(pushAngle || "reassurance").toLowerCase().replace("-", "_");

  if (style === "dark_premium") return "performance";
  if (style === "luxury_dark") return "premium";
  if (style === "executive_minimal") return "executive";
  if (style === "warm_family") return "family";
  if (style === "safe_light") return "firstcar";
  if (style === "finance_focus") return "finance";

  if (push === "finance") return "finance";
  if (push === "family") return "family";
  if (push === "first_car") return "firstcar";
  if (push === "performance") return "performance";
  if (push === "premium") return "premium";
  if (push === "executive") return "executive";
  if (push === "value") return "value";

  return "simple";
}

/** Resolve mode from a stored page row (prefers canonical page_mood). */
export function resolvePublicMode(page = {}) {
  if (page?.page_type === "enquiry") return "enquiry";

  const mood = String(page?.page_mood || "").toLowerCase();
  if (PUBLIC_MODES.includes(mood)) return mood;

  return computePublicMode({
    pageType: page?.page_type,
    pushAngle: page?.push_angle,
    designStyle: page?.design_style,
  });
}

/** @deprecated Use computePublicMode — kept for existing imports */
export function mapPushToPublicMode(pushAngle = "reassurance", designStyle = "") {
  return computePublicMode({ pushAngle, designStyle });
}
