"use client";

import { DESIGN_STYLES, PUSH_ANGLES, WHO_FOR_OPTIONS } from "@/lib/pageJourney";
import { Save } from "lucide-react";

function reasonsFromPage(page) {
  const micro = page.ai_microcopy || page.ai_sections || {};
  return micro.topReasons || micro.quickCards || page.ai_short_cards || [];
}

export default function PageEditorClient({ page }) {
  const micro = page.ai_microcopy || page.ai_sections || {};
  const reasons = reasonsFromPage(page);

  return (
    <form action={`/api/customer-pages/${page.id}/update`} method="POST" className="card p-7 space-y-5">
      <input type="hidden" name="page_type" value={page.page_type || "revisit"} />

      <div>
        <p className="badge mb-3">Edit page</p>
        <h1 className="text-4xl font-black">Update customer page</h1>
        <p className="text-ink/50 mt-2">Adjust who-for, push, design style and AI wording.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <select name="design_style" defaultValue={page.design_style || page.page_style || "clean_light"} className="input">
          {Object.values(DESIGN_STYLES).map((style) => (
            <option key={style.id} value={style.id}>
              Style: {style.label}
            </option>
          ))}
        </select>
        <select name="push_angle" defaultValue={page.push_angle || page.page_goal || "reassurance"} className="input">
          {Object.entries(PUSH_ANGLES).map(([key, label]) => (
            <option key={key} value={key}>
              Push: {label}
            </option>
          ))}
        </select>
        <select name="who_for" defaultValue={page.who_for || page.buying_for || "themselves"} className="input">
          {Object.values(WHO_FOR_OPTIONS).map((option) => (
            <option key={option.id} value={option.id}>
              Who for: {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        <input name="greeting" defaultValue={micro.greeting || page.title || ""} className="input" placeholder="Greeting" />
        <input
          name="heroSubtitle"
          defaultValue={micro.heroSubtitle || micro.subline || page.intro_message || ""}
          className="input"
          placeholder="Subtitle"
        />
        <input
          name="heroTitle"
          defaultValue={micro.heroTitle || micro.headline || page.ai_headline || ""}
          className="input"
          placeholder="Headline"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-3xl bg-white/70 border border-ink/10 p-4">
            <p className="font-black mb-3">Top reason {i + 1}</p>
            <input name={`reason${i + 1}Title`} defaultValue={reasons[i]?.title || ""} className="input mb-3" placeholder="Title" />
            <input name={`reason${i + 1}Text`} defaultValue={reasons[i]?.text || ""} className="input" placeholder="Text" />
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white/70 border border-ink/10 p-4">
          <input
            name="whyThisVehicleTitle"
            defaultValue={micro.whyThisVehicleTitle || micro.fitTitle || ""}
            className="input mb-3"
            placeholder="Why this vehicle — title"
          />
          <textarea
            name="whyThisVehicleText"
            defaultValue={micro.whyThisVehicleText || micro.fitText || ""}
            className="input min-h-[120px]"
            placeholder="Why this vehicle — text"
          />
        </div>
        <div className="rounded-3xl bg-white/70 border border-ink/10 p-4">
          <input
            name="ownershipTitle"
            defaultValue={micro.ownershipTitle || micro.moneyTitle || ""}
            className="input mb-3"
            placeholder="Ownership section — title"
          />
          <textarea
            name="ownershipText"
            defaultValue={micro.ownershipText || micro.moneyText || ""}
            className="input min-h-[120px]"
            placeholder="Ownership section — text"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-3xl bg-white/70 border border-ink/10 p-4">
          <input name="reassuranceTitle" defaultValue={micro.reassuranceTitle || ""} className="input mb-3" placeholder="Reassurance — title" />
          <textarea name="reassuranceText" defaultValue={micro.reassuranceText || ""} className="input min-h-[100px]" placeholder="Reassurance — text" />
        </div>
        <div className="rounded-3xl bg-white/70 border border-ink/10 p-4 space-y-3">
          <input name="question1" defaultValue={(micro.questions || [])[0] || ""} className="input" placeholder="Question 1" />
          <input name="question2" defaultValue={(micro.questions || [])[1] || ""} className="input" placeholder="Question 2" />
          <input name="question3" defaultValue={(micro.questions || [])[2] || ""} className="input" placeholder="Question 3" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <input name="primaryCta" defaultValue={micro.primaryCta || page.ai_cta || "Message us"} className="input" placeholder="Primary CTA" />
        <input name="secondaryCta" defaultValue={micro.secondaryCta || "Book a viewing"} className="input" placeholder="Secondary CTA" />
      </div>

      <button className="btn-acid" type="submit">
        <Save size={18} className="mr-2" /> Save changes
      </button>
    </form>
  );
}
