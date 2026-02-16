"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface CountdownProps {
  targetTime: string; // HH:mm format
  label: string;
}

function parseTimeToTodayDate(time: string): Date {
  const [timePart, period] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);
  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;
  const now = new Date();
  const target = new Date(now);
  target.setHours(hours, minutes, 0, 0);
  return target;
}

export default function Countdown({ targetTime, label }: CountdownProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } | null>(null);
  const [isPast, setIsPast] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculateTimeLeft = useCallback(() => {
    const now = new Date();
    const target = parseTimeToTodayDate(targetTime);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
      setIsPast(true);
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 });
      return;
    }

    setIsPast(false);
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setTimeLeft({ hours, minutes, seconds, totalSeconds });
  }, [targetTime]);

  useEffect(() => {
    calculateTimeLeft();
    intervalRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [calculateTimeLeft]);

  if (timeLeft === null) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="h-6 w-32 rounded-md bg-secondary animate-pulse" />
      </div>
    );
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (isPast) {
    return (
      <div className="flex flex-col items-center gap-3 animate-fade-in-up">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
          {label}
        </p>
        <Badge
          variant="secondary"
          className="bg-success/10 text-success border-success/20 gap-2 px-4 py-1.5 text-sm"
        >
          <CheckCircle className="size-4" />
          {t("timePassedForToday")}
        </Badge>
      </div>
    );
  }

  const isUrgent = timeLeft.totalSeconds <= 1800; // 30 minutes

  return (
    <div className="flex flex-col items-center gap-5 animate-fade-in-up">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {label}
      </p>
      <div className="flex items-center gap-2 sm:gap-3">
        <TimeBlock
          value={pad(timeLeft.hours)}
          unit={t("hours")}
          urgent={isUrgent}
        />
        <span
          className={cn(
            "text-2xl font-bold mt-[-1.4rem]",
            isUrgent
              ? "text-primary animate-pulse-glow"
              : "text-muted-foreground",
          )}
        >
          :
        </span>
        <TimeBlock
          value={pad(timeLeft.minutes)}
          unit={t("min")}
          urgent={isUrgent}
        />
        <span
          className={cn(
            "text-2xl font-bold mt-[-1.4rem]",
            isUrgent
              ? "text-primary animate-pulse-glow"
              : "text-muted-foreground",
          )}
        >
          :
        </span>
        <TimeBlock
          value={pad(timeLeft.seconds)}
          unit={t("sec")}
          urgent={isUrgent}
        />
      </div>
    </div>
  );
}

function TimeBlock({
  value,
  unit,
  urgent,
}: {
  value: string;
  unit: string;
  urgent: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-[4.5rem] h-[4rem] flex items-center justify-center rounded-xl border transition-all duration-300",
          urgent
            ? "border-primary/50 bg-primary/10 shadow-[0_0_16px_-4px] shadow-primary/20 animate-countdown"
            : "border-border bg-secondary/60",
        )}
      >
        <span
          className={cn(
            "text-3xl font-mono font-bold tabular-nums",
            urgent ? "text-primary" : "text-foreground",
          )}
        >
          {value}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground mt-1.5 uppercase tracking-widest font-medium">
        {unit}
      </span>
    </div>
  );
}
