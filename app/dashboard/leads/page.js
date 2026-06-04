import DashboardNav from "@/components/DashboardNav";
import { getDealerContext } from "@/lib/getDealer";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, MessageCircle, Eye, Flame, Phone, Mail, Clock3 } from "lucide-react";
import { isActionEvent } from "@/lib/pageEvents";

function scoreLead(pages = [], events = []) {
  const views = events.filter((e) => e.event_type === "view").length;
  const actions = events.filter((e) => isActionEvent(e.event_type)).length;
  const score = Math.min(100, views * 12 + actions * 35 + Math.max(0, pages.length - 1) * 8);
  if (actions || views >= 4) return ["🔥 Hot", "bg-acid", "Follow up now", score || 75];
  if (views >= 2 || pages.length > 1) return ["🟡 Warm", "bg-yellow-200", "Worth a nudge", score || 45];
  return ["⚪ Cold", "bg-white", "Waiting for first signal", score || 10];
}

function lastEvent(events = []) {
  return events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
}

function niceEvent(e) {
  if (!e) return "No activity yet";
  return String(e.event_type || "activity")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function LeadsPage() {
  const { supabase, dealer } = await getDealerContext();
  if (!dealer) redirect("/onboarding");
  if (dealer.subscription_status !== "active") redirect("/setup-pending");

  const { data: customers } = await supabase
    .from("customers")
    .select("*, customer_pages(id, title, slug, created_at, page_goal, push_angle, page_type, who_for)")
    .eq("dealership_id", dealer.id)
    .order("created_at", { ascending: false });

  const pageIds = (customers || []).flatMap((c) => c.customer_pages || []).map((p) => p.id);
  const { data: events } = pageIds.length
    ? await supabase.from("page_events").select("*").in("customer_page_id", pageIds)
    : { data: [] };

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />
        <section>
          <div className="dark-card p-8 md:p-10 mb-6">
            <p className="text-acid font-black mb-4">Customer interest</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Leads</h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">See who is opening, revisiting and clicking your pages.</p>
          </div>

          {!(customers || []).length && (
            <div className="card p-8">
              <Users size={30} />
              <h2 className="text-3xl font-black mt-4">No leads yet</h2>
              <p className="text-ink/55 mt-3">Create customer pages and your leads will appear here with activity.</p>
              <Link href="/dashboard/pages/new" className="btn-acid mt-6">
                Create customer page
              </Link>
            </div>
          )}

          <div className="grid gap-4">
            {(customers || []).map((customer) => {
              const pages = customer.customer_pages || [];
              const ids = pages.map((p) => p.id);
              const customerEvents = (events || []).filter((e) => ids.includes(e.customer_page_id));
              const views = customerEvents.filter((e) => e.event_type === "view").length;
              const actions = customerEvents.filter((e) => isActionEvent(e.event_type)).length;
              const [temp, tempClass, reason, score] = scoreLead(pages, customerEvents);
              const latestPage = pages[0];
              const latest = lastEvent(customerEvents);

              return (
                <div key={customer.id} className="card p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded-full px-3 py-2 text-sm font-black ${tempClass}`}>{temp}</span>
                        <h2 className="text-3xl font-black">{customer.first_name || "Customer"}</h2>
                        <span className="badge">Score {score}</span>
                      </div>
                      <p className="text-ink/50 mt-2">
                        {customer.customer_type || latestPage?.who_for || latestPage?.push_angle || "Customer"} • {reason}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3 text-sm text-ink/50">
                        <span className="flex items-center gap-1">
                          <Phone size={14} /> {customer.phone || "No phone"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Mail size={14} /> {customer.email || "No email"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock3 size={14} /> {niceEvent(latest)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge">
                        <Eye size={15} className="mr-2" /> {views} views
                      </span>
                      <span className="badge">
                        <MessageCircle size={15} className="mr-2" /> {actions} actions
                      </span>
                      <span className="badge">
                        <Flame size={15} className="mr-2" /> {pages.length} pages
                      </span>
                    </div>
                  </div>
                  {customerEvents.length > 0 && (
                    <div className="mt-4 rounded-3xl bg-white/65 border border-ink/10 p-4">
                      <p className="text-xs uppercase tracking-[0.14em] font-black text-ink/35 mb-3">Recent activity</p>
                      <div className="grid gap-2">
                        {customerEvents
                          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                          .slice(0, 3)
                          .map((e) => (
                            <p key={e.id} className="text-sm text-ink/60">
                              • {niceEvent(e)} — {new Date(e.created_at).toLocaleString("en-GB")}
                            </p>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
