"use client";

import { DESIGN_STYLES } from "@/lib/pageJourney";
import { CheckCircle, Sparkles } from "lucide-react";

export default function PageStylePreview({ value, onChange, recommendedStyle, dealerName = "Dealer", vehicleTitle = "Vehicle" }) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {Object.values(DESIGN_STYLES).map((style) => {
        const active = value === style.id;
        const recommended = recommendedStyle === style.id;

        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={`text-left rounded-[30px] border bg-white overflow-hidden transition ${
              active ? "border-ink ring-4 ring-acid/40" : "border-ink/10 hover:border-ink/25"
            }`}
          >
            <MiniPreview styleId={style.id} dealerName={dealerName} vehicleTitle={vehicleTitle} />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-black text-xl">{style.label}</p>
                {active ? <CheckCircle size={18} /> : recommended ? <Sparkles size={18} /> : null}
              </div>
              <p className="text-sm text-ink/50 mt-1">{style.description}</p>
              {recommended && <p className="inline-flex mt-3 rounded-full bg-acid px-3 py-1 text-xs font-black">Recommended</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function MiniPreview({ styleId, dealerName, vehicleTitle }) {
  if (styleId === "finance_focus") {
    return (
      <div className="h-72 bg-white text-ink p-5">
        <p className="text-xs font-black" style={{ color: "#111315" }}>A simple monthly view</p>
        <h3 className="text-6xl font-black mt-8">£219</h3>
        <p className="font-black">per month</p>
        <div className="grid grid-cols-3 gap-2 mt-6">
          <div className="h-12 rounded-2xl bg-black/8" />
          <div className="h-12 rounded-2xl bg-black/8" />
          <div className="h-12 rounded-2xl bg-black/8" />
        </div>
      </div>
    );
  }

  if (styleId === "warm_family") {
    return (
      <div className="h-72 bg-[#fff7e8] text-ink p-5">
        <p className="font-black">Hello Jack,</p>
        <h3 className="text-3xl font-black mt-4 leading-tight">Built for everyday family life.</h3>
        <div className="rounded-2xl bg-white p-3 mt-6 font-black text-sm">Comfort</div>
        <div className="rounded-2xl bg-white p-3 mt-2 font-black text-sm">Practicality</div>
      </div>
    );
  }

  if (styleId === "safe_light") {
    return (
      <div className="h-72 bg-[#f8f9ff] text-ink p-5">
        <p className="font-black">First car fit</p>
        <h3 className="text-3xl font-black mt-5 leading-tight">Why this could suit you.</h3>
        <div className="grid gap-2 mt-5">
          <div className="h-10 rounded-2xl bg-white" />
          <div className="h-10 rounded-2xl bg-white" />
          <div className="h-10 rounded-2xl bg-white" />
        </div>
      </div>
    );
  }

  if (styleId === "dark_premium") {
    return (
      <div className="h-72 bg-[#07080b] text-white p-5">
        <p className="text-xs font-black text-white/45">{dealerName}</p>
        <p className="text-xs text-acid mt-8 font-black">Hello Jack,</p>
        <h3 className="text-4xl font-black italic leading-none mt-2">This one<br />stands out</h3>
        <div className="h-24 rounded-3xl bg-white/10 mt-5" />
      </div>
    );
  }

  if (styleId === "executive_minimal") {
    return (
      <div className="h-72 bg-[#f4f4f1] text-ink p-5">
        <p className="text-xs tracking-[0.18em] uppercase font-black">Clear overview</p>
        <h3 className="text-4xl font-black mt-10 leading-none">{vehicleTitle}</h3>
        <div className="h-1 w-14 bg-black mt-5" />
        <p className="text-sm mt-8 text-black/45">Prepared overview</p>
      </div>
    );
  }

  if (styleId === "luxury_dark") {
    return (
      <div className="h-72 bg-[#070707] text-[#f5eddf] p-5">
        <p className="text-xs tracking-[0.22em] text-[#f5eddf]/45">PREPARED FOR YOU</p>
        <h3 className="text-3xl font-black mt-12 leading-none">{vehicleTitle}</h3>
        <div className="h-24 rounded-3xl bg-white/10 mt-6" />
      </div>
    );
  }

  return (
    <div className="h-72 bg-[#f7f7f4] text-ink p-5">
      <p className="font-black">{dealerName}</p>
      <h3 className="text-3xl font-black mt-10 leading-tight">Hello Jack, your {vehicleTitle} page is ready.</h3>
      <div className="h-24 rounded-3xl bg-black/8 mt-5" />
    </div>
  );
}
