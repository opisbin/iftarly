import { NextRequest, NextResponse } from "next/server";

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function getClientIp(request: NextRequest): string | null {
  const forwarded = request.headers.get("x-forwarded-for");
  if (!forwarded) return null;
  return forwarded.split(",")[0]?.trim() || null;
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);

  const providerUrls = [
    ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/",
    ip ? `https://ipwho.is/${ip}` : "https://ipwho.is/",
  ];

  for (const url of providerUrls) {
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) continue;

      const json = await response.json();
      const latitude = asNumber(json.latitude);
      const longitude = asNumber(json.longitude);

      if (latitude === null || longitude === null) continue;

      if (
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        continue;
      }

      return NextResponse.json({
        latitude,
        longitude,
        source: url.includes("ipapi") ? "ipapi" : "ipwhois",
      });
    } catch {
      // try next provider
    }
  }

  return NextResponse.json(
    { error: "Unable to determine location from IP" },
    { status: 502 },
  );
}
