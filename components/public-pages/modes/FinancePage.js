import TrackView from "@/components/TrackView";
import AnimatedSection from "../AnimatedSection";
import DealerMiniHeader from "../DealerMiniHeader";
import VehicleHeroImage from "../VehicleHeroImage";
import VerifiedSpecGrid from "../VerifiedSpecGrid";
import DealerTrustFooter from "../DealerTrustFooter";
import TrackActionLink from "@/components/TrackActionLink";
import { WhyThisVehicle, SalesReasons, OwnershipSection, ObjectionSection } from "../SalesCopySections";

function money(value) { if (!value) return ""; const s = String(value); return s.includes("£") ? s : `£${s}`; }

export default function FinancePage({ dealer, page, vehicle, copy, whatsappUrl, showWatermark, mode }) {
  const monthly = money(page?.finance_monthly || vehicle?.monthly_price);
  const price = money(vehicle?.price);
  return (
    <>
      <TrackView pageId={page.id} />
      <DealerMiniHeader dealer={dealer} label="Finance focus" />
      <div className="px-5">
        <AnimatedSection>
          <p className="font-black text-lg" style={{ color: "var(--dealer-primary)" }}>{copy.greeting || copy.hello}</p>
          <h1 className="text-[31px] leading-[1.06] font-black tracking-[-0.035em] mt-2">{copy.heroTitle || copy.headline}</h1>
        </AnimatedSection>
        <AnimatedSection delay={90}>
          <div className="mt-6 rounded-[30px] p-7 text-white shadow-2xl" style={{ background: "radial-gradient(circle at top right, var(--dealer-glow), transparent 36%), linear-gradient(145deg, #11121a, #05060a)" }}>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-white/55">Finance focus</p>
            {monthly ? <><p className="text-[70px] leading-[0.9] font-black tracking-[-0.07em] mt-3" style={{ color: "var(--dealer-primary)" }}>{monthly}</p><p className="font-black mt-1">per month</p><div className="grid grid-cols-3 gap-3 mt-6 border-t border-white/12 pt-5"><Small label="Cash price" value={price || "Ask"} /><Small label="Deposit" value={page?.finance_deposit || "Ask"} /><Small label="Term" value={page?.finance_term ? `${page.finance_term} months` : "Ask"} /></div>{page?.finance_apr && <p className="text-xs text-white/45 mt-4">APR: {page.finance_apr}. Finance subject to status.</p>}</> : <div className="mt-4"><p className="text-3xl font-black">Finance figures not added yet</p><p className="text-white/58 mt-3">The dealership can confirm monthly payment options for you. No figures have been guessed.</p></div>}
          </div>
        </AnimatedSection>
        <WhyThisVehicle copy={copy} />
        <SalesReasons copy={copy} />
        <AnimatedSection delay={500}><VehicleHeroImage vehicle={vehicle} treatment="light" className="mt-7 shadow-xl" /></AnimatedSection>
        <AnimatedSection delay={590}><VerifiedSpecGrid vehicle={vehicle} max={4} /></AnimatedSection>
        <OwnershipSection copy={copy} delay={670} />
        <ObjectionSection copy={copy} delay={750} />
        <AnimatedSection delay={830}><TrackActionLink pageId={page.id} eventType="finance_click" href={whatsappUrl} className="ar-button mt-6 flex justify-center rounded-2xl px-4 py-4 text-white font-black" style={{ background: "var(--dealer-primary)" }}>{copy.primaryCta || "Check finance figures"}</TrackActionLink></AnimatedSection>
      </div>
      <DealerTrustFooter dealer={dealer} page={page} whatsappUrl={whatsappUrl} mode={mode} showWatermark={showWatermark} />
    </>
  );
}
function Small({ label, value }) { return <div><p className="text-[10px] text-white/45">{label}</p><p className="font-black text-sm mt-1">{value}</p></div>; }
