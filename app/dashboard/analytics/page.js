import DashboardNav from "@/components/DashboardNav";
import LockedFeature from "@/components/LockedFeature";
import { getDealerContext } from "@/lib/getDealer";
import { getPlan } from "@/lib/plans";
import { redirect } from "next/navigation";
import { BarChart3, Eye, MousePointerClick, Repeat2, Trophy, MessageCircle } from "lucide-react";
import { isActionEvent } from "@/lib/pageEvents";

export default async function AnalyticsPage() {
  const { supabase, dealer } = await getDealerContext();
  if (!dealer) redirect("/onboarding");
  if (dealer.subscription_status !== "active") redirect("/setup-pending");

  const plan = getPlan(dealer.plan_name || "starter");
  const analyticsUnlocked = plan.advancedInsights || plan.leadScoring || dealer.plan_name !== "starter";

  const { data: pages } = await supabase
    .from("customer_pages")
    .select("id, title, created_at, page_style, push_angle, page_type")
    .eq("dealership_id", dealer.id)
    .is("deleted_at", null);

  const ids = (pages || []).map((p) => p.id);
  const { data: events } = ids.length
    ? await supabase.from("page_events").select("*").in("customer_page_id", ids)
    : { data: [] };

  const all = events || [];
  const views = all.filter((e) => e.event_type === "view").length;
  const whatsapp = all.filter((e) => e.event_type === "whatsapp_click" || e.event_type === "message_click").length;
  const calls = all.filter((e) => e.event_type === "call_click").length;
  const actions = all.filter((e) => isActionEvent(e.event_type)).length;
  const revisits = Math.max(0, views - (pages?.length || 0));
  const revisitRate = views ? Math.round((revisits / views) * 100) : 0;
  const topFocus = topValue((pages || []).map((p) => p.push_angle || "reassurance"));

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />
        <section className="space-y-5">
          <div className="dark-card p-8 md:p-10">
            <p className="text-acid font-black mb-4">Insights</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Understand buyer attention.</h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">Track views, revisits, WhatsApp clicks and customer intent.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            <Metric icon={Eye} title="Page views" value={analyticsUnlocked ? views : "Pro"} />
            <Metric icon={Repeat2} title="Revisits" value={analyticsUnlocked ? revisits : "Pro"} />
            <Metric icon={MousePointerClick} title="CTA clicks" value={analyticsUnlocked ? actions : "Pro"} />
            <Metric icon={BarChart3} title="Live pages" value={pages?.length || 0} />
          </div>
          {!analyticsUnlocked && (
            <LockedFeature
              title="Advanced analytics are locked"
              description="Upgrade to Professional to track revisits, CTA clicks, page performance and customer intent."
              requiredPlan="Professional"
            />
          )}
          {analyticsUnlocked && (
            <>
              <section className="card p-7">
                <h2 className="text-3xl font-black">Performance summary</h2>
                <p className="text-ink/55 mt-2">This becomes powerful once customers open links and revisit pages.</p>
                <div className="grid md:grid-cols-4 gap-4 mt-6">
                  <Insight title="Revisit rate" value={`${revisitRate}%`} />
                  <Insight title="Message clicks" value={whatsapp} />
                  <Insight title="Call clicks" value={calls} />
                  <Insight title="Top focus" value={nice(topFocus) || "No data yet"} />
                </div>
              </section>
              <section className="card p-7">
                <h2 className="text-3xl font-black flex items-center gap-2">
                  <Trophy /> Top pages
                </h2>
                <div className="grid gap-3 mt-5">
                  {(pages || []).slice(0, 5).map((page) => {
                    const pe = all.filter((e) => e.customer_page_id === page.id);
                    const pv = pe.filter((e) => e.event_type === "view").length;
                    const pa = pe.filter((e) => isActionEvent(e.event_type)).length;
                    return (
                      <div key={page.id} className="rounded-3xl bg-white/70 border border-ink/10 p-4 flex items-center justify-between">
                        <div>
                          <p className="font-black">{page.title || "Customer page"}</p>
                          <p className="text-sm text-ink/45">
                            {nice(page.page_type)} • {nice(page.push_angle)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <span className="badge">
                            <Eye size={14} className="mr-1" /> {pv}
                          </span>
                          <span className="badge">
                            <MessageCircle size={14} className="mr-1" /> {pa}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
function topValue(items){const counts={}; items.filter(Boolean).forEach(i=>{counts[i]=(counts[i]||0)+1}); return Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0]||""}
function nice(value){return String(value||"").replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase())}
function Metric({icon:Icon,title,value}){return <div className="card p-6"><Icon size={22}/><p className="text-4xl font-black mt-5">{value}</p><p className="text-ink/50 font-bold mt-1">{title}</p></div>}
function Insight({title,value}){return <div className="rounded-3xl bg-white/70 border border-ink/10 p-5"><p className="text-xs font-black text-ink/40 uppercase">{title}</p><p className="text-2xl font-black mt-2">{value}</p></div>}
