
"use client";
import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle, CloudSun, CloudMoon } from 'lucide-react';

// Open-Meteo Weather Codes: https://open-meteo.com/en/docs
export function getWeatherIcon(code: number, isDay: boolean = true, size: number = 24) {
    const props = {
        width: size,
        height: size,
    }

  switch (code) {
    // Clear sky
    case 0:
      return isDay ? <Sun {...props} className="text-yellow-500" /> : <Moon {...props} className="text-slate-400" />;

    // Mainly clear, partly cloudy, overcast
    case 1:
    case 2:
    case 3:
        return isDay? <CloudSun {...props} className="text-gray-500" /> : <CloudMoon {...props} className="text-gray-400" />;

    // Fog and depositing rime fog
    case 45:
    case 48:
      return <CloudFog {...props} className="text-gray-400" />;

    // Drizzle
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return <CloudDrizzle {...props} className="text-blue-400" />;

    // Rain
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return <CloudRain {...props} className="text-blue-500" />;

    // Snow fall & Snow showers
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
        return <CloudSnow {...props} className="text-white" />;

    // Thunderstorm
    case 80:
    case 81:
    case 82:
    case 95:
    case 96:
    case 99:
      return <CloudLightning {...props} className="text-yellow-400" />;

    // Default fallback
    default:
      return <Cloud {...props} className="text-gray-400" />;
  }
}
