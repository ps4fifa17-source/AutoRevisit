export default function VehicleHeroImage({ vehicle, treatment = "light", className = "" }) {
  const image = Array.isArray(vehicle?.image_urls) ? vehicle.image_urls[0] : null;
  const dark = treatment === "dark" || treatment === "cinematic" || treatment === "premium";
  const height = treatment === "cinematic" || treatment === "premium" ? "h-[350px]" : "h-[286px]";
  return (
    <div className={`relative overflow-hidden rounded-[28px] ${height} ${dark ? "bg-white/8" : "bg-black/5"} ${className}`}>
      {image ? <img src={image} alt="Vehicle" className="ar-hero-image h-full w-full object-cover" /> : <div className="h-full flex items-center justify-center font-black opacity-35">Vehicle photo</div>}
      {dark && <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />}
      {treatment === "cinematic" && <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{ background: "var(--dealer-primary)", boxShadow: "0 0 30px var(--dealer-glow)" }} />}
    </div>
  );
}
