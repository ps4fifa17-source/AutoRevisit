"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/slug";
import DashboardNav from "@/components/DashboardNav";
import CopyLinkButton from "@/components/CopyLinkButton";
import PageStylePreview from "@/components/PageStylePreview";
import JourneyBuilderPreview from "@/components/JourneyBuilderPreview";
import {
  PAGE_TYPE_OPTIONS,
  WHO_FOR_OPTIONS,
  PUSH_OPTIONS,
  DESIGN_STYLES,
  getRecommendedStyle,
  computePublicMode,
  makeDefaultGreeting,
  makeDefaultSubtitle,
} from "@/lib/pageJourney";
import {
  DEALER_NOTES_TITLE,
  DEALER_NOTES_PLACEHOLDER_REVISIT,
  DEALER_NOTES_PLACEHOLDER_ENQUIRY,
} from "@/lib/dealerNotesCopy";
import { getPlan } from "@/lib/plans";
import {
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Lock,
  UserRound,
  Target,
  Palette,
  WalletCards,
  StickyNote,
  FileText,
  HeartHandshake,
} from "lucide-react";

export default function NewCustomerPage() {
  const supabase = createClient();

  const [vehicles, setVehicles] = useState([]);
  const [dealer, setDealer] = useState(null);
  const [profile, setProfile] = useState(null);
  const [planName, setPlanName] = useState("starter");
  const [pageCount, setPageCount] = useState(0);
  const [selectedCar, setSelectedCar] = useState("");
  const [createdLink, setCreatedLink] = useState("");
  const [whatsappLink, setWhatsappLink] = useState("");
  const [emailLink, setEmailLink] = useState("");
  const [generatedMessage, setGeneratedMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    page_type: "revisit",
    customer_name: "",
    phone: "",
    email: "",
    who_for: "themselves",
    push_angle: "reassurance",
    design_style: "clean_light",
    finance_monthly: "",
    finance_deposit: "",
    finance_term: "",
    finance_apr: "",
    dealer_notes: "",
    handover_image_url: "",
    review_url: "",
    thank_you_message:
      "Thank you again for choosing us. We hope you enjoy your new vehicle — if you need anything at all, our team is always here to help.",
  });

  useEffect(() => {
    loadInitial();
  }, []);

  async function loadInitial() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return;

    const { data: loadedProfile } = await supabase
      .from("profiles")
      .select("*, dealerships(*)")
      .eq("id", auth.user.id)
      .single();

    if (!loadedProfile?.dealership_id) return;

    const loadedDealer = loadedProfile.dealerships;
    const effectivePlan =
      loadedProfile.role === "admin" && loadedProfile.test_plan
        ? loadedProfile.test_plan
        : loadedDealer?.plan_name || "starter";

    setProfile(loadedProfile);
    setDealer(loadedDealer);
    setPlanName(effectivePlan);

    const { data: vehicleData } = await supabase
      .from("vehicles")
      .select("*")
      .eq("dealership_id", loadedProfile.dealership_id)
      .order("created_at", { ascending: false });

    const cleanVehicles = (vehicleData || []).filter((vehicle) => !vehicle.deleted_at && vehicle.status !== "deleted");
    setVehicles(cleanVehicles);

    if (cleanVehicles.length) {
      setSelectedCar(cleanVehicles[0].id);
      setForm((current) => ({ ...current, finance_monthly: cleanVehicles[0].monthly_price || "" }));
    }

    const { count } = await supabase
      .from("customer_pages")
      .select("*", { count: "exact", head: true })
      .eq("dealership_id", loadedProfile.dealership_id)
      .eq("status", "live")
      .is("deleted_at", null);

    setPageCount(count || 0);
  }

  const plan = getPlan(planName);
  const selectedVehicle = useMemo(() => vehicles.find((car) => car.id === selectedCar), [vehicles, selectedCar]);
  const selectedVehicleTitle = selectedVehicle
    ? [selectedVehicle.year, selectedVehicle.make, selectedVehicle.model].filter(Boolean).join(" ")
    : "Vehicle";
  const limitReached = plan.livePagesLimit !== Infinity && pageCount >= plan.livePagesLimit;
  const recommendedStyle = getRecommendedStyle(form.push_angle);
  const selectedPublicMode = computePublicMode({
    pageType: form.page_type,
    pushAngle: form.page_type === "enquiry" ? "reassurance" : form.push_angle,
    designStyle: form.page_type === "enquiry" ? "clean_light" : form.design_style,
  });

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updatePageType(value) {
    if (value === "enquiry") {
      setForm((current) => ({
        ...current,
        page_type: value,
        who_for: "themselves",
        push_angle: "reassurance",
        design_style: "clean_light",
      }));
      return;
    }

    if (value === "thank_you") {
      setForm((current) => ({ ...current, page_type: value }));
      return;
    }

    setForm((current) => ({ ...current, page_type: value }));
  }

  function updatePush(value) {
    setForm((current) => ({
      ...current,
      push_angle: value,
      design_style: getRecommendedStyle(value),
    }));
  }

  function selectVehicle(value) {
    setSelectedCar(value);
    const vehicle = vehicles.find((car) => car.id === value);
    if (vehicle?.monthly_price && !form.finance_monthly) update("finance_monthly", vehicle.monthly_price);
  }

  async function createThankYouPage() {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return alert("Not logged in");
    if (!profile?.dealership_id || !dealer?.slug) return alert("No dealership found");
    if (!form.customer_name) return alert("Add customer name");

    setLoading(true);

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        dealership_id: profile.dealership_id,
        first_name: form.customer_name,
        phone: form.phone,
        email: form.email,
        customer_type: "Purchased",
      })
      .select()
      .single();

    if (customerError) {
      setLoading(false);
      return alert(customerError.message);
    }

    const slug = `${slugify(form.customer_name)}-thanks-${Date.now().toString().slice(-5)}`;

    const { data: page, error } = await supabase
      .from("thank_you_pages")
      .insert({
        dealership_id: profile.dealership_id,
        customer_id: customer?.id || null,
        vehicle_id: selectedCar || null,
        slug,
        title: `Thank you ${form.customer_name}`,
        message: form.thank_you_message,
        handover_image_url: form.handover_image_url,
        review_url: form.review_url,
      })
      .select()
      .single();

    if (error) {
      setLoading(false);
      return alert(error.message);
    }

    const site = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const publicLink = `${site}/t/${dealer.slug}/${page.slug}`;
    const msg = `Hi ${form.customer_name},\n\nThank you again for choosing us. I’ve put together a quick page with your handover message and review link:\n\n${publicLink}`;

    setCreatedLink(publicLink);
    setGeneratedMessage(msg);
    setWhatsappLink((dealer.whatsapp || dealer.phone) ? `https://wa.me/${(dealer.whatsapp || dealer.phone).replace(/[^0-9]/g, "")}?text=${encodeURIComponent(msg)}` : "");
    setEmailLink(`mailto:${form.email || ""}?subject=${encodeURIComponent("Thank you")}&body=${encodeURIComponent(msg)}`);
    setLoading(false);
  }

  async function createPage() {
    if (form.page_type === "thank_you") return createThankYouPage();

    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) return alert("Not logged in");
    if (!form.customer_name) return alert("Add customer name");
    if (!selectedCar) return alert("Select a vehicle");
    if (!dealer || !profile) return alert("Dealer profile missing");
    if (limitReached) return alert(`${plan.name} is limited to ${plan.livePagesLimit} live pages.`);

    setLoading(true);

    const site = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const baseSlug = `${slugify(form.customer_name)}-${Date.now().toString().slice(-5)}`;
    const publicLink = `${site}/p/${dealer.slug}/${baseSlug}`;

    const aiRes = await fetch("/api/ai/page-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleIds: [selectedCar],
        customerName: form.customer_name,
        whoFor: form.page_type === "enquiry" ? "fresh_enquiry" : form.who_for,
        buyingFor: form.page_type === "enquiry" ? "fresh_enquiry" : form.who_for,
        pushAngle: form.page_type === "enquiry" ? "reassurance" : form.push_angle,
        style: form.page_type === "enquiry" ? "clean_light" : form.design_style,
        pageType: form.page_type,
        pageUrl: publicLink,
        finance: {
          monthly: form.finance_monthly,
          deposit: form.finance_deposit,
          term: form.finance_term,
          apr: form.finance_apr,
        },
        dealerNotes: form.dealer_notes,
      }),
    });

    const aiData = await aiRes.json();
    if (aiData.error) {
      setLoading(false);
      return alert(aiData.error);
    }

    const micro = aiData.copy || {};
    const greeting = micro.greeting || makeDefaultGreeting(form.customer_name);
    const subline = micro.subline || micro.heroSubtitle || makeDefaultSubtitle(selectedVehicleTitle);

    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .insert({
        dealership_id: profile.dealership_id,
        first_name: form.customer_name,
        phone: form.phone,
        email: form.email,
        buying_for: form.page_type === "enquiry" ? "fresh_enquiry" : form.who_for,
        customer_type: form.page_type === "enquiry" ? "Fresh enquiry" : form.who_for,
        notes:
          form.page_type === "enquiry"
            ? `Enquiry follow up${form.dealer_notes ? ` | Notes: ${form.dealer_notes}` : ""}`
            : `Who for: ${form.who_for} | Push: ${form.push_angle} | Style: ${form.design_style}${form.dealer_notes ? ` | Notes: ${form.dealer_notes}` : ""}`,
      })
      .select()
      .single();

    if (customerError) {
      setLoading(false);
      return alert(customerError.message);
    }

    const publicMode = selectedPublicMode;
    const whatsappMessage =
      micro.whatsappMessage ||
      `Hi ${form.customer_name},\n\nI’ve put together a page for the ${selectedVehicleTitle}:\n\n${publicLink}`;

    const { data: page, error: pageError } = await supabase
      .from("customer_pages")
      .insert({
        dealership_id: profile.dealership_id,
        customer_id: customer.id,
        slug: baseSlug,
        page_type: form.page_type,
        title: greeting,
        intro_message: subline,
        page_goal: form.page_type === "enquiry" ? "enquiry" : form.push_angle,
        page_mood: publicMode,
        page_style: form.page_type === "enquiry" ? "clean_light" : form.design_style,
        customer_goal: publicMode,
        journey_type: form.page_type === "enquiry" ? "fresh_enquiry" : form.who_for,
        target_customer: form.page_type === "enquiry" ? "fresh_enquiry" : form.who_for,
        who_for: form.page_type === "enquiry" ? "fresh_enquiry" : form.who_for,
        buying_for: form.page_type === "enquiry" ? "fresh_enquiry" : form.who_for,
        push_angle: form.page_type === "enquiry" ? "enquiry" : form.push_angle,
        design_style: form.page_type === "enquiry" ? "clean_light" : form.design_style,
        finance_monthly: form.finance_monthly,
        finance_deposit: form.finance_deposit,
        finance_term: form.finance_term,
        finance_apr: form.finance_apr,
        dealer_notes: form.dealer_notes,
        whatsapp_message: whatsappMessage,
        status: "live",
        watermark_forced: plan.watermarkForced,
        ai_headline: greeting,
        ai_intro: subline,
        ai_selling_points: (micro.quickCards || micro.topReasons || []).map((card) => `${card.title}: ${card.text}`),
        ai_cta: micro.primaryCta || "Message us",
        ai_sections: {
          ...micro,
          who_for: form.page_type === "enquiry" ? "fresh_enquiry" : form.who_for,
          push_angle: form.page_type === "enquiry" ? "enquiry" : form.push_angle,
          design_style: form.page_type === "enquiry" ? "clean_light" : form.design_style,
          page_type: form.page_type,
          finance: {
            monthly: form.finance_monthly,
            deposit: form.finance_deposit,
            term: form.finance_term,
            apr: form.finance_apr,
          },
          dealer_notes: form.dealer_notes,
        },
        ai_short_cards: micro.quickCards || micro.topReasons || [],
        ai_microcopy: { ...micro, greeting, subline },
      })
      .select()
      .single();

    if (pageError) {
      setLoading(false);
      return alert(pageError.message);
    }

    const { error: linkError } = await supabase
      .from("customer_page_vehicles")
      .insert({
        customer_page_id: page.id,
        vehicle_id: selectedCar,
        display_order: 0,
      });

    if (linkError) {
      setLoading(false);
      return alert(linkError.message);
    }

    const phone = (dealer.whatsapp || dealer.phone || "").replace(/[^0-9]/g, "");
    setCreatedLink(publicLink);
    setGeneratedMessage(whatsappMessage);
    setWhatsappLink(phone ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}` : "");
    setEmailLink(`mailto:${form.email || ""}?subject=${encodeURIComponent("Your vehicle page")}&body=${encodeURIComponent(whatsappMessage)}`);
    setLoading(false);
  }

  if (createdLink) {
    return (
      <main className="min-h-screen p-4 md:p-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
          <DashboardNav />
          <section className="space-y-5">
            <div className="dark-card p-8 md:p-10">
              <p className="text-acid font-black mb-4">Page created</p>
              <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">Ready to send.</h1>
              <p className="text-white/60 text-lg mt-6 max-w-2xl">Copy the message, preview the page, or send it now.</p>
            </div>

            <div className="card p-7">
              <div className="h-14 w-14 rounded-3xl bg-acid flex items-center justify-center">
                <CheckCircle />
              </div>
              <h2 className="text-4xl font-black mt-5">Dealer message</h2>
              <textarea readOnly className="input min-h-[150px] mt-5" value={generatedMessage} />
              <p className="text-ink/55 mt-4 break-all">{createdLink}</p>
              <div className="flex flex-wrap gap-3 mt-6">
                <a href={createdLink} target="_blank" rel="noreferrer" className="btn">Preview</a>
                <CopyLinkButton value={createdLink} />
                <CopyLinkButton value={generatedMessage} label="Copy message" />
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noreferrer" className="btn-acid">
                    <MessageCircle size={18} className="mr-2" /> Send WhatsApp
                  </a>
                )}
                <a href={emailLink} className="btn-secondary">Send Email</a>
                <a href="/dashboard/live-pages" className="btn-secondary">Live Pages</a>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-[250px_1fr] gap-5">
        <DashboardNav />

        <section className="space-y-5">
          <div className="dark-card p-8 md:p-10">
            <p className="text-acid font-black mb-4">Create page</p>
            <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">What are you sending?</h1>
            <p className="text-white/60 text-lg mt-6 max-w-2xl">
              Revisit pages use the full AI sales brain. Enquiry and thank-you pages stay simple.
            </p>
          </div>

          {limitReached && form.page_type !== "thank_you" && (
            <div className="card p-6 border-2 border-red-200">
              <div className="flex gap-3">
                <Lock />
                <div>
                  <h2 className="text-2xl font-black">Page limit reached</h2>
                  <p className="text-ink/55 mt-1">{plan.name} is limited to {plan.livePagesLimit} live pages.</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid xl:grid-cols-[1fr_430px] gap-5">
            <section className="space-y-5">
              <Panel icon={FileText} badge="Page type" title="1. What are you creating?">
                <div className="grid md:grid-cols-3 gap-3 mt-6">
                  {Object.values(PAGE_TYPE_OPTIONS).map((option) => (
                    <Choice
                      key={option.id}
                      active={form.page_type === option.id}
                      title={option.label}
                      description={option.description}
                      onClick={() => updatePageType(option.id)}
                    />
                  ))}
                </div>
              </Panel>

              <Panel badge="Customer" title={form.page_type === "enquiry" ? "2. Fresh enquiry details" : form.page_type === "thank_you" ? "2. Handover details" : "2. Customer and vehicle"}>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <input className="input" placeholder="Customer name" value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} />
                  <input className="input" placeholder="Phone optional" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                  <input className="input" placeholder="Email optional" value={form.email} onChange={(e) => update("email", e.target.value)} />
                  <select className="input" value={selectedCar} onChange={(e) => selectVehicle(e.target.value)}>
                    {!vehicles.length && <option value="">No vehicles yet</option>}
                    {vehicles.map((car) => (
                      <option key={car.id} value={car.id}>{[car.year, car.make, car.model].filter(Boolean).join(" ")}</option>
                    ))}
                  </select>
                </div>
              </Panel>

              {form.page_type === "revisit" && (
                <>
                  <Panel icon={UserRound} badge="Audience" title="3. Who is this vehicle for?">
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 mt-6">
                      {Object.values(WHO_FOR_OPTIONS).map((option) => (
                        <Choice key={option.id} active={form.who_for === option.id} title={option.label} description={option.description} onClick={() => update("who_for", option.id)} />
                      ))}
                    </div>
                  </Panel>

                  <Panel icon={Target} badge="Push" title="4. What is stopping them buying?">
                    <div className="grid md:grid-cols-2 gap-3 mt-6">
                      {Object.values(PUSH_OPTIONS).map((option) => (
                        <Choice
                          key={option.id}
                          active={form.push_angle === option.id}
                          title={option.label}
                          description={`${option.description} Recommended: ${DESIGN_STYLES[option.recommendedStyle]?.label}`}
                          onClick={() => updatePush(option.id)}
                        />
                      ))}
                    </div>
                  </Panel>

                  <FinancePanel form={form} update={update} title="5. Finance details" />

                  <Panel icon={Palette} badge="Style" title="6. Choose the look">
                    <p className="text-ink/55 mt-3">
                      Recommended: <span className="font-black text-ink">{DESIGN_STYLES[recommendedStyle]?.label}</span>. You can override it.
                    </p>
                    <div className="mt-6">
                      <PageStylePreview
                        value={form.design_style}
                        onChange={(value) => update("design_style", value)}
                        recommendedStyle={recommendedStyle}
                        dealerName={dealer?.name || "Dealer"}
                        vehicleTitle={selectedVehicleTitle}
                      />
                    </div>
                  </Panel>

                  <NotesPanel form={form} update={update} title={`7. ${DEALER_NOTES_TITLE}`} placeholder={DEALER_NOTES_PLACEHOLDER_REVISIT} />
                </>
              )}

              {form.page_type === "enquiry" && (
                <>
                  <FinancePanel form={form} update={update} title="3. Finance details if already known" />
                  <NotesPanel
                    form={form}
                    update={update}
                    title={`4. ${DEALER_NOTES_TITLE}`}
                    placeholder={DEALER_NOTES_PLACEHOLDER_ENQUIRY}
                  />
                </>
              )}

              {form.page_type === "thank_you" && (
                <Panel icon={HeartHandshake} badge="Thank you" title="3. Thank-you page details">
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <input className="input md:col-span-2" placeholder="Handover image URL optional" value={form.handover_image_url} onChange={(e) => update("handover_image_url", e.target.value)} />
                    <input className="input md:col-span-2" placeholder="Review URL optional" value={form.review_url} onChange={(e) => update("review_url", e.target.value)} />
                    <textarea className="input md:col-span-2 min-h-[140px]" value={form.thank_you_message} onChange={(e) => update("thank_you_message", e.target.value)} />
                  </div>
                </Panel>
              )}

              <section className="card p-7">
                <p className="badge mb-4">Create</p>
                <h2 className="text-3xl font-black">Ready?</h2>
                <p className="text-ink/55 mt-2">
                  {form.page_type === "revisit"
                    ? "This will generate a full AI customer revisit page."
                    : form.page_type === "enquiry"
                    ? "This will create a simple enquiry follow-up page."
                    : "This will create a branded thank-you page."}
                </p>
                <button onClick={createPage} disabled={loading || !selectedCar || (limitReached && form.page_type !== "thank_you")} className="btn-acid w-full mt-6">
                  {loading ? "Creating..." : form.page_type === "thank_you" ? "Create thank-you page" : "Create page"}
                  <ArrowRight size={18} className="ml-2" />
                </button>
              </section>
            </section>

            <JourneyBuilderPreview form={form} selectedVehicle={selectedVehicleTitle} dealerName={dealer?.name} />
          </div>
        </section>
      </div>
    </main>
  );
}

function FinancePanel({ form, update, title }) {
  return (
    <Panel icon={WalletCards} badge="Finance" title={title}>
      <p className="text-ink/55 mt-3">Only add figures you actually have. If blank, the page will not invent finance.</p>
      <div className="grid md:grid-cols-4 gap-4 mt-6">
        <input className="input" placeholder="Monthly e.g. £219" value={form.finance_monthly} onChange={(e) => update("finance_monthly", e.target.value)} />
        <input className="input" placeholder="Deposit" value={form.finance_deposit} onChange={(e) => update("finance_deposit", e.target.value)} />
        <input className="input" placeholder="Term" value={form.finance_term} onChange={(e) => update("finance_term", e.target.value)} />
        <input className="input" placeholder="APR" value={form.finance_apr} onChange={(e) => update("finance_apr", e.target.value)} />
      </div>
    </Panel>
  );
}

function NotesPanel({ form, update, title, placeholder }) {
  return (
    <Panel icon={StickyNote} badge="Your words" title={title}>
      <p className="text-ink/55 mt-3">The more context you give, the more the AI will shape the page around this customer.</p>
      <textarea
        className="input min-h-[140px] mt-6"
        placeholder={placeholder}
        value={form.dealer_notes}
        onChange={(e) => update("dealer_notes", e.target.value)}
      />
    </Panel>
  );
}

function Panel({ badge, title, children, icon: Icon }) {
  return (
    <section className="card p-7">
      {Icon && <Icon className="mb-3" />}
      <p className="badge mb-4">{badge}</p>
      <h2 className="text-3xl font-black">{title}</h2>
      {children}
    </section>
  );
}

function Choice({ active, title, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-[26px] border p-5 transition bg-white/75 ${
        active ? "border-ink ring-4 ring-acid/40" : "border-ink/10 hover:border-ink/25"
      }`}
    >
      <p className="font-black text-xl">{title}</p>
      <p className="text-sm text-ink/50 mt-2 leading-relaxed">{description}</p>
      {active && <p className="badge mt-4">Selected</p>}
    </button>
  );
}
