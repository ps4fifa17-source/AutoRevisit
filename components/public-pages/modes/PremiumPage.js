import TrackView from "@/components/TrackView";
import AnimatedSection from "../AnimatedSection";
import DealerMiniHeader from "../DealerMiniHeader";
import VehicleHeroImage from "../VehicleHeroImage";
import VerifiedSpecGrid from "../VerifiedSpecGrid";
import DealerTrustFooter from "../DealerTrustFooter";
import TrackActionLink from "@/components/TrackActionLink";
import { WhyThisVehicle, SalesReasons, OwnershipSection, ObjectionSection } from "../SalesCopySections";

export default function PremiumPage({ dealer, page, vehicle, copy, whatsappUrl, showWatermark, mode }) {
  return (
    <>
      <TrackView pageId={page.id} />
      <DealerMiniHeader dealer={dealer} dark />

      <div className="px-5">
        <AnimatedSection delay={0}>
          <VehicleHeroImage vehicle={vehicle} treatment="premium" className="shadow-2xl -mx-1" />
        </AnimatedSection>

        <AnimatedSection delay={100}>
          <div className="min-h-[180px] flex flex-col justify-end pb-2 mt-6">
            <p className="text-xs font-black tracking-[0.18em] uppercase" style={{ color: "var(--dealer-primary)" }}>
              Private viewing
            </p>
            <p className="text-sm text-white/55 mt-4">{copy.greeting || copy.hello}</p>
            <h1 className="text-[44px] leading-[0.98] font-black tracking-[-0.055em] mt-3">{copy.heroTitle || copy.headline}</h1>
            <p className="text-[15px] text-white/62 mt-5 leading-relaxed">{copy.heroSubtitle || copy.intro}</p>
          </div>
        </AnimatedSection>

        <WhyThisVehicle copy={copy} dark />
        <SalesReasons copy={copy} dark startDelay={270} layout="grid" />
        <OwnershipSection copy={copy} dark delay={540} />
        <AnimatedSection delay={620}>
          <VerifiedSpecGrid vehicle={vehicle} dark max={4} />
        </AnimatedSection>
        <ObjectionSection copy={copy} dark delay={700} />
        <AnimatedSection delay={790}>
          <TrackActionLink
            pageId={page.id}
            eventType="premium_contact_click"
            href={whatsappUrl}
            className="ar-button mt-6 flex justify-center rounded-2xl px-4 py-4 text-white font-black"
            style={{ background: "var(--dealer-primary)" }}
          >
            {copy.primaryCta || "Speak to the dealership"}
          </TrackActionLink>
        </AnimatedSection>
      </div>

      <DealerTrustFooter dealer={dealer} page={page} whatsappUrl={whatsappUrl} mode={mode} showWatermark={showWatermark} dark />
    </>
  );
}
