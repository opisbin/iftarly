"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface DatePickerProps {
  value: string; // yyyy-MM-dd
  onChange: (date: string) => void;
  onToday: () => void;
  isToday: boolean;
}

export default function DatePicker({
  value,
  onChange,
  onToday,
  isToday,
}: DatePickerProps) {
  const { t } = useLanguage();
  const shift = (days: number) => {
    const d = new Date(value);
    d.setDate(d.getDate() + days);
    onChange(formatDate(d));
  };

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {/* Previous Day */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => shift(-1)}
        aria-label="Previous day"
        className="size-9 rounded-xl border-border/60 bg-card/80 hover:bg-secondary"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {/* Date Input */}
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none bg-card border border-border/60
          rounded-xl px-4 py-2 text-sm text-foreground
          focus:outline-none focus:ring-2 focus:ring-primary/50
          focus:border-primary transition-all cursor-pointer
          hover:border-muted-foreground/40
          dark:[color-scheme:dark] [color-scheme:light]
        "
      />

      {/* Next Day */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => shift(1)}
        aria-label="Next day"
        className="size-9 rounded-xl border-border/60 bg-card/80 hover:bg-secondary"
      >
        <ChevronRight className="size-4" />
      </Button>

      {/* Today Button */}
      {!isToday && (
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="ml-1 rounded-xl border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
        >
          {t("today")}
        </Button>
      )}
    </div>
  );
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
