export const PAGE_TYPE_OPTIONS = {
  revisit: {
    id: "revisit",
    label: "Customer Revisit",
    description: "AI sales page for a customer already interested.",
  },
  enquiry: {
    id: "enquiry",
    label: "Enquiry Follow Up",
    description: "Simple page for a fresh enquiry.",
  },
  thank_you: {
    id: "thank_you",
    label: "Thank You",
    description: "Handover page after purchase.",
  },
};

export const WHO_FOR_OPTIONS = {
  themselves: { id: "themselves", label: "Themselves", description: "Direct to the person interested." },
  family: { id: "family", label: "Family", description: "Family life and daily use." },
  business: { id: "business", label: "Business use", description: "Professional and practical." },
  partner: { id: "partner", label: "Partner", description: "Shared decision and reassurance." },
  daughter: { id: "daughter", label: "Daughter", description: "First-car style reassurance." },
  son: { id: "son", label: "Son", description: "First-car style reassurance." },
};

export const PUSH_OPTIONS = {
  reassurance: { id: "reassurance", label: "Reassurance", description: "Build confidence.", recommendedStyle: "clean_light" },
  finance: { id: "finance", label: "Finance", description: "Monthly payment and budget.", recommendedStyle: "finance_focus" },
  family: { id: "family", label: "Family / Practicality", description: "Space, comfort and daily life.", recommendedStyle: "warm_family" },
  first_car: { id: "first_car", label: "First car", description: "Confidence and easy use.", recommendedStyle: "safe_light" },
  performance: { id: "performance", label: "Performance", description: "Driving feel and desire.", recommendedStyle: "dark_premium" },
  premium: { id: "premium", label: "Premium", description: "Private and high-end.", recommendedStyle: "luxury_dark" },
  executive: { id: "executive", label: "Executive", description: "Clean and professional.", recommendedStyle: "executive_minimal" },
  value: { id: "value", label: "Value", description: "Sensible purchase.", recommendedStyle: "clean_light" },
};

export const DESIGN_STYLES = {
  clean_light: { id: "clean_light", label: "Clean Light", description: "Simple and clear." },
  finance_focus: { id: "finance_focus", label: "Finance Focus", description: "Monthly figure first." },
  warm_family: { id: "warm_family", label: "Warm Family", description: "Warm and practical." },
  safe_light: { id: "safe_light", label: "Safe Light", description: "Calm first-car feel." },
  dark_premium: { id: "dark_premium", label: "Dark Premium", description: "Cinematic and bold." },
  executive_minimal: { id: "executive_minimal", label: "Executive Minimal", description: "Structured summary." },
  luxury_dark: { id: "luxury_dark", label: "Luxury Dark", description: "Private and refined." },
};

export function getPageType(id = "revisit") {
  return PAGE_TYPE_OPTIONS[id] || PAGE_TYPE_OPTIONS.revisit;
}

export function getWhoFor(id = "themselves") {
  return WHO_FOR_OPTIONS[id] || WHO_FOR_OPTIONS.themselves;
}

export function getPush(id = "reassurance") {
  return PUSH_OPTIONS[id] || PUSH_OPTIONS.reassurance;
}

export function getDesignStyle(id = "clean_light") {
  return DESIGN_STYLES[id] || DESIGN_STYLES.clean_light;
}

export function getRecommendedStyle(push = "reassurance") {
  return getPush(push).recommendedStyle || "clean_light";
}

export { computePublicMode, resolvePublicMode, mapPushToPublicMode } from "@/lib/pageMode";

export function makeDefaultGreeting(name = "") {
  const first = String(name || "").trim().split(" ")[0] || "there";
  return `Hello ${first},`;
}

export function makeDefaultSubtitle(vehicleTitle = "this vehicle") {
  return `I’ve put this page together so you can quickly revisit the key details on ${vehicleTitle}.`;
}

// legacy compatibility
export const CUSTOMER_TYPES = {
  undecided: "Undecided buyer",
  family: "Family buyer",
  commuter: "Commuter",
  firstcar: "First car buyer",
  business: "Business user",
  performance: "Performance buyer",
  premium: "Premium buyer",
};

export const BUYING_FOR = Object.fromEntries(Object.values(WHO_FOR_OPTIONS).map((item) => [item.id, item.label]));
export const PUSH_ANGLES = Object.fromEntries(Object.values(PUSH_OPTIONS).map((item) => [item.id, item.label]));
export const PAGE_STYLES = Object.fromEntries(Object.values(DESIGN_STYLES).map((item) => [item.id, { ...item, name: item.label }]));

export function getCustomerType(id = "undecided") {
  return CUSTOMER_TYPES[id] || CUSTOMER_TYPES.undecided;
}

export function getBuyingFor(id = "themselves") {
  return getWhoFor(id).label;
}

export function getPushAngle(id = "reassurance") {
  return getPush(id).label;
}

export function getPageStyle(id = "clean_light") {
  const style = getDesignStyle(id);
  return { id: style.id, name: style.label, description: style.description };
}
