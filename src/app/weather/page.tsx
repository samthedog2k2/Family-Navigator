
"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getWeatherIcon } from "@/lib/weather-icons";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Loader2,
  Wind,
  Droplet,
  Sunrise,
  Sunset,
  Eye,
  Thermometer,
  Sun,
  Gauge,
} from "lucide-react";
import { RadarMap } from "@/components/RadarMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ChartTooltipContent } from "@/components/ui/chart";

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
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
    sunrise: string[];
    sunset: string[];
    visibility: number[];
  };
  daily_units: {
    visibility: string;
  }
};

const WeatherDetail = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex items-center gap-2 text-sm">
    <div className="text-muted-foreground">{icon}</div>
    <span className="font-medium">{label}</span>
    <span className="ml-auto font-semibold">{value}</span>
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
        setLocationName(
          geoData.city || geoData.principalSubdivision || "Current Location"
        );
      } catch (err) {
        console.error("Failed to fetch location name:", err);
        setLocationName("Current Location");
      }

      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relativehumidity_2m,apparent_temperature,is_day,weathercode,windspeed_10m,surface_pressure,dewpoint_2m,uv_index&hourly=temperature_2m,precipitation_probability,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,visibility&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=10`
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
    const startIndex = weather.hourly.time.findIndex(t => new Date(t) > now) - 1;
    if (startIndex < 0) return [];
    
    return weather.hourly.time.slice(startIndex, startIndex + 24).map((t, i) => {
      const dataIndex = startIndex + i;
      const time = new Date(t);
      return {
        time: time.getHours(),
        formattedTime: dataIndex === 0 ? 'Now' : time.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        temp: Math.round(weather.hourly.temperature_2m[dataIndex]),
        precip: weather.hourly.precipitation_probability[dataIndex],
        icon: getWeatherIcon(weather.hourly.weathercode[dataIndex], true)
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
        <PageHeader
          title="Weather Unavailable"
          description="Could not load weather data at this time."
        />
      </main>
    );
  }

  return (
    <div
      className={cn(
        "p-4 sm:p-6 transition-colors duration-500",
        isDay ? "weather-bg-day" : "weather-bg-night"
      )}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Weather */}
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="flex items-center gap-4">
              {getWeatherIcon(weather.current.weathercode, isDay)}
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
          
          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3">
             <WeatherDetail icon={<Thermometer size={20} />} label="Feels Like" value={`${Math.round(weather.current.apparent_temperature)}°`} />
             <WeatherDetail icon={<Wind size={20} />} label="Wind" value={`${Math.round(weather.current.windspeed_10m)} mph`} />
             <WeatherDetail icon={<Droplet size={20} />} label="Humidity" value={`${weather.current.relativehumidity_2m}%`} />
             <WeatherDetail icon={<Eye size={20} />} label="Visibility" value={`${(weather.daily.visibility[0] / 1609).toFixed(1)} mi`} />
             <WeatherDetail icon={<Gauge size={20} />} label="Pressure" value={`${(weather.current.surface_pressure / 33.864).toFixed(2)} in`} />
             <WeatherDetail icon={<Sun size={20} />} label="UV Index" value={weather.current.uv_index.toFixed(0)} />
          </div>

          <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Hourly Forecast</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={hourlyChartData} margin={{ top: 5, right: 20, left: -20, bottom: 40 }}>
                   <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fde047" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fde047" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="formattedTime" tickLine={false} axisLine={false} dy={10} interval="preserveStartEnd" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
                  <Tooltip
                    content={<ChartTooltipContent indicator="line" />}
                    cursor={{ stroke: 'hsl(var(--foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="temp" stroke="#facc15" fillOpacity={1} fill="url(#colorTemp)" strokeWidth={2} />
                  
                  {/* Precipitation */}
                  {hourlyChartData.map((entry, index) => entry.precip > 0 && (
                     <ReferenceLine
                        key={index}
                        x={entry.formattedTime}
                        ifOverflow="extendDomain"
                        y={entry.temp - 5}
                      >
                         <foreignObject x={-15} y={0} width="30" height="20">
                            <div style={{ color: '#3b82f6', fontSize: '10px', textAlign: 'center' }}>
                               💧{entry.precip}%
                            </div>
                        </foreignObject>
                      </ReferenceLine>
                  ))}
                   <ReferenceLine y={new Date(weather.daily.sunrise[0]).getHours()} label="Sunrise" strokeDasharray="3 3" />
                   <ReferenceLine y={new Date(weather.daily.sunset[0]).getHours()} label="Sunset" strokeDasharray="3 3" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader><CardTitle>Radar</CardTitle></CardHeader>
            <CardContent>
                <p className="text-sm text-center mb-2">No precipitation for at least 2 hours.</p>
                <RadarMap />
            </CardContent>
          </Card>

           <Card className="bg-background/50 backdrop-blur-sm">
            <CardHeader><CardTitle>10-Day Forecast</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {weather.daily.time.map((day, i) => (
                        <div key={day} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50">
                            <span className="font-medium w-12">{i === 0 ? 'Today' : new Date(day).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            <div className="w-8">{getWeatherIcon(weather.daily.weathercode[i], true)}</div>
                            <div className="flex-1 px-4">
                                <div className="w-full bg-muted rounded-full h-1.5">
                                    <div 
                                        className="bg-gradient-to-r from-blue-400 to-orange-400 h-1.5 rounded-full"
                                        style={{ 
                                            width: `${((weather.daily.temperature_2m_max[i] - weather.daily.temperature_2m_min[i]) / 40) * 100}%`,
                                            marginLeft: `${(weather.daily.temperature_2m_min[i] - 30) / 70 * 100}%`
                                        }}
                                    />
                                </div>
                            </div>
                            <span className="font-semibold w-8 text-right">{Math.round(weather.daily.temperature_2m_max[i])}°</span>
                            <span className="text-muted-foreground w-8 text-right">{Math.round(weather.daily.temperature_2m_min[i])}°</span>
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
