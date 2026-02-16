"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function LoadingSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12">
      {/* Header skeleton */}
      <div className="text-center mb-10">
        <Skeleton className="h-9 w-52 mx-auto rounded-lg mb-3" />
        <Skeleton className="h-5 w-28 mx-auto rounded-full" />
      </div>

      {/* Date picker skeleton */}
      <div className="flex justify-center gap-2 mb-6">
        <Skeleton className="h-9 w-9 rounded-xl" />
        <Skeleton className="h-9 w-40 rounded-xl" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>

      {/* Date info skeleton */}
      <div className="flex justify-center gap-5 mb-10">
        <Skeleton className="h-5 w-40 rounded-md" />
        <Skeleton className="h-5 w-40 rounded-md" />
      </div>

      {/* Prayer cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {[1, 2].map((i) => (
          <Card key={i} className="border-border/60 bg-card/80">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-3 w-20 rounded" />
                  <Skeleton className="h-7 w-16 rounded" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Countdown skeleton */}
      <Card className="mb-10 border-border/60 bg-card/80">
        <CardContent className="p-8">
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="h-4 w-32 rounded" />
            <div className="flex gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="w-[4.5rem] h-[4rem] rounded-xl" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All times skeleton */}
      <div className="mb-10">
        <Skeleton className="h-4 w-36 mx-auto rounded mb-4" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="border-border/60 bg-card/80">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="size-8 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-2.5 w-12 rounded" />
                    <Skeleton className="h-5 w-14 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
