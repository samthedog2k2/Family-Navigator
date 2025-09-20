"use client";

import React, { useEffect, useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { getWeatherIcon } from "@/lib/weather-icons";
import { Droplet, Loader2 } from "lucide-react";
import { RadarMap } from "@/components/RadarMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type WeatherData = {
  current: {
    temperature_2m: number;
    weathercode: number;
    is_day: 0 | 1;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
  };
};

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState("your location");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocationAndWeather(lat: number, lon: number) {
      setLoading(true);
      // Get friendly location name
      try {
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const geoData = await geoRes.json();
        setLocationName(geoData.city || geoData.principalSubdivision || "Current Location");
      } catch (err) {
        console.error("Failed to fetch location name:", err);
        setLocationName("Current Location");
      }

      // Get weather data
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weathercode&hourly=temperature_2m,weathercode,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=fahrenheit&windspeed_unit=mph`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchLocationAndWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // fallback to Greenwood
          fetchLocationAndWeather(39.6137, -86.1067);
        }
      );
    } else {
      fetchLocationAndWeather(39.6137, -86.1067);
    }
  }, []);
  
  if (loading) {
    return (
      <LayoutWrapper>
        <PageHeader title="Weather" description="Loading weather data..." />
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </LayoutWrapper>
    );
  }

  if (!weather) {
    return (
      <LayoutWrapper>
        <PageHeader title="Weather" description="Could not fetch weather data." />
      </LayoutWrapper>
    );
  }
  
  const now = new Date();
  const currentHourIndex = now.getHours();

  // Filter hourly forecast to show only from the current hour onwards for today
  const hourly = weather.hourly.time
    .map((t, i) => ({
      time: new Date(t),
      temp: weather.hourly.temperature_2m[i],
      code: weather.hourly.weathercode[i],
      precip: weather.hourly.precipitation_probability[i],
    }))
    .filter((h) => {
        const hDate = new Date(h.time);
        return hDate.getDate() === now.getDate() && hDate.getHours() >= currentHourIndex;
    });

  return (
    <LayoutWrapper>
        <div className="flex justify-between items-start mb-6">
            <div>
                 <PageHeader
                    title="Weather"
                    description={`Current conditions and forecast for ${locationName}`}
                    className="mb-0"
                />
            </div>
            <div className="flex items-center gap-4 text-right">
                <div className="flex items-center gap-2">
                    {getWeatherIcon(weather.current.weathercode, weather.current.is_day === 1)}
                    <span className="text-5xl font-bold">{Math.round(weather.current.temperature_2m)}°F</span>
                </div>
            </div>
        </div>

      <div className="space-y-8">
        {/* Hourly Forecast */}
        <Card>
            <CardHeader><CardTitle>Hourly Forecast</CardTitle></CardHeader>
            <CardContent>
                <div className="flex overflow-x-auto gap-4 py-2">
                {hourly.map((h) => (
                    <div
                    key={h.time.toISOString()}
                    className="flex flex-col items-center min-w-[60px] p-2 rounded-lg bg-muted/50 border"
                    >
                    <span className="text-xs font-semibold">
                        {h.time.toLocaleTimeString('en-us', {hour: 'numeric'})}
                    </span>
                    <div className="my-2">{getWeatherIcon(h.code)}</div>
                    <span className="font-medium">{Math.round(h.temp)}°</span>
                    <div className="flex items-center gap-1 text-xs text-blue-500">
                        <Droplet className="w-3 h-3" />
                        <span>{h.precip}%</span>
                    </div>
                    </div>
                ))}
                </div>
            </CardContent>
        </Card>
        
        {/* 7-Day Forecast */}
        <Card>
            <CardHeader><CardTitle>7-Day Forecast</CardTitle></CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
                    {weather.daily.time.map((day, i) => (
                        <div
                        key={day}
                        className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 border"
                        >
                        <p className="font-medium text-foreground">
                            {new Date(day).toLocaleDateString("en-US", { weekday: "short" })}
                        </p>
                        <div className="my-2">{getWeatherIcon(weather.daily.weathercode[i])}</div>
                        <p className="text-foreground font-semibold">
                            {Math.round(weather.daily.temperature_2m_max[i])}° /{" "}
                            {Math.round(weather.daily.temperature_2m_min[i])}°
                        </p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>

        {/* Radar */}
        <Card>
            <CardHeader><CardTitle>Radar</CardTitle></CardHeader>
            <CardContent>
                <RadarMap />
            </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}