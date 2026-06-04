import TrackActionLink from "@/components/TrackActionLink";
import DealerMiniHeader from "./DealerMiniHeader";
import { Phone, MessageCircle, ShieldCheck, Star, HeartHandshake } from "lucide-react";

export default function DealerTrustFooter({
  dealer,
  page,
  whatsappUrl,
  dark = false,
  mode = "simple",
  showWatermark = false,
}) {
  const trust = [dealer?.trust_point_1, dealer?.trust_point_2, dealer?.trust_point_3].filter(Boolean);

  const safeTrust = trust.length
    ? trust
    : ["Here to answer your questions", "Clear next steps, no pressure", "Ready when you need us"];

  const planKey = String(dealer?.plan_name || dealer?.plan || "").toLowerCase();

  const shouldShowWatermark =
    showWatermark === true &&
    planKey !== "premium" &&
    planKey !== "enterprise";

  return (
    <footer className={`mt-8 rounded-t-[34px] px-5 pt-6 pb-7 ${dark ? "bg-black/48 text-white" : "bg-[#0b0d10] text-white"}`}>
      <DealerMiniHeader dealer={dealer} dark />

      <div className="grid gap-3 mt-5">
        {safeTrust.map((item, index) => {
          const Icon = index === 0 ? HeartHandshake : index === 1 ? Star : ShieldCheck;

          return (
            <div key={item} className="flex gap-3 items-center">
              <Icon size={16} style={{ color: "var(--dealer-primary)" }} />
              <p className="text-sm text-white/68">{item}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-3 mt-7 text-center">
        {dealer?.phone && (
          <TrackActionLink pageId={page.id} eventType="call_click" href={`tel:${dealer.phone}`} className="text-xs text-white/62">
            <Phone size={17} className="mx-auto mb-2" />
            Call
          </TrackActionLink>
        )}

        <TrackActionLink pageId={page.id} eventType="message_click" href={whatsappUrl} className="text-xs text-white/62">
          <MessageCircle size={17} className="mx-auto mb-2" />
          Message
        </TrackActionLink>

        <TrackActionLink pageId={page.id} eventType="whatsapp_click" href={whatsappUrl} className="text-xs text-white/62">
          <MessageCircle size={17} className="mx-auto mb-2" />
          WhatsApp
        </TrackActionLink>
      </div>

      {shouldShowWatermark && (
        <p className="text-center text-xs text-white/42 mt-8">
          Powered by <span className="font-black">AutoRevisit</span>
        </p>
      )}
    </footer>
  );
}
