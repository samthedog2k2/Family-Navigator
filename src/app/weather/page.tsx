
"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Wind, Droplets, Eye, Gauge, Sunrise, Sunset } from "lucide-react";
import { format, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getWeatherIcon } from "@/lib/weather-icons";
import { RadarMap } from "@/components/RadarMap";
import { TemperatureCard, FeelsLikeCard, WindCard, HumidityCard, VisibilityCard, PressureCard, SunCard, UvCard, PrecipitationCard, CloudCoverCard } from "@/components/weather-cards";

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
    surface_pressure: number[];
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
    precipitation_sum: number[];
  };
};

const DailyForecastBar = ({ min, max, dayMin, dayMax }: { min: number; max: number; dayMin: number; dayMax: number }) => {
  const range = max - min;
  const dayRange = dayMax - dayMin;
  const left = range > 0 ? ((dayMin - min) / range) * 100 : 0;
  const width = range > 0 ? (dayRange / range) * 100 : 0;

  return (
    <div className="w-full h-1.5 bg-gray-600/50 rounded-full">
      <div
        className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full"
        style={{ marginLeft: `${left}%`, width: `${width}%` }}
      />
    </div>
  );
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
            current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,surface_pressure,wind_speed_10m,wind_direction_10m,uv_index",
            hourly: "temperature_2m,precipitation_probability,weather_code,is_day",
            daily: "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum",
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
  
  const now = new Date();
  const currentHourIndex = weather.hourly.time.findIndex(t => new Date(t).getHours() === now.getHours()) || 0;
  const isDay = weather.current.is_day === 1;

  const minTemp = Math.min(...weather.daily.temperature_2m_min.slice(0, 10));
  const maxTemp = Math.max(...weather.daily.temperature_2m_max.slice(0, 10));

  return (
    <div className={cn("p-4 sm:p-6 lg:p-8", isDay ? "weather-bg-day" : "weather-bg-night")}>
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Main Content Column */}
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
           <Card className="bg-white/10 border-white/20 backdrop-blur-lg text-white">
             <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-lg">{locationName}</p>
                        <p className="text-8xl font-bold">{Math.round(weather.current.temperature_2m)}°</p>
                        <p className="text-xl -mt-2">{getWeatherIcon(weather.current.weather_code, isDay).props.alt}</p>
                        <p className="text-md">H: {Math.round(weather.daily.temperature_2m_max[0])}° L: {Math.round(weather.daily.temperature_2m_min[0])}°</p>
                    </div>
                    <div className="w-28 h-28">
                        {getWeatherIcon(weather.current.weather_code, isDay, 112)}
                    </div>
                </div>
              </CardContent>
           </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-lg text-white">
              <CardHeader>
                <CardTitle>Hourly Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex space-x-2 overflow-x-auto pb-4 -mx-6 px-6">
                  {weather.hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, i) => {
                    const realIndex = currentHourIndex + i;
                    const precipProb = weather.hourly.precipitation_probability[realIndex];
                    return (
                      <div key={time} className="flex flex-col items-center space-y-2 p-2 rounded-lg min-w-[64px] text-center">
                        <p className="text-sm font-medium">{i === 0 ? "Now" : format(parseISO(time), 'ha')}</p>
                        <div className="w-8 h-8">
                          {getWeatherIcon(weather.hourly.weather_code[realIndex], weather.hourly.is_day[realIndex] === 1, 32)}
                        </div>
                        <p className="text-lg font-bold">{Math.round(weather.hourly.temperature_2m[realIndex])}°</p>
                        {precipProb > 10 && (
                          <div className="flex items-center gap-1 text-blue-300 text-xs">
                            <Droplets size={12}/>
                            <span>{precipProb}%</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-lg text-white">
                <CardHeader>
                <CardTitle>10-Day Forecast</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                {weather.daily.time.slice(0, 10).map((day, i) => (
                    <div key={day} className="flex items-center justify-between gap-2 text-sm">
                        <p className="w-1/6 font-medium">{i === 0 ? "Today" : format(parseISO(day), "E")}</p>
                        <div className="w-1/12 flex justify-center">{getWeatherIcon(weather.daily.weather_code[i], true, 28)}</div>
                        <p className="w-1/12 text-right text-gray-300">{Math.round(weather.daily.temperature_2m_min[i])}°</p>
                        <div className="w-4/6"><DailyForecastBar min={minTemp} max={maxTemp} dayMin={weather.daily.temperature_2m_min[i]} dayMax={weather.daily.temperature_2m_max[i]} /></div>
                        <p className="w-1/12 text-right font-medium">{Math.round(weather.daily.temperature_2m_max[i])}°</p>
                    </div>
                ))}
                </CardContent>
            </Card>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg text-white">
            <CardHeader>
              <CardTitle>Weather Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarMap />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <WindCard weather={weather} />
            <HumidityCard weather={weather} hourlyIndex={currentHourIndex} />
            <SunCard weather={weather} />
            <UvCard weather={weather} />
          </div>
        </div>
      </div>
    </div>
  );
}

    