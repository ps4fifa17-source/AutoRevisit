import TrackView from "@/components/TrackView";
import AnimatedSection from "../AnimatedSection";
import DealerMiniHeader from "../DealerMiniHeader";
import VehicleHeroImage from "../VehicleHeroImage";
import VerifiedSpecGrid from "../VerifiedSpecGrid";
import DealerTrustFooter from "../DealerTrustFooter";
import TrackActionLink from "@/components/TrackActionLink";
import { WhyThisVehicle, SalesReasons, OwnershipSection, ObjectionSection } from "../SalesCopySections";
function money(v){ if(!v)return""; const s=String(v); return s.includes("£")?s:`£${s}`; }
export default function ValuePage({ dealer, page, vehicle, copy, whatsappUrl, showWatermark, mode }) {
  return <><TrackView pageId={page.id}/><DealerMiniHeader dealer={dealer} label="Value focus"/><div className="px-5"><AnimatedSection><p className="font-black text-lg" style={{color:"var(--dealer-primary)"}}>{copy.greeting||copy.hello}</p><h1 className="text-[34px] leading-[1.05] font-black tracking-[-0.04em] mt-2">{copy.heroTitle||copy.headline}</h1><p className="text-sm mt-4" style={{color:"var(--dealer-muted)"}}>{copy.heroSubtitle||copy.intro}</p></AnimatedSection><AnimatedSection delay={90}><div className="ar-card p-5 mt-6"><p className="text-sm" style={{color:"var(--dealer-muted)"}}>Price</p><p className="text-5xl font-black tracking-[-0.06em] mt-2">{money(vehicle?.price)||"Ask dealer"}</p><p className="text-sm mt-3" style={{color:"var(--dealer-muted)"}}>Clear facts first. No fake bargain claims.</p></div></AnimatedSection><AnimatedSection delay={160}><VehicleHeroImage vehicle={vehicle} treatment="light" className="mt-7 shadow-xl"/></AnimatedSection><WhyThisVehicle copy={copy}/><AnimatedSection delay={280}><VerifiedSpecGrid vehicle={vehicle} max={6}/></AnimatedSection><SalesReasons copy={copy} startDelay={360}/><OwnershipSection copy={copy} delay={590}/><ObjectionSection copy={copy} delay={670}/><AnimatedSection delay={760}><TrackActionLink pageId={page.id} eventType="value_enquiry_click" href={whatsappUrl} className="ar-button mt-6 flex justify-center rounded-2xl px-4 py-4 text-white font-black" style={{background:"var(--dealer-primary)"}}>{copy.primaryCta||"Ask about this car"}</TrackActionLink></AnimatedSection></div><DealerTrustFooter dealer={dealer} page={page} whatsappUrl={whatsappUrl} mode={mode} showWatermark={showWatermark}/></>;
}
