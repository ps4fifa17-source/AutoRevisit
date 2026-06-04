import TrackActionLink from "@/components/TrackActionLink";
import { MessageCircle, Phone, CalendarDays, Wallet, HelpCircle, Gauge, BriefcaseBusiness, Gem } from "lucide-react";
function ctaForMode(mode) {
  if (mode === "finance") return { primary: "Check finance", icon: Wallet, event: "finance_click" };
  if (mode === "family") return { primary: "Book viewing", icon: CalendarDays, event: "book_viewing_click" };
  if (mode === "firstcar" || mode === "first_car") return { primary: "Ask costs", icon: HelpCircle, event: "first_car_costs_click" };
  if (mode === "performance") return { primary: "Test drive", icon: Gauge, event: "test_drive_click" };
  if (mode === "executive") return { primary: "Arrange", icon: BriefcaseBusiness, event: "arrange_viewing_click" };
  if (mode === "premium") return { primary: "Speak", icon: Gem, event: "premium_contact_click" };
  if (mode === "value") return { primary: "Ask about it", icon: MessageCircle, event: "value_enquiry_click" };
  return { primary: "Message", icon: MessageCircle, event: "message_click" };
}
export default function StickyMobileCTA({ page, dealer, mode, whatsappUrl, dark = false }) {
  const cta = ctaForMode(mode); const Icon = cta.icon; const phone = dealer?.phone;
  return <div className="ar-sticky-cta"><div className={`grid ${phone ? "grid-cols-2" : "grid-cols-1"} gap-2 rounded-[24px] p-2 shadow-2xl backdrop-blur-xl ${dark ? "bg-black/55 border border-white/12" : "bg-white/86 border border-black/10"}`}><TrackActionLink pageId={page.id} eventType={cta.event} href={whatsappUrl} className="ar-button rounded-[18px] px-3 py-4 font-black flex items-center justify-center gap-2 text-white" style={{ background: "var(--dealer-primary)" }}><Icon size={18} /> {cta.primary}</TrackActionLink>{phone && <TrackActionLink pageId={page.id} eventType="call_click" href={`tel:${phone}`} className={`ar-button rounded-[18px] px-3 py-4 font-black flex items-center justify-center gap-2 border ${dark ? "border-white/14 text-white" : "border-black/10 text-black"}`}><Phone size={18} /> Call</TrackActionLink>}</div></div>;
}
