function clean(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((x) => clean(x)).filter(Boolean).join(", ");
  if (typeof value === "object") return value.name || value.label || value.value || value.display || fallback;
  return fallback;
}

function numberFromText(value) {
  const match = clean(value).replace(/,/g, "").match(/[0-9]+(\.[0-9]+)?/);
  return match ? Number(match[0]) : null;
}

export function buildVehicleMasterRecord(vehicle = {}) {
  const facts = {
    make: clean(vehicle.make),
    model: clean(vehicle.model),
    year: clean(vehicle.year),
    reg: clean(vehicle.reg || vehicle.vrm),
    price: clean(vehicle.price),
    monthlyPrice: clean(vehicle.monthly_price),
    mileage: clean(vehicle.mileage),
    fuel: clean(vehicle.fuel_type),
    transmission: clean(vehicle.transmission),
    description: clean(vehicle.description),
    features: Array.isArray(vehicle.features) ? vehicle.features : Array.isArray(vehicle.tags) ? vehicle.tags : [],
    status: clean(vehicle.status, "available"),
  };

  const scores = scoreVehicle(facts);

  return {
    facts,
    scores,
    generatedAt: new Date().toISOString(),
  };
}

export function scoreVehicle(facts = {}) {
  const text = [
    facts.make,
    facts.model,
    facts.description,
    ...(facts.features || []),
    facts.fuel,
    facts.transmission,
  ].join(" ").toLowerCase();

  const mileageNumber = numberFromText(facts.mileage);
  const priceNumber = numberFromText(facts.price);

  let economy = 5;
  let practicality = 5;
  let performance = 5;
  let premium = 5;
  let technology = 5;
  let family = 5;

  if (/diesel|hybrid|electric|ulez|low tax|cheap tax|eco|efficient|mpg/.test(text)) economy += 2;
  if (/petrol/.test(text)) economy += 0;
  if (mileageNumber && mileageNumber < 40000) premium += 1;
  if (priceNumber && priceNumber < 10000) economy += 1;

  if (/estate|suv|touring|boot|isofix|family|spacious|5 door|five door/.test(text)) {
    practicality += 2;
    family += 2;
  }

  if (/sport|st|gti|gtd|cupra|amg|m sport|s line|rs|performance|bhp|turbo/.test(text)) {
    performance += 3;
  }

  if (/leather|pan roof|panoramic|heated|camera|premium|luxury|meridian|bose|harman|ambient/.test(text)) {
    premium += 2;
  }

  if (/carplay|android auto|bluetooth|navigation|camera|sensors|digital|cruise/.test(text)) {
    technology += 2;
  }

  const clamp = (n) => Math.max(1, Math.min(10, Math.round(n)));

  return {
    economy: clamp(economy),
    practicality: clamp(practicality),
    performance: clamp(performance),
    premium: clamp(premium),
    technology: clamp(technology),
    family: clamp(family),
  };
}

export function bestAnglesFromScores(scores = {}) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key]) => key);
}
