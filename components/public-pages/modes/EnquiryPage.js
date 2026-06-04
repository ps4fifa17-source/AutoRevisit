import TrackView from "@/components/TrackView";
import AnimatedSection from "../AnimatedSection";
import DealerMiniHeader from "../DealerMiniHeader";
import VehicleHeroImage from "../VehicleHeroImage";
import VerifiedSpecGrid from "../VerifiedSpecGrid";
import DealerTrustFooter from "../DealerTrustFooter";
import TrackActionLink from "@/components/TrackActionLink";
import { ObjectionSection } from "../SalesCopySections";
import { MessageCircle, CheckCircle2 } from "lucide-react";

export default function EnquiryPage({ dealer, page, vehicle, copy, whatsappUrl, showWatermark, mode }) {
  const reasons = copy?.topReasons || copy?.reasons || [];

  return (
    <>
      <TrackView pageId={page.id} />
      <DealerMiniHeader dealer={dealer} label="Enquiry follow up" />

      <div className="px-5">
        <AnimatedSection>
          <p className="font-black text-lg" style={{ color: "var(--dealer-primary)" }}>
            {copy.greeting || "Hello,"}
          </p>
          <h1 className="text-[34px] leading-[1.04] font-black tracking-[-0.04em] mt-2">
            {copy.heroTitle || "Thanks for your enquiry."}
          </h1>
          <p className="text-sm leading-relaxed mt-4" style={{ color: "var(--dealer-muted)" }}>
            {copy.heroSubtitle || "Here are the key vehicle details in one place."}
          </p>
        </AnimatedSection>

        {reasons.length > 0 && (
          <AnimatedSection delay={80}>
            <div className="ar-card p-5 mt-6">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-black/40">At a glance</p>
              <ol className="grid gap-3 mt-4">
                {reasons.slice(0, 3).map((item, index) => (
                  <li key={item.title} className="flex gap-3 items-start">
                    <span
                      className="h-7 w-7 rounded-full flex items-center justify-center shrink-0 text-xs font-black"
                      style={{ background: "var(--dealer-primary-soft)", color: "var(--dealer-primary)" }}
                    >
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-black text-sm">{item.title}</p>
                      <p className="text-sm text-black/55 mt-0.5">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={150}>
          <VehicleHeroImage vehicle={vehicle} treatment="light" className="mt-6 max-h-64 object-cover shadow-lg rounded-[28px]" />
        </AnimatedSection>

        <AnimatedSection delay={220}>
          <VerifiedSpecGrid vehicle={vehicle} clean max={6} />
        </AnimatedSection>

        {(copy.whyThisVehicleTitle || copy.whyThisVehicleText) && (
          <AnimatedSection delay={300}>
            <div className="ar-card p-5 mt-6 flex gap-3">
              <CheckCircle2 size={20} style={{ color: "var(--dealer-primary)" }} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-black">{copy.whyThisVehicleTitle}</p>
                <p className="text-sm mt-2 text-black/55">{copy.whyThisVehicleText}</p>
              </div>
            </div>
          </AnimatedSection>
        )}

        <AnimatedSection delay={400}>
          <TrackActionLink
            pageId={page.id}
            eventType="enquiry_message_click"
            href={whatsappUrl}
            className="ar-button mt-6 flex justify-center rounded-2xl px-4 py-4 text-white font-black"
            style={{ background: "var(--dealer-primary)" }}
          >
            <MessageCircle size={18} className="mr-2" />
            {copy.primaryCta || "Message the dealership"}
          </TrackActionLink>
        </AnimatedSection>

        <ObjectionSection copy={copy} delay={480} />
      </div>

      <DealerTrustFooter dealer={dealer} page={page} whatsappUrl={whatsappUrl} mode={mode} showWatermark={showWatermark} />
    </>
  );
}
