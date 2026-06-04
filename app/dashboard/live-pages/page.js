import Link from "next/link";
import DashboardNav from "@/components/DashboardNav";
import CopyLinkButton from "@/components/CopyLinkButton";
import { getDealerContext } from "@/lib/getDealer";
import { redirect } from "next/navigation";
import { Plus, Eye, MessageCircle, Repeat2, Pencil, Trash2, CopyPlus } from "lucide-react";
import { isActionEvent } from "@/lib/pageEvents";

function carTitle(vehicle) {
  return [vehicle?.year, vehicle?.make, vehicle?.model].filter(Boolean).join(" ") || "Vehicle not linked";
}

function nice(value) {
  if (!value) return "Not set";
  const map = {
    revisit: "Customer Revisit",
    enquiry: "Enquiry Follow Up",
    thank_you: "Thank You",
    firstcar: "First Car",
    first_car: "First Car",
    clean_light: "Clean Light",
    finance_focus: "Finance Focus",
    warm_family: "Warm Family",
    dark_premium: "Dark Premium",
    executive_minimal: "Executive Minimal",
    luxury_dark: "Luxury Dark",
  };

  return map[value] || String(value).replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function leadTemperature(events = []) {
  const views = events.filter((event) => event.event_type === "view").length;
  const actions = events.filter((event) => isActionEvent(event.event_type)).length;

  if (actions || views >= 4) return ["🔥 Hot", "bg-acid"];
  if (views >= 2) return ["🟡 Warm", "bg-yellow-200"];
  return ["⚪ Cold", "bg-white"];
}

export default async function LivePagesPage({ searchParams }) {
  const { supabase, dealer } = await getDealerContext();
  const limitError = searchParams?.error === "page_limit";

  if (!dealer) redirect("/onboarding");
  if (dealer.subscription_status !== "active") redirect("/setup-pending");

  const { data: pages } = await supabase
    .from("customer_pages")
    .select("*, customers(*), customer_page_vehicles(*, vehicles(*))")
    .eq("dealership_id", dealer.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  const ids = (pages || []).map((page) => page.id);

  const { data: events } = ids.length
    ? await supabase.from("page_events").select("*").in("customer_page_id", ids)
    : { data: [] };

  const eventsByPage = {};
  (events || []).forEach((event) => {
    eventsByPage[event.customer_page_id] ||= [];
    eventsByPage[event.customer_page_id].push(event);
  });

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section>
          <div className="dark-card p-8 md:p-10 mb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
              <div>
                <p className="text-acid font-black mb-4">Customer pages</p>
                <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Live pages</h1>
                <p className="text-white/60 text-lg mt-6 max-w-2xl">Preview, share, duplicate and track every page.</p>
              </div>
              <Link href="/dashboard/pages/new" className="btn-acid">
                <Plus size={18} className="mr-2" /> Create page
              </Link>
            </div>
          </div>

          {limitError && (
            <div className="card p-6 mb-6 border-2 border-red-200">
              <h2 className="text-2xl font-black">Page limit reached</h2>
              <p className="text-ink/55 mt-2">You cannot duplicate another page until you upgrade or remove a live page.</p>
              <Link href="/dashboard/upgrade" className="btn-acid mt-4 inline-flex">
                View upgrade options
              </Link>
            </div>
          )}

          {!(pages || []).length && (
            <div className="card p-8 mb-6">
              <h2 className="text-3xl font-black">No pages yet</h2>
              <p className="text-ink/55 mt-3">Create your first customer page from a vehicle.</p>
              <Link href="/dashboard/pages/new" className="btn-acid mt-6">Create first page</Link>
            </div>
          )}

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-5">
            {(pages || []).map((page) => {
              const firstVehicle = page.customer_page_vehicles?.[0]?.vehicles;
              const link = `${site}/p/${dealer.slug}/${page.slug}`;
              const pageEvents = eventsByPage[page.id] || [];
              const views = pageEvents.filter((event) => event.event_type === "view").length;
              const actions = pageEvents.filter((event) => isActionEvent(event.event_type)).length;
              const [temp, tempClass] = leadTemperature(pageEvents);

              return (
                <article key={page.id} className="card overflow-hidden">
                  <div className="h-52 bg-ink/8 relative">
                    {firstVehicle?.image_urls?.[0] ? (
                      <img src={firstVehicle.image_urls[0]} className="h-full w-full object-cover" alt="" />
                    ) : (
                      <div className="h-full flex items-center justify-center text-ink/35 font-black">Page preview</div>
                    )}
                    <span className={`absolute top-4 left-4 rounded-full px-3 py-2 text-sm font-black ${tempClass}`}>{temp}</span>
                  </div>

                  <div className="p-5">
                    <p className="badge mb-3">{nice(page.page_type || "revisit")}</p>
                    <h2 className="text-2xl font-black">{page.customers?.first_name || "Customer"}</h2>
                    <p className="text-ink/55 mt-1">{carTitle(firstVehicle)}</p>

                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Mini label="Audience" value={nice(page.who_for || page.buying_for)} />
                      <Mini label="Focus" value={nice(page.push_angle || page.page_goal)} />
                      <Mini label="Style" value={nice(page.design_style || page.page_style)} />
                      <Mini label="Created" value={formatDate(page.created_at)} />
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-5">
                      <Stat icon={Eye} label="Views" value={views} />
                      <Stat icon={Repeat2} label="Revisits" value={Math.max(0, views - 1)} />
                      <Stat icon={MessageCircle} label="Actions" value={actions} />
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-5">
                      <a href={link} target="_blank" rel="noreferrer" className="btn text-sm">Preview</a>
                      <Link href={`/dashboard/live-pages/${page.id}/edit`} className="btn-secondary text-sm">
                        <Pencil size={15} className="mr-1" /> Edit
                      </Link>
                      <CopyLinkButton value={link} label="Copy link" />
                      <form action={`/api/customer-pages/${page.id}/duplicate`} method="POST">
                        <button className="btn-secondary text-sm w-full" type="submit">
                          <CopyPlus size={15} className="mr-1" /> Duplicate
                        </button>
                      </form>
                      <form action={`/api/customer-pages/${page.id}/delete`} method="POST" className="col-span-2">
                        <button className="btn-secondary text-sm w-full" type="submit">
                          <Trash2 size={15} className="mr-1" /> Delete
                        </button>
                      </form>
                    </div>
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

function Mini({ label, value }) {
  return (
    <div className="rounded-2xl bg-white/65 border border-ink/10 p-3">
      <p className="text-[10px] uppercase tracking-[0.12em] font-black text-ink/35">{label}</p>
      <p className="text-sm font-black mt-1">{value}</p>
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white/70 border border-ink/10 p-3">
      <Icon size={16} />
      <p className="font-black mt-2">{value}</p>
      <p className="text-xs text-ink/45">{label}</p>
    </div>
  );
}
