"use client";

import { AppError } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MapPinOff, ServerCrash, AlertTriangle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

interface ErrorDisplayProps {
  error: AppError;
  onRetry?: () => void;
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const getIcon = () => {
    switch (error.type) {
      case "LOCATION_DENIED":
        return <MapPinOff className="size-10 text-destructive" />;
      case "API_FAILURE":
        return <ServerCrash className="size-10 text-destructive" />;
      default:
        return <AlertTriangle className="size-10 text-destructive" />;
    }
  };

  const { t } = useLanguage();
  const getHelpText = () => {
    switch (error.type) {
      case "LOCATION_DENIED":
        return t("errorLocationDenied");
      case "API_FAILURE":
        return t("errorApiFailure");
      case "INVALID_RESPONSE":
        return t("errorInvalidResponse");
      default:
        return t("errorUnknown");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-16 animate-fade-in-up">
      <Alert
        variant="destructive"
        className="flex flex-col items-center text-center gap-4 rounded-2xl border-destructive/20 bg-destructive/5 p-8"
      >
        {getIcon()}
        <div>
          <AlertTitle className="text-lg font-semibold text-foreground mb-2">
            {error.message}
          </AlertTitle>
          <AlertDescription className="text-sm text-muted-foreground leading-relaxed">
            {getHelpText()}
          </AlertDescription>
        </div>
        {onRetry && (
          <Button onClick={onRetry} className="mt-2 rounded-xl gap-2">
            <RefreshCw className="size-4" />
            {t("tryAgain")}
          </Button>
        )}
      </Alert>
    </div>
  );
}
