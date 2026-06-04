export const PUSH_MOTIVATIONS = {
  first_car: "confidence",
  family: "peace of mind",
  finance: "affordability",
  performance: "excitement",
  premium: "exclusivity",
  executive: "professional confidence",
  value: "sensible purchase",
  reassurance: "reduced doubt",
};

export const PUSH_BEHAVIOUR = {
  first_car: { cta: "Ask about first-car costs", secondary: "Book a viewing" },
  family: { cta: "Book a viewing", secondary: "Ask about practicality" },
  finance: { cta: "Check finance figures", secondary: "Message first" },
  performance: { cta: "Arrange a test drive", secondary: "Message us" },
  premium: { cta: "Speak to the dealership", secondary: "Request viewing" },
  executive: { cta: "Arrange a viewing", secondary: "Request details" },
  value: { cta: "Ask about this car", secondary: "Arrange viewing" },
  reassurance: { cta: "Message the dealership", secondary: "Book a viewing" },
};

export function pushKey(pushAngle = "reassurance") {
  const key = String(pushAngle || "reassurance").toLowerCase().replace("-", "_");
  return PUSH_BEHAVIOUR[key] ? key : "reassurance";
}

export function cleanVehicleFacts(vehicle = {}) {
  const facts = {
    make: vehicle.make || null,
    model: vehicle.model || null,
    year: vehicle.year || null,
    price: vehicle.price || null,
    monthly_price: vehicle.monthly_price || null,
    mileage: vehicle.mileage || null,
    fuel_type: vehicle.fuel_type || null,
    transmission: vehicle.transmission || null,
    body_type: vehicle.body_type || null,
    doors: vehicle.doors || null,
    colour: vehicle.colour || null,
    engine_capacity: vehicle.engine_capacity || null,
    mot_status: vehicle.mot_status || null,
    tax_status: vehicle.tax_status || null,
    features: vehicle.features || vehicle.tags || null,
    description: vehicle.description || null,
  };

  return Object.fromEntries(
    Object.entries(facts).filter(([, value]) => value !== null && value !== "" && value !== undefined)
  );
}

export function vehicleTitleFromFacts(facts = {}) {
  return [facts.year, facts.make, facts.model].filter(Boolean).join(" ") || "this vehicle";
}

export function firstName(name = "") {
  return String(name || "there").trim().split(" ")[0] || "there";
}

export function buildWhatsAppMessage({ customerName, vehicleTitle, pageUrl, pushAngle, pageType }) {
  const first = firstName(customerName);
  const key = pushKey(pushAngle);

  if (pageType === "enquiry") {
    return `Hi ${first},\n\nThanks for your enquiry. I’ve put together a quick page for the ${vehicleTitle} so you can see the key details in one place:\n\n${pageUrl}\n\nAny questions, just message me.`;
  }

  const middle =
    key === "finance"
      ? `I’ve put together a personalised page for the ${vehicleTitle}, including the key details and finance angle.`
      : key === "first_car"
      ? `I’ve put together a personalised page showing why the ${vehicleTitle} could make sense as a first car.`
      : key === "family"
      ? `I’ve put together a personalised page showing why the ${vehicleTitle} could work well for what you need.`
      : key === "performance"
      ? `I’ve put together a personalised page for the ${vehicleTitle} so you can revisit what makes it stand out.`
      : `I’ve put together a personalised page for the ${vehicleTitle} we discussed.`;

  return `Hi ${first},\n\n${middle}\n\nYou can revisit everything here:\n\n${pageUrl}\n\nAny questions, just let me know.`;
}

function dealerNotesPromptBlock(dealerNotes) {
  const trimmed = String(dealerNotes || "").trim();
  if (!trimmed) {
    return `Dealer context: None provided. Rely on who-for, push angle and verified vehicle facts only.`;
  }

  return `Dealer context (HIGHEST PRIORITY — this must heavily shape the whole page):
"${trimmed}"

Dealer context rules:
- Treat this as the main brief. Hero title, subtitle, topReasons, ownership and reassurance should clearly reflect it.
- Mirror useful phrases from the dealer naturally (timing, doubts, budget, who the car is for).
- If the dealer mentions a vehicle fact not listed in verified facts, do NOT state it as fact — say it is worth confirming with the dealership.
- Do not ignore this block in favour of generic sales copy.`;
}

export function buildAISalesPrompt({
  customerName,
  whoFor,
  pushAngle,
  designStyle,
  vehicleFacts,
  finance,
  dealerNotes,
  pageType,
  pageUrl,
}) {
  const key = pushKey(pushAngle);
  const vehicleTitle = vehicleTitleFromFacts(vehicleFacts);
  const motivation = PUSH_MOTIVATIONS[key] || "confidence";
  const behaviour = PUSH_BEHAVIOUR[key] || PUSH_BEHAVIOUR.reassurance;

  if (pageType === "enquiry") {
    return `You are AutoRevisit.

Create short dealer-to-customer copy for a simple enquiry follow-up page.

The dealership has received a fresh enquiry. They do NOT know enough about the customer yet, so do not ask deep buyer psychology questions and do not assume who the car is for.

Vehicle: ${vehicleTitle}
Customer name: ${customerName || "Customer"}

${dealerNotesPromptBlock(dealerNotes)}

Verified vehicle facts:
${JSON.stringify(vehicleFacts, null, 2)}

Finance:
${JSON.stringify(finance || {}, null, 2)}

Rules:
- Keep it short.
- Thank them for the enquiry.
- Show the vehicle clearly.
- Mention only verified facts.
- Do not invent facts.
- Do not oversell.
- Do not make it feel like a full personalised revisit page.
- When dealer context is provided, let it drive the angle of every section.

Return ONLY valid JSON:
{
  "greeting": "Hello first name,",
  "heroTitle": "",
  "heroSubtitle": "",
  "whyThisVehicleTitle": "Quick details",
  "whyThisVehicleText": "",
  "topReasons": [
    { "title": "", "text": "" },
    { "title": "", "text": "" },
    { "title": "", "text": "" }
  ],
  "ownershipTitle": "",
  "ownershipText": "",
  "reassuranceTitle": "",
  "reassuranceText": "",
  "questions": ["", "", ""],
  "primaryCta": "Message the dealership",
  "secondaryCta": "Book a viewing",
  "whatsappMessage": "${buildWhatsAppMessage({ customerName, vehicleTitle, pageUrl: pageUrl || "[LINK]", pageType: "enquiry" }).replace(/\n/g, "\\n")}",
  "safeDisclaimer": ""
}`;
  }

  return `You are AutoRevisit's AI sales brain.

Your job is to help a dealership sell THIS specific vehicle to THIS specific customer.

Core question:
Why should THIS customer buy THIS vehicle?

Customer:
Name: ${customerName || "Customer"}
Who this is for: ${whoFor || "themselves"}
Push angle: ${key}
Primary motivation: ${motivation}
Design style: ${designStyle || "clean_light"}

${dealerNotesPromptBlock(dealerNotes)}

Verified vehicle facts:
${JSON.stringify(vehicleFacts, null, 2)}

Finance:
${JSON.stringify(finance || {}, null, 2)}

Rules:
- Keep every text field short. One or two lines only.
- Write like a helpful salesperson, not a blog.
- Sell the ${vehicleTitle}, not the car category.
- Do not invent facts.
- Do not claim cheap insurance, excellent economy, full service history, warranty, perfect condition, ULEZ, low running costs, immaculate condition, one owner, or safe car unless that exact fact appears in verified facts.
- If a useful fact is missing, avoid it or phrase it as something worth confirming with the dealer.
- Questions should be lower-priority reassurance, not the main page.
- When dealer context is provided, it outweighs generic push-angle copy — still without inventing vehicle facts.

Return ONLY valid JSON:
{
  "greeting": "Hello first name,",
  "heroTitle": "",
  "heroSubtitle": "",
  "whyThisVehicleTitle": "",
  "whyThisVehicleText": "",
  "topReasons": [
    { "title": "", "text": "" },
    { "title": "", "text": "" },
    { "title": "", "text": "" }
  ],
  "ownershipTitle": "",
  "ownershipText": "",
  "reassuranceTitle": "",
  "reassuranceText": "",
  "questions": ["", "", ""],
  "primaryCta": "${behaviour.cta}",
  "secondaryCta": "${behaviour.secondary}",
  "whatsappMessage": "${buildWhatsAppMessage({ customerName, vehicleTitle, pageUrl: pageUrl || "[LINK]", pushAngle: key, pageType: "revisit" }).replace(/\n/g, "\\n")}",
  "safeDisclaimer": ""
}`;
}

export function fallbackSalesCopy({ customerName, pushAngle, vehicleFacts, pageUrl = "[LINK]", pageType = "revisit" }) {
  const first = firstName(customerName);
  const key = pushKey(pushAngle);
  const vehicleTitle = vehicleTitleFromFacts(vehicleFacts);
  const model = vehicleFacts?.model || "vehicle";
  const behaviour = PUSH_BEHAVIOUR[key] || PUSH_BEHAVIOUR.reassurance;

  if (pageType === "enquiry") {
    return {
      greeting: `Hello ${first},`,
      heroTitle: `Thanks for your enquiry.`,
      heroSubtitle: `Here’s the ${vehicleTitle} you asked about, with the key details in one place.`,
      whyThisVehicleTitle: "Quick vehicle overview",
      whyThisVehicleText: `This page keeps the main details for the ${model} easy to revisit.`,
      topReasons: [
        { title: "Key details together", text: "Photos, price and core information are all in one place." },
        { title: "Easy next step", text: "Message the dealership if you want more details." },
        { title: "Ready to view", text: "A viewing is the best way to see if it feels right." },
      ],
      ownershipTitle: "Interested in seeing more?",
      ownershipText: "The dealership can answer questions, confirm availability and arrange a viewing.",
      reassuranceTitle: "Before you visit",
      reassuranceText: "Ask anything you want confirmed before making the trip.",
      questions: ["Is it still available?", "Can I arrange a viewing?", "Can you confirm the details?"],
      primaryCta: "Message the dealership",
      secondaryCta: "Book a viewing",
      whatsappMessage: buildWhatsAppMessage({ customerName: first, vehicleTitle, pageUrl, pageType: "enquiry" }),
      safeDisclaimer: "Only verified vehicle details are shown.",
    };
  }

  const base = {
    greeting: `Hello ${first},`,
    primaryCta: behaviour.cta,
    secondaryCta: behaviour.secondary,
    safeDisclaimer: "Only verified vehicle facts are shown. Anything missing should be confirmed with the dealership.",
    whatsappMessage: buildWhatsAppMessage({ customerName: first, vehicleTitle, pageUrl, pushAngle: key, pageType }),
  };

  const copies = {
    first_car: {
      heroTitle: `Why this ${vehicleTitle} could make sense as a first car.`,
      heroSubtitle: "Approachable, easy to revisit and worth seeing properly.",
      whyThisVehicleTitle: `Why the ${model} works here`,
      whyThisVehicleText: `This focuses on why this specific ${model} could suit a first-car decision.`,
      topReasons: [
        { title: "Confidence first", text: "A first car should feel comfortable and easy to get used to." },
        { title: "Everyday usability", text: "It should make normal trips feel simple." },
        { title: "Worth viewing", text: "A viewing helps you check if it feels right." },
      ],
      ownershipTitle: "Imagine the first few months",
      ownershipText: "Getting to work, seeing friends and building confidence each week.",
      reassuranceTitle: "Helpful to confirm",
      reassuranceText: "Insurance, MOT, running costs and warranty options are worth checking.",
      questions: ["What are the running costs?", "What warranty options are available?", "Can I arrange a viewing?"],
    },
    family: {
      heroTitle: `Why this ${vehicleTitle} could work for family life.`,
      heroSubtitle: "Practicality, comfort and confidence in one place.",
      whyThisVehicleTitle: "Built around daily life",
      whyThisVehicleText: "This page focuses on how the car could fit normal family use.",
      topReasons: [
        { title: "Everyday practicality", text: "A family car needs to work for busy weeks." },
        { title: "Comfort matters", text: "A viewing helps you check the space and layout." },
        { title: "Peace of mind", text: "Ask about history, MOT and warranty options." },
      ],
      ownershipTitle: "Picture daily use",
      ownershipText: "School runs, shopping and weekends decide whether a car really fits.",
      reassuranceTitle: "Before deciding",
      reassuranceText: "Check space, comfort and ownership details with the dealership.",
      questions: ["Can we check the space?", "What warranty options are available?", "Can we arrange a viewing?"],
    },
    finance: {
      heroTitle: `How this ${vehicleTitle} could fit your budget.`,
      heroSubtitle: "Clear figures, useful details and no guessed numbers.",
      whyThisVehicleTitle: "Budget clarity first",
      whyThisVehicleText: "The vehicle and finance conversation stay together.",
      topReasons: [
        { title: "Monthly focus", text: "Check how the payment could work." },
        { title: "Clear figures", text: "Only dealer-provided finance is shown." },
        { title: "Simple next step", text: "Ask for deposit, term and monthly options." },
      ],
      ownershipTitle: "Make the numbers clear",
      ownershipText: "Good finance should make the decision easier, not rushed.",
      reassuranceTitle: "Finance note",
      reassuranceText: "Finance is subject to status and should be confirmed by the dealership.",
      questions: ["What deposit works?", "What term is available?", "Can I check the figures?"],
    },
    performance: {
      heroTitle: `Why this ${vehicleTitle} is worth experiencing.`,
      heroSubtitle: "Presence, feel and the reason it caught your eye.",
      whyThisVehicleTitle: "Built around the drive",
      whyThisVehicleText: "This page focuses on desire, presence and viewing it properly.",
      topReasons: [
        { title: "Road presence", text: "The right car feels special before you set off." },
        { title: "Driving feel", text: "If the drive matters, see it properly." },
        { title: "Look-back factor", text: "Some cars feel good before the journey starts." },
      ],
      ownershipTitle: "Imagine the drive",
      ownershipText: "The right car should make every trip feel more enjoyable.",
      reassuranceTitle: "See it properly",
      reassuranceText: "A viewing or test drive is the best way to judge it.",
      questions: ["Can I arrange a test drive?", "Can I see more photos?", "Can I ask about the spec?"],
    },
    executive: {
      heroTitle: `A clear look at this ${vehicleTitle}.`,
      heroSubtitle: "Structured, simple and easy to compare.",
      whyThisVehicleTitle: "Prepared summary",
      whyThisVehicleText: "The key details are organised so the decision feels clear.",
      topReasons: [
        { title: "Clear overview", text: "The main details are easy to compare." },
        { title: "Professional next step", text: "Ask what you need before viewing." },
        { title: "No pressure", text: "Everything is laid out simply." },
      ],
      ownershipTitle: "A cleaner way to decide",
      ownershipText: "Review the details, ask questions and arrange viewing when ready.",
      reassuranceTitle: "Next step",
      reassuranceText: "The dealership can confirm anything missing before you visit.",
      questions: ["Can I request details?", "Can I arrange a viewing?", "Can you confirm availability?"],
    },
    premium: {
      heroTitle: `A private look at this ${vehicleTitle}.`,
      heroSubtitle: "Prepared so you can take a closer look in your own time.",
      whyThisVehicleTitle: "Prepared for you",
      whyThisVehicleText: "A calmer, more personal way to revisit the car.",
      topReasons: [
        { title: "Private presentation", text: "Everything important is kept in one place." },
        { title: "The details matter", text: "Take your time with the images and specification." },
        { title: "Soft next step", text: "Speak to the dealership when ready." },
      ],
      ownershipTitle: "Picture it properly",
      ownershipText: "The right car should feel considered, not rushed.",
      reassuranceTitle: "Take your time",
      reassuranceText: "Ask the dealership to confirm any details before viewing.",
      questions: ["Can I request a viewing?", "Can I see more details?", "Can I speak to the dealership?"],
    },
    value: {
      heroTitle: `Why this ${vehicleTitle} could be a sensible option.`,
      heroSubtitle: "Clear facts, practical details and an easy next step.",
      whyThisVehicleTitle: "Sensible purchase thinking",
      whyThisVehicleText: "This page focuses on the facts that help you decide.",
      topReasons: [
        { title: "Clear price", text: "The key numbers are easy to revisit." },
        { title: "Useful facts", text: "Mileage, fuel and transmission are shown where provided." },
        { title: "Worth asking about", text: "The dealership can confirm anything missing." },
      ],
      ownershipTitle: "Simple ownership thinking",
      ownershipText: "A sensible car should feel clear before you visit.",
      reassuranceTitle: "Before viewing",
      reassuranceText: "Ask about history, MOT and warranty options if important.",
      questions: ["Is it still available?", "What is included?", "Can I arrange a viewing?"],
    },
    reassurance: {
      heroTitle: `Why this ${vehicleTitle} is worth another look.`,
      heroSubtitle: "A clear, simple page to help you decide with confidence.",
      whyThisVehicleTitle: "Made easier to revisit",
      whyThisVehicleText: "The main details are kept together so nothing gets lost.",
      topReasons: [
        { title: "Clear details", text: "The key information is easy to come back to." },
        { title: "Ask anything", text: "The dealership can confirm what matters." },
        { title: "Next step made simple", text: "Message or arrange a viewing when ready." },
      ],
      ownershipTitle: "Imagine it fitting in",
      ownershipText: "Think about your normal journeys and whether this feels right.",
      reassuranceTitle: "Still unsure?",
      reassuranceText: "Ask the dealership to confirm any details before deciding.",
      questions: ["Can I ask a question?", "Can I arrange a viewing?", "Can you confirm availability?"],
    },
  };

  return { ...base, ...(copies[key] || copies.reassurance) };
}
