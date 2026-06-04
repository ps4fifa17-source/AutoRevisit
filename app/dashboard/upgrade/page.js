import DashboardNav from "@/components/DashboardNav";
import { getDealerContext } from "@/lib/getDealer";
import { getEffectivePlanName } from "@/lib/planAccess";
import { getPlan, PLANS, getPlanAction } from "@/lib/plans";
import { redirect } from "next/navigation";
import { CheckCircle, Sparkles, ArrowRight, Lock } from "lucide-react";

export default async function UpgradePage() {
  const { dealer, profile } = await getDealerContext();

  if (!dealer) redirect("/onboarding");
  if (dealer.subscription_status !== "active") redirect("/setup-pending");

  const currentPlanName = getEffectivePlanName(dealer, profile);
  const current = getPlan(currentPlanName);

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <div className="dark-card p-8 md:p-10">
            <p className="text-acid font-black mb-4">Packages</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Clear packages. Clear limits.</h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">
              Current access: {current.name}. Starter is locked to Simple only and 10 live pages.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {Object.values(PLANS).map((plan) => {
              const action = getPlanAction(current.id, plan.id);
              const active = action === "Current plan";
              const included = action === "Included";

              return (
                <article key={plan.id} className={`card p-7 relative overflow-hidden ${active ? "ring-4 ring-acid/40" : ""}`}>
                  <p className={`badge mb-4 ${active ? "bg-acid" : ""}`}>{action}</p>

                  <div className="h-12 w-12 rounded-3xl bg-ink text-acid flex items-center justify-center">
                    {included ? <Lock size={20} /> : <Sparkles size={20} />}
                  </div>

                  <h2 className="text-4xl font-black mt-5">{plan.name}</h2>

                  <div className="mt-4">
                    <span className="text-5xl font-black">{plan.price}</span>
                    <span className="text-ink/45 font-bold ml-2">{plan.period}</span>
                  </div>

                  <p className="text-ink/55 mt-4">{plan.description}</p>

                  <div className="rounded-3xl bg-white/70 border border-ink/10 p-4 mt-6">
                    <p className="text-xs font-black text-ink/40 uppercase">Live page limit</p>
                    <p className="text-2xl font-black mt-1">{plan.livePagesLimit === Infinity ? "Unlimited" : plan.livePagesLimit}</p>
                  </div>

                  <div className="space-y-3 mt-6">
                    {plan.features.map((item) => (
                      <div key={item} className="flex gap-3">
                        <CheckCircle size={18} className="text-ink mt-0.5" />
                        <p className="font-bold">{item}</p>
                      </div>
                    ))}
                  </div>

                  {!!plan.locked.length && (
                    <div className="mt-6 rounded-3xl bg-ink/5 p-4">
                      <p className="text-xs font-black text-ink/35 uppercase mb-3">Not included</p>
                      <div className="space-y-2">
                        {plan.locked.map((item) => <p key={item} className="text-sm text-ink/45 font-bold">— {item}</p>)}
                      </div>
                    </div>
                  )}

                  <a href="mailto:support@autorevisit.co.uk" className={action === "Upgrade" ? "btn-acid w-full mt-6" : "btn-secondary w-full mt-6"}>
                    {action} {action === "Upgrade" && <ArrowRight size={17} className="ml-2" />}
                  </a>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
