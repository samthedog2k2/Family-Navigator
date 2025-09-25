
"use client";

import React, { useEffect, useState } from "react";
import { Loader2, MapPin, AlertTriangle, RefreshCw } from "lucide-react";
import { format, parseISO } from "date-fns";
import { getWeatherIcon } from "@/lib/weather-icons";
import { RadarMap } from "@/components/RadarMap";
import { WindCard, HumidityCard, SunCard, UvCard } from "@/components/weather-cards";
import { weatherService, type ComprehensiveWeatherData } from "@/lib/weather-api-free";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Droplets } from 'lucide-react';
import { LayoutWrapper } from "@/components/layout-wrapper";

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<ComprehensiveWeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Default to Greenwood, IN if location access denied
        setLocation({ lat: 39.6137, lon: -86.1067 });
      },
      { timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  const fetchWeather = async (loc: { lat: number; lon: number; }) => {
      try {
        const data = await weatherService.getComprehensiveWeather(
          loc.lat,
          loc.lon
        );
        setWeatherData(data);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Failed to load weather data. Please try again.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
  };

  // Fetch weather data when location is available
  useEffect(() => {
    if (!location) return;
    
    setLoading(true);
    setError(null);
    fetchWeather(location);

  }, [location]);

  const handleRefresh = async () => {
    if (!location || refreshing) return;
    setRefreshing(true);
    fetchWeather(location);
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <div className="flex h-[80vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-msn-text-secondary">Loading weather data...</p>
          </div>
        </div>
      </LayoutWrapper>
    );
  }
  
  if (error || !weatherData) {
    return (
      <LayoutWrapper>
        <div className="max-w-2xl mx-auto mt-8">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {error || 'Unable to load weather data'}
            </AlertDescription>
          </Alert>
        </div>
      </LayoutWrapper>
    );
  }

  const now = new Date();
  const currentHourIndex = weatherData.hourly.time.findIndex(t => new Date(t) > now) -1;
  const hourlyIndex = currentHourIndex < 0 ? 0 : currentHourIndex;

  return (
    <LayoutWrapper className="bg-msn-bg text-msn-text font-sans p-0 m-0 max-w-full">
      <header className="bg-msn-card shadow-msn px-6 py-4 flex items-center justify-between border-b">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-msn-text">
            <MapPin className="h-4 w-4 text-msn-blue" />
            <h1 className="text-xl font-semibold text-msn-blue">{weatherData.location.name}</h1>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-msn-blue text-white rounded-md hover:bg-msn-blue/90 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Current Weather Hero */}
            <Card className="bg-msn-card shadow-msn p-6 flex items-center justify-between">
              <div>
                <h2 className="text-5xl font-bold">{Math.round(weatherData.current.temperature)}°F</h2>
                <p className="text-msn-text-secondary">{weatherData.current.weatherCode ? iconDescriptions[weatherData.current.weatherCode] : ''}</p>
                <p className="text-sm text-msn-text-muted">
                  High {Math.round(weatherData.daily.temperatureMax[0])}° • Low {Math.round(weatherData.daily.temperatureMin[0])}°
                </p>
              </div>
              <div className="w-20 h-20">
                {getWeatherIcon(weatherData.current.weatherCode, weatherData.current.isDay, 80)}
              </div>
            </Card>

            {/* Hourly Forecast */}
            <Card className="bg-msn-card shadow-msn p-6">
              <h3 className="text-lg font-semibold mb-4">Hourly Forecast</h3>
              <div className="flex overflow-x-auto gap-4 pb-2">
                {weatherData.hourly.time.slice(hourlyIndex, hourlyIndex + 24).map((time, i) => (
                  <div key={time} className="flex-shrink-0 w-20 text-center">
                    <p className="text-xs text-msn-text-secondary mb-2">
                      {format(parseISO(time), 'h a')}
                    </p>
                    <div className="mx-auto my-2 w-8 h-8">
                      {getWeatherIcon(weatherData.hourly.weatherCode[hourlyIndex + i], true, 32)}
                    </div>
                    <p className="font-medium text-sm">{Math.round(weatherData.hourly.temperature[hourlyIndex + i])}°</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* 10-Day Forecast */}
            <Card className="bg-msn-card shadow-msn p-6">
              <h3 className="text-lg font-semibold mb-4">10-Day Forecast</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {weatherData.daily.time.slice(0, 10).map((day, i) => {
                  const dayMin = Math.round(weatherData.daily.temperatureMin[i]);
                  const dayMax = Math.round(weatherData.daily.temperatureMax[i]);
                  
                  return (
                    <div key={day} className="bg-msn-bg/50 rounded-lg p-3 flex flex-col items-center text-center">
                      <p className="text-sm font-semibold text-msn-text-secondary">
                        {i === 0 ? "Today" : format(parseISO(day), 'EEE')}
                      </p>
                      <div className="w-10 h-10 my-2">
                         {getWeatherIcon(weatherData.daily.weatherCode[i], true, 40)}
                      </div>
                      <p className="text-sm font-bold">{dayMax}°</p>
                      <p className="text-sm text-msn-text-muted">{dayMin}°</p>
                    </div>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
             {/* Weather Alerts */}
            {weatherData.alerts && weatherData.alerts.length > 0 && (
              <Card className="bg-msn-card shadow-msn p-4">
                <h3 className="text-lg font-semibold mb-2 text-destructive">Weather Alerts</h3>
                <div className="space-y-2">
                  {weatherData.alerts.map((alert) => (
                    <Alert key={alert.id} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{alert.title}</strong> - {alert.description}
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </Card>
            )}

            <Card className="bg-msn-card shadow-msn p-6">
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <SunCard weather={weatherData} />
                    <UvCard weather={weatherData} />
                    <WindCard weather={weatherData} />
                    <HumidityCard weather={weatherData} hourlyIndex={hourlyIndex} />
                </div>
            </Card>

            <Card className="bg-msn-card shadow-msn p-6">
              <h3 className="text-lg font-semibold mb-4">Weather Radar</h3>
              <RadarMap />
            </Card>
          </div>
        </div>
      </main>
    </LayoutWrapper>
  );
}

const iconDescriptions: { [key: number]: string } = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
  45: 'Fog', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  56: 'Light Freezing Drizzle', 57: 'Heavy Freezing Drizzle', 61: 'Light Rain',
  63: 'Rain', 65: 'Heavy Rain', 66: 'Light Freezing Rain', 67: 'Heavy Freezing Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
  80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers', 85: 'Snow Showers', 86: 'Heavy Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Thunderstorm with Heavy Hail',
};
