
"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { format, parseISO } from "date-fns";
import { getWeatherIcon } from "@/lib/weather-icons";
import { RadarMap } from "@/components/RadarMap";
import { WindCard, HumidityCard, SunCard, UvCard } from "@/components/weather-cards";
import { Droplets } from "lucide-react";

type WeatherData = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: 0 | 1;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    uv_index: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
    relative_humidity_2m: number[];
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
        if (geoRes.ok) {
            const geoData = await geoRes.json();
            setLocationName(geoData.city || geoData.principalSubdivision || "Current Location");
        } else {
            setLocationName("Current Location");
        }
        
        const params = new URLSearchParams({
            latitude: lat.toString(),
            longitude: lon.toString(),
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index",
            hourly: "temperature_2m,weather_code,relative_humidity_2m",
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
          setWeather(null);
        }
      } catch (err) {
        console.error("Failed to fetch weather data:", err);
      } finally {
        setLoading(false);
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => fetchLocationAndWeather(pos.coords.latitude, pos.coords.longitude),
      () => {
          console.log("Geolocation permission denied, using fallback.");
          fetchLocationAndWeather(39.6137, -86.1067) // Fallback to Greenwood, IN
      }
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
  const currentHourIndex = weather.hourly.time.findIndex(t => new Date(t).getHours() === now.getHours());
  const hourlyIndex = currentHourIndex === -1 ? 0 : currentHourIndex;

  return (
    <div className="min-h-screen bg-msn-bg text-msn-text font-sans">
      <header className="bg-msn-card shadow-msn px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-msn-blue">
          {locationName}
        </h1>
        <span className="text-sm text-msn-text-secondary">United States</span>
      </header>

      <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content column */}
        <div className="lg:col-span-2 space-y-6">
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
                    {weather.hourly.time.slice(hourlyIndex, hourlyIndex + 12).map((time, i) => (
                        <div key={time} className="flex-shrink-0 w-28 bg-msn-card rounded-lg shadow-msn p-3 text-center">
                            <p className="text-sm text-msn-text-secondary">{format(parseISO(time), 'h a')}</p>
                            <div className="mx-auto my-2">
                                {getWeatherIcon(weather.hourly.weather_code[hourlyIndex + i], true, 32)}
                            </div>
                            <p className="font-medium">{Math.round(weather.hourly.temperature_2m[hourlyIndex + i])}°</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>

        {/* Right sidebar column */}
        <div className="lg:col-span-1 space-y-6">
            <section>
                <h3 className="text-lg font-semibold mb-2">Radar</h3>
                <RadarMap />
            </section>

            <section>
                <h3 className="text-lg font-semibold mb-2">10-Day Forecast</h3>
                <div className="space-y-2">
                    {weather.daily.time.slice(0, 10).map((day, i) => (
                    <div key={day} className="bg-msn-card rounded-lg shadow-msn p-3 flex items-center justify-between text-sm">
                        <p className="font-semibold w-12">{i === 0 ? "Today" : format(parseISO(day), 'EEE')}</p>
                        <div className="flex items-center gap-2">
                            {getWeatherIcon(weather.daily.weather_code[i], true, 24)}
                        </div>
                        <p className="w-20 text-right">
                            <span className="font-medium">{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                            <span className="text-msn-text-secondary"> / {Math.round(weather.daily.temperature_2m_min[i])}°</span>
                        </p>
                    </div>
                    ))}
                </div>
            </section>
             <section>
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <HumidityCard weather={weather} hourlyIndex={hourlyIndex} />
                  <WindCard weather={weather} />
                  <SunCard weather={weather} />
                  <UvCard weather={weather} />
                </div>
            </section>
        </div>
      </main>
    </div>
  );
}
