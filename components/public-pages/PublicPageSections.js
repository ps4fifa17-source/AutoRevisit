import TrackableCTA from "./TrackableCTA";
import { MessageCircle, Phone, CalendarDays, CheckCircle2, ShieldCheck, Wallet, Users, Zap, Gem, BriefcaseBusiness, Star, HelpCircle, Gauge, Fuel, Settings2, CarFront } from "lucide-react";

export function DealerBrand({ dealer, accent, dark = false }) {
  const name = dealer?.name || "Dealership";
  return (
    <div className="flex items-center gap-3">
      {dealer?.logo_url ? (
        <img src={dealer.logo_url} alt={name} className="h-9 max-w-[155px] object-contain" />
      ) : (
        <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-black" style={{ backgroundColor: accent }}>{name.slice(0,1)}</div>
      )}
      {!dealer?.logo_url && <p className={`font-black leading-none ${dark ? "text-white" : "text-[#101114]"}`}>{name}</p>}
    </div>
  );
}

export function Reveal({ children, delay = 0, className = "" }) {
  return <div className={`ar-reveal ${className}`} style={{ "--delay": `${delay}ms` }}>{children}</div>;
}

export function VehicleHero({ car, dark = false, cinematic = false, className = "" }) {
  const image = Array.isArray(car?.image_urls) ? car.image_urls[0] : null;
  return (
    <div className={`relative rounded-[30px] overflow-hidden ${dark ? "bg-white/10" : "bg-black/5"} ${cinematic ? "shadow-2xl" : "shadow-xl"} ${className}`}>
      {image ? <img src={image} alt={[car?.year, car?.make, car?.model].filter(Boolean).join(" ")} className={`ar-img w-full object-cover ${cinematic ? "h-[360px]" : "h-[300px]"}`} /> : <div className={`${cinematic ? "h-[360px]" : "h-[300px]"} flex items-center justify-center opacity-40 font-black`}>Vehicle photo</div>}
      {cinematic && <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />}
    </div>
  );
}

export function SpecGrid({ car, accent, dark = false }) {
  const specs = [
    { icon: CalendarDays, label: "Year", value: car?.year },
    { icon: Gauge, label: "Miles", value: car?.mileage },
    { icon: Fuel, label: "Fuel", value: car?.fuel_type },
    { icon: Settings2, label: "Gearbox", value: car?.transmission },
    { icon: CarFront, label: "Doors", value: car?.doors },
  ].filter(x => x.value);

  if (!specs.length) return null;

  return (
    <div className="grid grid-cols-2 gap-3 mt-5">
      {specs.slice(0, 4).map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.label} className={dark ? "ar-dark-card p-4" : "ar-card p-4"}>
            <Icon size={18} style={{ color: accent }} />
            <p className={`text-xs mt-3 ${dark ? "text-white/45" : "text-black/45"}`}>{s.label}</p>
            <p className={`font-black mt-1 ${dark ? "text-white" : "text-[#101114]"}`}>{s.value}</p>
          </div>
        );
      })}
    </div>
  );
}

export function Reasons({ reasons, accent, dark = false, icon = "check" }) {
  const Icon = icon === "finance" ? Wallet : icon === "family" ? Users : icon === "performance" ? Zap : icon === "premium" ? Gem : icon === "executive" ? BriefcaseBusiness : CheckCircle2;
  return (
    <div className="grid gap-3 mt-4">
      {reasons.slice(0, 4).map((item, index) => (
        <div key={`${item.title}-${index}`} className={dark ? "ar-dark-card p-4 flex gap-3" : "ar-card p-4 flex gap-3"}>
          <div className="h-10 w-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${accent}18`, color: accent }}>
            <Icon size={18} />
          </div>
          <div>
            <p className={`font-black ${dark ? "text-white" : "text-[#101114]"}`}>{item.title}</p>
            <p className={`text-sm mt-1 ${dark ? "text-white/55" : "text-black/55"}`}>{item.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StickyCTA({ page, dealer, accent, whatsappUrl, dark = false, finance = false }) {
  const phone = dealer?.phone;
  return (
    <div className="ar-sticky mt-7">
      <div className={`grid ${phone ? "grid-cols-2" : "grid-cols-1"} gap-3 rounded-[26px] p-2 ${dark ? "bg-white/10 border border-white/10" : "bg-white/85 border border-black/10"} backdrop-blur-xl shadow-2xl`}>
        <TrackableCTA pageId={page.id} eventType={finance ? "finance_click" : "whatsapp_click"} href={whatsappUrl} className="ar-cta rounded-2xl px-4 py-4 font-black flex items-center justify-center gap-2 text-white" style={{ backgroundColor: accent }}>
          {finance ? <CalendarDays size={18} /> : <MessageCircle size={18} />}{finance ? "Check figures" : "Message"}
        </TrackableCTA>
        {phone && <TrackableCTA pageId={page.id} eventType="call_click" href={`tel:${phone}`} className={`ar-cta rounded-2xl px-4 py-4 font-black flex items-center justify-center gap-2 border ${dark ? "border-white/15 text-white" : "border-black/10 text-[#101114]"}`}><Phone size={18}/>Call</TrackableCTA>}
      </div>
    </div>
  );
}

export function DealerFooter({ dealer, page, accent, whatsappUrl, dark = true, showWatermark }) {
  const text = dark ? "text-white" : "text-[#101114]";
  const muted = dark ? "text-white/60" : "text-black/55";
  const trust = [dealer?.trust_point_1 || "Family-run dealership", dealer?.trust_point_2 || "Here to answer your questions", dealer?.trust_point_3 || "Clear next steps, no pressure"];
  return (
    <footer className={`mt-9 rounded-t-[34px] p-6 ${dark ? "bg-[#080b10]" : "bg-[#f0eee8]"} ${text}`}>
      <DealerBrand dealer={dealer} accent={accent} dark={dark} />
      <div className="grid gap-3 mt-6">
        {trust.map((item, i) => {
          const Icon = i === 0 ? ShieldCheck : i === 1 ? Star : CheckCircle2;
          return <div key={item} className="flex items-center gap-3"><Icon size={16} style={{ color: accent }} /><p className={`text-sm ${muted}`}>{item}</p></div>;
        })}
      </div>
      <p className={`text-sm mt-5 ${muted}`}>We’re here when you need us.</p>
      <div className="grid grid-cols-3 gap-3 mt-6 text-center">
        {dealer?.phone && <TrackableCTA pageId={page.id} eventType="call_click" href={`tel:${dealer.phone}`} className={`text-xs ${muted}`}><Phone size={17} className="mx-auto mb-2" />Call</TrackableCTA>}
        <TrackableCTA pageId={page.id} eventType="message_click" href={whatsappUrl} className={`text-xs ${muted}`}><MessageCircle size={17} className="mx-auto mb-2" />Message</TrackableCTA>
        <TrackableCTA pageId={page.id} eventType="whatsapp_click" href={whatsappUrl} className={`text-xs ${muted}`}><MessageCircle size={17} className="mx-auto mb-2" />WhatsApp</TrackableCTA>
      </div>
      {showWatermark && <p className={`text-center text-xs mt-8 ${muted}`}>Powered by <span className="font-black">AutoRevisit</span></p>}
    </footer>
  );
}

export function Questions({ accent }) {
  return (
    <section className="ar-card p-5 mt-6">
      <h2 className="font-black">Questions worth asking</h2>
      <div className="grid gap-3 mt-4">
        {["What’s included?", "Any service history?", "What finance figures are confirmed?", "Can I book a viewing?"].map(q => (
          <div key={q} className="flex gap-3"><HelpCircle size={17} style={{ color: accent }} /><p className="text-sm">{q}</p></div>
        ))}
      </div>
    </section>
  );
}
