
"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Wind, Droplets, Eye, Gauge, Sunrise, Sunset, Sun, Thermometer } from "lucide-react";
import { format, parseISO } from "date-fns";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { getWeatherIcon } from "@/lib/weather-icons";
import { RadarMap } from "@/components/RadarMap";


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
    precipitation_probability: number[];
    weather_code: number[];
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

const WeatherDetail = ({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string, unit?: string }) => (
  <div className="flex items-center gap-3">
    <div className="text-gray-400">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-gray-400">{label}</div>
      <div className="text-lg font-bold">
        {value}
        {unit && <span className="text-base font-normal">{unit}</span>}
      </div>
    </div>
  </div>
);


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
            hourly: "temperature_2m,precipitation_probability,weather_code",
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

  const isDay = weather?.current.is_day === 1;
  const weatherDescription = getWeatherIcon(weather?.current.weather_code ?? 0, isDay)?.description || 'Loading...';

  const hourlyData = weather?.hourly.time.slice(0, 24).map((time, index) => ({
    time: format(parseISO(time), 'ha'),
    temp: weather.hourly.temperature_2m[index],
    precip: weather.hourly.precipitation_probability[index],
  })) || [];

  const chartConfig: ChartConfig = {
    temp: {
      label: "Temperature",
      color: "hsl(var(--primary))",
    },
     precip: {
      label: "Precipitation",
      color: "hsl(var(--muted-foreground))",
    },
  }

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
  
  const currentVisibility = weather.hourly.visibility?.[0] || 0;


  return (
    <div className={cn("p-4 sm:p-6 lg:p-8", isDay ? "weather-bg-day" : "weather-bg-night")}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
           <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
             <CardContent className="p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-lg">{locationName}</p>
                        <p className="text-7xl font-bold">{Math.round(weather.current.temperature_2m)}°</p>
                        <p className="text-lg">{weatherDescription}</p>
                        <p className="text-sm">H: {Math.round(weather.daily.temperature_2m_max[0])}° L: {Math.round(weather.daily.temperature_2m_min[0])}°</p>
                    </div>
                    <div className="w-24 h-24">
                        {getWeatherIcon(weather.current.weather_code, isDay, 96)}
                    </div>
                </div>
              </CardContent>
           </Card>

            <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
              <CardHeader>
                <CardTitle>Hourly Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                 <ChartContainer config={chartConfig} className="h-64 w-full">
                  <AreaChart data={hourlyData} margin={{ top: 5, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-temp)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-temp)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis dataKey="time" tick={{ fill: 'white' }} tickLine={{ stroke: 'white' }} axisLine={{ stroke: 'white' }} />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                    <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="temp" strokeWidth={2} stroke="var(--color-temp)" fill="url(#colorTemp)" />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
            </Card>

           <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
             <CardContent className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
                <WeatherDetail icon={<Thermometer size={20} />} label="Feels Like" value={`${Math.round(weather.current.apparent_temperature)}°`} />
                <WeatherDetail icon={<Wind size={20} />} label="Wind" value={`${Math.round(weather.current.wind_speed_10m)}`} unit=" mph" />
                <WeatherDetail icon={<Droplets size={20} />} label="Humidity" value={`${weather.current.relative_humidity_2m}%`} />
                <WeatherDetail icon={<Eye size={20} />} label="Visibility" value={`${(currentVisibility / 1609).toFixed(1)}`} unit=" mi" />
                <WeatherDetail icon={<Gauge size={20} />} label="Pressure" value={`${(weather.current.surface_pressure / 33.864).toFixed(2)}`} unit=" in" />
                <WeatherDetail icon={<Sun size={20} />} label="UV Index" value={`${weather.current.uv_index}`} />
             </CardContent>
           </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>Weather Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarMap />
            </CardContent>
          </Card>
          <Card className="bg-white/10 border-white/20 backdrop-blur-lg">
            <CardHeader>
              <CardTitle>10-Day Forecast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {weather.daily.time.slice(0, 10).map((day, i) => (
                 <div key={day} className="flex items-center justify-between">
                    <p className="w-1/4 font-medium">{format(parseISO(day), "EEEE")}</p>
                    <div className="w-1/4 flex justify-center">
                        {getWeatherIcon(weather.daily.weather_code[i], true, 28)}
                    </div>
                    <p className="w-1/4 text-right">{Math.round(weather.daily.temperature_2m_min[i])}°</p>
                     <div className="w-1/4 h-1.5 bg-gray-600/50 rounded-full mx-2">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full" />
                    </div>
                    <p className="w-1/4 text-right font-medium">{Math.round(weather.daily.temperature_2m_max[i])}°</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

