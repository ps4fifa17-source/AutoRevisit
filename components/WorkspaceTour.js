"use client";

import { useEffect, useState } from "react";
import { X, ArrowRight, CheckCircle } from "lucide-react";
import { BRAND } from "@/lib/brand";

const stepsByPlan = {
  starter: [
    ["Vehicles", "Add or sync vehicles, upload photos, then turn each car into a shareable customer page."],
    ["Live Pages", "Your customer pages live here. This is where revisits, shares and activity start to matter."],
    ["Create Page", "Pick a vehicle, choose the customer angle, and generate a page ready to send."],
  ],
  pro: [
    ["AI journeys", "Pro unlocks AI-assisted positioning, customer targeting and stronger page angles."],
    ["Analytics", "Track page views, lead actions and which vehicles are getting attention."],
    ["Live Pages", "Manage, share and improve each customer journey from one place."],
  ],
  elite: [
    ["Advanced builder", "Elite is built for deeper page control, advanced journeys and optimisation."],
    ["Behaviour insight", "Use revisit and click activity to understand real buyer intent."],
    ["Scale", "Build a repeatable customer journey system across your whole dealership."],
  ],
};

export default function WorkspaceTour({ plan = "starter" }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const key = "autorevisit_workspace_tour_done";
    if (!localStorage.getItem(key)) setOpen(true);
  }, []);

  if (!open) return null;

  const steps = stepsByPlan[plan] || stepsByPlan.starter;
  const current = steps[step] || steps[0];

  function finish() {
    localStorage.setItem("autorevisit_workspace_tour_done", "true");
    setOpen(false);
  }

  function next() {
    if (step >= steps.length - 1) finish();
    else setStep(step + 1);
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
      <div className="card max-w-xl w-full p-7 relative">
        <button onClick={finish} className="absolute top-5 right-5 h-10 w-10 rounded-full bg-ink/5 flex items-center justify-center">
          <X size={18} />
        </button>

        <p className="badge mb-5">{BRAND.name} setup guide</p>
        <h2 className="text-4xl font-black tracking-tight">{current[0]}</h2>
        <p className="text-ink/60 text-lg mt-4">{current[1]}</p>

        <div className="flex items-center gap-2 mt-7">
          {steps.map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i === step ? "w-10 bg-acid" : "w-2 bg-ink/15"}`} />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-7">
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
          <button onClick={finish} className="btn-secondary">Skip for now</button>
        </div>
      </div>
    </div>
  );
}
