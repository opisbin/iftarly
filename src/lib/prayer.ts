import { PrayerApiResponse } from "./types";

const IFB_METHOD_ID = 16;

const CACHE = new Map<string, { data: PrayerApiResponse; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCacheKey(
  lat: number,
  lng: number,
  date: string,
  method: number,
): string {
  return `${lat.toFixed(4)}_${lng.toFixed(4)}_${date}_${method}`;
}

/**
 * Build the AlAdhan API URL.
 * For Islamic Foundation Bangladesh (method 16) we use method=99 (Custom)
 * with Fajr 18°, Isha 18°, and school=1 (Hanafi Asr calculation).
 */
function buildApiUrl(
  latitude: number,
  longitude: number,
  date: string,
  method: number,
): string {
  const base = `https://api.aladhan.com/v1/timings/${date}?latitude=${latitude}&longitude=${longitude}`;

  if (method === IFB_METHOD_ID) {
    // Custom method matching Islamic Foundation Bangladesh:
    // Fajr angle = 18°, no Maghrib adjustment, Isha angle = 18°
    // school = 1 → Hanafi (Asr shadow factor = 2)
    return `${base}&method=99&methodSettings=18,null,18&school=1`;
  }

  return `${base}&method=${method}`;
}

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  date: string,
  method: number = 16,
): Promise<PrayerApiResponse> {
  const cacheKey = getCacheKey(latitude, longitude, date, method);

  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const url = buildApiUrl(latitude, longitude, date, method);

  const response = await fetch(url, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(
      `Aladhan API request failed with status ${response.status}`,
    );
  }

  const json = await response.json();

  if (!json?.data?.timings || !json?.data?.date) {
    throw new Error("Invalid response structure from Aladhan API");
  }

  const apiData = json.data;
  const apiDate = apiData.date;
  const apiHijri = apiDate?.hijri;
  const apiGregorian = apiDate?.gregorian;

  if (!apiHijri || !apiGregorian) {
    throw new Error("Missing date fields in Aladhan API response");
  }

  const timings = apiData.timings;
  const requiredFields = [
    "Fajr",
    "Sunrise",
    "Dhuhr",
    "Asr",
    "Sunset",
    "Maghrib",
    "Isha",
    "Imsak",
    "Midnight",
  ];

  for (const field of requiredFields) {
    if (typeof timings[field] !== "string") {
      throw new Error(`Missing or invalid timing field: ${field}`);
    }
  }

  const stripTimezone = (t: string): string => t.replace(/\s*\(.*\)$/, "");

  const to12h = (t: string): string => {
    const clean = stripTimezone(t);
    const [h, m] = clean.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
  };

  const methodId =
    typeof apiData?.meta?.method?.id === "number"
      ? apiData.meta.method.id
      : method;
  const methodName =
    typeof apiData?.meta?.method?.name === "string"
      ? apiData.meta.method.name
      : "Unknown method";

  const hijriMonthNumber =
    typeof apiHijri?.month?.number === "number" ? apiHijri.month.number : 0;

  const result: PrayerApiResponse = {
    timings: {
      fajr: to12h(timings.Fajr),
      sunrise: to12h(timings.Sunrise),
      dhuhr: to12h(timings.Dhuhr),
      asr: to12h(timings.Asr),
      sunset: to12h(timings.Sunset),
      maghrib: to12h(timings.Maghrib),
      isha: to12h(timings.Isha),
      imsak: to12h(timings.Imsak),
      midnight: to12h(timings.Midnight),
    },
    date: {
      hijri: {
        day: String(apiHijri?.day ?? ""),
        weekday: String(apiHijri?.weekday?.en ?? ""),
        month: String(apiHijri?.month?.en ?? ""),
        monthNumber: hijriMonthNumber,
        year: String(apiHijri?.year ?? ""),
        designation: String(apiHijri?.designation?.abbreviated ?? ""),
        holidays: Array.isArray(apiHijri?.holidays) ? apiHijri.holidays : [],
      },
      gregorian: {
        date: String(apiGregorian?.date ?? ""),
        day: String(apiGregorian?.day ?? ""),
        month: {
          number:
            typeof apiGregorian?.month?.number === "number"
              ? apiGregorian.month.number
              : 0,
          en: String(apiGregorian?.month?.en ?? ""),
        },
        year: String(apiGregorian?.year ?? ""),
        weekday: { en: String(apiGregorian?.weekday?.en ?? "") },
      },
    },
    meta: {
      method: {
        id: methodId,
        name: methodName,
      },
    },
  };

  // Label the method correctly for Islamic Foundation Bangladesh
  if (method === IFB_METHOD_ID) {
    result.meta.method = {
      id: IFB_METHOD_ID,
      name: "Bangladesh",
    };
  }

  CACHE.set(cacheKey, { data: result, timestamp: Date.now() });

  return result;
}
