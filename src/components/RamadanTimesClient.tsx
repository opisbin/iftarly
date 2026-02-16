"use client";

import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import {
  PrayerCard,
  AllTimesGrid,
  SahoorIcon,
  IftarIcon,
} from "@/components/PrayerTimes";
import Countdown from "@/components/Countdown";
import MethodSelector from "@/components/MethodSelector";
import DatePicker from "@/components/DatePicker";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import ErrorDisplay from "@/components/ErrorDisplay";
import NextPrayerCountdown from "@/components/NextPrayerCountdown";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Calendar, Download, Moon } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LanguageToggle } from "@/components/LanguageToggle";
import { useLanguage } from "@/components/LanguageProvider";

export default function RamadanTimesClient() {
  const {
    data,
    error,
    loading,
    method,
    setMethod,
    selectedDate,
    setSelectedDate,
    isToday,
    retry,
  } = usePrayerTimes();
  const { t } = useLanguage();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={retry} />;
  }

  if (!data) {
    return null;
  }

  const { timings, date } = data;
  const isRamadan = date.hijri.monthNumber === 9;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 sm:py-12 animate-fade-in-up">
      {/* ─── Theme & Language Toggle ─────────────────── */}
      <div className="flex justify-end gap-2 mb-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      {/* ─── Header ───────────────────────────────────── */}
      <header className="text-center mb-10">
        <div className="inline-flex items-center gap-3 mb-3">
          <Image
            src="/iftarly-logo.svg"
            alt="Iftarly logo"
            width={44}
            height={44}
            className="drop-shadow-[0_0_12px_rgba(212,168,67,0.35)]"
            priority
          />
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-r from-gold-bright via-gold to-gold-dim bg-clip-text text-transparent">
            Iftarly.app
          </h1>
        </div>
        {isRamadan ? (
          <Badge className="bg-primary/15 text-primary border-primary/30 hover:bg-primary/20">
            {t("ramadanMubarak")}
          </Badge>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t("dailyPrayerTimes")}
          </p>
        )}
      </header>

      {/* ─── Date Picker ─────────────────────────────── */}
      <div className="mb-6">
        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          onToday={() => {
            const d = new Date();
            setSelectedDate(
              `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
            );
          }}
          isToday={isToday}
        />
      </div>

      {/* ─── Dates ────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-5 mb-10 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-3.5" />
          <span>
            {date.gregorian.weekday.en}, {date.gregorian.day}{" "}
            {date.gregorian.month.en} {date.gregorian.year}
          </span>
        </div>
        <Separator orientation="vertical" className="hidden sm:block h-4" />
        <div className="flex items-center gap-2 text-primary">
          <Moon className="size-3.5" />
          <span className="font-medium">
            {date.hijri.day} {date.hijri.month} {date.hijri.year}{" "}
            {date.hijri.designation}
          </span>
        </div>
      </div>

      {/* ─── Sahoor & Iftar Cards ─────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        <PrayerCard
          label={t("sahoorEnds")}
          time={timings.fajr}
          highlight
          icon={<SahoorIcon />}
        />
        <PrayerCard
          label={t("iftar")}
          time={timings.maghrib}
          highlight
          icon={<IftarIcon />}
        />
      </div>

      {/* ─── Countdown ────────────────────────────────── */}
      {isToday ? (
        <Card className="mb-10 border-border/60 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8">
            <Countdown
              targetTime={timings.maghrib}
              label={t("countdownToIftar")}
            />
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-10 border-border/60 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6 sm:p-8 text-center">
            <p className="text-sm text-muted-foreground">
              {t("countdownOnlyToday")}
            </p>
          </CardContent>
        </Card>
      )}

      {/* ─── All Prayer Times ─────────────────────────── */}
      <div className="mb-10">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="h-px flex-1 bg-border" />
          {t("allPrayerTimes")}
          <span className="h-px flex-1 bg-border" />
        </h2>
        <AllTimesGrid
          timings={{
            fajr: timings.fajr,
            sunrise: timings.sunrise,
            dhuhr: timings.dhuhr,
            asr: timings.asr,
            maghrib: timings.maghrib,
            isha: timings.isha,
          }}
        />
        <NextPrayerCountdown
          timings={{
            fajr: timings.fajr,
            dhuhr: timings.dhuhr,
            asr: timings.asr,
            maghrib: timings.maghrib,
            isha: timings.isha,
          }}
          isToday={isToday}
        />
      </div>

      {/* ─── Method Selector ──────────────────────────── */}
      <Card className="mb-4 border-border/60 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <MethodSelector value={method} onChange={setMethod} />
        </CardContent>
      </Card>

      {/* ─── Disclaimer ───────────────────────────────── */}
      <div className="mb-8 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-4 text-center space-y-3">
        <p className="text-xs leading-relaxed text-amber-600 dark:text-amber-400">
          ⚠️ {t("apiDisclaimer")}
        </p>
        <div>
          <p className="text-xs text-muted-foreground mb-2">
            {t("ifbDownloadNote")}
          </p>
          <a
            href="/ibf.pdf"
            download="Islamic-Foundation-Bangladesh-Schedule.pdf"
            className="inline-flex items-center gap-2 rounded-lg bg-primary/10 border border-primary/30 px-4 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
          >
            <Download className="size-3.5" />
            {t("ifbDownloadBtn")}
          </a>
        </div>
      </div>

      {/* ─── Footer ───────────────────────────────────── */}
      <footer className="text-center text-xs text-muted-foreground pt-4 border-t border-border/50">
        <p className="font-medium">
          {t("calculation")} {data.meta.method.name}
        </p>
        <p className="mt-1.5 opacity-50">
          {t("footerNote")}{" "}
          <a
            href="https://meherab.art"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-blue-500 hover:text-blue-400 transition-colors"
          >
            Meherab Hossain (Opi)
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
