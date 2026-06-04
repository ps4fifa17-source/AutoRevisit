"use client";

import { useMemo, useState } from "react";
import { Camera, Save, Trash2, Star, ArrowUp, ArrowDown, Plus } from "lucide-react";

function asArray(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function vehicleTitle(form) {
  return [form.year, form.make, form.model].filter(Boolean).join(" ") || "Vehicle preview";
}

export default function VehicleEditorClient({ vehicle, updateAction, deleteAction }) {
  const [uploading, setUploading] = useState(false);
  const [imageUrls, setImageUrls] = useState(asArray(vehicle.image_urls));
  const [form, setForm] = useState({
    make: vehicle.make || "",
    model: vehicle.model || "",
    year: vehicle.year || "",
    reg: vehicle.reg || vehicle.vrm || "",
    price: vehicle.price || "",
    monthly_price: vehicle.monthly_price || "",
    mileage: vehicle.mileage || "",
    fuel_type: vehicle.fuel_type || "",
    transmission: vehicle.transmission || "",
    colour: vehicle.colour || "",
    engine_capacity: vehicle.engine_capacity || "",
    co2_emissions: vehicle.co2_emissions || "",
    tax_status: vehicle.tax_status || "",
    mot_status: vehicle.mot_status || "",
    tags: Array.isArray(vehicle.tags) ? vehicle.tags.join(", ") : Array.isArray(vehicle.features) ? vehicle.features.join(", ") : "",
    description: vehicle.description || "",
  });

  const title = useMemo(() => vehicleTitle(form), [form]);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function uploadPhotos(files) {
    if (!files?.length) return;
    setUploading(true);

    const fd = new FormData();
    Array.from(files).forEach((file) => fd.append("photos", file));

    const res = await fetch("/api/vehicle-photos/upload", { method: "POST", body: fd });
    const data = await res.json();

    if (data.error) alert(data.error);
    else setImageUrls((current) => [...current, ...(data.urls || [])]);

    setUploading(false);
  }

  function removePhoto(url) {
    setImageUrls((current) => current.filter((item) => item !== url));
  }

  function makeCover(url) {
    setImageUrls((current) => [url, ...current.filter((item) => item !== url)]);
  }

  function movePhoto(url, direction) {
    setImageUrls((current) => {
      const index = current.indexOf(url);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
      return copy;
    });
  }

  return (
    <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-5">
      <aside className="card overflow-hidden h-fit">
        <div className="h-80 bg-ink/8">
          {imageUrls[0] ? (
            <img src={imageUrls[0]} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full flex flex-col items-center justify-center font-black text-ink/35">
              <Camera className="mb-2" />
              No photos yet
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="text-xs font-black text-ink/40 uppercase">{form.reg || "No reg"}</p>
          <h2 className="text-3xl font-black mt-1">{title}</h2>
          <p className="text-ink/55 mt-2">
            {[form.fuel_type, form.transmission, form.mileage].filter(Boolean).join(" • ") || "Add vehicle details"}
          </p>

          <form action={deleteAction} method="POST" className="mt-6">
            <button type="submit" className="btn-secondary w-full">
              <Trash2 size={18} className="mr-2" /> Delete vehicle
            </button>
          </form>
        </div>
      </aside>

      <form action={updateAction} method="POST" className="card p-7 md:p-9">
        <p className="badge mb-5">Photos</p>

        <label className="rounded-3xl border border-dashed border-ink/20 bg-white/60 p-6 flex flex-col items-center justify-center text-center cursor-pointer">
          <Camera size={32} />
          <p className="font-black mt-3">{uploading ? "Uploading..." : "Upload / add more photos"}</p>
          <p className="text-ink/50 text-sm mt-1">No URLs shown. Upload from camera roll or desktop.</p>
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadPhotos(e.target.files)} />
        </label>

        {!!imageUrls.length && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-5">
            {imageUrls.map((url, index) => (
              <div key={url} className="rounded-3xl overflow-hidden bg-white border border-ink/10">
                <img src={url} className="h-32 w-full object-cover" />
                <div className="p-2 grid grid-cols-4 gap-1">
                  <button type="button" title="Set cover" onClick={() => makeCover(url)} className={`rounded-xl p-2 ${index === 0 ? "bg-acid" : "bg-ink/5"}`}>
                    <Star size={15} />
                  </button>
                  <button type="button" title="Move up" onClick={() => movePhoto(url, -1)} className="rounded-xl p-2 bg-ink/5">
                    <ArrowUp size={15} />
                  </button>
                  <button type="button" title="Move down" onClick={() => movePhoto(url, 1)} className="rounded-xl p-2 bg-ink/5">
                    <ArrowDown size={15} />
                  </button>
                  <button type="button" title="Remove" onClick={() => removePhoto(url)} className="rounded-xl p-2 bg-ink/5">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <input type="hidden" name="image_urls_json" value={JSON.stringify(imageUrls)} />

        <p className="badge mt-8 mb-5">Main details</p>
        <div className="grid md:grid-cols-3 gap-4">
          <input name="make" className="input" placeholder="Make" value={form.make} onChange={(e) => update("make", e.target.value)} />
          <input name="model" className="input" placeholder="Model" value={form.model} onChange={(e) => update("model", e.target.value)} />
          <input name="year" className="input" placeholder="Year" value={form.year} onChange={(e) => update("year", e.target.value)} />
          <input name="reg" className="input" placeholder="Registration" value={form.reg} onChange={(e) => update("reg", e.target.value)} />
          <input name="price" className="input" placeholder="Price" value={form.price} onChange={(e) => update("price", e.target.value)} />
          <input name="monthly_price" className="input" placeholder="Monthly price" value={form.monthly_price} onChange={(e) => update("monthly_price", e.target.value)} />
          <input name="mileage" className="input" placeholder="Mileage" value={form.mileage} onChange={(e) => update("mileage", e.target.value)} />
          <input name="fuel_type" className="input" placeholder="Fuel type" value={form.fuel_type} onChange={(e) => update("fuel_type", e.target.value)} />
          <input name="transmission" className="input" placeholder="Transmission" value={form.transmission} onChange={(e) => update("transmission", e.target.value)} />
        </div>

        <details className="mt-6 rounded-3xl bg-white/60 border border-ink/10 p-5">
          <summary className="font-black cursor-pointer">Advanced vehicle facts</summary>
          <div className="grid md:grid-cols-3 gap-4 mt-5">
            <input name="colour" className="input" placeholder="Colour" value={form.colour} onChange={(e) => update("colour", e.target.value)} />
            <input name="engine_capacity" className="input" placeholder="Engine CC" value={form.engine_capacity} onChange={(e) => update("engine_capacity", e.target.value)} />
            <input name="co2_emissions" className="input" placeholder="CO2" value={form.co2_emissions} onChange={(e) => update("co2_emissions", e.target.value)} />
            <input name="tax_status" className="input" placeholder="Tax status" value={form.tax_status} onChange={(e) => update("tax_status", e.target.value)} />
            <input name="mot_status" className="input" placeholder="MOT status" value={form.mot_status} onChange={(e) => update("mot_status", e.target.value)} />
          </div>
        </details>

        <p className="badge mt-8 mb-5">AI selling facts</p>
        <input name="tags" className="input" placeholder="Features, comma separated" value={form.tags} onChange={(e) => update("tags", e.target.value)} />
        <textarea name="description" className="input min-h-[140px] mt-4" placeholder="Short description / notes for AI" value={form.description} onChange={(e) => update("description", e.target.value)} />

        <button className="btn-acid mt-6" type="submit">
          <Save size={18} className="mr-2" /> Save vehicle
        </button>
      </form>
    </div>
  );
}
