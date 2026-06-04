import { CheckCircle2 } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
export default function ReasonCards({ reasons = [], dark = false, numbered = false, className = "" }) {
  if (!reasons.length) return null;
  return <div className={`grid gap-3 ${className}`}>{reasons.slice(0,4).map((item,index)=><AnimatedSection key={`${item.title}-${index}`} delay={80+index*70}><div className={dark ? "ar-dark-card p-4 flex gap-3" : "ar-card p-4 flex gap-3"}><div className="h-9 w-9 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--dealer-primary-soft)", color: "var(--dealer-primary)" }}>{numbered ? <span className="text-xs font-black">{String(index+1).padStart(2,"0")}</span> : <CheckCircle2 size={18} />}</div><div><p className={`font-black ${dark ? "text-white" : ""}`}>{item.title}</p><p className={`text-sm mt-1 ${dark ? "text-white/55" : "text-black/55"}`}>{item.text}</p></div></div></AnimatedSection>)}</div>;
}
