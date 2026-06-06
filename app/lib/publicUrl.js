export function getServerSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.autorevisit.com").replace(/\/$/, "");
}

export function buildPublicPageUrl({ dealerSlug, pageSlug, baseUrl }) {
  const site = (baseUrl || getServerSiteUrl()).replace(/\/$/, "");
  return `${site}/p/${dealerSlug}/${pageSlug}`;
}

export function buildThankYouPageUrl({ dealerSlug, pageSlug, baseUrl }) {
  const site = (baseUrl || getServerSiteUrl()).replace(/\/$/, "");
  return `${site}/t/${dealerSlug}/${pageSlug}`;
}