import { NextRequest, NextResponse } from "next/server";
import { fetchPrayerTimes } from "@/lib/prayer";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const latitude = searchParams.get("latitude");
    const longitude = searchParams.get("longitude");
    const date = searchParams.get("date");
    const method = searchParams.get("method");

    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: "latitude and longitude are required" },
        { status: 400 },
      );
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "Invalid latitude or longitude values" },
        { status: 400 },
      );
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: "Coordinates out of valid range" },
        { status: 400 },
      );
    }

    const today =
      date || new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
    const calcMethod = method ? parseInt(method, 10) : 2;

    const data = await fetchPrayerTimes(lat, lng, today, calcMethod);

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    console.error("Prayer times API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { error: `Failed to fetch prayer times: ${message}` },
      { status: 502 },
    );
  }
}
