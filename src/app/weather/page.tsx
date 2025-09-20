
"use client";

import { useEffect, useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Navigation, AlertCircle, CloudSun } from "lucide-react";

type WeatherData = {
  temperature: number;
  windspeed: number;
  weathercode: number;
  winddirection: number;
};

const weatherCodeMap: { [key: number]: { description: string; icon: React.ReactNode } } = {
  0: { description: "Clear sky", icon: <Sun className="size-8" /> },
  1: { description: "Mainly clear", icon: <Sun className="size-8" /> },
  2: { description: "Partly cloudy", icon: <CloudSun className="size-8" /> },
  3: { description: "Overcast", icon: <Cloud className="size-8" /> },
  45: { description: "Fog", icon: <Cloud className="size-8" /> },
  48: { description: "Depositing rime fog", icon: <Cloud className="size-8" /> },
  51: { description: "Light drizzle", icon: <CloudRain className="size-8" /> },
  53: { description: "Moderate drizzle", icon: <CloudRain className="size-8" /> },
  55: { description: "Dense drizzle", icon: <CloudRain className="size-8" /> },
  61: { description: "Slight rain", icon: <CloudRain className="size-8" /> },
  63: { description: "Moderate rain", icon: <CloudRain className="size-8" /> },
  65: { description: "Heavy rain", icon: <CloudRain className="size-8" /> },
  80: { description: "Slight rain showers", icon: <CloudRain className="size-8" /> },
  81: { description: "Moderate rain showers", icon: <CloudRain className="size-8" /> },
  82: { description: "Violent rain showers", icon: <CloudRain className="size-8" /> },
  71: { description: "Slight snow fall", icon: <CloudSnow className="size-8" /> },
  73: { description: "Moderate snow fall", icon: <CloudSnow className="size-8" /> },
  75: { description: "Heavy snow fall", icon: <CloudSnow className="size-8" /> },
  85: { description: "Slight snow showers", icon: <CloudSnow className="size-8" /> },
  86: { description: "Heavy snow showers", icon: <CloudSnow className="size-8" /> },
  95: { description: "Thunderstorm", icon: <CloudLightning className="size-8" /> },
};


export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [locationName, setLocationName] = useState<string>("your location");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (latitude: number, longitude: number) => {
    try {
      const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=fahrenheit`);
      if (!weatherResponse.ok) throw new Error("Failed to fetch weather data.");
      const weatherData = await weatherResponse.json();
      setWeather(weatherData.current_weather);

      // Fetch location name
      const locationResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        setLocationName(locationData.city || locationData.principalSubdivision || "your location");
      }

    } catch (err) {
      setError("Could not fetch weather data. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Geolocation failed, fallback to San Diego
          setLocationName("San Diego");
          fetchWeather(32.7157, -117.1611);
          setError("Geolocation failed. Showing weather for San Diego.");
        }
      );
    } else {
      // Geolocation not supported, fallback to San Diego
      setLocationName("San Diego");
      fetchWeather(32.7157, -117.1611);
      setError("Geolocation not supported. Showing weather for San Diego.");
    }
  }, []);
  
  const weatherInfo = weather ? weatherCodeMap[weather.weathercode] : null;

  return (
    <LayoutWrapper>
      <PageHeader
        title="Weather"
        description={`Current weather for ${locationName}.`}
      />
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Current Conditions</CardTitle>
             <CardDescription>
                {weatherInfo ? weatherInfo.description : "Loading..."}
             </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="size-8 animate-spin text-primary" />
              </div>
            ) : weather ? (
              <div className="flex items-center justify-around text-center">
                <div className="flex items-center gap-4">
                  {weatherInfo?.icon}
                  <div className="text-5xl font-bold">{Math.round(weather.temperature)}°F</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                   <Navigation className="size-8" style={{ transform: `rotate(${weather.winddirection}deg)` }}/>
                   <div className="font-semibold">{weather.windspeed} mph</div>
                   <div className="text-sm text-muted-foreground">Wind</div>
                </div>
              </div>
            ) : (
                 <div className="flex flex-col items-center justify-center h-32 gap-2 text-destructive">
                    <AlertCircle className="size-8" />
                    <p>{error || "Could not load weather data."}</p>
                 </div>
            )}
          </CardContent>
        </Card>
      </div>
    </LayoutWrapper>
  );
}
