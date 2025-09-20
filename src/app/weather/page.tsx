
"use client";

import { useEffect, useState } from "react";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Sun, Cloud, CloudRain, Snowflake, Wind } from "lucide-react";

// Map Open-Meteo weather codes to icons + text
const weatherCodeMap: Record<number, { icon: JSX.Element; text: string }> = {
  0: { icon: <Sun className="h-12 w-12 text-yellow-500" />, text: "Clear sky" },
  1: { icon: <Cloud className="h-12 w-12 text-gray-500" />, text: "Mainly clear" },
  2: { icon: <Cloud className="h-12 w-12 text-gray-400" />, text: "Partly cloudy" },
  3: { icon: <Cloud className="h-12 w-12 text-gray-600" />, text: "Overcast" },
  61: { icon: <CloudRain className="h-12 w-12 text-blue-500" />, text: "Rain showers" },
  71: { icon: <Snowflake className="h-12 w-12 text-blue-300" />, text: "Snowfall" },
};

export default function WeatherPage() {
  const [weather, setWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [location, setLocation] = useState("Greenwood, IN");
  const [radarUrl, setRadarUrl] = useState("https://embed.windy.com/embed2.html?lat=39.6&lon=-86.1&zoom=6&level=surface&overlay=radar&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&detailLat=39.6&detailLon=-86.1&metricWind=mph&metricTemp=°F");

  useEffect(() => {
    async function fetchWeather(lat: number, lon: number) {
      // Set radar URL first
      setRadarUrl(`https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&zoom=6&level=surface&overlay=radar&menu=&message=true&marker=true&calendar=now&pressure=true&type=map&location=coordinates&detail=true&detailLat=${lat}&detailLon=${lon}&metricWind=mph&metricTemp=°F`);

      // Get friendly location name
      try {
        const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
        const geoData = await geoRes.json();
        setLocation(geoData.city || geoData.principalSubdivision || "Current Location");
      } catch (err) {
        console.error("Failed to fetch location name:", err);
        setLocation("Current Location");
      }

      // Get weather data
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weathercode,windspeed_10m&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&temperature_unit=fahrenheit&windspeed_unit=mph`
        );
        const data = await res.json();
        setWeather(data.current);
        setForecast(data.daily.time.map((t: string, i: number) => ({
          date: t,
          max: data.daily.temperature_2m_max[i],
          min: data.daily.temperature_2m_min[i],
          code: data.daily.weathercode[i],
        })));
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          // fallback to Greenwood
          fetchWeather(39.6137, -86.1067);
        }
      );
    } else {
      fetchWeather(39.6137, -86.1067);
    }
  }, []);

  function getIcon(code: number, size: 'large' | 'small' = 'large') {
    const iconSizeClass = size === 'large' ? "h-12 w-12" : "h-8 w-8";
    const weatherInfo = Object.entries(weatherCodeMap).find(([key]) => Number(key) >= code);
    if(weatherInfo) {
        return React.cloneElement(weatherInfo[1].icon, {className: `${iconSizeClass} ${weatherInfo[1].icon.props.className.split(' ').filter((c:string) => !c.startsWith('h-') && !c.startsWith('w-')).join(' ')}`})
    }
    return <Cloud className={`${iconSizeClass} text-gray-400`} />;
  }

  function getText(code: number) {
     const weatherInfo = Object.entries(weatherCodeMap).find(([key]) => Number(key) >= code);
     return weatherInfo ? weatherInfo[1].text : "Unknown";
  }

  if (!weather || forecast.length === 0) {
    return (
       <LayoutWrapper>
        <PageHeader
          title="Weather"
          description="Loading weather data..."
        />
        <p>Loading...</p>
      </LayoutWrapper>
    )
  }

  return (
    <LayoutWrapper>
      <PageHeader
        title="Weather"
        description={`Current conditions and forecast for ${location}`}
      />

      <div className="space-y-8">
        {/* Current Conditions */}
        <div className="bg-card shadow-sm rounded-xl p-6 border">
          <h2 className="text-xl font-semibold text-card-foreground">Current Conditions</h2>
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-4">
              {getIcon(weather.weathercode)}
              <span className="text-5xl font-bold">{Math.round(weather.temperature_2m)}°F</span>
            </div>
            <div className="text-right text-muted-foreground">
              <p>{getText(weather.weathercode)}</p>
              <p className="flex items-center justify-end space-x-2">
                <Wind className="h-4 w-4" />{" "}
                <span>{weather.windspeed_10m} mph Wind</span>
              </p>
            </div>
          </div>
        </div>

        {/* 5-Day Forecast */}
        <div className="bg-card shadow-sm rounded-xl p-6 border">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">5-Day Forecast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {forecast.slice(0, 5).map((day, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-4 border"
              >
                <p className="font-medium text-foreground">
                  {new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <div className="my-2">{getIcon(day.code, 'small')}</div>
                <p className="text-foreground font-semibold">{Math.round(day.max)}° / {Math.round(day.min)}°</p>
              </div>
            ))}
          </div>
        </div>

        {/* Radar */}
        <div className="bg-card shadow-sm rounded-xl p-6 border">
          <h2 className="text-xl font-semibold text-card-foreground mb-4">Radar</h2>
          <iframe
            className="w-full h-[500px] rounded-lg border"
            src={radarUrl}
            frameBorder="0"
          ></iframe>
        </div>
      </div>
    </LayoutWrapper>
  );
}
