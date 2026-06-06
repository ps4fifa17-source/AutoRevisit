import crypto from "crypto";

function clean(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || fallback;
  if (typeof value === "number") return String(value);
  return fallback;
}

function money(value) {
  const str = clean(value);
  if (!str) return "";
  const match = str.replace(/,/g, "").match(/\d+(?:\.\d+)?/);
  return match ? match[0] : "";
}

function mileage(value) {
  const str = clean(value);
  if (!str) return "";
  const match = str.replace(/,/g, "").match(/\d+/);
  return match ? match[0] : "";
}

function normaliseReg(value) {
  return clean(value).toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function flatten(value) {
  const out = [];
  const seen = new Set();

  function walk(v) {
    if (!v) return;
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      if (seen.has(v)) return;
      seen.add(v);
      out.push(v);
      Object.values(v).forEach(walk);
    }
  }

  walk(value);
  return out;
}

function get(obj, paths) {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, key) => acc?.[key], obj);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return "";
}

function titleFrom(obj) {
  const direct = clean(get(obj, [
    "title.rendered",
    "title",
    "name",
    "vehicle_title",
    "advert_title",
    "heading",
    "full_title",
    "display_name",
  ]));

  if (direct) return direct;

  return [
    clean(get(obj, ["year", "registration_year", "yearOfManufacture"])),
    clean(get(obj, ["make", "manufacturer"])),
    clean(get(obj, ["model"])),
    clean(get(obj, ["derivative", "variant", "trim"])),
  ].filter(Boolean).join(" ");
}

function badTitle(title) {
  const value = String(title || "").toLowerCase();
  return ["privacy", "cookie", "terms", "contact", "about", "finance", "warranty", "complaint", "sell your car"].some((word) => value.includes(word));
}

function collectImageUrls(value) {
  const urls = new Set();

  function addString(str) {
    const value = clean(str);
    if (!value) return;
    if (/^https?:\/\//i.test(value) && /\.(jpe?g|png|webp|avif)(\?|$)/i.test(value)) urls.add(value);
  }

  function walk(v) {
    if (!v) return;
    if (typeof v === "string") return addString(v);
    if (Array.isArray(v)) return v.forEach(walk);
    if (typeof v === "object") {
      ["url", "src", "source_url", "full", "large", "medium", "thumbnail", "guid"].forEach((key) => addString(v[key]));
      Object.values(v).forEach(walk);
    }
  }

  walk(get(value, ["image_urls", "images", "gallery", "photos", "media", "featured_image", "featuredImage", "image", "thumbnail"]));
  return Array.from(urls).slice(0, 30);
}

function featuresFrom(value) {
  const raw = get(value, ["features", "feature_list", "options", "equipment", "specification", "specs", "tags"]);
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.map((item) => clean(item?.name || item?.label || item)).filter(Boolean).slice(0, 60);
  if (typeof raw === "object") return Object.values(raw).map((item) => clean(item?.name || item?.label || item)).filter(Boolean).slice(0, 60);
  return clean(raw).split(/,|\n|\|/).map((item) => item.trim()).filter(Boolean).slice(0, 60);
}

function splitTitle(title) {
  const parts = clean(title).split(" ").filter(Boolean);
  const yearIndex = parts.findIndex((part) => /^20\d{2}$|^19\d{2}$/.test(part));
  const year = yearIndex >= 0 ? parts[yearIndex] : "";
  const remaining = parts.filter((_, index) => index !== yearIndex);
  return {
    year,
    make: remaining[0] || "",
    model: remaining.slice(1).join(" "),
  };
}

function hashObject(obj) {
  return crypto.createHash("sha1").update(JSON.stringify(obj || {})).digest("hex");
}

function parseDealerKitVehicles(data) {
  const objects = flatten(data);
  const vehicles = [];
  const seen = new Set();

  for (const obj of objects) {
    const title = titleFrom(obj);
    if (!title || title.length < 4 || badTitle(title)) continue;

    const link = clean(get(obj, ["link", "url", "permalink", "vehicle_url", "advert_url", "details_url", "page_url"]));
    const reg = normaliseReg(get(obj, ["reg", "registration", "registration_number", "vrm", "registrationNumber"]));
    const sourceId = clean(get(obj, ["id", "ID", "vehicle_id", "stock_id", "advert_id", "post_id", "cap_id"]), link || reg || title);

    if (!sourceId || seen.has(sourceId)) continue;

    const make = clean(get(obj, ["make", "manufacturer"]));
    const model = clean(get(obj, ["model"]));
    const price = money(get(obj, ["price", "display_price", "formatted_price", "price_display", "selling_price", "retail_price", "cash_price"]));
    const miles = mileage(get(obj, ["mileage", "odometer", "miles"]));
    const fuel = clean(get(obj, ["fuel", "fuel_type", "fuelType"]));
    const transmission = clean(get(obj, ["transmission", "gearbox"]));

    if (!make && !model && !price && !miles && !reg && !fuel && !transmission && !link) continue;

    seen.add(sourceId);

    vehicles.push({
      source_vehicle_id: sourceId,
      source_platform: "dealerkit",
      title,
      make,
      model,
      derivative: clean(get(obj, ["derivative", "variant", "trim"])),
      year: clean(get(obj, ["year", "registration_year", "yearOfManufacture"])),
      reg,
      price,
      mileage: miles,
      fuel_type: fuel,
      transmission,
      colour: clean(get(obj, ["colour", "color"])),
      engine_capacity: clean(get(obj, ["engine_capacity", "engineCapacity", "engine_size", "engine"])),
      description: clean(get(obj, ["description", "excerpt.rendered", "summary", "short_description", "content.rendered"])),
      features: featuresFrom(obj),
      image_urls: collectImageUrls(obj),
      source_url: link,
      raw: obj,
      sync_hash: hashObject(obj),
    });
  }

  return vehicles;
}

function toVehicleRow(car, dealershipId) {
  const fallback = splitTitle(car.title);
  const make = clean(car.make, fallback.make);
  const model = [clean(car.model), clean(car.derivative)].filter(Boolean).join(" ") || fallback.model || clean(car.title);
  const tags = Array.isArray(car.features) ? car.features : [];

  return {
    dealership_id: dealershipId,
    make,
    model,
    year: clean(car.year, fallback.year),
    reg: clean(car.reg),
    vrm: clean(car.reg),
    price: clean(car.price),
    monthly_price: "",
    mileage: clean(car.mileage),
    fuel_type: clean(car.fuel_type),
    transmission: clean(car.transmission),
    colour: clean(car.colour),
    engine_capacity: clean(car.engine_capacity),
    description: clean(car.description, clean(car.title)),
    features: tags,
    tags,
    image_urls: car.image_urls || [],
    verified_facts: {
      make,
      model,
      year: clean(car.year, fallback.year),
      reg: clean(car.reg),
      price: clean(car.price),
      mileage: clean(car.mileage),
      fuel_type: clean(car.fuel_type),
      transmission: clean(car.transmission),
      colour: clean(car.colour),
      engine_capacity: clean(car.engine_capacity),
      features: tags,
    },
    status: "available",
    source_url: clean(car.source_url),
    source_platform: "dealerkit",
    source_vehicle_id: clean(car.source_vehicle_id),
    raw_data: car.raw || car,
    sync_hash: car.sync_hash || hashObject(car),
    last_synced_at: new Date().toISOString(),
    deleted_at: null,
  };
}

export async function importDealerKitStock({ supabase, feedUrl, dealershipId }) {
  if (!feedUrl) throw new Error("DealerKit feed URL is missing.");
  if (!dealershipId) throw new Error("Dealership ID is missing.");

  const response = await fetch(feedUrl, {
    headers: {
      Accept: "application/json,text/plain,*/*",
      "User-Agent": "AutoRevisit Stock Sync",
    },
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`DealerKit feed returned ${response.status}.`);

  const text = await response.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("DealerKit feed did not return valid JSON.");
  }

  const parsed = parseDealerKitVehicles(json);
  if (!parsed.length) throw new Error("DealerKit feed returned zero vehicles.");

  const sourceIds = [];
  let created = 0;
  let updated = 0;

  for (const car of parsed) {
    const row = toVehicleRow(car, dealershipId);
    sourceIds.push(row.source_vehicle_id);

    let existing = null;

    if (row.source_vehicle_id) {
      const { data } = await supabase
        .from("vehicles")
        .select("id")
        .eq("dealership_id", dealershipId)
        .eq("source_platform", "dealerkit")
        .eq("source_vehicle_id", row.source_vehicle_id)
        .maybeSingle();
      existing = data;
    }

    if (!existing?.id && row.reg) {
      const { data } = await supabase
        .from("vehicles")
        .select("id")
        .eq("dealership_id", dealershipId)
        .eq("reg", row.reg)
        .maybeSingle();
      existing = data;
    }

    if (existing?.id) {
      const { error } = await supabase.from("vehicles").update(row).eq("id", existing.id);
      if (error) throw error;
      updated += 1;
    } else {
      const { error } = await supabase.from("vehicles").insert(row);
      if (error) throw error;
      created += 1;
    }
  }

  const { data: existingFeedVehicles } = await supabase
    .from("vehicles")
    .select("id, source_vehicle_id")
    .eq("dealership_id", dealershipId)
    .eq("source_platform", "dealerkit")
    .is("deleted_at", null);

  const activeSet = new Set(sourceIds);
  const removedIds = (existingFeedVehicles || [])
    .filter((vehicle) => vehicle.source_vehicle_id && !activeSet.has(vehicle.source_vehicle_id))
    .map((vehicle) => vehicle.id);

  if (removedIds.length) {
    const { error } = await supabase
      .from("vehicles")
      .update({ status: "deleted", deleted_at: new Date().toISOString() })
      .in("id", removedIds);
    if (error) throw error;
  }

  const message = `Imported ${parsed.length} vehicles. ${created} created, ${updated} updated, ${removedIds.length} removed.`;

  await supabase
    .from("dealerships")
    .update({
      last_stock_sync_at: new Date().toISOString(),
      last_stock_sync_status: "success",
      last_stock_sync_message: message,
      updated_at: new Date().toISOString(),
    })
    .eq("id", dealershipId);

  return { total: parsed.length, created, updated, removed: removedIds.length, message };
}
