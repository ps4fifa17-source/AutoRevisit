import AnimatedSection from "./AnimatedSection";
import { CheckCircle2, HelpCircle, Sparkles } from "lucide-react";

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
  if (!copy?.reassuranceTitle && !copy?.reassuranceText && !copy?.questions?.length) return null;

  return (
    <AnimatedSection delay={delay}>
      <div className={dark ? "ar-dark-card p-5 mt-6" : "ar-card p-5 mt-6"}>
        <h2 className={`font-black text-xl ${dark ? "text-white" : ""}`}>{short(copy.reassuranceTitle || "Still unsure?", 60)}</h2>
        {copy.reassuranceText && <p className={`text-sm mt-2 ${dark ? "text-white/58" : "text-black/58"}`}>{short(copy.reassuranceText, 130)}</p>}

        {!!copy.questions?.length && (
          <div className="grid gap-3 mt-4">
            {copy.questions.slice(0, 3).map((question) => (
              <div key={question} className="flex gap-3">
                <HelpCircle size={17} style={{ color: "var(--dealer-primary)" }} />
                <p className={`text-sm ${dark ? "text-white/70" : "text-black/70"}`}>{short(question, 80)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
