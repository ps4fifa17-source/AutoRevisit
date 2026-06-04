"use client";

import TrackActionLink from "@/components/TrackActionLink";

export default function TrackableCTA({ pageId, eventType, href, children, className = "", style = {}, target, rel }) {
  return (
    <TrackActionLink
      pageId={pageId}
      eventType={eventType}
      href={href}
      className={className}
      style={style}
      target={target}
      rel={rel}
    >
      {children}
    </TrackActionLink>
  );
}
