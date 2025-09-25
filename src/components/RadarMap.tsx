
"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Location = {
  lat: number;
  lon: number;
};

export function RadarMap() {
  const [location, setLocation] = useState<Location | null>(null);
  const [isMapActive, setIsMapActive] = useState(false);

  // Try to get browser location, fallback to Greenwood, IN
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        () => {
          // Fallback → Greenwood, IN 46143
          setLocation({ lat: 39.6137, lon: -86.1067 });
        }
      );
    } else {
      setLocation({ lat: 39.6137, lon: -86.1067 });
    }
  }, []);

  if (!location) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-lg border bg-muted/20">
        <p className="text-muted-foreground">Loading radar…</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full h-[500px] rounded-lg border overflow-hidden",
        !isMapActive && "cursor-pointer"
      )}
      onClick={() => !isMapActive && setIsMapActive(true)}
    >
      <iframe
        src={`https://embed.windy.com/embed2.html?lat=${location.lat}&lon=${location.lon}&zoom=7&overlay=radar&level=surface&menu=&message=false&type=map&location=coordinates&detail=false`}
        className={cn(
          "w-full h-full border-0",
          !isMapActive && "pointer-events-none"
        )}
        loading="lazy"
      ></iframe>
      {!isMapActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity opacity-100 hover:opacity-0">
          <p className="text-white font-semibold">Click to activate map</p>
        </div>
      )}
    </div>
  );
}
