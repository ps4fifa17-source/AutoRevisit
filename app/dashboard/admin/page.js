import DashboardNav from "@/components/DashboardNav";
import { getDealerContext } from "@/lib/getDealer";
import { getAdminContext } from "@/lib/admin";
import { redirect } from "next/navigation";
import { PLANS, CUSTOMER_GOALS } from "@/lib/plans";
import { Users, ShieldCheck, SlidersHorizontal, GalleryHorizontal, Gem, Wallet, Zap, SmilePlus, BriefcaseBusiness } from "lucide-react";

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
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <div className="dark-card p-8 md:p-10">
            <p className="text-acid font-black mb-4">Admin</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Platform control.</h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">
              Approve dealers, change packages, test limits and compare customer page goals.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            <Metric icon={ShieldCheck} label="Admin mode" value="On" />
            <Metric icon={Users} label="Dealers" value={dealerCount || 0} />
            <Metric icon={Users} label="Users" value={userCount || 0} />
            <Metric icon={SlidersHorizontal} label="Pages" value={pageCount || 0} />
          </div>

          <section className="card p-7">
            <p className="badge mb-3">Package tester</p>
            <h2 className="text-4xl font-black">Test package access</h2>
            <p className="text-ink/55 mt-2">This changes only your admin test view. It does not change billing.</p>

            <div className="grid md:grid-cols-4 gap-3 mt-6">
              {Object.values(PLANS).map((plan) => (
                <form key={plan.id} action="/api/admin/profile/test-plan" method="POST">
                  <input type="hidden" name="test_plan" value={plan.id} />
                  <button className={`card p-5 text-left w-full ${profile?.test_plan === plan.id ? "ring-4 ring-acid/40" : ""}`}>
                    <p className="font-black text-xl">{plan.name}</p>
                    <p className="text-ink/50 mt-1">{plan.price}/month</p>
                    <p className="badge mt-4">{profile?.test_plan === plan.id ? "Testing now" : "Test"}</p>
                  </button>
                </form>
              ))}

              <form action="/api/admin/profile/test-plan" method="POST">
                <input type="hidden" name="test_plan" value="clear" />
                <button className="card p-5 text-left w-full">
                  <p className="font-black text-xl">Clear test</p>
                  <p className="text-ink/50 mt-1">Return to live plan.</p>
                  <p className="badge mt-4">Clear</p>
                </button>
              </form>
            </div>
          </section>

          <section className="card p-7">
            <p className="badge mb-3">Dealer approvals</p>
            <h2 className="text-4xl font-black">Manage dealers</h2>
            <p className="text-ink/55 mt-2">Approve, pause and change packages from one place.</p>

            <div className="grid gap-4 mt-6">
              {(dealers || []).map((dealer) => (
                <form key={dealer.id} action={`/api/admin/dealers/${dealer.id}/update`} method="POST" className="rounded-3xl bg-white/70 border border-ink/10 p-5">
                  <div className="grid lg:grid-cols-[1fr_170px_170px_170px_auto] gap-3 items-center">
                    <div>
                      <p className="text-2xl font-black">{dealer.name || "Unnamed dealer"}</p>
                      <p className="text-ink/45 text-sm">{dealer.slug || "No slug"}</p>
                    </div>

                    <select name="plan_name" defaultValue={dealer.plan_name || "starter"} className="input">
                      {Object.values(PLANS).map((plan) => <option key={plan.id} value={plan.id}>{plan.name}</option>)}
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

                    <button className="btn-acid" type="submit">Save</button>
                  </div>

                  <textarea name="admin_notes" className="input mt-4 min-h-[80px]" placeholder="Admin notes" defaultValue={dealer.admin_notes || ""} />
                </form>
              ))}
            </div>
          </section>

          <section className="card p-7">
            <p className="badge mb-3">Page lab</p>
            <h2 className="text-4xl font-black">Customer goal designs</h2>
            <p className="text-ink/55 mt-2">These are the six customer page directions. Final styling is pulled from dealer logo and colour.</p>

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
  return <div className="card p-6"><Icon size={22} /><p className="text-4xl font-black mt-5">{value}</p><p className="text-ink/50 font-bold mt-1">{label}</p></div>;
}

function StyleCard({ goal }) {
  const Icon = goal.id === "premium" ? Gem : goal.id === "finance" ? Wallet : goal.id === "performance" ? Zap : goal.id === "executive" ? BriefcaseBusiness : SmilePlus;
  return <article className="rounded-[36px] overflow-hidden bg-[#08090a] text-white shadow-xl"><div className="p-6"><Icon className="text-purple-400" /><p className="text-sm font-black mt-8 text-purple-300">{goal.label.toUpperCase()}</p><h3 className="text-5xl font-black leading-[0.85] mt-2">Hello Joe</h3><p className="text-white/60 mt-4">{goal.description}</p><div className="h-56 rounded-[28px] bg-white/10 mt-6 flex items-center justify-center text-white/35 font-black">Vehicle image</div><div className="grid grid-cols-2 gap-3 mt-4"><div className="h-12 rounded-2xl bg-purple-700" /><div className="h-12 rounded-2xl border border-white/15" /></div></div></article>;
}
