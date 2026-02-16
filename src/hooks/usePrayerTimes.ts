"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { LocationCoords, AppError, PrayerApiResponse } from "@/lib/types";

const LOCATION_STORAGE_KEY = "iftarly:last-location";

interface UsePrayerTimesResult {
  data: PrayerApiResponse | null;
  location: LocationCoords | null;
  error: AppError | null;
  loading: boolean;
  method: number;
  setMethod: (m: number) => void;
  selectedDate: string;
  setSelectedDate: (d: string) => void;
  isToday: boolean;
  retry: () => void;
}

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getStoredLocation(): LocationCoords | null {
  try {
    const raw = localStorage.getItem(LOCATION_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<LocationCoords>;
    if (
      typeof parsed.latitude === "number" &&
      typeof parsed.longitude === "number" &&
      parsed.latitude >= -90 &&
      parsed.latitude <= 90 &&
      parsed.longitude >= -180 &&
      parsed.longitude <= 180
    ) {
      return {
        latitude: parsed.latitude,
        longitude: parsed.longitude,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

function saveStoredLocation(coords: LocationCoords) {
  try {
    localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(coords));
  } catch {
    // ignore
  }
}

function getBrowserLocation(): Promise<LocationCoords> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject({
        type: "LOCATION_DENIED" as const,
        message: "Geolocation is not supported by your browser",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (position?.coords) {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        } else {
          reject({
            type: "LOCATION_DENIED" as const,
            message: "Unable to retrieve your location",
          });
        }
      },
      (err) => {
        let message = "Unable to retrieve your location";
        if (err && err.code === 1) {
          message = "Location permission denied";
        } else if (err && err.code === 2) {
          message = "Location information unavailable";
        } else if (err && err.code === 3) {
          message = "Location request timed out";
        }
        reject({ type: "LOCATION_DENIED" as const, message });
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  });
}

export function usePrayerTimes(): UsePrayerTimesResult {
  const [data, setData] = useState<PrayerApiResponse | null>(null);
  const [location, setLocation] = useState<LocationCoords | null>(null);
  const [error, setError] = useState<AppError | null>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState(2);
  const [selectedDate, setSelectedDate] = useState(getTodayStr());
  const abortRef = useRef<AbortController | null>(null);
  const locationRef = useRef<LocationCoords | null>(null);

  const isToday = selectedDate === getTodayStr();

  const fetchPrayerData = useCallback(
    async (
      coords: LocationCoords,
      calcMethod: number,
      dateStr: string,
      signal: AbortSignal,
    ) => {
      // Convert yyyy-MM-dd → dd-MM-yyyy for API
      const [y, m, d] = dateStr.split("-");
      const apiDate = `${d}-${m}-${y}`;

      const params = new URLSearchParams({
        latitude: coords.latitude.toString(),
        longitude: coords.longitude.toString(),
        date: apiDate,
        method: calcMethod.toString(),
      });

      const response = await fetch(`/api/prayer?${params}`, { signal });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw {
          type: "API_FAILURE" as const,
          message: body.error || `Server returned ${response.status}`,
        };
      }

      const json = await response.json();

      if (!json || !json.timings || !json.date) {
        throw {
          type: "INVALID_RESPONSE" as const,
          message: "Received invalid data from server",
        };
      }

      return json as PrayerApiResponse;
    },
    [],
  );

  // Use refs for method/selectedDate so loadAll identity stays stable
  const methodRef = useRef(method);
  methodRef.current = method;
  const dateRef = useRef(selectedDate);
  dateRef.current = selectedDate;

  const loadAll = useCallback(async () => {
    // Abort any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      // Resolve location: cached ref → localStorage → browser prompt
      let coords = locationRef.current ?? getStoredLocation();

      if (!coords) {
        coords = await getBrowserLocation();
      }

      if (
        !coords ||
        typeof coords.latitude !== "number" ||
        typeof coords.longitude !== "number"
      ) {
        throw {
          type: "LOCATION_DENIED" as const,
          message: "Unable to determine your location",
        };
      }

      // Store location without triggering re-render loop
      locationRef.current = coords;
      setLocation(coords);
      saveStoredLocation(coords);

      const prayerData = await fetchPrayerData(
        coords,
        methodRef.current,
        dateRef.current,
        controller.signal,
      );

      // Only update state if this request wasn't aborted
      if (!controller.signal.aborted) {
        setData(prayerData);
      }
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return; // silently ignore aborted requests
      }
      if (controller.signal.aborted) {
        return; // request was superseded
      }
      const appError: AppError =
        err && typeof err === "object" && "type" in err
          ? (err as AppError)
          : {
              type: "UNKNOWN",
              message:
                err instanceof Error
                  ? err.message
                  : "An unexpected error occurred",
            };
      setError(appError);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPrayerData]);

  // Trigger loadAll when method or date changes
  useEffect(() => {
    loadAll();

    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [loadAll, method, selectedDate]);

  const retry = useCallback(() => {
    // Clear cached location so we re-prompt if needed
    locationRef.current = null;
    loadAll();
  }, [loadAll]);

  return {
    data,
    location,
    error,
    loading,
    method,
    setMethod,
    selectedDate,
    setSelectedDate,
    isToday,
    retry,
  };
}
