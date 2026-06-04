"use client";

import { useState } from "react";

export default function CopyLinkButton({ value, label = "Copy link" }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" onClick={copy} className="btn-secondary">
      {copied ? "Copied" : label}
    </button>
  );
}
