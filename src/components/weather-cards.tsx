
"use client";
import { Card } from "./ui/card";
import { getWeatherIcon } from "@/lib/weather-icons";
import { degreesToCompass, getAqiInfo, getUVIndexInfo } from "@/lib/weather-helpers";
import { format, parseISO } from "date-fns";
import { Gauge, TrendingDown, Thermometer, Wind, Droplets, Eye, Sunrise, Sunset, Sun } from "lucide-react";

const WeatherCard = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <Card className={`bg-gray-800/60 border-gray-700/50 p-4 sm:p-6 text-white backdrop-blur-sm ${className}`}>
        {children}
    </Card>
);

export const TemperatureCard = ({ weather }: { weather: any }) => {
    return (
        <WeatherCard>
            <h2 className="text-sm text-gray-400 mb-2">Temperature</h2>
            <div className="text-5xl font-bold">{Math.round(weather.current.temperature_2m)}°</div>
            <div className="flex items-center gap-2 text-sm mt-4">
                <TrendingDown />
                <span>Falling</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">Falling with a low of {Math.round(weather.daily.temperature_2m_min[0])}° at 11:00 PM. Tomorrow expected to be similar to today.</p>
        </WeatherCard>
    );
};

export const FeelsLikeCard = ({ weather }: { weather: any }) => {
    return (
        <WeatherCard>
            <h2 className="text-sm text-gray-400 mb-2">Feels like</h2>
            <div className="relative h-2 bg-gray-700 rounded-full my-4">
                <div className="absolute h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full w-full"></div>
                <div className="absolute h-4 w-4 bg-white rounded-full -top-1 border-2 border-gray-900" style={{ left: `calc(${Math.min(100, Math.max(0, (weather.current.apparent_temperature/100)*100))}% - 8px)` }}></div>
            </div>
            <p className="text-xs text-gray-400">Dominant factor: none</p>
            <div className="flex justify-between items-center mt-4">
                <div>
                    <span className="text-xs text-gray-400">Feels like:</span>
                    <p className="text-2xl font-bold">{Math.round(weather.current.apparent_temperature)}°</p>
                </div>
                 <div>
                    <span className="text-xs text-gray-400">Temperature:</span>
                    <p className="text-2xl font-bold">{Math.round(weather.current.temperature_2m)}°</p>
                </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">Feels warmer than the actual temperature.</p>
        </WeatherCard>
    );
};

export const WindCard = ({ weather }: { weather: any }) => {
    const windDirectionStyle = {
        transform: `rotate(${weather.current.wind_direction_10m}deg)`
    };

    return (
        <WeatherCard>
            <h2 className="text-sm text-gray-400 mb-2">Wind</h2>
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-2 border-gray-600 rounded-full"></div>
                    <div className="absolute inset-2" style={windDirectionStyle}>
                        <div className="relative w-full h-full">
                            <Wind className="w-6 h-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-xs text-gray-400">From {degreesToCompass(weather.current.wind_direction_10m)} ({weather.current.wind_direction_10m}°)</p>
                    <p><span className="text-3xl font-bold">{Math.round(weather.current.wind_speed_10m)}</span> mph Wind Speed</p>
                </div>
            </div>
        </WeatherCard>
    );
};


export const HumidityCard = ({ weather, hourlyIndex }: { weather: any, hourlyIndex: number }) => {
    return (
        <WeatherCard>
            <h2 className="text-sm text-gray-400 mb-2">Humidity</h2>
            <div className="flex justify-between items-start">
                <div className="flex gap-2">
                    {weather.hourly.relative_humidity_2m.slice(hourlyIndex, hourlyIndex + 12).map((h: number, i: number) => (
                        <div key={i} className="w-2 rounded-full bg-gray-700 h-16 flex flex-col-reverse">
                            <div className="bg-blue-400 w-full rounded-full" style={{ height: `${h}%` }}></div>
                        </div>
                    ))}
                </div>
                <div>
                    <p className="text-3xl font-bold">{weather.current.relative_humidity_2m}%</p>
                    <p className="text-xs text-gray-400 text-right">Relative</p>
                    <p className="text-2xl font-bold mt-2">{Math.round(weather.hourly.dew_point_2m[hourlyIndex])}°</p>
                    <p className="text-xs text-gray-400 text-right">Dew point</p>
                </div>
            </div>
        </WeatherCard>
    );
};

export const VisibilityCard = ({ weather, hourlyIndex }: { weather: any, hourlyIndex: number }) => {
    const visibilityInMiles = (weather.hourly.visibility?.[hourlyIndex] / 1609).toFixed(1) || 0;
    return (
        <WeatherCard>
            <h2 className="text-sm text-gray-400 mb-2">Visibility</h2>
            <p className="text-5xl font-bold">{visibilityInMiles} <span className="text-3xl">mi</span></p>
            <p className="text-sm text-gray-300">Excellent</p>
            <p className="text-xs text-gray-400 mt-2">Tomorrow's visibility is expected to be similar to today.</p>
        </WeatherCard>
    );
};

export const PressureCard = ({ weather }: { weather: any }) => {
    const pressureInInches = (weather.current.surface_pressure / 33.864).toFixed(2);
    return (
        <WeatherCard>
            <h2 className="text-sm text-gray-400 mb-2">Pressure</h2>
            <p className="text-5xl font-bold">{pressureInInches} <span className="text-3xl">in</span></p>
            <p className="text-sm text-gray-300">Rising</p>
             <p className="text-xs text-gray-400 mt-2">Expected to rise slowly in the next 3 hours.</p>
        </WeatherCard>
    );
};

export const SunCard = ({ weather }: { weather: any }) => {
    const sunrise = parseISO(weather.daily.sunrise[0]);
    const sunset = parseISO(weather.daily.sunset[0]);

    return (
        <WeatherCard>
            <h2 className="text-sm text-gray-400 mb-2">Sun</h2>
            <div className="flex justify-between items-center text-center">
                <div>
                    <Sunrise className="mx-auto" />
                    <p className="text-lg font-bold">{format(sunrise, 'h:mm')}</p>
                    <p className="text-xs text-gray-400">{format(sunrise, 'a')}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-400">Total Daylight</p>
                    <p className="text-lg font-bold">12 hrs 2 mins</p>
                </div>
                <div>
                    <Sunset className="mx-auto" />
                    <p className="text-lg font-bold">{format(sunset, 'h:mm')}</p>
                    <p className="text-xs text-gray-400">{format(sunset, 'a')}</p>
                </div>
            </div>
        </WeatherCard>
    );
};

export const UvCard = ({ weather }: { weather: any }) => {
    const uvIndex = weather.current.uv_index;
    const { level, color } = getUVIndexInfo(uvIndex);

    return (
        <WeatherCard>
            <h2 className="text-sm text-gray-400 mb-2">UV</h2>
             <div className="relative w-32 h-16 mx-auto mt-4">
                <div className="absolute bottom-0 left-0 right-0 h-16 border-t-8 border-l-8 border-r-8 border-gray-700 rounded-t-full"></div>
                <div className="absolute bottom-0 left-0 right-0 h-16 border-t-8 border-l-8 border-r-8 border-transparent rounded-t-full overflow-hidden">
                   <div className={`absolute bottom-0 left-0 h-full w-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500`}></div>
                </div>
                <div 
                    className="absolute bottom-0 left-1/2 h-16 w-1 bg-gray-900 origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${(uvIndex/12)*180 - 90}deg)` }}
                >
                    <div className="w-3 h-3 bg-white rounded-full absolute -top-1.5 -left-1"></div>
                </div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-3xl font-bold">{Math.round(uvIndex)}</div>
            </div>
            <div className="text-center mt-4">
                <p className="font-bold">{level}</p>
                <p className="text-xs text-gray-400">Tomorrow's maximum UV level will be moderate.</p>
            </div>
        </WeatherCard>
    );
};

export const PrecipitationCard = ({ weather }: { weather: any }) => (
    <WeatherCard>
        <h2 className="text-sm text-gray-400 mb-2">Precipitation</h2>
        <div className="w-32 h-32 mx-auto rounded-full border-4 border-blue-400/20 flex items-center justify-center">
            <div className="text-center">
                <p className="text-3xl font-bold">{weather.current.precipitation}"</p>
                <p className="text-xs text-gray-400">in next 24h</p>
            </div>
        </div>
        <div className="text-center mt-4">
            <p className="font-bold">No Precipitation</p>
            <p className="text-xs text-gray-400">No precipitation in the next 24 hours.</p>
        </div>
    </WeatherCard>
);

export const CloudCoverCard = ({ weather }: { weather: any }) => (
    <WeatherCard>
        <h2 className="text-sm text-gray-400 mb-2">Cloud cover</h2>
        <div className="w-32 h-32 mx-auto relative">
             {getWeatherIcon(weather.current.weather_code, weather.current.is_day === 1, 100)}
        </div>
        <div className="text-center mt-4">
            <p className="font-bold">Cloudy ({weather.current.cloud_cover}%)</p>
            <p className="text-xs text-gray-400">Steady with mostly cloudy sky at {format(new Date(), 'h:mm a')}.</p>
        </div>
    </WeatherCard>
);
