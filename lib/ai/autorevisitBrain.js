import { generateSafeVehicleCopy } from "@/lib/ai/safeVehicleCopy";
import { buildVehicleMasterRecord, bestAnglesFromScores } from "@/lib/vehicle/masterRecord";
import { getCustomerType, getPushAngle, getPageStyle, getBuyingFor, makeDefaultGreeting, makeDefaultSubtitle } from "@/lib/pageJourney";

function safeString(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

function compactVehicle(vehicle = {}) {
  const master = buildVehicleMasterRecord(vehicle);
  const facts = master.facts || {};
  const scores = master.scores || {};
  return {
    id: vehicle.id,
    title: [facts.year, facts.make, facts.model].filter(Boolean).join(" "),
    make: facts.make,
    model: facts.model,
    year: facts.year,
    registration: facts.reg,
    price: facts.price,
    monthlyPrice: facts.monthlyPrice,
    mileage: facts.mileage,
    fuel: facts.fuel,
    transmission: facts.transmission,
    description: facts.description,
    suppliedFeatures: facts.features || [],
    verifiedFacts: vehicle.verified_facts || {},
    dvlaData: vehicle.dvla_data || {},
    aiScores: vehicle.ai_scores || scores,
    strongestAngles: bestAnglesFromScores(vehicle.ai_scores || scores),
  };
}

function makeVehicleTitle(vehicle = {}) {
  return [vehicle.year, vehicle.make, vehicle.model].filter(Boolean).join(" ") || "this vehicle";
}

function makeFallbackCards(pushAngle) {
  if (pushAngle === "performance") return [
    { title: "Driving feel", text: "worth experiencing" },
    { title: "Sharp choice", text: "for the right buyer" },
    { title: "Prepared", text: "ready to view" },
    { title: "Test drive", text: "feel it properly" },
  ];
  if (pushAngle === "finance") return [
    { title: "Finance", text: "made simple" },
    { title: "Figures", text: "to discuss" },
    { title: "Prepared", text: "ready to view" },
    { title: "We’re here", text: "to help" },
  ];
  return [
    { title: "Great choice", text: "easy to revisit" },
    { title: "Prepared", text: "ready to discuss" },
    { title: "Next steps", text: "simple from here" },
    { title: "We’re here", text: "ask anything" },
  ];
}

function fallbackMicrocopy({ vehicle, customerName, whoFor, buyingFor, pushAngle, style }) {
  const vehicleTitle = makeVehicleTitle(vehicle);
  const safe = generateSafeVehicleCopy({ vehicle, customerType: `${getCustomerType(whoFor)} buying for ${getBuyingFor(buyingFor)}`, pageGoal: getPushAngle(pushAngle), pageMood: getPageStyle(style).name });
  return {
    greeting: makeDefaultGreeting(customerName),
    subline: makeDefaultSubtitle(vehicleTitle),
    vehicleBadge: "Picked for you",
    quickCards: makeFallbackCards(pushAngle),
    fitTitle: buyingFor !== "themselves" ? `Why it could suit their ${getBuyingFor(buyingFor).toLowerCase()}` : `Why this ${vehicle.model || "car"} suits you`,
    fitText: safe.sellingPoints?.[0] || `${vehicleTitle} has been presented clearly so it can be reviewed without pressure.`,
    moneyTitle: pushAngle === "finance" ? "Finance made clear" : "Clear next step",
    moneyText: pushAngle === "finance" ? "Ask us for figures that suit you." : "Message us when you’re ready.",
    primaryCta: "Message us",
    secondaryCta: pushAngle === "performance" ? "Arrange a drive" : "Book a test drive",
    factsUsed: [],
    riskFlags: [],
  };
}

function systemPrompt() {
  return `You are the AutoRevisit microcopy brain for UK car dealers.

Return only valid JSON.
Keep everything very short. No paragraph over 14 words.
The greeting must stay close to: Hello {name}.
The subtitle must stay close to: Thanks for viewing our {vehicle} today.
Use PUSH ANGLE first, BUYING FOR second, customer type third.
Never invent MPG, BHP, tax, warranty, finance figures, owners, service history, ULEZ, MOT, trim, spec, or features.
If a fact is missing, don't mention it.
If Push = Performance, do not randomly write family/practical copy.
If buying for daughter/son/partner/family, make the wording feel aimed at both the visitor and that person.

JSON shape:
{"greeting":"Hello Jack","subline":"Thanks for viewing our Toyota Yaris today.","vehicleBadge":"Picked for you","quickCards":[{"title":"Great choice","text":"easy to revisit"},{"title":"Prepared","text":"ready to view"},{"title":"Next steps","text":"simple from here"},{"title":"We're here","text":"to help"}],"fitTitle":"Why this car suits you","fitText":"Very short reason.","moneyTitle":"Clear next step","moneyText":"Short safe line.","primaryCta":"Message us","secondaryCta":"Book a test drive","factsUsed":[],"riskFlags":[]}`;
}

function userPrompt({ vehicles, customerName, whoFor, buyingFor, pushAngle, style, dealer }) {
  const compact = vehicles.map(compactVehicle);
  return JSON.stringify({
    requiredDefaults: { greeting: makeDefaultGreeting(customerName), subline: makeDefaultSubtitle(compact[0]?.title || "this vehicle") },
    customer: { name: customerName, whoFor: getCustomerType(whoFor), buyingFor: getBuyingFor(buyingFor), pushAngle: getPushAngle(pushAngle), style: getPageStyle(style) },
    dealer: { name: dealer?.name || "", phone: dealer?.phone || "", website: dealer?.website || "" },
    vehicles: compact,
  });
}

function parseJson(responseJson) {
  const text = responseJson.output_text || responseJson.output?.flatMap((i) => i.content || []).map((c) => c.text || "").join("") || "";
  if (!text) throw new Error("No OpenAI output");
  return JSON.parse(text.replace(/^```json/i, "").replace(/^```/i, "").replace(/```$/i, "").trim());
}

function normalise(raw, fallback) {
  return {
    greeting: safeString(raw.greeting, fallback.greeting),
    subline: safeString(raw.subline, fallback.subline),
    vehicleBadge: safeString(raw.vehicleBadge, fallback.vehicleBadge),
    quickCards: Array.isArray(raw.quickCards) ? raw.quickCards.slice(0, 4).map((c, i) => ({ title: safeString(c.title, fallback.quickCards[i]?.title), text: safeString(c.text, fallback.quickCards[i]?.text) })) : fallback.quickCards,
    fitTitle: safeString(raw.fitTitle, fallback.fitTitle),
    fitText: safeString(raw.fitText, fallback.fitText),
    moneyTitle: safeString(raw.moneyTitle, fallback.moneyTitle),
    moneyText: safeString(raw.moneyText, fallback.moneyText),
    primaryCta: safeString(raw.primaryCta, fallback.primaryCta),
    secondaryCta: safeString(raw.secondaryCta, fallback.secondaryCta),
    factsUsed: Array.isArray(raw.factsUsed) ? raw.factsUsed.slice(0, 10) : [],
    riskFlags: Array.isArray(raw.riskFlags) ? raw.riskFlags.slice(0, 10) : [],
  };
}

export async function generateAutoRevisitBrainCopy({ vehicles = [], customerName = "", whoFor = "undecided", buyingFor = "themselves", pushAngle = "reassurance", style = "simple", dealer = null }) {
  const fallback = fallbackMicrocopy({ vehicle: vehicles[0] || {}, customerName, whoFor, buyingFor, pushAngle, style });
  if (!process.env.OPENAI_API_KEY) return { copy: fallback, provider: "safe_fallback_no_openai_key" };
  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4.1-mini", input: [{ role: "system", content: systemPrompt() }, { role: "user", content: userPrompt({ vehicles, customerName, whoFor, buyingFor, pushAngle, style, dealer }) }], temperature: 0.25, max_output_tokens: 700 }),
    });
    if (!response.ok) throw new Error(await response.text());
    return { copy: normalise(parseJson(await response.json()), fallback), provider: "openai" };
  } catch (error) {
    console.error("AI failed, using fallback", error);
    return { copy: fallback, provider: "safe_fallback_after_error", error: error?.message || String(error) };
  }
}
