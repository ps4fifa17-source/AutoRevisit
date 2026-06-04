"use client";

import { useEffect } from "react";

function getVisitorId() {
  const key = "autorevisit_visitor_id";
  let value = localStorage.getItem(key);

  if (!value) {
    value = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(key, value);
  }

  return value;
}

export default function TrackView({ pageId }) {
  useEffect(() => {
    if (!pageId) return;

    const startedAt = Date.now();
    const visitorId = getVisitorId();

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        customer_page_id: pageId,
        event_type: "view",
        visitor_id: visitorId,
        metadata: {
          path: window.location.pathname,
          user_agent: navigator.userAgent,
          referrer: document.referrer || "",
        },
      }),
    });

    function sendTimeOnPage() {
      const seconds = Math.round((Date.now() - startedAt) / 1000);
      if (seconds < 3) return;

      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        keepalive: true,
        body: JSON.stringify({
          customer_page_id: pageId,
          event_type: "time_on_page",
          visitor_id: visitorId,
          metadata: { seconds },
        }),
      });
    }

    window.addEventListener("beforeunload", sendTimeOnPage);

    return () => {
      window.removeEventListener("beforeunload", sendTimeOnPage);
      sendTimeOnPage();
    };
  }, [pageId]);

  return null;
}
