"use client";

import { getWhoFor, getPush, getDesignStyle, getPageType } from "@/lib/pageJourney";
import { Sparkles, UserRound, Target, Palette, WalletCards, FileText, StickyNote } from "lucide-react";

export default function JourneyBuilderPreview({ form, selectedVehicle, dealerName }) {
  const pageType = getPageType(form.page_type);
  const who = getWhoFor(form.who_for);
  const push = getPush(form.push_angle);
  const style = getDesignStyle(form.design_style);

  const isRevisit = form.page_type === "revisit";
  const isEnquiry = form.page_type === "enquiry";
  const isThankYou = form.page_type === "thank_you";

  return (
    <div className="card p-7 sticky top-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-3xl bg-acid flex items-center justify-center">
          <Sparkles size={20} />
        </div>
        <div>
          <p className="badge mb-1">Page brain</p>
          <h2 className="text-3xl font-black">What gets created</h2>
        </div>
      </div>

      <div className="grid gap-3 mt-6">
        <Row icon={FileText} label="Page type" value={pageType.label} description={pageType.description} />

        {isRevisit && (
          <>
            <Row icon={UserRound} label="Audience" value={who.label} description={who.description} />
            <Row icon={Target} label="Push" value={push.label} description={push.description} />
            <Row icon={Palette} label="Style" value={style.label} description={style.description} />
          </>
        )}

        {isEnquiry && (
          <Row
            icon={Target}
            label="Purpose"
            value="Fresh enquiry response"
            description="A simple page with the vehicle, key details and contact actions."
          />
        )}

        {isThankYou && (
          <Row
            icon={Target}
            label="Purpose"
            value="Post-handover page"
            description="A branded thank-you page with review and aftercare links."
          />
        )}

        {(form.finance_monthly || form.finance_deposit || form.finance_term || form.finance_apr) && !isThankYou && (
          <Row
            icon={WalletCards}
            label="Finance"
            value={form.finance_monthly ? `${form.finance_monthly} per month` : "Finance details added"}
            description={[
              form.finance_deposit && `Deposit ${form.finance_deposit}`,
              form.finance_term && `${form.finance_term} months`,
              form.finance_apr && `${form.finance_apr}% APR`,
            ].filter(Boolean).join(" · ")}
          />
        )}

        {form.dealer_notes && !isThankYou && (
          <Row icon={StickyNote} label="Your words" value="Shapes the AI page" description={form.dealer_notes.slice(0, 90)} />
        )}
      </div>

      <div className="rounded-[32px] bg-ink text-white p-5 mt-6 overflow-hidden">
        <p className="text-white/45 text-xs font-black">{dealerName || "Dealer"} will send:</p>
        <h3 className="text-3xl font-black mt-4 leading-tight">
          {isThankYou ? "Thank you page" : `Hello ${form.customer_name || "Jack"},`}
        </h3>
        <p className="text-white/62 mt-3">
          {isRevisit && `A personalised revisit page for the ${selectedVehicle || "selected vehicle"}.`}
          {isEnquiry && `A simple enquiry follow-up page for the ${selectedVehicle || "selected vehicle"}.`}
          {isThankYou && `A handover-style thank-you page.`}
        </p>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value, description }) {
  return (
    <div className="rounded-3xl bg-white/70 border border-ink/10 p-4 flex gap-3">
      <div className="h-10 w-10 rounded-2xl bg-acid/55 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.12em] font-black text-ink/35">{label}</p>
        <p className="font-black mt-1">{value}</p>
        <p className="text-sm text-ink/50 mt-1">{description}</p>
      </div>
    </div>
  );
}
