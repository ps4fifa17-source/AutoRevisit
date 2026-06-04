import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import WorkspaceTour from "@/components/WorkspaceTour";
import { BRAND } from "@/lib/brand";
import { getDealerContext } from "@/lib/getDealer";
import { getPlan } from "@/lib/plans";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Car,
  FileStack,
  Users,
  BarChart3,
  Plus,
  Send,
  HeartHandshake,
  Flame,
  Eye,
  MessageCircle,
} from "lucide-react";
import { isActionEvent } from "@/lib/pageEvents";

function leadTemperature(events = []) {
  const views = events.filter((e) => e.event_type === "view").length;
  const actions = events.filter((e) => isActionEvent(e.event_type)).length;
  if (actions || views >= 4) return ["Hot", "bg-acid"];
  if (views >= 2) return ["Warm", "bg-yellow-200"];
  return ["New", "bg-white"];
}

export default async function DashboardPage() {
  const { supabase, dealer } = await getDealerContext();

  if (!dealer) redirect("/onboarding");
  if (dealer.subscription_status !== "active") redirect("/setup-pending");

  const planName = dealer.plan_name || "starter";
  const plan = getPlan(planName);

  const [{ count: vehicleCount }, { count: pageCount }, { data: recentPages }, { data: customers }] = await Promise.all([
    supabase.from("vehicles").select("*", { count: "exact", head: true }).eq("dealership_id", dealer.id),
    supabase.from("customer_pages").select("*", { count: "exact", head: true }).eq("dealership_id", dealer.id).is("archived_at", null),
    supabase
      .from("customer_pages")
      .select("id, slug, title, created_at, page_goal, customers(first_name), customer_page_vehicles(vehicles(make,model,year,image_urls))")
      .eq("dealership_id", dealer.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("customers")
      .select("id, first_name, customer_type, created_at, customer_pages(id, title, slug)")
      .eq("dealership_id", dealer.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const pageIds = (recentPages || []).map((p) => p.id);
  const { data: events } = pageIds.length
    ? await supabase.from("page_events").select("*").in("customer_page_id", pageIds).order("created_at", { ascending: false }).limit(20)
    : { data: [] };

  const hotCount = (customers || []).filter((customer) => {
    const ids = (customer.customer_pages || []).map((p) => p.id);
    const customerEvents = (events || []).filter((e) => ids.includes(e.customer_page_id));
    const [temp] = leadTemperature(customerEvents);
    return temp === "Hot";
  }).length;

  return (
    <main className="min-h-screen p-4 md:p-6">
      <WorkspaceTour plan={planName} />

      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <div className="dark-card p-8 md:p-10 overflow-hidden relative">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-acid/20 blur-3xl" />
            <div className="relative">
              <p className="text-acid font-black mb-4">{BRAND.name}</p>
              <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
                Your journey command centre.
              </h1>
              <p className="text-white/60 text-lg mt-6 max-w-2xl">
                Add stock, create personalised pages, follow buyer activity and keep customers coming back to the car.
              </p>
              <div className="flex flex-wrap gap-3 mt-8">
                <Link href="/dashboard/pages/new" className="btn-acid">
                  Create customer page <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link href="/dashboard/vehicles/new" className="rounded-full px-5 py-4 font-black bg-white/8 border border-white/10 hover:bg-white/12">
                  Add vehicle
                </Link>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <Metric icon={Car} label="Vehicles" value={vehicleCount || 0} href="/dashboard/vehicles" />
            <Metric icon={FileStack} label="Live pages" value={pageCount || 0} href="/dashboard/live-pages" />
            <Metric icon={Flame} label="Hot leads" value={hotCount} href="/dashboard/leads" />
            <Metric icon={BarChart3} label="Insights" value={plan.analyticsEnabled ? "Live" : "Pro"} href="/dashboard/analytics" />
          </div>

          <section className="card p-7">
            <p className="badge mb-4">Quick actions</p>
            <div className="grid md:grid-cols-3 gap-4">
              <Action href="/dashboard/vehicles/new" icon={Plus} title="Add Vehicle" text="Add stock manually or start from a reg lookup." />
              <Action href="/dashboard/pages/new" icon={Send} title="Create Page" text="Build a customer journey with mood and page previews." />
              <Action href="/dashboard/thank-you" icon={HeartHandshake} title="Thank You Page" text="Send a simple branded page after handover." />
            </div>
          </section>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-5">
            <section className="card p-7">
              <div className="flex items-center justify-between">
                <div>
                  <p className="badge mb-3">Live journeys</p>
                  <h2 className="text-3xl font-black">Recent customer pages</h2>
                </div>
                <Link href="/dashboard/live-pages" className="btn-secondary">View all</Link>
              </div>

              <div className="grid gap-3 mt-6">
                {(recentPages || []).length ? (recentPages || []).map((page) => {
                  const eventsForPage = (events || []).filter((event) => event.customer_page_id === page.id);
                  const views = eventsForPage.filter((event) => event.event_type === "view").length;
                  const actions = eventsForPage.filter((event) => isActionEvent(event.event_type)).length;
                  const [temp, tempClass] = leadTemperature(eventsForPage);
                  return (
                    <div key={page.id} className="rounded-3xl border border-ink/10 bg-white/70 p-4 flex items-center justify-between gap-4">
                      <div>
                        <span className={`rounded-full px-3 py-1 text-xs font-black ${tempClass}`}>{temp}</span>
                        <p className="font-black mt-2">{page.title || "Customer page"}</p>
                        <p className="text-sm text-ink/45">{page.customers?.first_name || "Customer"} • {page.page_goal || "showcase"}</p>
                      </div>
                      <div className="flex gap-2">
                        <span className="badge"><Eye size={14} className="mr-1" /> {views}</span>
                        <span className="badge"><MessageCircle size={14} className="mr-1" /> {actions}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="rounded-3xl border border-dashed border-ink/15 p-7 text-center">
                    <p className="font-black">No live pages yet</p>
                    <p className="text-ink/50 mt-2">Create your first customer journey when ready.</p>
                  </div>
                )}
              </div>
            </section>

            <section className="card p-7">
              <p className="badge mb-3">Package</p>
              <h2 className="text-3xl font-black">{plan.name}</h2>
              <p className="text-ink/55 mt-2">{plan.description}</p>
              <div className="rounded-3xl bg-white/70 border border-ink/10 p-5 mt-6">
                <p className="text-xs font-black uppercase text-ink/40">Phase 3 focus</p>
                <p className="font-black mt-2">Customer journey pages now use mood previews, journey types and AI sections.</p>
              </div>
              <Link href="/dashboard/upgrade" className="btn-secondary mt-6">View upgrades</Link>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ title, value, icon: Icon, href }) {
  return (
    <Link href={href} className="card p-6 hover:-translate-y-1 transition group">
      <div className="h-11 w-11 rounded-2xl bg-ink/5 flex items-center justify-center group-hover:bg-ink group-hover:text-acid transition">
        <Icon size={20} />
      </div>
      <p className="text-4xl font-black mt-5">{value}</p>
      <p className="text-ink/50 font-bold mt-1">{title}</p>
    </Link>
  );
}

function Action({ href, icon: Icon, title, text }) {
  return (
    <Link href={href} className="rounded-[32px] bg-white/70 border border-ink/10 p-6 hover:-translate-y-1 transition">
      <div className="h-12 w-12 rounded-3xl bg-acid flex items-center justify-center">
        <Icon size={20} />
      </div>
      <p className="text-2xl font-black mt-5">{title}</p>
      <p className="text-ink/55 mt-2">{text}</p>
    </Link>
  );
}
