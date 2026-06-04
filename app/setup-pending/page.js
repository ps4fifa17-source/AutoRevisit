import { getDealerContext } from "@/lib/getDealer";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, Car, Sparkles } from "lucide-react";

export default async function SetupPendingPage() {
  const { dealer } = await getDealerContext();

  if (!dealer) redirect("/onboarding");
  if (dealer.subscription_status === "active") redirect("/dashboard");

  return (
    <main className="min-h-screen p-5 soft-grid flex items-center justify-center">
      <section className="max-w-4xl w-full grid lg:grid-cols-[1fr_0.9fr] gap-6">
        <div className="dark-card p-8 md:p-12">
          <p className="text-acid font-black mb-5">SIGNAL SETUP</p>
          <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
            Your dealership workspace is being prepared.
          </h1>
          <p className="text-white/62 text-lg mt-7">
            We’re getting your account ready, preparing your stock area and configuring the customer page engine for your dealership.
          </p>
        </div>

        <div className="card p-7">
          <h2 className="text-3xl font-black">Setup progress</h2>
          <p className="text-ink/55 mt-2">{dealer.name}</p>

          <div className="space-y-3 mt-7">
            <Step done icon={CheckCircle2} title="Dealership created" />
            <Step done icon={Sparkles} title="Brand workspace started" />
            <Step icon={Car} title="Stock import pending" />
            <Step icon={Clock} title="Awaiting activation" />
          </div>

          <div className="rounded-3xl bg-acid/30 border border-acid/40 p-5 mt-7">
            <p className="font-black">What happens next?</p>
            <p className="text-ink/65 mt-2">
              Once your stock and subscription are active, your dashboard unlocks automatically.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({ icon: Icon, title, done }) {
  return (
    <div className="flex items-center gap-4 rounded-3xl bg-white/75 border border-line p-4">
      <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${done ? "bg-acid" : "bg-ink text-acid"}`}>
        <Icon size={20} />
      </div>
      <p className="font-black">{title}</p>
    </div>
  );
}
