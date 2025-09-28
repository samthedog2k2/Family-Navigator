
"use client";

import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudDrizzle, CloudLightning, CloudFog, CloudSun, Moon, CloudMoon } from 'lucide-react';

export function getWeatherIcon(code: number, isDay: boolean = true, size: number = 24) {
    const altText = iconDescriptions[code] || 'Weather';
    const props = { size, "aria-label": altText, strokeWidth: 1.5 };

    switch (code) {
        // Clear sky
        case 0:
            return isDay ? <Sun {...props} className="text-yellow-500 fill-yellow-400" /> : <Moon {...props} className="text-slate-400 fill-slate-500" />;

        // Mainly clear, partly cloudy
        case 1:
        case 2:
            return isDay ? <CloudSun {...props} className="text-slate-400" /> : <CloudMoon {...props} className="text-slate-400" />;
        
        // Overcast
        case 3:
            return <Cloud {...props} className="text-slate-400" />;

        // Fog
        case 45:
        case 48:
            return <CloudFog {...props} className="text-slate-400" />;

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
        case 80:
        case 81:
        case 82:
            return <CloudRain {...props} className="text-blue-500" />;

        // Snow fall
        case 71:
        case 73:
        case 75:
        case 77:
        case 85:
        case 86:
            return <CloudSnow {...props} className="text-blue-300" />;

        // Thunderstorm
        case 95:
        case 96:
        case 99:
            return <CloudLightning {...props} className="text-yellow-500" />;

        // Default fallback
        default:
            return <Cloud {...props} className="text-slate-400" />;
    }
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
