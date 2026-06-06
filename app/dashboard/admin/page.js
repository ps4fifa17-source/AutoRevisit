import DashboardNav from "@/components/DashboardNav";
import { getDealerContext } from "@/lib/getDealer";
import { getAdminContext } from "@/lib/admin";
import { redirect } from "next/navigation";
import { PLANS, CUSTOMER_GOALS } from "@/lib/plans";
import {
  Users,
  ShieldCheck,
  SlidersHorizontal,
  Gem,
  Wallet,
  Zap,
  SmilePlus,
  BriefcaseBusiness,
  DatabaseZap,
  RefreshCw,
  Link2,
} from "lucide-react";

function timeAgo(value) {
  if (!value) return "Never";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Never";

  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default async function AdminPage() {
  const { supabase } = await getDealerContext();
  const { isAdmin, profile } = await getAdminContext(supabase);

  if (!isAdmin) redirect("/dashboard");

  const [{ data: dealers }, { count: dealerCount }, { count: userCount }, { count: pageCount }] = await Promise.all([
    supabase.from("dealerships").select("*").order("created_at", { ascending: false }),
    supabase.from("dealerships").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("customer_pages").select("*", { count: "exact", head: true }),
  ]);

  return (
    <main className="min-h-screen bg-[#050607] text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <div className="relative overflow-hidden rounded-[44px] border border-acid/15 bg-[radial-gradient(circle_at_top_right,rgba(199,253,98,.28),transparent_34%),linear-gradient(145deg,#111318,#050607)] p-8 md:p-12 shadow-2xl">
            <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:42px_42px]" />
            <div className="relative">
              <p className="inline-flex rounded-full bg-acid text-black px-4 py-2 text-sm font-black mb-5">
                Alfie control room
              </p>
              <h1 className="text-5xl md:text-8xl font-black leading-[0.86] tracking-[-0.06em]">
                Admin command centre.
              </h1>
              <p className="text-white/55 text-lg mt-6 max-w-2xl">
                Approve dealers, change packages, connect stock feeds and sync live inventory from one place.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Metric icon={ShieldCheck} label="Admin mode" value="On" />
            <Metric icon={Users} label="Dealers" value={dealerCount || 0} />
            <Metric icon={Users} label="Users" value={userCount || 0} />
            <Metric icon={SlidersHorizontal} label="Pages" value={pageCount || 0} />
          </div>

          <section className="rounded-[40px] border border-white/10 bg-white/[0.04] p-7">
            <p className="badge mb-3">Package tester</p>
            <h2 className="text-4xl font-black">Test package access</h2>
            <p className="text-white/45 mt-2">This changes only your admin test view. It does not change billing.</p>

            <div className="grid md:grid-cols-4 gap-3 mt-6">
              {Object.values(PLANS).map((plan) => (
                <form key={plan.id} action="/api/admin/profile/test-plan" method="POST">
                  <input type="hidden" name="test_plan" value={plan.id} />
                  <button className={`rounded-[28px] border border-white/10 bg-white/[0.06] p-5 text-left w-full hover:border-acid/40 transition ${profile?.test_plan === plan.id ? "ring-4 ring-acid/30" : ""}`}>
                    <p className="font-black text-xl">{plan.name}</p>
                    <p className="text-white/45 mt-1">{plan.price}/month</p>
                    <p className="inline-flex mt-4 rounded-full bg-acid px-3 py-1 text-xs font-black text-black">
                      {profile?.test_plan === plan.id ? "Testing now" : "Test"}
                    </p>
                  </button>
                </form>
              ))}

              <form action="/api/admin/profile/test-plan" method="POST">
                <input type="hidden" name="test_plan" value="clear" />
                <button className="rounded-[28px] border border-white/10 bg-white/[0.06] p-5 text-left w-full hover:border-acid/40 transition">
                  <p className="font-black text-xl">Clear test</p>
                  <p className="text-white/45 mt-1">Return to live plan.</p>
                  <p className="inline-flex mt-4 rounded-full bg-white/10 px-3 py-1 text-xs font-black">Clear</p>
                </button>
              </form>
            </div>
          </section>

          <section className="rounded-[40px] border border-white/10 bg-white/[0.04] p-7">
            <p className="badge mb-3">Dealer operations</p>
            <h2 className="text-4xl font-black">Manage dealers</h2>
            <p className="text-white/45 mt-2">Approve, pause, change packages, connect DealerKit feeds and sync stock.</p>

            <div className="grid gap-5 mt-6">
              {(dealers || []).map((dealer) => {
                const connected = !!dealer.stock_feed_url;
                const saveFormId = `dealer-save-${dealer.id}`;

                return (
                  <article key={dealer.id} className="rounded-[36px] border border-white/10 bg-[#0c0e11] p-5 shadow-xl">
                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-3xl bg-acid text-black flex items-center justify-center">
                            <DatabaseZap size={22} />
                          </div>
                          <div>
                            <p className="text-3xl font-black">{dealer.name || "Unnamed dealer"}</p>
                            <p className="text-white/40 text-sm">{dealer.slug || "No slug"}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <span className="rounded-full bg-white/8 border border-white/10 px-3 py-2 text-xs font-black">
                            {dealer.plan_name || "starter"}
                          </span>
                          <span className={`rounded-full px-3 py-2 text-xs font-black ${connected ? "bg-acid text-black" : "bg-white/8 text-white"}`}>
                            {connected ? "Stock connected" : "No stock feed"}
                          </span>
                          <span className="rounded-full bg-white/8 border border-white/10 px-3 py-2 text-xs font-black">
                            Synced: {timeAgo(dealer.last_stock_sync_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button form={saveFormId} className="btn-acid" type="submit">
                          Save
                        </button>

                        <form action={`/api/admin/dealers/${dealer.id}/sync-stock`} method="POST">
                          <button className="rounded-full px-5 py-4 font-black bg-white text-black hover:bg-acid transition" type="submit">
                            <RefreshCw size={17} className="inline mr-2" />
                            Sync stock
                          </button>
                        </form>
                      </div>
                    </div>

                    <form id={saveFormId} action={`/api/admin/dealers/${dealer.id}/update`} method="POST" className="mt-6 grid gap-4">
                      <div className="grid lg:grid-cols-3 gap-3">
                        <select name="plan_name" defaultValue={dealer.plan_name || "starter"} className="input">
                          {Object.values(PLANS).map((plan) => (
                            <option key={plan.id} value={plan.id}>{plan.name}</option>
                          ))}
                        </select>

                        <select name="subscription_status" defaultValue={dealer.subscription_status || "active"} className="input">
                          <option value="active">Active</option>
                          <option value="trial">Trial</option>
                          <option value="paused">Paused</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        <select name="approval_status" defaultValue={dealer.approval_status || "approved"} className="input">
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="paused">Paused</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="rounded-[30px] border border-acid/20 bg-acid/[0.04] p-4">
                        <div className="flex items-center gap-2 mb-4">
                          <Link2 size={18} className="text-acid" />
                          <p className="font-black">Stock feed connection</p>
                        </div>

                        <div className="grid lg:grid-cols-[180px_1fr] gap-3">
                          <select name="stock_feed_type" defaultValue={dealer.stock_feed_type || "manual"} className="input">
                            <option value="manual">Manual</option>
                            <option value="dealerkit">DealerKit</option>
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                          </select>

                          <input
                            name="stock_feed_url"
                            defaultValue={dealer.stock_feed_url || ""}
                            className="input"
                            placeholder="Paste DealerKit / JSON feed URL"
                          />
                        </div>
                      </div>

                      <textarea
                        name="admin_notes"
                        className="input min-h-[90px]"
                        placeholder="Admin notes"
                        defaultValue={dealer.admin_notes || ""}
                      />
                    </form>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="rounded-[40px] border border-white/10 bg-white/[0.04] p-7">
            <p className="badge mb-3">Page lab</p>
            <h2 className="text-4xl font-black">Customer goal designs</h2>
            <p className="text-white/45 mt-2">These are the customer page directions. Final styling is pulled from dealer logo and colour.</p>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5 mt-6">
              {Object.values(CUSTOMER_GOALS).map((goal) => <StyleCard key={goal.id} goal={goal} />)}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6">
      <Icon size={22} className="text-acid" />
      <p className="text-4xl font-black mt-5">{value}</p>
      <p className="text-white/45 font-bold mt-1">{label}</p>
    </div>
  );
}

function StyleCard({ goal }) {
  const Icon =
    goal.id === "premium" ? Gem :
    goal.id === "finance" ? Wallet :
    goal.id === "performance" ? Zap :
    goal.id === "executive" ? BriefcaseBusiness :
    SmilePlus;

  return (
    <article className="rounded-[36px] overflow-hidden bg-[#08090a] text-white shadow-xl border border-white/10">
      <div className="p-6">
        <Icon className="text-acid" />
        <p className="text-sm font-black mt-8 text-acid">{goal.label.toUpperCase()}</p>
        <h3 className="text-5xl font-black leading-[0.85] mt-2">Hello Joe</h3>
        <p className="text-white/60 mt-4">{goal.description}</p>
        <div className="h-56 rounded-[28px] bg-white/10 mt-6 flex items-center justify-center text-white/35 font-black">
          Vehicle image
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="h-12 rounded-2xl bg-acid" />
          <div className="h-12 rounded-2xl border border-white/15" />
        </div>
      </div>
    </article>
  );
}