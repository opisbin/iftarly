"use client";

import { CALCULATION_METHODS } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/components/LanguageProvider";

interface MethodSelectorProps {
  value: number;
  onChange: (method: number) => void;
}

export default function MethodSelector({
  value,
  onChange,
}: MethodSelectorProps) {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
        {t("calculationMethod")}
      </label>
      <Select
        value={String(value)}
        onValueChange={(v) => onChange(parseInt(v, 10))}
      >
        <SelectTrigger className="w-full rounded-xl border-border/60 bg-secondary/40 hover:bg-secondary/70 transition-colors">
          <SelectValue placeholder={t("selectMethod")} />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          {Object.entries(CALCULATION_METHODS).map(([id, name]) => (
            <SelectItem key={id} value={id} className="rounded-lg">
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
