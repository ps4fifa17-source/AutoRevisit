import TrackView from "@/components/TrackView";
import { DealerBrand, Reveal, VehicleHero, SpecGrid, Reasons, StickyCTA, DealerFooter, Questions } from "./PublicPageSections";
import { Wallet, Users, Zap, Gem, BriefcaseBusiness, Star, MessageCircle } from "lucide-react";

function price(value) {
  if (!value) return "";
  const s = String(value);
  return s.includes("£") ? s : `£${s}`;
}

export default function PublicPageShell({ mode, visualStyle, pushAngle, buyingFor, dealer, page, car, copy, accent, whatsappUrl, showWatermark }) {
  if (mode === "finance" || pushAngle === "finance") return <Finance {...arguments[0]} />;
  if (mode === "family" || buyingFor === "family") return <Family {...arguments[0]} />;
  if (mode === "performance" || pushAngle === "performance") return <Performance {...arguments[0]} />;
  if (mode === "premium" || visualStyle === "premium") return <Premium {...arguments[0]} />;
  if (mode === "executive" || buyingFor === "business") return <Executive {...arguments[0]} />;
  if (mode === "firstcar" || buyingFor === "daughter" || buyingFor === "son") return <FirstCar {...arguments[0]} />;
  return <Simple {...arguments[0]} />;
}

function Simple(props) {
  const { dealer, page, car, copy, accent, whatsappUrl, showWatermark } = props;
  return <main className="ar-page bg-white text-[#101114] px-4 pt-5"><TrackView pageId={page.id}/><div className="ar-phone"><Header dealer={dealer} accent={accent}/><Reveal><p className="text-lg font-bold" style={{color:accent}}>{copy.hello}</p><h1 className="text-4xl font-black leading-[1.03] mt-2">{copy.headline}</h1><p className="text-black/60 mt-4">{copy.intro}</p></Reveal><Reveal delay={90}><VehicleHero car={car} className="mt-7"/></Reveal><Reveal delay={160}><section className="mt-7"><h2 className="text-xl font-black">Why this makes sense</h2><Reasons reasons={copy.reasons} accent={accent}/></section></Reveal><Reveal delay={230}><SpecGrid car={car} accent={accent}/></Reveal><StickyCTA page={page} dealer={dealer} accent={accent} whatsappUrl={whatsappUrl}/><DealerFooter dealer={dealer} page={page} accent={accent} whatsappUrl={whatsappUrl} dark={false} showWatermark={showWatermark}/></div></main>
}

function Finance(props) {
  const { dealer, page, car, copy, accent, whatsappUrl, showWatermark } = props;
  const monthly = price(car.monthly_price);
  return <main className="ar-page bg-white text-[#101114] px-4 pt-5"><TrackView pageId={page.id}/><div className="ar-phone"><Header dealer={dealer} accent={accent} icon={<Wallet style={{color:accent}}/>}/><Reveal><div className="text-center"><p className="inline-flex px-4 py-2 rounded-full text-xs font-black" style={{color:accent,backgroundColor:`${accent}18`}}>PERSONALISED FINANCE FOR {copy.customerFirst.toUpperCase()}</p><h1 className="text-3xl font-black mt-6">Drive away with clarity</h1>{monthly?<><p className="text-7xl font-black mt-3" style={{color:accent}}>{monthly}</p><p className="font-black">per month</p></>:<div className="ar-card p-5 mt-5"><p className="font-black">Finance figures can be added once confirmed.</p><p className="text-sm text-black/55 mt-2">No figures have been guessed.</p></div>}</div></Reveal><Reveal delay={90}><VehicleHero car={car} className="mt-7"/></Reveal><Reveal delay={160}><section className="mt-6"><h2 className="text-xl font-black">Why this could work for your budget</h2><Reasons reasons={copy.reasons} accent={accent} icon="finance"/></section></Reveal><Reveal delay={230}><section className="ar-card p-5 mt-5"><h2 className="font-black">Important to know</h2><p className="text-sm text-black/55 mt-2">Finance is subject to status. Figures are examples unless confirmed by the dealership.</p></section></Reveal><StickyCTA page={page} dealer={dealer} accent={accent} whatsappUrl={whatsappUrl} finance/><DealerFooter dealer={dealer} page={page} accent={accent} whatsappUrl={whatsappUrl} dark={false} showWatermark={showWatermark}/></div></main>
}

function Family(props) {
  const { dealer, page, car, copy, accent, whatsappUrl, showWatermark } = props;
  return <main className="ar-page bg-[#fff8ea] text-[#101114] px-4 pt-5"><TrackView pageId={page.id}/><div className="ar-phone"><Header dealer={dealer} accent={accent} icon={<Users style={{color:accent}}/>}/><Reveal><p className="text-lg font-bold" style={{color:accent}}>{copy.hello}</p><h1 className="text-4xl font-black leading-tight mt-2">{copy.headline}</h1><p className="text-black/60 mt-4">{copy.intro}</p></Reveal><Reveal delay={90}><VehicleHero car={car} className="mt-7"/></Reveal><Reveal delay={160}><section className="mt-6"><h2 className="text-xl font-black">Built for real family life</h2><Reasons reasons={copy.reasons} accent={accent} icon="family"/></section></Reveal><Reveal delay={230}><SpecGrid car={car} accent={accent}/></Reveal><StickyCTA page={page} dealer={dealer} accent={accent} whatsappUrl={whatsappUrl}/><DealerFooter dealer={dealer} page={page} accent={accent} whatsappUrl={whatsappUrl} dark={false} showWatermark={showWatermark}/></div></main>
}

function Performance(props) {
  const { dealer, page, car, copy, accent, whatsappUrl, showWatermark } = props;
  return <main className="ar-page bg-[#05070a] text-white px-4 pt-5"><TrackView pageId={page.id}/><div className="ar-phone"><Header dealer={dealer} accent={accent} dark icon={<Zap style={{color:accent}}/>}/><Reveal><section className="relative overflow-hidden rounded-[34px] bg-[#10151c] p-6"><div className="absolute -right-10 top-16 h-40 w-40 rounded-full blur-3xl opacity-60" style={{backgroundColor:accent}}/><p className="text-sm font-black tracking-[0.18em]" style={{color:accent}}>BUILT TO FEEL SPECIAL</p><h1 className="text-5xl font-black italic leading-[0.92] mt-5">{copy.headline}</h1><p className="text-white/60 mt-4">{copy.intro}</p><VehicleHero car={car} dark cinematic className="mt-6"/></section></Reveal><Reveal delay={170}><section className="mt-6"><h2 className="text-xl font-black">Feel the difference</h2><Reasons reasons={copy.reasons} accent={accent} dark icon="performance"/></section></Reveal><StickyCTA page={page} dealer={dealer} accent={accent} whatsappUrl={whatsappUrl} dark/><DealerFooter dealer={dealer} page={page} accent={accent} whatsappUrl={whatsappUrl} showWatermark={showWatermark}/></div></main>
}

function Executive(props) {
  const { dealer, page, car, copy, accent, whatsappUrl, showWatermark } = props;
  return <main className="ar-page bg-[#f7f7f4] text-[#101114] px-4 pt-5"><TrackView pageId={page.id}/><div className="ar-phone"><Header dealer={dealer} accent={accent} icon={<BriefcaseBusiness style={{color:accent}}/>}/><Reveal><p className="text-black/60">Good evening, {copy.customerFirst}.</p><div className="h-1 w-16 mt-5 rounded-full" style={{backgroundColor:accent}}/><h1 className="text-5xl font-black leading-[1.02] mt-7">{copy.headline}</h1><p className="text-black/60 mt-5">{copy.intro}</p></Reveal><Reveal delay={110}><VehicleHero car={car} className="mt-7"/></Reveal><Reveal delay={180}><section className="mt-6"><h2 className="text-xl font-black">Executive summary</h2><Reasons reasons={copy.reasons} accent={accent} icon="executive"/></section></Reveal><SpecGrid car={car} accent={accent}/><StickyCTA page={page} dealer={dealer} accent={accent} whatsappUrl={whatsappUrl}/><DealerFooter dealer={dealer} page={page} accent={accent} whatsappUrl={whatsappUrl} dark={false} showWatermark={showWatermark}/></div></main>
}

function Premium(props) {
  const { dealer, page, car, copy, accent, whatsappUrl, showWatermark } = props;
  return <main className="ar-page bg-[#06090c] text-white px-4 pt-5"><TrackView pageId={page.id}/><div className="ar-phone"><Header dealer={dealer} accent={accent} dark icon={<Gem style={{color:accent}}/>}/><Reveal><section className="min-h-[230px] flex flex-col justify-end"><p className="text-sm font-black tracking-[0.24em]" style={{color:accent}}>PRIVATE VIEWING</p><h1 className="text-5xl font-black leading-[0.98] mt-4">{copy.headline}</h1><p className="text-white/60 mt-5">{copy.intro}</p></section></Reveal><Reveal delay={100}><VehicleHero car={car} dark cinematic className="mt-6"/></Reveal><Reveal delay={170}><section className="mt-7"><h2 className="text-xl font-black">A premium experience</h2><Reasons reasons={copy.reasons} accent={accent} dark icon="premium"/></section></Reveal><StickyCTA page={page} dealer={dealer} accent={accent} whatsappUrl={whatsappUrl} dark/><DealerFooter dealer={dealer} page={page} accent={accent} whatsappUrl={whatsappUrl} showWatermark={showWatermark}/></div></main>
}

function FirstCar(props) {
  const { dealer, page, car, copy, accent, whatsappUrl, showWatermark } = props;
  return <main className="ar-page bg-white text-[#101114] px-4 pt-5"><TrackView pageId={page.id}/><div className="ar-phone"><Header dealer={dealer} accent={accent} icon={<Star style={{color:accent}}/>}/><Reveal><p className="text-lg font-bold" style={{color:accent}}>{copy.hello}</p><h1 className="text-4xl font-black leading-tight mt-2">{copy.headline}</h1><p className="text-black/60 mt-4">{copy.intro}</p></Reveal><Reveal delay={100}><VehicleHero car={car} className="mt-7"/></Reveal><Reveal delay={170}><section className="mt-6"><h2 className="text-xl font-black">Why this could work well</h2><Reasons reasons={copy.reasons} accent={accent}/></section></Reveal><Questions accent={accent}/><StickyCTA page={page} dealer={dealer} accent={accent} whatsappUrl={whatsappUrl}/><DealerFooter dealer={dealer} page={page} accent={accent} whatsappUrl={whatsappUrl} dark={false} showWatermark={showWatermark}/></div></main>
}

function Header({ dealer, accent, dark = false, icon }) {
  return <header className="flex items-center justify-between mb-7"><DealerBrand dealer={dealer} accent={accent} dark={dark}/>{icon || <MessageCircle style={{color:accent}}/>}</header>
}
