export default function DealerMiniHeader({ dealer, label, dark = false, minimal = false }) {
  const name = dealer?.name || "Dealership";
  return (
    <header className={`flex items-center justify-between px-5 ${minimal ? "pt-6 pb-4" : "pt-5 pb-5"}`}>
      <div className="flex items-center gap-3 min-w-0">
        {dealer?.logo_url ? <img src={dealer.logo_url} alt={name} className="ar-logo-img" /> : <><div className="h-9 w-9 rounded-full flex items-center justify-center text-white font-black" style={{ background: "var(--dealer-primary)" }}>{name.slice(0, 1)}</div><p className={`font-black leading-none truncate ${dark ? "text-white" : ""}`}>{name}</p></>}
      </div>
      {label && <div className={`rounded-full px-3 py-2 text-[11px] font-black border ${dark ? "border-white/12 text-white/70 bg-white/5" : "border-black/8 text-black/55 bg-white/60"}`}>{label}</div>}
    </header>
  );
}
