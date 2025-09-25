
"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Sun } from "lucide-react";
import { format, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import {
  TemperatureCard,
  FeelsLikeCard,
  WindCard,
  HumidityCard,
  VisibilityCard,
  PressureCard,
  UvCard,
  SunCard,
  PrecipitationCard,
  CloudCoverCard,
} from "@/components/weather-cards";

type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: 0 | 1;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    uv_index: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    dew_point_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    pressure_msl: number;
    surface_pressure: number;
    cloud_cover: number[];
    visibility: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    wind_gusts_10m: number[];
    uv_index: number[];
    is_day: (0 | 1)[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
    precipitation_hours: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
    shortwave_radiation_sum: number[];
    et0_fao_evapotranspiration: number[];
  };
};

export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState("your location");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const defaultLocation = "Greenwood, IN 46143";

    async function fetchLocationAndWeather(lat: number, lon: number) {
      setLoading(true);
      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const geoData = await geoRes.json();
        setLocationName(geoData.city || geoData.principalSubdivision || "Current Location");
      } catch (err) {
        console.error("Failed to fetch location name:", err);
        setLocationName("Current Location");
      }

      try {
        const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: lon.toString(),
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index",
            hourly: "temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,surface_pressure,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,is_day",
            daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant",
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
          setWeather(null);
        }
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      } finally {
        setLoading(false);
      }
    }

     async function geocodeAndFetch(address: string) {
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(address)}&count=1`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          await fetchLocationAndWeather(latitude, longitude);
        } else { setLoading(false); }
      } catch (error) {
        console.error("Geocoding API call failed:", error);
        setLoading(false);
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchLocationAndWeather(pos.coords.latitude, pos.coords.longitude),
      () => geocodeAndFetch(defaultLocation)
    );
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <Loader2 className="h-12 w-12 animate-spin" />
      </main>
    );
  }

  if (!weather) {
    return (
      <main className="flex-1 p-4 sm:p-6 bg-gray-900 text-white">
        <div>Could not load weather data.</div>
      </main>
    );
  }
  
  const currentHourIndex = weather.hourly.time.findIndex(t => new Date(t).getHours() === new Date().getHours());


  return (
    <div className="bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8">
        <h1 className="text-3xl font-bold mb-2">{locationName}</h1>
        <p className="text-lg text-gray-400 mb-8">As of {format(new Date(), "h:mm a")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <TemperatureCard weather={weather} />
            <FeelsLikeCard weather={weather} />
            <CloudCoverCard weather={weather} />
            <PrecipitationCard weather={weather} />
            <WindCard weather={weather} />
            <HumidityCard weather={weather} hourlyIndex={currentHourIndex} />
            <UvCard weather={weather} />
            <VisibilityCard weather={weather} hourlyIndex={currentHourIndex} />
            <PressureCard weather={weather} />
            <SunCard weather={weather} />
        </div>
    </div>
  );
}
