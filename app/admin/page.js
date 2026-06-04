import { getDealerContext } from "@/lib/getDealer";
import AdminActivateButton from "@/components/AdminActivateButton";

export default async function AdminPage() {
  const { supabase, profile } = await getDealerContext();

  if (!profile || profile.role !== "admin") {
    return (
      <main className="min-h-screen p-6 flex items-center justify-center">
        <div className="card p-8 max-w-md">
          <h1 className="text-4xl font-black">Admin only</h1>
          <p className="text-ink/60 mt-3">Set your profile role to admin in Supabase to use this page.</p>
        </div>
      </main>
    );
  }

  const { data: dealers } = await supabase
    .from("dealerships")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="dark-card p-8 mb-6">
          <p className="text-acid font-black">SIGNAL ADMIN</p>
          <h1 className="text-6xl font-black tracking-tight mt-3">Dealer activation</h1>
          <p className="text-white/60 mt-4">Approve dealers after payment/setup.</p>
        </div>

        <div className="grid gap-4">
          {(dealers || []).map((dealer) => (
            <div key={dealer.id} className="card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black">{dealer.name}</h2>
                <p className="text-ink/55">{dealer.website}</p>
                <p className="font-bold mt-2">Status: {dealer.subscription_status}</p>
              </div>
              <AdminActivateButton dealerId={dealer.id} currentStatus={dealer.subscription_status} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
