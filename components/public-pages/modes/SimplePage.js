import TrackView from "@/components/TrackView";
import AnimatedSection from "../AnimatedSection";
import DealerMiniHeader from "../DealerMiniHeader";
import VehicleHeroImage from "../VehicleHeroImage";
import VerifiedSpecGrid from "../VerifiedSpecGrid";
import DealerTrustFooter from "../DealerTrustFooter";
import TrackActionLink from "@/components/TrackActionLink";
import { WhyThisVehicle, SalesReasons, OwnershipSection, ObjectionSection } from "../SalesCopySections";

export default function SimplePage({ dealer, page, vehicle, copy, whatsappUrl, showWatermark, mode }) {
  const reasons = copy?.topReasons || copy?.reasons || [];

  return (
    <>
      <TrackView pageId={page.id} />
      <DealerMiniHeader dealer={dealer} />
      <div className="px-5">
        <AnimatedSection>
          <p className="font-black text-lg" style={{ color: "var(--dealer-primary)" }}>{copy.greeting || copy.hello}</p>
          <h1 className="text-[34px] leading-[1.04] font-black tracking-[-0.04em] mt-2">{copy.heroTitle || copy.headline}</h1>
          <p className="text-[15px] leading-relaxed mt-4" style={{ color: "var(--dealer-muted)" }}>{copy.heroSubtitle || copy.intro}</p>
        </AnimatedSection>

        {reasons.length > 0 && (
          <AnimatedSection delay={70}>
            <div className="flex gap-2 overflow-x-auto pb-1 mt-6 snap-x">
              {reasons.slice(0, 3).map((item) => (
                <div key={item.title} className="ar-card p-4 min-w-[200px] snap-start shrink-0">
                  <p className="font-black text-sm">{item.title}</p>
                  <p className="text-xs mt-1" style={{ color: "var(--dealer-muted)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={120}>
          <VehicleHeroImage vehicle={vehicle} treatment="light" className="mt-6 shadow-xl" />
        </AnimatedSection>
        <WhyThisVehicle copy={copy} />
        <SalesReasons copy={copy} startDelay={280} />
        <AnimatedSection delay={500}>
          <h2 className="font-black text-xl mt-7">Key verified details</h2>
          <VerifiedSpecGrid vehicle={vehicle} max={4} />
        </AnimatedSection>
        <OwnershipSection copy={copy} delay={590} />
        <ObjectionSection copy={copy} delay={670} />
        <AnimatedSection delay={760}>
          <TrackActionLink
            pageId={page.id}
            eventType="message_click"
            href={whatsappUrl}
            className="ar-button mt-6 flex justify-center rounded-2xl px-4 py-4 text-white font-black"
            style={{ background: "var(--dealer-primary)" }}
          >
            {copy.primaryCta || "Message the dealership"}
          </TrackActionLink>
        </AnimatedSection>
      </div>
      <DealerTrustFooter dealer={dealer} page={page} whatsappUrl={whatsappUrl} mode={mode} showWatermark={showWatermark} />
    </>
  );
}
