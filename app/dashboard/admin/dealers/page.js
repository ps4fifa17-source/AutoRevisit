import DashboardNav from "@/components/DashboardNav";
import { getDealerContext } from "@/lib/getDealer";
import { getAdminContext } from "@/lib/admin";
import { redirect } from "next/navigation";
import { PLANS } from "@/lib/plans";
import { RefreshCw, Save, DatabaseZap } from "lucide-react";

function niceDate(value) {
  if (!value) return "Never";
  return new Date(value).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function feedStatus(dealer) {
  if (!dealer.stock_feed_url) return ["Not connected", "bg-white"];
  if (dealer.last_stock_sync_status === "success") return ["Connected", "bg-acid"];
  if (dealer.last_stock_sync_status === "failed") return ["Sync failed", "bg-red-100"];
  return ["Feed added", "bg-yellow-200"];
}

export default async function AdminDealersPage({ searchParams }) {
  const { supabase } = await getDealerContext();
  const { isAdmin } = await getAdminContext(supabase);

  if (!isAdmin) redirect("/dashboard");

  const { data: dealers } = await supabase
    .from("dealerships")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <div className="dark-card p-8 md:p-10">
            <p className="text-acid font-black mb-4">Admin</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Dealers.</h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">
              Connect stock feeds manually, approve dealers and sync live stock when needed.
            </p>
          </div>

          {searchParams?.saved && <Notice type="success" text="Dealer settings saved." />}
          {searchParams?.synced && <Notice type="success" text={searchParams?.message || "Stock synced."} />}
          {searchParams?.error && <Notice type="error" text={searchParams.error} />}

          <div className="grid gap-4">
            {(dealers || []).map((dealer) => {
              const [statusText, statusClass] = feedStatus(dealer);

              return (
                <article key={dealer.id} className="card p-5">
                  <div className="grid xl:grid-cols-[1fr_180px_180px_180px_auto] gap-3 items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-2xl font-black">{dealer.name || "Unnamed dealer"}</p>
                        <span className={`rounded-full px-3 py-2 text-xs font-black ${statusClass}`}>{statusText}</span>
                      </div>
                      <p className="text-ink/45 text-sm mt-1">{dealer.slug || dealer.id}</p>
                      {dealer.website && <p className="text-ink/45 text-sm break-all">{dealer.website}</p>}
                    </div>

                    <Mini label="Feed" value={dealer.stock_feed_type || "manual"} />
                    <Mini label="Last sync" value={niceDate(dealer.last_stock_sync_at)} />
                    <Mini label="Status" value={dealer.last_stock_sync_message || "No sync yet"} />

                    <form action={`/api/admin/dealers/${dealer.id}/sync-stock`} method="POST">
                      <button
                        className="btn-acid w-full"
                        type="submit"
                        disabled={!dealer.stock_feed_url || (dealer.stock_feed_type || "manual") !== "dealerkit"}
                      >
                        <RefreshCw size={16} className="mr-2" /> Sync stock
                      </button>
                    </form>
                  </div>

                  <form action={`/api/admin/dealers/${dealer.id}/update`} method="POST" className="mt-5 rounded-3xl bg-white/65 border border-ink/10 p-4">
                    <div className="grid lg:grid-cols-[1fr_160px_160px_160px] gap-3">
                      <select name="plan_name" defaultValue={dealer.plan_name || "starter"} className="input">
                        {Object.values(PLANS).map((plan) => (
                          <option key={plan.id} value={plan.id}>{plan.name}</option>
                        ))}
                      </select>

                      <select name="subscription_status" defaultValue={dealer.subscription_status || "active"} className="input">
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="trial">Trial</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <select name="approval_status" defaultValue={dealer.approval_status || "approved"} className="input">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="paused">Paused</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <select name="stock_feed_type" defaultValue={dealer.stock_feed_type || "manual"} className="input">
                        <option value="manual">Manual</option>
                        <option value="dealerkit">DealerKit</option>
                        <option value="json">JSON</option>
                        <option value="csv">CSV</option>
                      </select>
                    </div>

                    <div className="grid lg:grid-cols-[1fr_auto] gap-3 mt-3">
                      <input
                        name="stock_feed_url"
                        className="input"
                        placeholder="DealerKit JSON feed URL"
                        defaultValue={dealer.stock_feed_url || ""}
                      />
                      <button className="btn-secondary" type="submit">
                        <Save size={16} className="mr-2" /> Save feed
                      </button>
                    </div>

                    <textarea
                      name="admin_notes"
                      className="input mt-3 min-h-[90px]"
                      placeholder="Admin notes"
                      defaultValue={dealer.admin_notes || ""}
                    />
                  </form>
                </article>
              );
            })}
          </div>

          <section className="card p-6">
            <div className="flex gap-3">
              <DatabaseZap className="shrink-0" />
              <div>
                <h2 className="text-2xl font-black">How to connect a DealerKit site</h2>
                <p className="text-ink/55 mt-2">
                  Inspect the dealer website, find the DealerKit JSON source, paste it above, set feed type to DealerKit, save, then sync stock.
                </p>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/70 border border-ink/10 p-3 min-h-[70px]">
      <p className="text-[10px] uppercase tracking-[0.12em] font-black text-ink/35">{label}</p>
      <p className="text-sm font-black mt-1 break-words">{value || "Not set"}</p>
    </div>
  );
}

function Notice({ text, type }) {
  return (
    <div className={`rounded-3xl border p-4 font-black ${type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-acid/25 border-acid/50"}`}>
      {text}
    </div>
  );
}
