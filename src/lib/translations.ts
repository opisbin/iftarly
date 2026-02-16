export type Language = "en" | "bn";

export const translations = {
  // Header
  ramadanMubarak: { en: "✨ Ramadan Mubarak!", bn: "✨ রমজান মোবারক!" },
  dailyPrayerTimes: {
    en: "Daily Prayer | Iftar | Sahoor Times",
    bn: "দৈনিক ইফতার | সাহরীর | নামাযের সময়",
  },

  // Prayer Names
  fajr: { en: "Fajr", bn: "ফজর" },
  sunrise: { en: "Sunrise", bn: "সূর্যোদয়" },
  dhuhr: { en: "Dhuhr", bn: "যোহর" },
  asr: { en: "Asr", bn: "আসর" },
  maghrib: { en: "Maghrib", bn: "মাগরিব" },
  isha: { en: "Isha", bn: "ইশা" },

  // Sahoor & Iftar
  sahoorEnds: { en: "Sahoor Ends", bn: "সাহরীর শেষ" },
  iftar: { en: "Iftar", bn: "ইফতার" },

  // Countdown
  countdownToIftar: { en: "Countdown to Iftar", bn: "ইফতারের কাউন্টডাউন" },
  hours: { en: "Hours", bn: "ঘণ্টা" },
  min: { en: "Min", bn: "মিনিট" },
  sec: { en: "Sec", bn: "সেকেন্ড" },
  timePassedForToday: {
    en: "Time has passed for today",
    bn: "আজকের সময় শেষ হয়ে গেছে",
  },
  countdownOnlyToday: {
    en: "Countdown is only available for today's date",
    bn: "কাউন্টডাউন শুধুমাত্র আজকের তারিখের জন্য পাওয়া যায়",
  },

  // All Prayer Times
  allPrayerTimes: { en: "All Prayer Times", bn: "সকল নামাযের সময়" },

  // Next Prayer Countdown
  nextPrayer: { en: "Next Prayer:", bn: "পরবর্তী নামায:" },
  fajrTomorrow: { en: "Fajr (Tomorrow)", bn: "ফজর (আগামীকাল)" },
  nextPrayerTodayOnly: {
    en: "Next prayer countdown is available for today only.",
    bn: "পরবর্তী নামাযের কাউন্টডাউন শুধুমাত্র আজকের জন্য।",
  },

  // Calculation Method
  calculationMethod: { en: "Calculation Method", bn: "হিসাব পদ্ধতি" },
  selectMethod: { en: "Select method", bn: "পদ্ধতি নির্বাচন" },

  // Date Picker
  today: { en: "Today", bn: "আজ" },

  // Footer
  calculation: { en: "Calculation:", bn: "হিসাব:" },
  footerNote: {
    en: "Times are based on your current location. Developed by",
    bn: "সময় আপনার বর্তমান অবস্থানের উপর ভিত্তি করে। ডেভেলপ করেছেন",
  },

  // Errors
  tryAgain: { en: "Try Again", bn: "আবার চেষ্টা করুন" },
  errorLocationDenied: {
    en: "Please enable location access in your browser settings and refresh the page.",
    bn: "দয়া করে আপনার ব্রাউজারের সেটিংসে লোকেশন অ্যাক্সেস চালু করুন এবং পেজ রিফ্রেশ করুন।",
  },
  errorApiFailure: {
    en: "The prayer times service might be temporarily unavailable. Please try again.",
    bn: "নামাযের সময় সেবা সাময়িকভাবে অনুপলব্ধ হতে পারে। দয়া করে আবার চেষ্টা করুন।",
  },
  errorInvalidResponse: {
    en: "Received unexpected data from the server. Please try again later.",
    bn: "সার্ভার থেকে অপ্রত্যাশিত ডেটা পাওয়া গেছে। দয়া করে পরে আবার চেষ্টা করুন।",
  },
  errorUnknown: {
    en: "An unexpected error occurred. Please try refreshing the page.",
    bn: "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। দয়া করে পেজ রিফ্রেশ করুন।",
  },

  // Language toggle
  toggleLanguage: { en: "Toggle language", bn: "ভাষা পরিবর্তন" },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Language): string {
  return translations[key][lang];
}
