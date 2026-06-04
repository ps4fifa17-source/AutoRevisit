"use client";

import { PAGE_MOODS } from "@/lib/pageJourney";
import { CheckCircle } from "lucide-react";

export default function PageMoodPreview({ value, onChange }) {
  return (
    <div>
      <p className="badge mb-4">Page mood</p>
      <div className="grid md:grid-cols-3 gap-3">
        {Object.values(PAGE_MOODS).map((mood) => {
          const active = value === mood.id;
          return (
            <button
              key={mood.id}
              type="button"
              onClick={() => onChange(mood.id)}
              className={`text-left overflow-hidden rounded-[28px] border transition ${
                active ? "border-ink ring-4 ring-acid/40" : "border-ink/10 hover:border-ink/25"
              }`}
            >
              <div className={`${mood.preview} p-4 h-36`}>
                <div className="flex items-center justify-between">
                  <div className={`h-8 w-8 rounded-full ${mood.accent}`} />
                  {active && <CheckCircle size={18} />}
                </div>
                <div className="mt-7">
                  <div className="h-3 w-24 rounded-full bg-current opacity-25" />
                  <div className="h-3 w-16 rounded-full bg-current opacity-15 mt-2" />
                  <div className="h-8 w-24 rounded-full bg-current opacity-10 mt-4" />
                </div>
              </div>
              <div className="p-4 bg-white/75">
                <p className="font-black">{mood.name}</p>
                <p className="text-xs text-ink/50 mt-1">{mood.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
