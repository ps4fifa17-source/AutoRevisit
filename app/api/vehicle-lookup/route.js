import { NextResponse } from "next/server";

function normaliseReg(reg) { return String(reg || "").toUpperCase().replace(/[^A-Z0-9]/g, ""); }

export async function POST(request) {
  try {
    const body = await request.json();
    const reg = normaliseReg(body.reg);
    if (!reg) return NextResponse.json({ error: "Enter a registration" }, { status: 400 });

    if (!process.env.DVLA_API_KEY) {
      return NextResponse.json({ success: false, lookupConnected: false, reg, message: "DVLA lookup not connected yet. Add DVLA_API_KEY." });
    }

    const response = await fetch("https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": process.env.DVLA_API_KEY },
      body: JSON.stringify({ registrationNumber: reg }),
    });

    const raw = await response.text();
    let data = {};
    try { data = raw ? JSON.parse(raw) : {}; } catch { data = { raw }; }

    if (!response.ok) return NextResponse.json({ success: false, lookupConnected: true, reg, message: data?.errors?.[0]?.detail || "DVLA lookup failed", raw: data });

    return NextResponse.json({
      success: true,
      lookupConnected: true,
      reg,
      vehicle: {
        reg,
        make: data.make || "",
        year: data.yearOfManufacture || "",
        fuel_type: data.fuelType || "",
        colour: data.colour || "",
        engine_capacity: data.engineCapacity || "",
        co2_emissions: data.co2Emissions || "",
        tax_status: data.taxStatus || "",
        mot_status: data.motStatus || "",
        month_of_first_registration: data.monthOfFirstRegistration || "",
        dvla_data: data,
      },
      raw: data,
    });
  } catch (error) {
    return NextResponse.json({ error: error?.message || String(error) }, { status: 500 });
  }
}
