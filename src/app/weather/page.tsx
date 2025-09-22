"use client";

import React, { useEffect, useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { getWeatherIcon } from "@/lib/weather-icons";
import { Droplet, Loader2, Wind, Sun, Thermometer, Sunrise, Sunset, Gauge, Waves, Umbrella } from "lucide-react";
import { RadarMap } from "@/components/RadarMap";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type WeatherData = {
  current: {
    temperature_2m: number;
    weathercode: number;
    is_day: 0 | 1;
    apparent_temperature: number;
    relativehumidity_2m: number;
    windspeed_10m: number;
    winddirection_10m: number;
    uv_index: number;
    dewpoint_2m: number;
    surface_pressure: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
    precipitation_probability: number[];
    apparent_temperature: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
    precipitation_sum: number[];
  };
  daily_units: {
    precipitation_sum: string;
  }
};

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState("your location");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- EDIT YOUR DEFAULT LOCATION HERE ---
    const defaultLocation = "46143"; // Can be a zip code or address like "Beverly Hills, CA"
    // -------------------------------------

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
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weathercode,apparent_temperature,relativehumidity_2m,windspeed_10m,winddirection_10m,uv_index,dewpoint_2m,surface_pressure&hourly=temperature_2m,weathercode,precipitation_probability,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset,precipitation_sum&timezone=auto&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch`
        );
        const data = await res.json();
        setWeather(data);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      } finally {
        setLoading(false);
      }
    }

    async function geocodeAndFetch(address: string) {
      console.log(`Geocoding address: ${address}`);
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(address)}&count=1`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          console.log(`Geocoded to: ${latitude}, ${longitude}`);
          await fetchLocationAndWeather(latitude, longitude);
        } else {
          console.error("Geocoding failed: Address not found.");
          setLoading(false);
          setWeather(null);
          setLocationName(`Could not find: ${address}`);
        }
      } catch (error) {
        console.error("Geocoding API call failed:", error);
        setLoading(false);
        setWeather(null);
        setLocationName("Error finding location");
      }
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // User allowed location access
          fetchLocationAndWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // User denied location access or an error occurred, use default
          console.log("Geolocation failed, falling back to default location.");
          geocodeAndFetch(defaultLocation);
        }
      );
    } else {
      // Geolocation is not supported by the browser, use default
      console.log("Geolocation not supported, falling back to default location.");
      geocodeAndFetch(defaultLocation);
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
        <PageHeader title="Weather" description={locationName} />
        <p>Could not fetch weather data. Please try again later.</p>
      </LayoutWrapper>
    );
  }
  
  const now = new Date();
  const startIndex = Math.max(0, weather.hourly.time.findIndex(t => new Date(t) > now) - 1);

  const hourly = weather.hourly.time
    .slice(startIndex, startIndex + 13)
    .map((t, i) => {
        const dataIndex = startIndex + i;
        return {
            time: new Date(t),
            temp: weather.hourly.temperature_2m[dataIndex],
            apparent_temp: weather.hourly.apparent_temperature[dataIndex],
            code: weather.hourly.weathercode[dataIndex],
            precip: weather.hourly.precipitation_probability[dataIndex],
        };
    });

  const WeatherDetail = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
    <div className="flex flex-col items-center justify-center text-center p-3 bg-muted/50 rounded-lg border">
        <div className="text-muted-foreground">{icon}</div>
        <div className="text-xs font-bold text-muted-foreground uppercase mt-1">{label}</div>
        <div className="text-lg font-semibold mt-1">{value}</div>
    </div>
  );

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
        {/* Current Details */}
        <Card>
            <CardHeader><CardTitle>Current Details</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <WeatherDetail icon={<Thermometer size={20} />} label="Feels Like" value={`${Math.round(weather.current.apparent_temperature)}°`} />
                <WeatherDetail icon={<Waves size={20} />} label="Humidity" value={`${weather.current.relativehumidity_2m}%`} />
                <WeatherDetail icon={<Wind size={20} />} label="Wind" value={`${Math.round(weather.current.windspeed_10m)} mph`} />
                <WeatherDetail icon={<Sun size={20} />} label="UV Index" value={weather.current.uv_index} />
                <WeatherDetail icon={<Droplet size={20} />} label="Dew Point" value={`${Math.round(weather.current.dewpoint_2m)}°`} />
                <WeatherDetail icon={<Gauge size={20} />} label="Pressure" value={`${Math.round(weather.current.surface_pressure)} hPa`} />
            </CardContent>
        </Card>

        {/* Hourly Forecast */}
        <Card>
            <CardHeader><CardTitle>Hourly Forecast</CardTitle></CardHeader>
            <CardContent>
                <div className="flex overflow-x-auto gap-4 py-2">
                {hourly.map((h) => (
                    <div
                    key={h.time.toISOString()}
                    className="flex flex-col items-center min-w-[70px] p-2 rounded-lg bg-muted/50 border"
                    >
                    <span className="text-sm font-semibold">
                        {h.time.toLocaleTimeString('en-us', {hour: 'numeric'})}
                    </span>
                    <div className="my-2">{getWeatherIcon(h.code)}</div>
                    <span className="font-medium">{Math.round(h.temp)}°</span>
                    <span className="text-xs text-muted-foreground">Feels {Math.round(h.apparent_temp)}°</span>
                    <div className="flex items-center gap-1 text-xs text-blue-500 mt-1">
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
                        className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 border text-center"
                        >
                        <p className="font-medium text-foreground">
                            {new Date(day).toLocaleDateString("en-US", { weekday: "short" })}
                        </p>
                        <div className="my-2">{getWeatherIcon(weather.daily.weathercode[i])}</div>
                        <p className="text-foreground font-semibold">
                            {Math.round(weather.daily.temperature_2m_max[i])}° /{" "}
                            {Math.round(weather.daily.temperature_2m_min[i])}°
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                            <Umbrella className="w-4 h-4" />
                            <span>{weather.daily.precipitation_sum[i].toFixed(2)} {weather.daily_units.precipitation_sum}</span>
                        </div>
                        <div className="mt-2 w-full text-xs text-muted-foreground space-y-1">
                            <div className="flex justify-between items-center w-full">
                                <Sunrise size={16} />
                                <span>{new Date(weather.daily.sunrise[i]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}</span>
                            </div>
                            <div className="flex justify-between items-center w-full">
                                <Sunset size={16} />
                                <span>{new Date(weather.daily.sunset[i]).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}</span>
                            </div>
                        </div>
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
