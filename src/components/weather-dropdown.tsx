
"use client";

import * as React from "react";
import Link from "next/link";
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Loader2,
  Sun,
  Wind,
} from "lucide-react";
import {
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "./ui/button";
import {
  getWeatherForecast,
  WeatherOutput,
} from "@/ai/flows/weather";
import { toast } from "@/hooks/use-toast";

const weatherIconMap: { [key: string]: React.ReactNode } = {
  sun: <Sun className="size-5" />,
  cloud: <Cloud className="size-5" />,
  rain: <CloudRain className="size-5" />,
  snow: <CloudSnow className="size-5" />,
  wind: <Wind className="size-5" />,
  thunderstorm: <CloudLightning className="size-5" />,
};

export function WeatherDropdown() {
  const [weather, setWeather] = React.useState<WeatherOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchWeather() {
      try {
        setIsLoading(true);
        // Default to San Diego for the dropdown
        const result = await getWeatherForecast({ latitude: 32.7157, longitude: -117.1611 });
        setWeather(result);
      } catch (e) {
        setError("Could not fetch weather.");
        toast({ title: "Weather Error", description: "Could not fetch weather for the dropdown.", variant: "destructive" });
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchWeather();
  }, []);

  return (
    <>
      <NavigationMenuTrigger className="flex items-center gap-2">
        {weather && !isLoading ? (
          <>
            {weatherIconMap[weather.currentIcon]}
            <span>{weather.currentTemp}°</span>
          </>
        ) : (
          <CloudSun className="size-5" />
        )}
        <span>Weather</span>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <div className="w-[300px] p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
             <div className="flex justify-center items-center h-32 text-destructive text-sm text-center">
              {error}
            </div>
          ) : weather ? (
            <>
              <div className="text-center mb-4">
                <p className="text-lg font-semibold">{weather.locationName}</p>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-4xl font-bold">{weather.currentTemp}°</div>
                   <div className="flex flex-col items-center">
                     {weatherIconMap[weather.currentIcon]}
                     <p className="text-sm text-muted-foreground">{weather.currentConditions}</p>
                   </div>
                </div>
              </div>
              <div className="flex justify-between gap-2 text-center">
                {weather.forecast.map((day) => (
                  <div key={day.day} className="flex flex-col items-center gap-1 p-2 rounded-md hover:bg-muted/50">
                    <p className="text-sm font-medium">{day.day}</p>
                    {weatherIconMap[day.icon]}
                    <p className="text-sm">{day.temp}°</p>
                  </div>
                ))}
              </div>
               <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/weather/forecast">Full Forecast</Link>
                  </Button>
                   <Button variant="outline" asChild>
                    <Link href="/weather/radar">Weather Radar</Link>
                  </Button>
               </div>
            </>
          ) : null}
        </div>
      </NavigationMenuContent>
    </>
  );
}
