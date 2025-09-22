"use client";

import React, { useEffect, useState } from "react";

type Location = {
  lat: number;
  lon: number;
};

export function RadarMap() {
  const [location, setLocation] = useState<Location | null>(null);

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
    <iframe
      src={`https://embed.windy.com/embed2.html?lat=${location.lat}&lon=${location.lon}&zoom=7&overlay=radar&level=surface&menu=&message=false&type=map&location=coordinates&detail=false`}
      className="w-full h-[500px] rounded-lg border"
      loading="lazy"
    ></iframe>
  );
}
