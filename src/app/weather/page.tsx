
"use client";

import { useEffect, useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Navigation, AlertCircle, Wind, CloudFog, Snowflake, CloudRainWind } from "lucide-react";
import { getWeatherForecast, WeatherOutput } from "@/ai/flows/weather";
import { toast } from "@/hooks/use-toast";

const weatherIconMap: { [key: string]: React.ReactNode } = {
  sun: <Sun className="size-8" />,
  cloud: <Cloud className="size-8" />,
  rain: <CloudRain className="size-8" />,
  snow: <CloudSnow className="size-8" />,
  wind: <Wind className="size-8" />,
  thunderstorm: <CloudLightning className="size-8" />,
};


export default function WeatherPage() {
  const [weather, setWeather] = useState<WeatherOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const weatherData = await getWeatherForecast({ latitude, longitude });
      setWeather(weatherData);
    } catch (err) {
      setError("Could not fetch weather data. Please try again later.");
      toast({ title: "Error", description: "Failed to fetch weather.", variant: "destructive" });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Geolocation failed, fallback to San Diego
          setError("Geolocation failed. Showing weather for San Diego.");
          fetchWeatherData(32.7157, -117.1611);
        }
      );
    } else {
      // Geolocation not supported, fallback to San Diego
      setError("Geolocation not supported. Showing weather for San Diego.");
      fetchWeatherData(32.7157, -117.1611);
    }
  }, []);
  
  return (
    <LayoutWrapper>
      <PageHeader
        title="Weather"
        description={weather ? `Current weather for ${weather.locationName}.` : "Loading weather..."}
      />
      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Current Conditions</CardTitle>
             <CardDescription>
                {weather ? weather.currentConditions : "Loading..."}
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
                  {weatherIconMap[weather.currentIcon]}
                  <div className="text-5xl font-bold">{weather.currentTemp}°F</div>
                </div>
                <div className="flex flex-col items-center gap-1">
                   <Navigation className="size-8" style={{ transform: `rotate(${weather.windDirection}deg)` }}/>
                   <div className="font-semibold">{weather.windSpeed} mph</div>
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
