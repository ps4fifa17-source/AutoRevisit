import TrackView from "@/components/TrackView";
import AnimatedSection from "../AnimatedSection";
import DealerMiniHeader from "../DealerMiniHeader";
import VehicleHeroImage from "../VehicleHeroImage";
import VerifiedSpecGrid from "../VerifiedSpecGrid";
import DealerTrustFooter from "../DealerTrustFooter";
import TrackActionLink from "@/components/TrackActionLink";
import { WhyThisVehicle, SalesReasons, OwnershipSection, ObjectionSection } from "../SalesCopySections";
import { Users } from "lucide-react";

export default function FamilyPage({ dealer, page, vehicle, copy, whatsappUrl, showWatermark, mode }) {
  return (
    <>
      <TrackView pageId={page.id} />
      <DealerMiniHeader dealer={dealer} />
      <div className="px-5">
        <AnimatedSection><p className="font-black text-lg" style={{ color: "var(--dealer-primary)" }}>{copy.greeting || copy.hello}</p><h1 className="text-[34px] leading-[1.06] font-black tracking-[-0.04em] mt-2">{copy.heroTitle || copy.headline}</h1><p className="text-sm mt-4" style={{ color: "var(--dealer-muted)" }}>{copy.heroSubtitle || copy.intro}</p></AnimatedSection>
        <AnimatedSection delay={90}><div className="ar-soft-card p-5 mt-6"><Users style={{ color: "var(--dealer-primary)" }} /><h2 className="text-xl font-black mt-4">Built around real family life</h2><p className="text-sm mt-2" style={{ color: "var(--dealer-muted)" }}>{copy.whyThisVehicleText || "Space, comfort and practicality matter most when the car needs to work every day."}</p></div></AnimatedSection>
        <AnimatedSection delay={160}><VehicleHeroImage vehicle={vehicle} treatment="warm" className="mt-7 shadow-xl" /></AnimatedSection>
        <SalesReasons copy={copy} layout="grid" />
        <OwnershipSection copy={copy} delay={520} />
        <AnimatedSection delay={610}><VerifiedSpecGrid vehicle={vehicle} max={4} /></AnimatedSection>
        <ObjectionSection copy={copy} delay={690} />
        <AnimatedSection delay={780}><TrackActionLink pageId={page.id} eventType="family_viewing_click" href={whatsappUrl} className="ar-button mt-6 flex justify-center rounded-2xl px-4 py-4 text-white font-black" style={{ background: "var(--dealer-primary)" }}>{copy.primaryCta || "Book a family viewing"}</TrackActionLink></AnimatedSection>
      </div>
      <DealerTrustFooter dealer={dealer} page={page} whatsappUrl={whatsappUrl} mode={mode} showWatermark={showWatermark} />
    </>
  );
}
