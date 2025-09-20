"use client";

import { useEffect, useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Sun, CloudSun, CloudRain, CloudSnow } from "lucide-react";

type CurrentWeather = {
  temperature: number;
  windspeed: number;
  winddirection: number;
  weathercode: number;
};

type DailyForecast = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
};

export default function WeatherPage() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<DailyForecast | null>(null);
  const [loading, setLoading] = useState(true);

  // fallback Greenwood, IN
  const fallback = { lat: 39.6137, lon: -86.1067 };

  const getIcon = (code: number, size = 32) => {
    if (code === 0) return <Sun size={size} />;
    if (code >= 1 && code <= 3) return <CloudSun size={size} />;
    if (code >= 51 && code <= 67) return <CloudRain size={size} />;
    if (code >= 71 && code <= 77) return <CloudSnow size={size} />;
    return <Sun size={size} />;
  };

  useEffect(() => {
    function fetchWeather(lat: number, lon: number) {
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=fahrenheit`,
        { cache: "no-store" }
      )
        .then((res) => res.json())
        .then((data) => {
          setCurrent(data.current_weather);
          setForecast(data.daily);
        })
        .catch((e) => console.error("Weather fetch failed:", e))
        .finally(() => setLoading(false));
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchWeather(fallback.lat, fallback.lon)
      );
    } else {
      fetchWeather(fallback.lat, fallback.lon);
    }
  }, []);

  return (
    <LayoutWrapper>
      <PageHeader
        title="Weather Dashboard"
        description="Current conditions, 5-day forecast, and radar"
      />

      {loading ? (
        <p className="text-muted-foreground mt-6">Loading weather...</p>
      ) : !current ? (
        <p className="text-destructive mt-6">Failed to load weather data.</p>
      ) : (
        <div className="space-y-8 mt-6">
          {/* Current conditions */}
          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <h2 className="text-xl font-bold mb-4">Current Conditions</h2>
            <div className="flex items-center gap-4">
              {getIcon(current.weathercode, 48)}
              <div>
                <p className="text-4xl font-bold">{Math.round(current.temperature)}°F</p>
                <p className="text-sm text-muted-foreground">
                  Wind: {current.windspeed} mph
                </p>
              </div>
            </div>
          </div>

          {/* Forecast */}
          {forecast && (
            <div className="p-6 rounded-lg border shadow-sm bg-card">
              <h2 className="text-xl font-bold mb-4">5-Day Forecast</h2>
              <div className="grid grid-cols-5 gap-4">
                {forecast.time.slice(0, 5).map((day, i) => (
                  <div
                    key={day}
                    className="flex flex-col items-center rounded-md p-2"
                  >
                    <span className="text-sm">
                      {new Date(day).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </span>
                    {getIcon(forecast.weathercode[i])}
                    <span className="text-sm">
                      {Math.round(forecast.temperature_2m_max[i])}° /{" "}
                      {Math.round(forecast.temperature_2m_min[i])}°
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Radar */}
          <div className="p-6 rounded-lg border shadow-sm bg-card">
            <h2 className="text-xl font-bold mb-4">Radar</h2>
            <iframe
              src="https://radar.weather.gov/"
              className="w-full h-[400px] rounded"
              title="Weather Radar"
            />
          </div>
        </div>
      )}
    </LayoutWrapper>
  );
}