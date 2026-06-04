import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import { getDealerContext } from "@/lib/getDealer";
import { redirect } from "next/navigation";
import { Plus, Send, Pencil, Trash2, Camera, Sparkles } from "lucide-react";

function money(value) {
  if (!value && value !== 0) return "";
  const str = String(value);
  if (str.includes("£")) return str;
  return `£${str}`;
}

export default async function VehiclesPage() {
  const { supabase, dealer } = await getDealerContext();

  if (!dealer) redirect("/onboarding");
  if (dealer.subscription_status !== "active") redirect("/setup-pending");

  const { data: allVehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("dealership_id", dealer.id)
    .order("created_at", { ascending: false });

  const vehicles = (allVehicles || []).filter((vehicle) => !vehicle.deleted_at && vehicle.status !== "deleted");

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section>
          <div className="dark-card p-8 md:p-10 mb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div>
                <p className="text-acid font-black mb-4">Stock</p>
                <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Vehicles</h1>
                <p className="text-white/60 text-lg mt-6 max-w-2xl">
                  Manage stock, photos and the customer pages each car can power.
                </p>
              </div>
              <Link href="/dashboard/vehicles/new" className="btn-acid">
                <Plus size={18} className="mr-2" /> Add vehicle
              </Link>
            </div>
          </div>

          {!vehicles.length && (
            <div className="card p-8 text-center">
              <div className="h-16 w-16 rounded-3xl bg-ink/5 flex items-center justify-center mx-auto">
                <Camera />
              </div>
              <h2 className="text-3xl font-black mt-5">No vehicles yet</h2>
              <p className="text-ink/50 mt-2">Add your first vehicle to create customer pages.</p>
              <Link href="/dashboard/vehicles/new" className="btn-acid mt-6">Add vehicle</Link>
            </div>
          )}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {vehicles.map((vehicle) => {
              const imageUrls = Array.isArray(vehicle.image_urls) ? vehicle.image_urls : [];
              const title = [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || "Vehicle";
              const price = money(vehicle.price);
              const monthly = vehicle.monthly_price ? `From ${money(vehicle.monthly_price)}` : "";
              const detailLine = [vehicle.fuel_type, vehicle.transmission, vehicle.mileage].filter(Boolean).join(" • ");

              return (
                <article key={vehicle.id} className="card overflow-hidden">
                  <div className="h-72 bg-ink/8 relative">
                    {imageUrls[0] ? (
                      <img src={imageUrls[0]} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-ink/35 font-black">
                        <Camera className="mb-2" />
                        Photos needed
                      </div>
                    )}

                    <div className="absolute top-4 left-4 rounded-full bg-white/85 backdrop-blur px-3 py-2 text-xs font-black">
                      {imageUrls.length ? `${imageUrls.length} photos` : "Photos needed"}
                    </div>

                    {vehicle.verified_facts && (
                      <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-acid flex items-center justify-center">
                        <Sparkles size={17} />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-black text-ink/40 uppercase">{vehicle.reg || vehicle.vrm || "No reg"}</p>
                    <h2 className="text-3xl font-black mt-2">{title}</h2>
                    <p className="text-ink/55 mt-2">{detailLine || "Vehicle details needed"}</p>

                    <div className="flex flex-wrap gap-2 mt-5">
                      {price && <span className="badge">{price}</span>}
                      {monthly && <span className="badge">{monthly}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <Link href={`/dashboard/pages/new?vehicle=${vehicle.id}`} className="btn-acid text-center">
                        <Send size={16} className="mr-2" /> Create page
                      </Link>

                      <Link href={`/dashboard/vehicles/${vehicle.id}/edit`} className="btn-secondary text-center">
                        <Pencil size={16} className="mr-2" /> Edit vehicle
                      </Link>
                    </div>

                    <form action={`/api/vehicles/${vehicle.id}/delete`} method="POST" className="mt-3">
                      <button type="submit" className="btn-secondary w-full text-center">
                        <Trash2 size={16} className="mr-2" /> Delete vehicle
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
