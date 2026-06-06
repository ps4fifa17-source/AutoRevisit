export function cleanBaseUrl(value) {
  return String(value || "").replace(/\/$/, "");
}

export function getServerSiteUrl() {
  return cleanBaseUrl(process.env.NEXT_PUBLIC_SITE_URL || "https://www.autorevisit.com");
}

export function getBrowserSiteUrl() {
  if (typeof window !== "undefined" && window.location?.origin) {
    return cleanBaseUrl(window.location.origin);
  }

  return getServerSiteUrl();
}

export function buildPublicPageUrl({ dealerSlug, pageSlug, baseUrl }) {
  const site = cleanBaseUrl(baseUrl || getServerSiteUrl());
  return `${site}/p/${dealerSlug}/${pageSlug}`;
}

export function buildThankYouPageUrl({ dealerSlug, pageSlug, baseUrl }) {
  const site = cleanBaseUrl(baseUrl || getServerSiteUrl());
  return `${site}/t/${dealerSlug}/${pageSlug}`;
}