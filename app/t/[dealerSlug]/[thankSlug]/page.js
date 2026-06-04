import { createClient } from "@/lib/supabase/server";
import { MessageCircle, Phone, Star } from "lucide-react";

export default async function PublicThankYouPage({ params }) {
  const supabase = createClient();

  const { data: dealer } = await supabase
    .from("dealerships")
    .select("*")
    .eq("slug", params.dealerSlug)
    .single();

  if (!dealer) return <main className="min-h-screen p-6">Dealer not found</main>;

  const { data: page } = await supabase
    .from("thank_you_pages")
    .select("*, customers(*), vehicles(*)")
    .eq("slug", params.thankSlug)
    .eq("dealership_id", dealer.id)
    .single();

  if (!page) return <main className="min-h-screen p-6">Page not found</main>;

  const car = page.vehicles;
  const image = page.handover_image_url || car?.image_urls?.[0] || "";
  const dealerPhone = (dealer.phone || "").replace(/[^0-9]/g, "");
  const whatsappUrl = dealerPhone ? `https://wa.me/${dealerPhone}` : "#";

  return (
    <main className="min-h-screen px-4 py-6" style={{ background: "#fffdf8", color: "#111315" }}>
      <div className="max-w-md mx-auto">
        <header className="flex items-center justify-between mb-6">
          {dealer.logo_url ? (
            <img src={dealer.logo_url} className="h-12 object-contain" />
          ) : (
            <div>
              <p className="text-2xl font-black tracking-tight" style={{ color: dealer.primary_color || "#111315" }}>{dealer.name}</p>
              <p className="text-[10px] tracking-[0.45em] text-black/45">THANK YOU</p>
            </div>
          )}
        </header>

        <section className="rounded-[32px] overflow-hidden bg-white shadow-2xl border border-black/10">
          {image ? (
            <img src={image} className="w-full h-80 object-cover" />
          ) : (
            <div className="h-80 flex items-center justify-center font-black text-black/35 bg-black/5">Thank you</div>
          )}

          <div className="p-7 text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em]" style={{ color: dealer.primary_color || "#111315" }}>
              From {dealer.name}
            </p>
            <h1 className="text-5xl font-black leading-[0.9] mt-4">
              Thank you{page.customers?.first_name ? `, ${page.customers.first_name}` : ""}.
            </h1>
            <p className="text-black/60 text-lg mt-5">{page.message}</p>

            {car && (
              <div className="rounded-3xl bg-black/5 p-5 mt-6 text-left">
                <p className="text-xs font-black text-black/40 uppercase">Your vehicle</p>
                <p className="text-2xl font-black mt-1">{[car.year, car.make, car.model].filter(Boolean).join(" ")}</p>
              </div>
            )}

            <div className="grid gap-3 mt-7">
              {dealerPhone && (
                <a href={whatsappUrl} className="rounded-full px-5 py-4 font-black flex items-center justify-center gap-2" style={{ background: dealer.primary_color || "#B8FF3C", color: "#111315" }}>
                  <MessageCircle size={18} /> WhatsApp us
                </a>
              )}

              {dealer.phone && (
                <a href={`tel:${dealer.phone}`} className="rounded-full px-5 py-4 font-black bg-black text-white flex items-center justify-center gap-2">
                  <Phone size={18} /> Call dealership
                </a>
              )}

              {page.review_url && (
                <a href={page.review_url} target="_blank" rel="noreferrer" className="rounded-full px-5 py-4 font-black bg-black/5 flex items-center justify-center gap-2">
                  <Star size={18} /> Leave a review
                </a>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
