import TrackView from "@/components/TrackView";
import AnimatedSection from "../AnimatedSection";
import DealerMiniHeader from "../DealerMiniHeader";
import VehicleHeroImage from "../VehicleHeroImage";
import VerifiedSpecGrid from "../VerifiedSpecGrid";
import DealerTrustFooter from "../DealerTrustFooter";
import TrackActionLink from "@/components/TrackActionLink";
import { SalesReasons, OwnershipSection, ObjectionSection } from "../SalesCopySections";

export default function ExecutivePage({ dealer, page, vehicle, copy, whatsappUrl, showWatermark, mode }) {
  return (
    <>
      <TrackView pageId={page.id} />
      <DealerMiniHeader dealer={dealer} label="Prepared summary" minimal />
      <div className="px-5">
        <AnimatedSection><div className="bg-white border border-black/8 rounded-[18px] p-6 shadow-xl"><p className="text-xs uppercase tracking-[0.14em] font-black" style={{ color: "var(--dealer-primary)" }}>Executive summary</p><p className="text-black/60 mt-5">{copy.greeting || copy.hello}</p><h1 className="text-[34px] leading-[1.05] font-black tracking-[-0.04em] mt-3">{copy.heroTitle || copy.headline}</h1><p className="text-sm mt-4 text-black/58">{copy.heroSubtitle || copy.intro}</p></div></AnimatedSection>
        <AnimatedSection delay={110}><VehicleHeroImage vehicle={vehicle} treatment="light" className="mt-6 shadow-xl" /></AnimatedSection>
        <AnimatedSection delay={180}><div className="mt-6 bg-white border border-black/8 rounded-[18px] p-5"><h2 className="font-black text-xl">{copy.whyThisVehicleTitle || "Key reasons this suits the brief"}</h2><p className="text-sm mt-2 text-black/58">{copy.whyThisVehicleText}</p></div></AnimatedSection>
        <SalesReasons copy={copy} startDelay={260} layout="numbered" />
        <AnimatedSection delay={520}><VerifiedSpecGrid vehicle={vehicle} clean max={6} /></AnimatedSection>
        <OwnershipSection copy={copy} delay={600} />
        <ObjectionSection copy={copy} delay={690} />
        <AnimatedSection delay={780}><TrackActionLink pageId={page.id} eventType="arrange_viewing_click" href={whatsappUrl} className="ar-button mt-6 flex justify-center rounded-2xl px-4 py-4 text-white font-black" style={{ background: "var(--dealer-primary)" }}>{copy.primaryCta || "Arrange a viewing"}</TrackActionLink></AnimatedSection>
      </div>
      <DealerTrustFooter dealer={dealer} page={page} whatsappUrl={whatsappUrl} mode={mode} showWatermark={showWatermark} />
    </>
  );
}
