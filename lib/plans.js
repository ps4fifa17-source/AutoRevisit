export const PLAN_ORDER = ["starter", "pro", "premium"];

export const CUSTOMER_GOALS = {
  simple: {
    id: "simple",
    name: "Simple",
    label: "Simple Buyer",
    requiredPlan: "starter",
    description: "Clean, quick and easy to understand.",
  },
  finance: {
    id: "finance",
    name: "Finance",
    label: "Finance Focused Buyer",
    requiredPlan: "pro",
    description: "Monthly payment and affordability first.",
  },
  family: {
    id: "family",
    name: "Family",
    label: "Family Buyer",
    requiredPlan: "pro",
    description: "Safety, space, practicality and peace of mind.",
  },
  performance: {
    id: "performance",
    name: "Performance",
    label: "Performance Buyer",
    requiredPlan: "pro",
    description: "Driving feel, power and excitement first.",
  },
  executive: {
    id: "executive",
    name: "Executive",
    label: "Executive Buyer",
    requiredPlan: "premium",
    description: "Ultra-clean, professional and confidence-led.",
  },
  premium: {
    id: "premium",
    name: "Premium",
    label: "Premium Buyer",
    requiredPlan: "premium",
    description: "Luxury, exclusivity and high-end presentation.",
  },
};

export const PLANS = {
  starter: {
    id: "starter",
    name: "Starter",
    price: "£29",
    period: "per month",
    description: "Simple personalised customer pages for smaller dealers.",
    livePagesLimit: 10,
    customerGoals: ["simple"],
    regLookup: false,
    aiTargeting: false,
    leadScoring: false,
    advancedInsights: false,
    journeyTools: false,
    removeBranding: false,
    watermarkForced: true,
    features: [
      "10 live pages per month",
      "Unlimited vehicles",
      "Simple customer pages",
      "WhatsApp sharing",
      "Basic tracking",
      "Dealer logo and colour",
      "Thank you pages",
    ],
    locked: [
      "Finance, Family, Performance, Executive and Premium page goals",
      "Registration lookup",
      "Lead scoring",
      "Advanced insights",
      "Customer journey intelligence",
      "Remove AutoRevisit watermark",
    ],
  },

  pro: {
    id: "pro",
    name: "Professional",
    price: "£79",
    period: "per month",
    description: "AI targeting, reg lookup and buyer-intent tracking.",
    livePagesLimit: 50,
    customerGoals: ["simple", "finance", "family", "performance"],
    regLookup: true,
    aiTargeting: true,
    leadScoring: true,
    advancedInsights: true,
    journeyTools: true,
    removeBranding: false,
    watermarkForced: true,
    features: [
      "50 live pages per month",
      "Simple, Finance, Family and Performance goals",
      "AI customer targeting",
      "Registration lookup",
      "Lead scoring",
      "Revisit tracking",
      "Advanced insights",
    ],
    locked: [
      "Executive and Premium goals",
      "Remove AutoRevisit watermark",
      "Premium page lab tools",
    ],
  },

  premium: {
    id: "premium",
    name: "Premium",
    price: "£149",
    period: "per month",
    description: "Unlimited pages, full control and premium support.",
    livePagesLimit: Infinity,
    customerGoals: ["simple", "finance", "family", "performance", "executive", "premium"],
    regLookup: true,
    aiTargeting: true,
    leadScoring: true,
    advancedInsights: true,
    journeyTools: true,
    removeBranding: true,
    watermarkForced: false,
    features: [
      "Unlimited live pages",
      "All customer goals",
      "AI customer targeting",
      "Registration lookup",
      "Lead scoring",
      "Advanced insights",
      "Remove AutoRevisit watermark",
      "Priority support",
    ],
    locked: [],
  },
};

export function normalisePlan(planName = "starter") {
  if (planName === "professional") return "pro";
  if (planName === "elite") return "premium";
  return PLANS[planName] ? planName : "starter";
}

export function getPlan(planName = "starter") {
  return PLANS[normalisePlan(planName)] || PLANS.starter;
}

export function planRank(planName = "starter") {
  return PLAN_ORDER.indexOf(normalisePlan(planName));
}

export function isPlanAtLeast(currentPlan = "starter", targetPlan = "starter") {
  return planRank(currentPlan) >= planRank(targetPlan);
}

export function getPlanAction(currentPlanName, cardPlanName) {
  const current = normalisePlan(currentPlanName);
  const card = normalisePlan(cardPlanName);

  if (current === card) return "Current plan";
  if (isPlanAtLeast(current, card)) return "Included";
  return "Upgrade";
}

export function getAllowedGoals(planName = "starter") {
  const plan = getPlan(planName);
  return plan.customerGoals.map((id) => CUSTOMER_GOALS[id]).filter(Boolean);
}

export function isGoalAllowed(planName = "starter", goal = "simple") {
  return getPlan(planName).customerGoals.includes(goal);
}

export function getGoal(goal = "simple") {
  return CUSTOMER_GOALS[goal] || CUSTOMER_GOALS.simple;
}

export function getLivePageLimit(planName = "starter") {
  return getPlan(planName).livePagesLimit;
}
