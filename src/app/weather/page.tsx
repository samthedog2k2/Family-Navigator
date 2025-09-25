
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Loader2,
  Wind,
  Droplet,
  Sunrise,
  Sunset,
  Eye,
  Thermometer,
  Gauge,
  CalendarDays,
  Sun,
} from "lucide-react";
import { format, parseISO } from "date-fns";

import { getWeatherIcon } from "@/lib/weather-icons";
import { cn } from "@/lib/utils";
import { RadarMap } from "@/components/RadarMap";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type WeatherData = {
  current: {
    is_day: 0 | 1;
    temperature_2m: number;
    apparent_temperature: number;
    weathercode: number;
    windspeed_10m: number;
    relativehumidity_2m: number;
    surface_pressure: number;
    dewpoint_2m: number;
    uv_index: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weathercode: number[];
    visibility: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
  };
};

const WeatherDetail = ({
  icon,
  label,
  value,
  unit,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {icon}
      <span>{label}</span>
    </div>
    <span className="font-semibold">
      {value}
      {unit}
    </span>
  </div>
);

const chartConfig = {
  temp: {
    label: "Temperature",
    color: "hsl(var(--primary))",
  },
  precip: {
    label: "Precipitation",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;


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
        setLocationName(
          geoData.city || geoData.principalSubdivision || "Current Location"
        );
      } catch (err) {
        console.error("Failed to fetch location name:", err);
        setLocationName("Current Location");
      }

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,apparent_temperature,is_day,weathercode,windspeed_10m,surface_pressure,dewpoint_2m,uv_index&hourly=temperature_2m,precipitation_probability,weathercode,visibility&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=10`
        );
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
        const geoRes = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            address
          )}&count=1`
        );
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          const { latitude, longitude } = geoData.results[0];
          await fetchLocationAndWeather(latitude, longitude);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Geocoding API call failed:", error);
        setLoading(false);
      }
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        fetchLocationAndWeather(pos.coords.latitude, pos.coords.longitude),
      () => geocodeAndFetch(defaultLocation)
    );
  }, []);

  const isDay = weather?.current.is_day === 1;

  const hourlyChartData = useMemo(() => {
    if (!weather) return [];
    const now = new Date();
    let startIndex = weather.hourly.time.findIndex(t => new Date(t) > now);
    if (startIndex === -1) startIndex = weather.hourly.time.length - 24;
    else if (startIndex > 0) startIndex = startIndex -1;
    else startIndex = 0;


    return weather.hourly.time.slice(startIndex, startIndex + 24).map((t, i) => {
      const dataIndex = startIndex + i;
      const time = new Date(t);
      return {
        time: time.toISOString(),
        formattedTime: dataIndex === startIndex ? 'Now' : format(time, 'h a'),
        temp: Math.round(weather.hourly.temperature_2m[dataIndex]),
        precip: weather.hourly.precipitation_probability[dataIndex],
        icon: getWeatherIcon(weather.hourly.weathercode[dataIndex], true),
        weathercode: weather.hourly.weathercode[dataIndex]
      }
    });
  }, [weather]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-blue-100">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </main>
    );
  }

  if (!weather) {
    return (
      <main className="flex-1 p-4 sm:p-6 bg-gray-100">
        <Card>
          <CardHeader>
            <CardTitle>Weather Unavailable</CardTitle>
            <CardDescription>Could not load weather data at this time.</CardDescription>
          </CardHeader>
        </Card>
      </main>
    );
  }

  const currentHourIndex = weather.hourly.time.findIndex(t => new Date(t) > new Date()) -1;
  const currentVisibility = currentHourIndex >=0 ? weather.hourly.visibility[currentHourIndex] : 0;
  
  const dailyForecasts = weather.daily.time.map((day, i) => ({
    date: day,
    dayName: i === 0 ? 'Today' : format(parseISO(day), 'EEE'),
    maxTemp: Math.round(weather.daily.temperature_2m_max[i]),
    minTemp: Math.round(weather.daily.temperature_2m_min[i]),
    weathercode: weather.daily.weathercode[i]
  }));

  return (
    <div
      className={cn(
        "p-4 sm:p-6 transition-colors duration-500 min-h-screen",
        isDay ? "weather-bg-day" : "weather-bg-night"
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-screen-2xl mx-auto">
        <div className="lg:col-span-2 xl:col-span-3 space-y-6">
          <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16">{getWeatherIcon(weather.current.weathercode, isDay, 64)}</div>
                  <div>
                    <span className="text-7xl font-bold">
                      {Math.round(weather.current.temperature_2m)}°
                    </span>
                    <p className="font-semibold text-lg -mt-2">
                      Feels like {Math.round(weather.current.apparent_temperature)}°
                    </p>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">
                    {locationName}
                  </p>
                  <p>The skies will be mostly cloudy. The low will be {Math.round(weather.daily.temperature_2m_min[0])}°.</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-4">
                 <WeatherDetail icon={<Thermometer size={20} />} label="Feels Like" value={`${Math.round(weather.current.apparent_temperature)}°`} />
                 <WeatherDetail icon={<Wind size={20} />} label="Wind" value={`${Math.round(weather.current.windspeed_10m)}`} unit=" mph" />
                 <WeatherDetail icon={<Droplet size={20} />} label="Humidity" value={`${weather.current.relativehumidity_2m}`} unit="%" />
                 <WeatherDetail icon={<Eye size={20} />} label="Visibility" value={`${(currentVisibility / 1609).toFixed(1)}`} unit=" mi" />
                 <WeatherDetail icon={<Gauge size={20} />} label="Pressure" value={`${(weather.current.surface_pressure / 33.864).toFixed(2)}`} unit=" in" />
                 <WeatherDetail icon={<Sun size={20} />} label="UV Index" value={`${weather.current.uv_index}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Hourly Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto pb-4">
                <div className="flex space-x-2">
                {hourlyChartData.map((hour, i) => (
                  <div key={hour.time} className={cn(
                    "flex flex-col items-center p-3 rounded-lg border min-w-[80px] cursor-pointer",
                    i === 0 ? "bg-primary text-primary-foreground border-primary" : "bg-accent/50"
                    )}>
                      <p className="font-bold text-sm">{hour.formattedTime}</p>
                      <div className="w-10 h-10 my-2">{getWeatherIcon(hour.weathercode, true, 40)}</div>
                      <p className="font-bold">{hour.temp}°</p>
                  </div>
                ))}
                </div>
              </div>
               <ChartContainer config={chartConfig} className="w-full h-[250px] aspect-auto">
                 <AreaChart data={hourlyChartData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-temp)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--color-temp)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="formattedTime" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={20} />
                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                    <RechartsTooltip cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '3 3' }} content={<ChartTooltipContent indicator="line" />} />
                    <Area type="monotone" dataKey="temp" stroke="var(--color-temp)" strokeWidth={2} fill="url(#colorTemp)" />
                    <ReferenceLine y={32} stroke="hsl(var(--foreground))" strokeDasharray="3 3" strokeOpacity={0.5} />
                  </AreaChart>
              </ChartContainer>
              <ChartContainer config={chartConfig} className="w-full h-[80px] aspect-auto -mt-4">
                <BarChart data={hourlyChartData} margin={{top: 10, right: 10, left: -20, bottom: 0}}>
                   <XAxis dataKey="formattedTime" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={20} hide/>
                   <YAxis domain={[0, 100]} hide/>
                   <RechartsTooltip content={<ChartTooltipContent indicator="dot" nameKey="precip"/>} cursor={false} />
                   <Bar dataKey="precip" fill="hsl(var(--secondary-foreground))" fillOpacity={0.5} radius={4}/>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
           <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader><CardTitle>Radar</CardTitle></CardHeader>
            <CardContent>
                <RadarMap />
            </CardContent>
          </Card>

           <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader><CardTitle>10-Day Forecast</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {dailyForecasts.map((day) => (
                        <div key={day.date} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50">
                            <span className="font-medium w-12">{day.dayName}</span>
                            <div className="w-8">{getWeatherIcon(day.weathercode, true, 24)}</div>
                            <div className="flex-1 px-4">
                                <div className="w-full bg-muted rounded-full h-1.5">
                                    <div 
                                        className="bg-gradient-to-r from-blue-400 to-orange-400 h-1.5 rounded-full"
                                        style={{ 
                                            width: `${((day.maxTemp - day.minTemp) / 40) * 100}%`,
                                            marginLeft: `${(day.minTemp - 30) / 70 * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                            <span className="font-semibold w-8 text-right">{day.maxTemp}°</span>
                            <span className="text-muted-foreground w-8 text-right">{day.minTemp}°</span>
                        </div>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    