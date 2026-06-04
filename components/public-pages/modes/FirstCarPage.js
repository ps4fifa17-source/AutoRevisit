import TrackView from "@/components/TrackView";
import AnimatedSection from "../AnimatedSection";
import DealerMiniHeader from "../DealerMiniHeader";
import VehicleHeroImage from "../VehicleHeroImage";
import VerifiedSpecGrid from "../VerifiedSpecGrid";
import DealerTrustFooter from "../DealerTrustFooter";
import TrackActionLink from "@/components/TrackActionLink";
import { ShieldCheck, CarFront, ParkingCircle, Gauge, ArrowRightCircle } from "lucide-react";

function vehicleTitle(vehicle) {
  return [vehicle?.year, vehicle?.make, vehicle?.model].filter(Boolean).join(" ") || "this car";
}

export default function FirstCarPage({ dealer, page, vehicle, copy, whatsappUrl, showWatermark, mode }) {
  const title = vehicleTitle(vehicle);
  const reasons = copy.topReasons || copy.reasons || [];
  return (
    <>
      <TrackView pageId={page.id} />
      <DealerMiniHeader dealer={dealer} />
      <div className="px-5">
        <AnimatedSection>
          <p className="font-black text-lg" style={{ color: "var(--dealer-primary)" }}>{copy.greeting || copy.hello}</p>
          <h1 className="text-[34px] leading-[1.04] font-black tracking-[-0.04em] mt-2">
            {copy.heroTitle || `Why this ${title} could make sense as a first car.`}
          </h1>
          <p className="text-sm leading-relaxed mt-4" style={{ color: "var(--dealer-muted)" }}>{copy.heroSubtitle || copy.intro}</p>
        </AnimatedSection>

        <AnimatedSection delay={90}><VehicleHeroImage vehicle={vehicle} treatment="light" className="mt-7 shadow-xl" /></AnimatedSection>

        <AnimatedSection delay={160}>
          <div className="ar-card p-5 mt-6">
            <div className="h-12 w-12 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--dealer-primary-soft)", color: "var(--dealer-primary)" }}><CarFront size={22} /></div>
            <h2 className="text-xl font-black">{copy.whyThisVehicleTitle || `Why this ${title} works well here`}</h2>
            <p className="text-sm mt-2" style={{ color: "var(--dealer-muted)" }}>{copy.whyThisVehicleText || "This page focuses on why this exact vehicle could work as a first car."}</p>
          </div>
        </AnimatedSection>

        <div className="grid gap-3 mt-5">
          {reasons.slice(0, 4).map((item, index) => {
            const icons = [ShieldCheck, ParkingCircle, Gauge, ArrowRightCircle];
            const Icon = icons[index] || ShieldCheck;
            return (
              <AnimatedSection key={`${item.title}-${index}`} delay={230 + index * 70}>
                <div className="ar-card p-4 flex gap-4">
                  <div className="h-11 w-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--dealer-primary-soft)", color: "var(--dealer-primary)" }}><Icon size={20} /></div>
                  <div><p className="font-black">{item.title}</p><p className="text-sm mt-1" style={{ color: "var(--dealer-muted)" }}>{item.text}</p></div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>

        <AnimatedSection delay={550}>
          <div className="ar-card p-5 mt-6"><h2 className="font-black text-xl">{copy.ownershipTitle || "Imagine ownership"}</h2><p className="text-sm mt-2" style={{ color: "var(--dealer-muted)" }}>{copy.ownershipText || "Daily driving, short trips, building confidence and getting used to the roads you actually use."}</p></div>
        </AnimatedSection>

        <AnimatedSection delay={620}><VerifiedSpecGrid vehicle={vehicle} max={4} /></AnimatedSection>

        <AnimatedSection delay={690}>
          <div className="ar-card p-5 mt-6 flex gap-4 items-start">
            <div className="h-11 w-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "var(--dealer-primary-soft)", color: "var(--dealer-primary)" }}>
              <ArrowRightCircle size={20} />
            </div>
            <div>
              <h2 className="font-black text-xl">{copy.reassuranceTitle || "Worth another look"}</h2>
              <p className="text-sm mt-2" style={{ color: "var(--dealer-muted)" }}>{copy.reassuranceText || "Everything important is kept together so it is easier to decide the next step."}</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={760}>
          <TrackActionLink pageId={page.id} eventType="first_car_costs_click" href={whatsappUrl} className="ar-button mt-6 flex justify-center rounded-2xl px-4 py-4 text-white font-black" style={{ background: "var(--dealer-primary)" }}>{copy.primaryCta || "Ask about first-car costs"}</TrackActionLink>
        </AnimatedSection>
      </div>
      <DealerTrustFooter dealer={dealer} page={page} whatsappUrl={whatsappUrl} mode={mode} showWatermark={showWatermark} />
    </>
  );
}
