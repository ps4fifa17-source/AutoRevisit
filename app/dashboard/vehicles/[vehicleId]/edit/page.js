import DashboardNav from "@/components/DashboardNav";
import VehicleEditorClient from "@/components/VehicleEditorClient";
import { getDealerContext } from "@/lib/getDealer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditVehiclePage({ params }) {
  const { supabase, dealer } = await getDealerContext();
  if (!dealer) redirect("/onboarding");

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", params.vehicleId)
    .eq("dealership_id", dealer.id)
    .single();

  if (!vehicle) redirect("/dashboard/vehicles");

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <Link href="/dashboard/vehicles" className="btn-secondary w-fit">
            <ArrowLeft size={18} className="mr-2" /> Back to vehicles
          </Link>

          <div className="dark-card p-8 md:p-10">
            <p className="text-acid font-black mb-4">Edit vehicle</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
              Keep this stock ready.
            </h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">
              Replace photos, set the cover image, clean up details and save AI-ready facts.
            </p>
          </div>

          <VehicleEditorClient
            vehicle={vehicle}
            updateAction={`/api/vehicles/${vehicle.id}/update`}
            deleteAction={`/api/vehicles/${vehicle.id}/delete`}
          />
        </section>
      </div>
    </main>
  );
}
