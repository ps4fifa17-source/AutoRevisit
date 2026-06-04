"use client";

export default function TrackActionLink({
  pageId,
  eventType,
  href,
  className = "",
  children,
  metadata = {},
  target,
  rel,
}) {
  async function track() {
    if (!pageId || !eventType) return;

    let visitorId = "";

    try {
      visitorId = localStorage.getItem("autorevisit_visitor_id") || "";
    } catch {}

    try {
      await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          customer_page_id: pageId,
          event_type: eventType,
          visitor_id: visitorId,
          metadata: {
            href,
            ...metadata,
          },
        }),
      });
    } catch {}
  }

  return (
    <a href={href} target={target} rel={rel} className={className} onClick={track}>
      {children}
    </a>
  );
}
