import { buildVehicleMasterRecord, bestAnglesFromScores } from "@/lib/vehicle/masterRecord";

function clean(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) return value.map((x) => clean(x)).filter(Boolean).join(", ");
  if (typeof value === "object") return value.name || value.label || value.value || value.display || fallback;
  return fallback;
}

function vehicleTitle(vehicle) {
  return [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || "this vehicle";
}

export function generateSafeVehicleCopy({ vehicle, customerType = "Undecided buyer", pageGoal = "general", pageMood = "modern" }) {
  const master = buildVehicleMasterRecord(vehicle);
  const facts = master.facts;
  const scores = master.scores;
  const bestAngles = bestAnglesFromScores(scores);
  const title = vehicleTitle(facts);

  const points = [];

  if (facts.mileage) points.push(`Mileage is clearly shown at ${facts.mileage}, helping the customer judge usage quickly.`);
  if (facts.transmission) points.push(`The ${facts.transmission.toLowerCase()} gearbox is highlighted for easy comparison.`);
  if (facts.fuel) points.push(`The ${facts.fuel.toLowerCase()} fuel type is made clear upfront.`);
  if (facts.features?.length) points.push(`Key supplied features include ${facts.features.slice(0, 4).join(", ")}.`);
  if (facts.price) points.push(`The price is clearly positioned at ${facts.price}.`);

  if (!points.length) {
    points.push("The page keeps the vehicle details simple, clear and easy to revisit.");
    points.push("The customer can review the car without pressure after leaving the dealership.");
  }

  let angleLine = "clear information and an easy way to revisit the car";
  if (customerType.toLowerCase().includes("finance")) angleLine = "clear pricing and a simple next step";
  if (customerType.toLowerCase().includes("family")) angleLine = "practical details and reassuring presentation";
  if (customerType.toLowerCase().includes("commuter") || customerType.toLowerCase().includes("short")) angleLine = "everyday usability and simple running information";
  if (customerType.toLowerCase().includes("performance")) {
    if (scores.performance >= 7) angleLine = "driving appeal and the stronger supplied specification";
    else angleLine = "the car’s strongest real-world benefits rather than forcing a performance angle";
  }
  if (customerType.toLowerCase().includes("premium")) angleLine = "presentation, condition and standout supplied features";

  return {
    headline: `${title}, presented around ${angleLine}.`,
    intro: `This page has been built to help the customer revisit the important details of ${title} in one clean place.`,
    sellingPoints: points.slice(0, 4),
    cta: "Message us about this vehicle",
    bestAngles,
    scores,
    safetyNote: "Generated only from supplied vehicle data. Missing facts are not invented.",
  };
}
