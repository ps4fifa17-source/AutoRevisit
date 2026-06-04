"use client";

import { JOURNEY_TYPES } from "@/lib/pageJourney";
import { CheckCircle } from "lucide-react";

export default function JourneyTypePreview({ value, onChange }) {
  return (
    <div>
      <p className="badge mb-4">Journey type</p>
      <div className="grid md:grid-cols-2 gap-3">
        {Object.values(JOURNEY_TYPES).map((journey) => {
          const active = value === journey.id;
          return (
            <button
              key={journey.id}
              type="button"
              onClick={() => onChange(journey.id)}
              className={`text-left rounded-[28px] border p-5 transition bg-white/70 ${
                active ? "border-ink ring-4 ring-acid/40" : "border-ink/10 hover:border-ink/25"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-black text-lg">{journey.name}</p>
                  <p className="text-sm text-ink/50 mt-1">{journey.description}</p>
                </div>
                {active && <CheckCircle size={18} className="shrink-0" />}
              </div>

              <div className="flex gap-1 mt-5">
                {journey.sections.slice(0, 6).map((section, i) => (
                  <span key={section} className={`h-2 rounded-full ${i === 0 ? "w-12 bg-acid" : "w-7 bg-ink/15"}`} />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
