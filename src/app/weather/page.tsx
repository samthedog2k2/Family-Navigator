"use client";

import React, { useEffect, useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { RadarMap } from "@/components/RadarMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getWeatherIcon } from "@/lib/weather-icons.tsx";

type CurrentWeather = {
  temperature_2m: number;
  weathercode: number;
  is_day: 0 | 1;
};

type DailyForecast = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  weathercode: number[];
};

type HourlyForecastItem = {
    time: string;
    temp: number;
    weathercode: number;
};


export default function WeatherPage() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [daily, setDaily] = useState<DailyForecast | null>(null);
  const [hourly, setHourly] = useState<HourlyForecastItem[]>([]);
  const [location, setLocation] = useState("Greenwood, IN");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather(lat: number, lon: number) {
      // Get friendly location name
      try {
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const geoData = await geoRes.json();
        setLocation(geoData.city || geoData.principalSubdivision || "Current Location");
      } catch (err) {
        console.error("Failed to fetch location name:", err);
        setLocation("Current Location");
      }

      // Get weather data
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weathercode&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=fahrenheit&windspeed_unit=mph`
        );
        const data = await res.json();
        setCurrent(data.current);
        setDaily(data.daily);

        const today = new Date().toISOString().split("T")[0];
        const hourlyData: HourlyForecastItem[] = data.hourly.time
          .map((t: string, idx: number) => ({
            time: t,
            temp: data.hourly.temperature_2m[idx],
            weathercode: data.hourly.weathercode[idx],
          }))
          .filter((h: HourlyForecastItem) => h.time.startsWith(today));
        
        setHourly(hourlyData);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      } finally {
        setLoading(false);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // fallback to Greenwood
          fetchWeather(39.6137, -86.1067);
        }
      );
    } else {
      fetchWeather(39.6137, -86.1067);
    }
  }, []);

  if (loading || !current || !daily) {
    return (
       <LayoutWrapper>
        <PageHeader
          title="Weather"
          description="Loading weather data..."
        />
        <p>Loading...</p>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <div className="flex justify-between items-start mb-6">
        <div>
          <PageHeader
            title="Weather"
            description={`Current conditions and forecast for ${location}`}
            className="mb-0"
          />
        </div>
        <div className="flex items-center gap-4 text-right">
            <span className="text-5xl font-bold">{Math.round(current.temperature_2m)}°F</span>
            {getWeatherIcon(current.weathercode, current.is_day === 1)}
        </div>
      </div>

      <div className="space-y-8">
        {/* Hourly Forecast */}
        <Card>
          <CardHeader><CardTitle>Hourly Forecast</CardTitle></CardHeader>
          <CardContent>
            <div className="flex overflow-x-auto gap-4 py-2">
              {hourly.map((h) => (
                <div key={h.time} className="flex flex-col items-center min-w-[60px] p-2 rounded-lg bg-muted/50 border">
                  <span className="text-xs font-semibold">
                    {new Date(h.time).toLocaleTimeString('en-us', {hour: 'numeric'})}
                  </span>
                   <div className="my-2">{getWeatherIcon(h.weathercode)}</div>
                  <span className="font-medium">{Math.round(h.temp)}°</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* 7-Day Forecast */}
        <Card>
          <CardHeader>
            <CardTitle>7-Day Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                {daily.time.map((day, idx) => (
                <div
                    key={idx}
                    className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 border"
                >
                    <p className="font-medium text-foreground">
                    {new Date(day).toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <div className="my-2">{getWeatherIcon(daily.weathercode[idx])}</div>
                    <p className="text-foreground font-semibold">{Math.round(daily.temperature_2m_max[idx])}° / {Math.round(daily.temperature_2m_min[idx])}°</p>
                </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Radar */}
        <Card>
            <CardHeader>
                <CardTitle>Radar</CardTitle>
            </CardHeader>
            <CardContent>
                <RadarMap />
            </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
