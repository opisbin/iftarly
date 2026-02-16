"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Moon, Sunrise, Sun, CloudSun, Sunset, Stars } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface PrayerCardProps {
  label: string;
  time: string;
  highlight?: boolean;
  icon: React.ReactNode;
}

export function PrayerCard({ label, time, highlight, icon }: PrayerCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:scale-[1.02] group",
        highlight
          ? "border-primary/30 bg-primary/5 shadow-[0_0_24px_-6px] shadow-primary/10"
          : "border-border/60 bg-card/80 hover:bg-secondary/60",
      )}
    >
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary to-transparent" />
      )}
      <CardContent className="px-5 py-4 sm:px-6 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl transition-colors",
                highlight
                  ? "bg-primary/15 text-primary"
                  : "bg-secondary text-muted-foreground group-hover:text-foreground",
              )}
            >
              {icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1">
                {label}
              </p>
              <p
                className={cn(
                  "text-3xl font-mono font-bold tabular-nums",
                  highlight ? "text-primary" : "text-foreground",
                )}
              >
                {time}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface AllTimesGridProps {
  timings: {
    fajr: string;
    sunrise: string;
    dhuhr: string;
    asr: string;
    maghrib: string;
    isha: string;
  };
}

export function AllTimesGrid({ timings }: AllTimesGridProps) {
  const { t } = useLanguage();
  const prayers = [
    { label: t("fajr"), time: timings.fajr, icon: <Moon className="size-4" /> },
    {
      label: t("sunrise"),
      time: timings.sunrise,
      icon: <Sunrise className="size-4" />,
    },
    {
      label: t("dhuhr"),
      time: timings.dhuhr,
      icon: <Sun className="size-4" />,
    },
    {
      label: t("asr"),
      time: timings.asr,
      icon: <CloudSun className="size-4" />,
    },
    {
      label: t("maghrib"),
      time: timings.maghrib,
      icon: <Sunset className="size-4" />,
    },
    {
      label: t("isha"),
      time: timings.isha,
      icon: <Stars className="size-4" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {prayers.map((p) => (
        <Card
          key={p.label}
          className="border-border/60 bg-card/80 hover:bg-secondary/60 transition-all duration-200 group"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-muted-foreground group-hover:text-primary transition-colors">
                {p.icon}
              </div>
              <div>
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  {p.label}
                </p>
                <p className="text-lg font-mono font-semibold tabular-nums">
                  {p.time}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Exported Icon Wrappers ───────────────────────────────────────

export function SahoorIcon() {
  return <Moon className="size-5" />;
}

export function IftarIcon() {
  return <Sunset className="size-5" />;
}
