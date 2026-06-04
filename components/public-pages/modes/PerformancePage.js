import TrackView from "@/components/TrackView";
import AnimatedSection from "../AnimatedSection";
import DealerMiniHeader from "../DealerMiniHeader";
import VehicleHeroImage from "../VehicleHeroImage";
import VerifiedSpecGrid from "../VerifiedSpecGrid";
import DealerTrustFooter from "../DealerTrustFooter";
import TrackActionLink from "@/components/TrackActionLink";
import { SalesReasons, OwnershipSection, ObjectionSection } from "../SalesCopySections";

export default function PerformancePage({ dealer, page, vehicle, copy, whatsappUrl, showWatermark, mode }) {
  return (
    <>
      <TrackView pageId={page.id} />
      <DealerMiniHeader dealer={dealer} label="Drive focused" dark />
      <div className="px-5">
        <AnimatedSection><div className="relative rounded-[34px] overflow-hidden p-6 min-h-[255px]" style={{ background: "linear-gradient(145deg, rgba(255,255,255,.08), rgba(255,255,255,.025))", border: "1px solid rgba(255,255,255,.11)" }}><div className="absolute -right-12 top-10 h-44 w-44 rounded-full blur-3xl opacity-60" style={{ background: "var(--dealer-glow)" }} /><p className="font-black tracking-[0.18em] text-xs" style={{ color: "var(--dealer-primary)" }}>BUILT TO FEEL SPECIAL</p><h1 className="text-[48px] leading-[0.9] font-black italic tracking-[-0.06em] mt-5">{copy.heroTitle || copy.headline}</h1><p className="text-white/62 mt-4">{copy.heroSubtitle || copy.intro}</p></div></AnimatedSection>
        <AnimatedSection delay={100}><VehicleHeroImage vehicle={vehicle} treatment="cinematic" className="mt-6 shadow-2xl" /></AnimatedSection>
        <AnimatedSection delay={190}><VerifiedSpecGrid vehicle={vehicle} dark max={3} /></AnimatedSection>
        <AnimatedSection delay={280}><h2 className="text-xl font-black mt-7 text-white">Why this one stands out</h2></AnimatedSection>
        <SalesReasons copy={copy} dark startDelay={340} />
        <OwnershipSection copy={copy} dark delay={610} />
        <ObjectionSection copy={copy} dark delay={700} />
        <AnimatedSection delay={790}><TrackActionLink pageId={page.id} eventType="test_drive_click" href={whatsappUrl} className="ar-button mt-6 flex justify-center rounded-2xl px-4 py-4 text-white font-black" style={{ background: "var(--dealer-primary)" }}>{copy.primaryCta || "Arrange a test drive"}</TrackActionLink></AnimatedSection>
      </div>
      <DealerTrustFooter dealer={dealer} page={page} whatsappUrl={whatsappUrl} mode={mode} showWatermark={showWatermark} dark />
    </>
  );
}
