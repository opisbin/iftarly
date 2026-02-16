export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  imsak: string;
  midnight: string;
}

export interface HijriDate {
  day: string;
  weekday: string;
  month: string;
  monthNumber: number;
  year: string;
  designation: string;
  holidays: string[];
}

export interface PrayerApiResponse {
  timings: PrayerTimesData;
  date: {
    hijri: HijriDate;
    gregorian: {
      date: string;
      day: string;
      month: { number: number; en: string };
      year: string;
      weekday: { en: string };
    };
  };
  meta: {
    method: {
      id: number;
      name: string;
    };
  };
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface AppError {
  type: "LOCATION_DENIED" | "API_FAILURE" | "INVALID_RESPONSE" | "UNKNOWN";
  message: string;
}

export const CALCULATION_METHODS: Record<number, string> = {
  0: "Shia Ithna-Ashari",
  1: "University of Islamic Sciences, Karachi",
  2: "Islamic Society of North America (ISNA)",
  3: "Muslim World League",
  4: "Umm Al-Qura University, Makkah",
  5: "Egyptian General Authority of Survey",
  7: "Institute of Geophysics, University of Tehran",
  8: "Gulf Region",
  9: "Kuwait",
  10: "Qatar",
  11: "Majlis Ugama Islam Singapura",
  12: "Union Organization Islamic de France",
  13: "Diyanet İşleri Başkanlığı, Turkey",
  14: "Spiritual Administration of Muslims of Russia",
  15: "Moonsighting Committee Worldwide",
  16: "Dhaka, Bangladesh",
  99: "Custom",
};
