import { CalendarDays, Fuel, Gauge, Settings2, DoorOpen, Palette, CircleGauge } from "lucide-react";
export default function VerifiedSpecGrid({ vehicle, dark = false, clean = false, max = 6 }) {
  const specs = [
    { label: "Year", value: vehicle?.year, icon: CalendarDays },
    { label: "Mileage", value: vehicle?.mileage, icon: Gauge },
    { label: "Fuel", value: vehicle?.fuel_type, icon: Fuel },
    { label: "Transmission", value: vehicle?.transmission, icon: Settings2 },
    { label: "Doors", value: vehicle?.doors, icon: DoorOpen },
    { label: "Colour", value: vehicle?.colour, icon: Palette },
    { label: "Engine", value: vehicle?.engine_capacity, icon: CircleGauge },
  ].filter((item) => item.value).slice(0, max);
  if (!specs.length) return null;
  if (clean) return <div className="mt-5 divide-y divide-black/10 rounded-[22px] bg-white border border-black/8 overflow-hidden">{specs.map((item)=><div key={item.label} className="flex items-center justify-between px-4 py-3"><span className="text-sm text-black/50">{item.label}</span><span className="font-black text-sm">{item.value}</span></div>)}</div>;
  return <div className="grid grid-cols-2 gap-3 mt-5">{specs.map((item)=>{ const Icon=item.icon; return <div key={item.label} className={dark ? "ar-dark-card p-4" : "ar-card p-4"}><Icon size={18} style={{ color: "var(--dealer-primary)" }} /><p className={`text-[11px] mt-3 ${dark ? "text-white/45" : "text-black/45"}`}>{item.label}</p><p className={`font-black text-sm mt-1 ${dark ? "text-white" : ""}`}>{item.value}</p></div>;})}</div>;
}
