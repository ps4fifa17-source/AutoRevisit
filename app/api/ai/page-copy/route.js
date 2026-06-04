import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import {
  buildAISalesPrompt,
  cleanVehicleFacts,
  fallbackSalesCopy,
} from "@/lib/aiPageBrain";

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error("AI returned invalid JSON");
  }
}

function normaliseCopy(copy, fallback) {
  const topReasons =
    Array.isArray(copy.topReasons) && copy.topReasons.length
      ? copy.topReasons
          .slice(0, 3)
          .map((item) => ({
            title: String(item.title || "Worth noting").slice(0, 55),
            text: String(item.text || "").slice(0, 120),
          }))
          .filter((item) => item.text)
      : fallback.topReasons;

  return {
    greeting: copy.greeting || fallback.greeting,
    heroTitle: copy.heroTitle || fallback.heroTitle,
    heroSubtitle: copy.heroSubtitle || fallback.heroSubtitle,
    whyThisVehicleTitle: copy.whyThisVehicleTitle || fallback.whyThisVehicleTitle,
    whyThisVehicleText: copy.whyThisVehicleText || fallback.whyThisVehicleText,
    topReasons,
    ownershipTitle: copy.ownershipTitle || fallback.ownershipTitle,
    ownershipText: copy.ownershipText || fallback.ownershipText,
    reassuranceTitle: copy.reassuranceTitle || fallback.reassuranceTitle,
    reassuranceText: copy.reassuranceText || fallback.reassuranceText,
    questions: [],
    primaryCta: copy.primaryCta || fallback.primaryCta,
    secondaryCta: copy.secondaryCta || fallback.secondaryCta,
    whatsappMessage: copy.whatsappMessage || fallback.whatsappMessage,
    safeDisclaimer: copy.safeDisclaimer || fallback.safeDisclaimer,

    // legacy compatibility
    headline: copy.heroTitle || fallback.heroTitle,
    subline: copy.heroSubtitle || fallback.heroSubtitle,
    intro: copy.heroSubtitle || fallback.heroSubtitle,
    quickCards: topReasons,
  };
}

export async function POST(request) {
  try {
    const body = await request.json();

    const {
      vehicleIds = [],
      customerName,
      whoFor,
      buyingFor,
      pushAngle,
      style,
      pageType = "revisit",
      pageUrl = "[LINK]",
      finance = {},
      dealerNotes = "",
    } = body;

    const supabase = createClient();

    let vehicle = {};
    if (vehicleIds?.[0]) {
      const { data } = await supabase
        .from("vehicles")
        .select("*")
        .eq("id", vehicleIds[0])
        .single();

      vehicle = data || {};
    }

    const vehicleFacts = cleanVehicleFacts(vehicle);
    const fallback = fallbackSalesCopy({
      customerName,
      pushAngle,
      vehicleFacts,
      pageUrl,
      pageType,
    });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ copy: fallback, source: "fallback_no_openai_key" });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = buildAISalesPrompt({
      customerName,
      whoFor: whoFor || buyingFor,
      pushAngle,
      designStyle: style,
      vehicleFacts,
      finance,
      dealerNotes,
      pageType,
      pageUrl,
    });

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      temperature: 0.38,
      messages: [
        {
          role: "system",
          content:
            "You write short, safe, dealer-to-customer vehicle sales page copy. Return JSON only. Never invent vehicle facts. Keep it punchy.",
        },
        { role: "user", content: prompt },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content || "";
    let parsed;
    try {
      parsed = safeJsonParse(raw);
    } catch (error) {
      console.error("AI JSON parse failed, using fallback:", error);
      return NextResponse.json({ copy: fallback, source: "fallback_invalid_ai_json" });
    }
    const copy = normaliseCopy(parsed, fallback);

    return NextResponse.json({ copy, source: "openai" });
  } catch (error) {
    console.error("AI page-copy error:", error);
    return NextResponse.json({ error: error?.message || "AI copy failed" }, { status: 500 });
  }
}
