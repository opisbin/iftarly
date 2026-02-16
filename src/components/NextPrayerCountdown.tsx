"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock3 } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface NextPrayerCountdownProps {
  timings: {
    fajr: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
  isToday: boolean;
}

interface CountdownState {
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
}

function parseTime(time: string, baseDate: Date): Date {
  const [timePart, period] = time.split(" ");
  let [h, m] = timePart.split(":").map(Number);
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  const d = new Date(baseDate);
  d.setHours(h, m, 0, 0);
  return d;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function NextPrayerCountdown({
  timings,
  isToday,
}: NextPrayerCountdownProps) {
  const { t } = useLanguage();
  const schedule = useMemo(
    () => [
      { label: t("fajr"), time: timings.fajr },
      { label: t("dhuhr"), time: timings.dhuhr },
      { label: t("asr"), time: timings.asr },
      { label: t("maghrib"), time: timings.maghrib },
      { label: t("isha"), time: timings.isha },
    ],
    [timings, t],
  );

  const [countdown, setCountdown] = useState<CountdownState | null>(null);

  const updateCountdown = useCallback(() => {
    const now = new Date();

    const todayPrayerTimes = schedule.map((p) => ({
      label: p.label,
      datetime: parseTime(p.time, now),
    }));

    const upcoming = todayPrayerTimes.find(
      (p) => p.datetime.getTime() > now.getTime(),
    );

    const target = upcoming
      ? upcoming
      : {
          label: "Fajr",
          datetime: (() => {
            const d = parseTime(timings.fajr, now);
            d.setDate(d.getDate() + 1);
            return d;
          })(),
        };

    const totalSeconds = Math.max(
      0,
      Math.floor((target.datetime.getTime() - now.getTime()) / 1000),
    );

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setCountdown({
      label: upcoming ? target.label : t("fajrTomorrow"),
      hours,
      minutes,
      seconds,
    });
  }, [schedule, timings.fajr]);

  useEffect(() => {
    if (!isToday) return;

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [isToday, updateCountdown]);

  if (!isToday) {
    return (
      <Card className="mt-4 border-border/60 bg-card/60">
        <CardContent className="p-4 text-center">
          <p className="text-xs text-muted-foreground">
            {t("nextPrayerTodayOnly")}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-4 border-border/60 bg-card/60">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock3 className="size-4 text-primary" />
            <span className="text-muted-foreground">{t("nextPrayer")}</span>
            <span className="font-semibold text-foreground">
              {countdown?.label ?? "..."}
            </span>
          </div>

          <p className="font-mono text-base sm:text-lg font-bold tabular-nums text-primary">
            {countdown
              ? `${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`
              : "--:--:--"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
