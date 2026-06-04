import DashboardNav from "@/components/DashboardNav";
import { BRAND } from "@/lib/brand";
import { getDealerContext } from "@/lib/getDealer";
import { redirect } from "next/navigation";
import { Lock, Palette, Phone, Globe, Save } from "lucide-react";

export default async function SettingsPage() {
  const { dealer } = await getDealerContext();

  if (!dealer) redirect("/onboarding");
  if (dealer.subscription_status !== "active") redirect("/setup-pending");

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <div className="dark-card p-8 md:p-10">
            <p className="text-acid font-black mb-4">Settings</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
              Dealer workspace.
            </h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">
              Control the brand, contact details and links used across customer pages.
            </p>
          </div>

          <form action="/api/dealer/settings" method="POST" className="card p-7 md:p-9">
            <p className="badge mb-5">Editable brand details</p>

            <div className="grid lg:grid-cols-3 gap-4">
              <Field icon={Palette} label="Dealership name">
                <input name="name" className="input" defaultValue={dealer.name || ""} placeholder="Dealership name" />
              </Field>
              <Field icon={Palette} label="Primary colour">
                <input name="primary_color" className="input" defaultValue={dealer.primary_color || "#B8FF3C"} placeholder="#B8FF3C" />
              </Field>
              <Field icon={Palette} label="Logo URL">
                <input name="logo_url" className="input" defaultValue={dealer.logo_url || ""} placeholder="Logo image URL" />
              </Field>

              <Field icon={Phone} label="Phone">
                <input name="phone" className="input" defaultValue={dealer.phone || ""} placeholder="Phone number" />
              </Field>
              <Field icon={Phone} label="WhatsApp">
                <input name="whatsapp" className="input" defaultValue={dealer.whatsapp || dealer.phone || ""} placeholder="WhatsApp number" />
              </Field>
              <Field icon={Phone} label="Email">
                <input name="email" className="input" defaultValue={dealer.email || ""} placeholder="Email address" />
              </Field>

              <Field icon={Globe} label="Website">
                <input name="website" className="input" defaultValue={dealer.website || ""} placeholder="Website URL" />
              </Field>
              <Field icon={Globe} label="Stock source">
                <input name="stock_source_url" className="input" defaultValue={dealer.stock_source_url || ""} placeholder="Stock source / website stock page" />
              </Field>
            </div>

            <button className="btn-acid mt-6" type="submit">
              <Save size={18} className="mr-2" /> Save settings
            </button>
          </form>

          <section className="card p-7">
            <p className="badge mb-4">Locked account fields</p>
            <h2 className="text-3xl font-black">Account setup</h2>
            <p className="text-ink/55 mt-2">
              Plan, account status and dealer slug are locked while AutoRevisit is in early setup.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <Locked label="Plan" value={dealer.plan_name || "starter"} />
              <Locked label="Account status" value={dealer.subscription_status} />
              <Locked label="Support" value={BRAND.supportEmail} />
              <Locked label="Dealer slug" value={dealer.slug} />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <div className="rounded-3xl bg-white/60 border border-ink/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} />
        <p className="font-black">{label}</p>
      </div>
      {children}
    </div>
  );
}

function Locked({ label, value }) {
  return (
    <div className="rounded-3xl bg-white/70 border border-ink/10 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-black text-ink/40 uppercase">{label}</p>
        <Lock size={15} className="text-ink/35" />
      </div>
      <p className="font-bold mt-2 break-all">{value || "—"}</p>
    </div>
  );
}
