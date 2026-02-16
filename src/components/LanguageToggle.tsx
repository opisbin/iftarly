"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="size-9 rounded-xl border-border/60 bg-card/80"
      >
        <span className="size-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setLanguage(language === "en" ? "bn" : "en")}
      className="size-9 rounded-xl border-border/60 bg-card/80 hover:bg-secondary cursor-pointer"
      aria-label="Toggle language"
    >
      <span className="text-xs font-bold text-primary">
        {language === "en" ? "বাং" : "EN"}
      </span>
    </Button>
  );
}
