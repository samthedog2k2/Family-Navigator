
"use client";
import { Card } from "./ui/card";
import { getUVIndexInfo } from "@/lib/weather-helpers";
import { format, parseISO } from "date-fns";
import { Wind, Droplets, Sunrise, Sunset } from "lucide-react";
import { degreesToCompass } from "@/lib/weather-helpers";
import { cn } from "@/lib/utils";

const WeatherCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={cn("bg-msn-card shadow-msn p-4", className)}>
        {children}
    </Card>
);

export const WindCard = ({ weather }: { weather: any }) => {
    const windDirectionStyle = {
        transform: `rotate(${weather.current.wind_direction_10m}deg)`
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
                    <p className="text-xs text-msn-text-secondary">From {degreesToCompass(weather.current.wind_direction_10m)}</p>
                    <p><span className="text-3xl font-bold">{Math.round(weather.current.wind_speed_10m)}</span> mph</p>
                </div>
            </div>
        </WeatherCard>
    );
};


export const HumidityCard = ({ weather, hourlyIndex }: { weather: any, hourlyIndex: number }) => {
    if (!weather?.hourly?.relative_humidity_2m) {
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
                    <p className="text-3xl font-bold">{weather.current.relative_humidity_2m}%</p>
                    <p className="text-xs text-msn-text-secondary">Relative</p>
                </div>
                <div className="flex gap-1">
                    {weather.hourly.temperature_2m.slice(hourlyIndex, hourlyIndex + 5).map((h: number, i: number) => (
                        <div key={i} className="w-2 rounded-full bg-gray-200 dark:bg-gray-700 h-12 flex flex-col-reverse">
                           {(weather.hourly.relative_humidity_2m && weather.hourly.relative_humidity_2m[hourlyIndex + i]) && <div className="bg-msn-blue w-full rounded-full" style={{ height: `${weather.hourly.relative_humidity_2m[hourlyIndex + i]}%` }}></div>}
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
    const uvIndex = weather.current.uv_index;
    const { level, color } = getUVIndexInfo(uvIndex);
    const maxUv = 11;
    const angle = (uvIndex / maxUv) * 180;

    return (
        <WeatherCard>
            <h2 className="text-sm text-msn-text-secondary mb-2">UV Index</h2>
             <div className="relative w-32 h-16 mx-auto mt-2">
                <div 
                    className="absolute bottom-0 left-0 right-0 h-16 border-t-[6px] border-l-[6px] border-r-[6px] rounded-t-full"
                    style={{borderColor: 'transparent', background: 'conic-gradient(from -90deg, #5cb85c 0deg 60deg, #f0ad4e 60deg 120deg, #d9534f 120deg 180deg)', clipPath: 'path("M 0 64 A 64 64 0 0 1 128 64 L 128 16 A 48 48 0 0 0 16 16 Z")' }}
                />
                <div 
                    className="absolute bottom-0 left-1/2 h-[58px] w-1 bg-msn-text origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${angle - 90}deg)` }}
                >
                    <div className="w-2 h-2 bg-msn-text rounded-full absolute -top-1 -left-0.5"></div>
                </div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl font-bold">{Math.round(uvIndex)}</div>
            </div>
            <div className="text-center mt-1">
                <p className="font-bold text-sm" style={{ color }}>{level}</p>
            </div>
        </WeatherCard>
    );
};
