
"use client";
import { Card } from "./ui/card";
import { getUVIndexInfo } from "@/lib/weather-helpers";
import { format, parseISO } from "date-fns";
import { Wind, Droplets, Sunrise, Sunset, Sun } from "lucide-react";
import { degreesToCompass } from "@/lib/weather-helpers";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const WeatherCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={cn("bg-muted/30 dark:bg-muted/50 p-4", className)}>
        {children}
    </Card>
);

export const WindCard = ({ weather }: { weather: any }) => {
    const windDirectionStyle = {
        transform: `rotate(${weather.current.windDirection}deg)`
    };

    return (
        <WeatherCard>
            <h2 className="text-sm text-muted-foreground mb-2">Wind</h2>
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-muted-foreground/50 rounded-full"></div>
                    <div className="absolute inset-2" style={windDirectionStyle}>
                        <div className="relative w-full h-full">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-0.5 bg-foreground"></div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 border-t-2 border-l-2 border-foreground transform rotate-45"></div>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-xs text-muted-foreground">From {degreesToCompass(weather.current.windDirection)}</p>
                    <p><span className="text-3xl font-bold">{Math.round(weather.current.windSpeed)}</span> mph</p>
                </div>
            </div>
        </WeatherCard>
    );
};


export const HumidityCard = ({ weather, hourlyIndex }: { weather: any, hourlyIndex: number }) => {
    if (!weather?.hourly?.humidity) {
        return (
            <WeatherCard>
                <h2 className="text-sm text-muted-foreground mb-2">Humidity</h2>
                <div className="text-muted-foreground">Data unavailable</div>
            </WeatherCard>
        );
    }
    return (
        <WeatherCard>
            <h2 className="text-sm text-muted-foreground mb-2">Humidity</h2>
            <div className="flex justify-between items-start">
                 <div>
                    <p className="text-3xl font-bold">{weather.current.humidity}%</p>
                    <p className="text-xs text-muted-foreground">Relative</p>
                </div>
                <TooltipProvider>
                    <div className="flex flex-col items-center">
                        <p className="text-xs font-semibold text-muted-foreground">Hourly</p>
                        <div className="flex gap-2 pt-1 items-end h-16">
                            {weather.hourly.time.slice(hourlyIndex, hourlyIndex + 5).map((time: string, i: number) => {
                                const humidityValue = weather.hourly.humidity[hourlyIndex + i];
                                return (
                                    <Tooltip key={time}>
                                        <TooltipTrigger asChild>
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-2.5 rounded-full bg-secondary h-12 flex flex-col-reverse">
                                                    <div className="bg-blue-400 w-full rounded-full" style={{ height: `${humidityValue}%` }}></div>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground">{format(parseISO(time), 'ha')}</p>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{humidityValue}% humidity</p>
                                        </TooltipContent>
                                    </Tooltip>
                                );
                            })}
                        </div>
                    </div>
                </TooltipProvider>
            </div>
        </WeatherCard>
    );
};

export const SunCard = ({ weather }: { weather: any }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sunrise = parseISO(weather.daily.sunrise[0]);
  const sunset = parseISO(weather.daily.sunset[0]);

  const totalDaylight = sunset.getTime() - sunrise.getTime();
  const timeSinceSunrise = currentTime.getTime() - sunrise.getTime();
  
  let sunProgress = 0;
  if (totalDaylight > 0 && timeSinceSunrise > 0) {
      sunProgress = (timeSinceSunrise / totalDaylight) * 100;
  }
  
  if (currentTime > sunset) {
      sunProgress = 100;
  }
  if (currentTime < sunrise) {
      sunProgress = 0;
  }

  const angle = 180 - (sunProgress * 1.8);
  const radians = (angle * Math.PI) / 180;
  const sunX = 50 + 45 * Math.cos(radians);
  const sunY = 50 - 45 * Math.sin(radians);

  return (
    <WeatherCard>
      <h2 className="text-sm text-muted-foreground mb-4">Sunrise & Sunset</h2>
      <div className="flex justify-between items-center text-center">
        {/* Sunrise Info */}
        <div>
          <Sunrise className="mx-auto text-orange-400" />
          <p className="text-lg font-bold">{format(sunrise, 'h:mm')}</p>
          <p className="text-xs text-muted-foreground">{format(sunrise, 'a')}</p>
        </div>

        {/* Sun Arc and Time */}
        <div className="relative w-32 h-16">
          <svg viewBox="0 0 100 55" className="w-full h-full">
            <path d="M 5 50 A 45 45 0 0 1 95 50" stroke="hsl(var(--muted-foreground))" strokeWidth="2" fill="none" strokeDasharray="2 3" />
            {sunProgress > 0 && sunProgress < 100 && (
              <g transform={`translate(${sunX}, ${sunY})`}>
                <Sun size={12} className="text-yellow-500" fill="hsl(var(--yellow-500))"/>
              </g>
            )}
          </svg>
          <p className="absolute bottom-0 left-1/2 -translate-x-1/2 text-muted-foreground font-semibold text-xs">
            {format(currentTime, 'h:mm:ss a')}
          </p>
        </div>

        {/* Sunset Info */}
        <div>
          <Sunset className="mx-auto text-orange-500" />
          <p className="text-lg font-bold">{format(sunset, 'h:mm')}</p>
          <p className="text-xs text-muted-foreground">{format(sunset, 'a')}</p>
        </div>
      </div>
    </WeatherCard>
  );
};


export const UvCard = ({ weather }: { weather: any }) => {
    const uvIndex = weather.current.uvIndex;
    const { level, color } = getUVIndexInfo(uvIndex);
    const maxUv = 11;
    const percentage = (uvIndex / maxUv) * 100;

    return (
        <WeatherCard>
            <h2 className="text-sm text-muted-foreground mb-4">UV Index</h2>
            <div className="space-y-2">
                <div className="w-full bg-secondary rounded-full h-4">
                    <div 
                        className="h-4 rounded-full flex items-center justify-end pr-2" 
                        style={{ width: `${percentage}%`, backgroundColor: color }}
                    >
                         <span className="text-xs font-bold text-white">{Math.round(uvIndex)}</span>
                    </div>
                </div>
                <div className="text-center">
                    <p className="font-bold text-lg" style={{ color }}>{level}</p>
                </div>
            </div>
        </WeatherCard>
    );
};
