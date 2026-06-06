export function normaliseSiteUrl(value, fallback = "") {
  const raw = String(value || fallback || "").trim().replace(/\/$/, "");

  if (!raw) return "";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  if (raw.startsWith("localhost") || raw.startsWith("127.0.0.1")) return `http://${raw}`;

  return `https://${raw}`;
}

export function getBrowserSiteUrl() {
  const fallback = typeof window !== "undefined" ? window.location.origin : "";
  return normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, fallback);
}

export function getServerSiteUrl() {
  return normaliseSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, "http://localhost:3000");
}

export function buildPublicPageUrl({ dealerSlug, pageSlug, baseUrl }) {
  return `${normaliseSiteUrl(baseUrl, getServerSiteUrl())}/p/${dealerSlug}/${pageSlug}`;
}

export function buildThankYouPageUrl({ dealerSlug, pageSlug, baseUrl }) {
  return `${normaliseSiteUrl(baseUrl, getServerSiteUrl())}/t/${dealerSlug}/${pageSlug}`;
}
