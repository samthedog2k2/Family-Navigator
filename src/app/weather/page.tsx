
"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, CloudFog, CloudSun, Wind, Droplets, Sunrise, Sunset } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { getWeatherIcon } from "@/lib/weather-icons";

type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: 0 | 1;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
  };
};

function degreesToCompass(deg: number) {
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}


export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState("your location");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLocationAndWeather(lat: number, lon: number) {
      setLoading(true);
      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const geoData = await geoRes.json();
        setLocationName(geoData.city || geoData.principalSubdivision || "Current Location");

        const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: lon.toString(),
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m",
            hourly: "temperature_2m,weather_code,precipitation_probability",
            daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset",
            temperature_unit: "fahrenheit",
            wind_speed_unit: "mph",
            precipitation_unit: "inch",
            timezone: "auto",
        });
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
        const data = await res.json();
        if (!data.error) {
          setWeather(data);
        } else {
          console.error("Weather API error:", data.reason);
        }
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      } finally {
        setLoading(false);
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchLocationAndWeather(pos.coords.latitude, pos.coords.longitude),
      () => fetchLocationAndWeather(39.6137, -86.1067) // Fallback to Greenwood, IN
    );
  }, []);

  if (loading || !weather) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-msn-bg">
        <Loader2 className="h-12 w-12 animate-spin text-msn-blue" />
      </div>
    );
  }
  
  const now = new Date();
  const currentHourIndex = weather.hourly.time.findIndex(t => new Date(t).getHours() === now.getHours()) || 0;

  return (
    <div className="min-h-screen bg-msn-bg text-msn-text font-sans">
      <header className="bg-msn-card shadow-sm px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-msn-blue">
          {locationName}
        </h1>
        <span className="text-sm text-msn-text-secondary">United States</span>
      </header>

      <main className="p-6 space-y-8">
        <section className="bg-msn-card rounded-lg shadow-msn p-6 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bold">{Math.round(weather.current.temperature_2m)}°F</h2>
            <p className="text-msn-text-secondary">{getWeatherIcon(weather.current.weather_code, weather.current.is_day === 1).props.alt}</p>
            <p className="text-sm text-msn-text-muted">High {Math.round(weather.daily.temperature_2m_max[0])}° • Low {Math.round(weather.daily.temperature_2m_min[0])}°</p>
          </div>
          {getWeatherIcon(weather.current.weather_code, weather.current.is_day === 1, 64)}
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Hourly Forecast</h3>
          <div className="flex overflow-x-auto gap-4 pb-2">
            {weather.hourly.time.slice(currentHourIndex, currentHourIndex + 12).map((time, i) => (
              <div key={time} className="flex-shrink-0 w-28 bg-msn-card rounded-lg shadow-msn p-3 text-center">
                <p className="text-sm text-msn-text-secondary">{format(parseISO(time), 'h a')}</p>
                <div className="mx-auto my-2">
                    {getWeatherIcon(weather.hourly.weather_code[currentHourIndex + i], true, 32)}
                </div>
                <p className="font-medium">{Math.round(weather.hourly.temperature_2m[currentHourIndex + i])}°</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">10-Day Forecast</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {weather.daily.time.slice(0, 10).map((day, i) => (
              <div key={day} className="bg-msn-card rounded-lg shadow-msn p-4 flex flex-col items-center text-center">
                <p className="text-sm font-semibold text-msn-text-secondary">{i === 0 ? "Today" : format(parseISO(day), 'EEE')}</p>
                <div className="my-2">
                    {getWeatherIcon(weather.daily.weather_code[i], true, 40)}
                </div>
                <p className="text-sm font-medium">H {Math.round(weather.daily.temperature_2m_max[i])}°</p>
                <p className="text-sm text-msn-text-secondary">L {Math.round(weather.daily.temperature_2m_min[i])}°</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-msn-card rounded-lg shadow-msn p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <h3 className="text-lg font-semibold mb-2 col-span-full">Details</h3>
          <div className="flex items-center gap-3">
            <Droplets className="w-8 h-8 text-msn-icon-blue" />
            <div>
                <p className="text-sm text-msn-text-secondary">Humidity</p>
                <p className="font-bold">{weather.current.relative_humidity_2m}%</p>
            </div>
          </div>
           <div className="flex items-center gap-3">
            <Wind className="w-8 h-8 text-msn-icon-gray" />
            <div>
                <p className="text-sm text-msn-text-secondary">Wind</p>
                <p className="font-bold">{Math.round(weather.current.wind_speed_10m)} mph {degreesToCompass(weather.current.wind_direction_10m)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sunrise className="w-8 h-8 text-msn-icon-sun" />
            <div>
                <p className="text-sm text-msn-text-secondary">Sunrise</p>
                <p className="font-bold">{format(parseISO(weather.daily.sunrise[0]), 'h:mm a')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Sunset className="w-8 h-8 text-msn-icon-sun" />
            <div>
                <p className="text-sm text-msn-text-secondary">Sunset</p>
                <p className="font-bold">{format(parseISO(weather.daily.sunset[0]), 'h:mm a')}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

    