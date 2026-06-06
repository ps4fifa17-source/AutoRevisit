"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight, CheckCircle, ArrowLeft } from "lucide-react";
import { BRAND } from "@/lib/brand";

const steps = [
  {
    title: "Your dashboard",
    text: "This is your AutoRevisit workspace. From here you can manage stock, create pages and track buyer activity.",
    target: "Dashboard",
  },
  {
    title: "Add your vehicles",
    text: "Start by adding stock. Each vehicle can become a personalised page for a customer.",
    target: "Vehicles",
  },
  {
    title: "Create customer pages",
    text: "This is where AutoRevisit turns a customer, vehicle and sales angle into a page ready to send.",
    target: "Create Page",
  },
  {
    title: "Track live pages",
    text: "Live Pages shows the pages you've sent, how many times they were viewed and which ones are getting attention.",
    target: "Live Pages",
  },
  {
    title: "Follow buyer intent",
    text: "Leads helps you see which customers are coming back, clicking and showing real interest.",
    target: "Leads",
  },
];

export default function WorkspaceTour({ plan = "starter", userId = "default" }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const key = `autorevisit_workspace_tour_done_${userId || "default"}`;
    if (!localStorage.getItem(key)) setOpen(true);
  }, [userId]);

  if (!open) return null;

  const current = steps[step];

  function finish() {
    const key = `autorevisit_workspace_tour_done_${userId || "default"}`;
    localStorage.setItem(key, "true");
    setOpen(false);
  }

  function next() {
    if (step >= steps.length - 1) finish();
    else setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-[2px] flex items-end md:items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-4 top-4 md:left-[280px] md:top-8 rounded-[28px] border-2 border-acid shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] bg-white/5 h-24 w-[calc(100%-2rem)] md:h-28 md:w-[420px]" />
      </div>

      <div className="card max-w-xl w-full p-7 relative z-10 shadow-2xl">
        <button
          onClick={finish}
          className="absolute top-5 right-5 h-10 w-10 rounded-full bg-ink/5 flex items-center justify-center"
        >
          <X size={18} />
        </button>

        <p className="badge mb-5">{BRAND.name} walkthrough</p>
        <p className="text-xs font-black uppercase tracking-[0.16em] text-ink/35">
          Step {step + 1} of {steps.length}
        </p>

        <h2 className="text-4xl font-black tracking-tight mt-3">{current.title}</h2>
        <p className="text-ink/60 text-lg mt-4">{current.text}</p>

        <div className="rounded-3xl bg-acid/25 border border-acid/45 p-4 mt-6">
          <p className="text-xs uppercase tracking-[0.14em] font-black text-ink/45">Look for</p>
          <p className="font-black text-xl mt-1">{current.target}</p>
        </div>

        <div className="flex items-center gap-2 mt-7">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step ? "w-10 bg-acid" : "w-2 bg-ink/15"
              }`}
            />
          ))}
        </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-7">
          {step > 0 && (
            <button onClick={back} className="btn-secondary">
              <ArrowLeft size={18} className="mr-2" /> Back
            </button>
          )}

          <button onClick={next} className="btn-acid">
            {step >= steps.length - 1 ? (
              <>
                Finish <CheckCircle size={18} className="ml-2" />
              </>
            ) : (
              <>
                Next <ArrowRight size={18} className="ml-2" />
              </>
            )}
          </button>

          <button onClick={finish} className="btn-secondary">
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}