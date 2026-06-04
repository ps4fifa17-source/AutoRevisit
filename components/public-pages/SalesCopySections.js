import AnimatedSection from "./AnimatedSection";
import { CheckCircle2, Sparkles, ArrowRightCircle } from "lucide-react";

function short(text = "", max = 145) {
  const value = String(text || "");
  return value.length > max ? `${value.slice(0, max - 1).trim()}…` : value;
}

export function WhyThisVehicle({ copy, dark = false, label = "Why this vehicle" }) {
  if (!copy?.whyThisVehicleTitle && !copy?.whyThisVehicleText) return null;

  return (
    <AnimatedSection delay={160}>
      <div className={dark ? "ar-dark-card p-5 mt-6" : "ar-card p-5 mt-6"}>
        <div className="h-11 w-11 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--dealer-primary-soft)", color: "var(--dealer-primary)" }}>
          <Sparkles size={20} />
        </div>
        <p className={`text-[11px] uppercase tracking-[0.14em] font-black mb-2 ${dark ? "text-white/35" : "text-black/35"}`}>{label}</p>
        <h2 className={`font-black text-xl ${dark ? "text-white" : ""}`}>{short(copy.whyThisVehicleTitle, 70)}</h2>
        <p className={`text-sm mt-2 ${dark ? "text-white/58" : "text-black/58"}`}>{short(copy.whyThisVehicleText)}</p>
      </div>
    </AnimatedSection>
  );
}

export function SalesReasons({ copy, dark = false, startDelay = 230, compact = false, layout = "stack" }) {
  const reasons = copy?.topReasons || copy?.reasons || [];
  if (!reasons.length) return null;

  const gridClass =
    layout === "grid" ? "grid md:grid-cols-2 gap-3 mt-5" : layout === "numbered" ? "grid gap-3 mt-5" : `grid gap-3 mt-5 ${compact ? "grid-cols-1" : ""}`;

  return (
    <div className={gridClass}>
      {reasons.slice(0, 3).map((item, index) => (
        <AnimatedSection key={`${item.title}-${index}`} delay={startDelay + index * 70}>
          <div className={dark ? "ar-dark-card p-4 flex gap-4" : "ar-card p-4 flex gap-4"}>
            {layout === "numbered" && (
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center shrink-0 font-black text-sm"
                style={{ background: "var(--dealer-primary)", color: "#111315" }}
              >
                {index + 1}
              </div>
            )}
            {layout !== "numbered" && (
              <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--dealer-primary-soft)", color: "var(--dealer-primary)" }}>
                <CheckCircle2 size={18} />
              </div>
            )}
            <div>
              <p className={`font-black ${dark ? "text-white" : ""}`}>{short(item.title, 42)}</p>
              <p className={`text-sm mt-1 ${dark ? "text-white/55" : "text-black/55"}`}>{short(item.text, 105)}</p>
            </div>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
}

export function OwnershipSection({ copy, dark = false, delay = 550 }) {
  if (!copy?.ownershipTitle && !copy?.ownershipText) return null;

  return (
    <AnimatedSection delay={delay}>
      <div className={dark ? "ar-dark-card p-5 mt-6" : "ar-card p-5 mt-6"}>
        <h2 className={`font-black text-xl ${dark ? "text-white" : ""}`}>{short(copy.ownershipTitle || "Imagine ownership", 60)}</h2>
        <p className={`text-sm mt-2 ${dark ? "text-white/58" : "text-black/58"}`}>{short(copy.ownershipText)}</p>
      </div>
    </AnimatedSection>
  );
}

export function ObjectionSection({ copy, dark = false, delay = 650 }) {
  if (!copy?.reassuranceTitle && !copy?.reassuranceText && !copy?.primaryCta) return null;

  const rawTitle = String(copy?.reassuranceTitle || "").trim();
  const buyerGuideWords = /question|ask|check|confirm|unsure|before|worth asking|helpful/i;
  const title = rawTitle && !buyerGuideWords.test(rawTitle) ? rawTitle : "Worth another look";
  const text = copy?.reassuranceText || "Everything important is in one place, and the dealership can help with the next step when you are ready.";

  return (
    <AnimatedSection delay={delay}>
      <div className={dark ? "ar-dark-card p-5 mt-6" : "ar-card p-5 mt-6"}>
        <div className="flex gap-4 items-start">
          <div
            className="h-11 w-11 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "var(--dealer-primary-soft)", color: "var(--dealer-primary)" }}
          >
            <ArrowRightCircle size={20} />
          </div>
          <div>
            <h2 className={`font-black text-xl ${dark ? "text-white" : ""}`}>{short(title, 60)}</h2>
            <p className={`text-sm mt-2 ${dark ? "text-white/58" : "text-black/58"}`}>{short(text, 130)}</p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
