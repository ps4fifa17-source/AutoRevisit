import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Settings, Building2, CheckCircle } from "lucide-react";

export default async function AdminDealersPage() {
  const supabase = createClient();

  const { data: dealers } = await supabase
    .from("dealerships")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <section className="dark-card p-8 md:p-10">
          <p className="text-acid font-black mb-4">AutoRevisit Admin</p>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
            Dealer setup queue.
          </h1>
          <p className="text-white/60 mt-5 max-w-2xl">
            Use this area for your manual dealer setup workflow: package checks, stock source setup and activation review.
          </p>
        </section>

        <div className="grid gap-4">
          {(dealers || []).map((dealer) => (
            <article key={dealer.id} className="card p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-3xl bg-ink text-acid flex items-center justify-center">
                  <Building2 />
                </div>
                <div>
                  <h2 className="text-2xl font-black">{dealer.name}</h2>
                  <p className="text-ink/50">{dealer.website || "No website"} • {dealer.plan_name || "starter"}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge">{dealer.subscription_status || "unknown"}</span>
                <span className="badge">{dealer.setup_status || "pending"}</span>
                <span className="badge">{dealer.stock_sync_status || "stock not started"}</span>
              </div>
            </article>
          ))}

          {!(dealers || []).length && (
            <section className="card p-8">
              <h2 className="text-3xl font-black">No dealers yet</h2>
              <p className="text-ink/55 mt-2">New signups will appear here.</p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
