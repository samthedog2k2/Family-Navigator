
"use client";
import { Card } from "./ui/card";
import { getUVIndexInfo } from "@/lib/weather-helpers";
import { format, parseISO } from "date-fns";
import { Wind, Droplets, Sunrise, Sunset } from "lucide-react";
import { degreesToCompass } from "@/lib/weather-helpers";
import { cn } from "@/lib/utils";

const WeatherCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={cn("bg-msn-bg/50 shadow-inner p-4", className)}>
        {children}
    </Card>
);

export const WindCard = ({ weather }: { weather: any }) => {
    const windDirectionStyle = {
        transform: `rotate(${weather.current.windDirection}deg)`
    };

    return (
        <WeatherCard>
            <h2 className="text-sm text-msn-text-secondary mb-2">Wind</h2>
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-msn-text-secondary/50 rounded-full"></div>
                    <div className="absolute inset-2" style={windDirectionStyle}>
                        <div className="relative w-full h-full">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 w-0.5 bg-msn-text"></div>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 border-t-2 border-l-2 border-msn-text transform rotate-45"></div>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-xs text-msn-text-secondary">From {degreesToCompass(weather.current.windDirection)}</p>
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
                <h2 className="text-sm text-msn-text-secondary mb-2">Humidity</h2>
                <div className="text-msn-text-muted">Data unavailable</div>
            </WeatherCard>
        );
    }
    return (
        <WeatherCard>
            <h2 className="text-sm text-msn-text-secondary mb-2">Humidity</h2>
            <div className="flex justify-between items-start">
                 <div>
                    <p className="text-3xl font-bold">{weather.current.humidity}%</p>
                    <p className="text-xs text-msn-text-secondary">Relative</p>
                </div>
                <div className="flex gap-1 pt-1">
                    {weather.hourly.temperature.slice(hourlyIndex, hourlyIndex + 5).map((h: number, i: number) => (
                        <div key={i} className="w-2 rounded-full bg-gray-200 dark:bg-gray-700 h-12 flex flex-col-reverse">
                           {(weather.hourly.humidity && weather.hourly.humidity[hourlyIndex + i]) && <div className="bg-msn-blue w-full rounded-full" style={{ height: `${weather.hourly.humidity[hourlyIndex + i]}%` }}></div>}
                        </div>
                    ))}
                </div>
            </div>
        </WeatherCard>
    );
};

export const SunCard = ({ weather }: { weather: any }) => {
    const sunrise = parseISO(weather.daily.sunrise[0]);
    const sunset = parseISO(weather.daily.sunset[0]);

    return (
        <WeatherCard>
            <h2 className="text-sm text-msn-text-secondary mb-2">Sunrise & Sunset</h2>
            <div className="flex justify-between items-center text-center mt-4">
                <div>
                    <Sunrise className="mx-auto text-msn-icon-sun" />
                    <p className="text-lg font-bold">{format(sunrise, 'h:mm')}</p>
                    <p className="text-xs text-msn-text-muted">{format(sunrise, 'a')}</p>
                </div>
                <div>
                    <Sunset className="mx-auto text-orange-500" />
                    <p className="text-lg font-bold">{format(sunset, 'h:mm')}</p>
                    <p className="text-xs text-msn-text-muted">{format(sunset, 'a')}</p>
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
            <h2 className="text-sm text-msn-text-secondary mb-4">UV Index</h2>
            <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
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

