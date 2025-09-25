
"use client";
import React from 'react';
import { Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain, CloudSnow, CloudLightning, CloudFog } from 'lucide-react';

const ClearDayIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <g>
      <circle cx="32" cy="32" r="14" fill="#facc15" />
      <path d="M32 0a2 2 0 0 1 2 2v6a2 2 0 1 1-4 0V2a2 2 0 0 1 2-2zm0 54a2 2 0 0 1 2 2v6a2 2 0 1 1-4 0v-6a2 2 0 0 1 2-2zm22-22a2 2 0 0 1 2 2h6a2 2 0 1 1 0 4h-6a2 2 0 0 1-2-2zm-54 0a2 2 0 0 1 2 2h6a2 2 0 1 1 0 4H4a2 2 0 0 1-2-2zM13.8 11.7a2 2 0 0 1 2.8 0l4.2 4.3a2 2 0 0 1-2.8 2.8l-4.2-4.3a2 2 0 0 1 0-2.8zm33.9 33.9a2 2 0 0 1 2.8 0l4.2 4.3a2 2 0 0 1-2.8 2.8l-4.2-4.3a2 2 0 0 1 0-2.8zM11.7 47.9a2 2 0 0 1 0 2.8l-4.2 4.3a2 2 0 1 1-2.8-2.8l4.2-4.3a2 2 0 0 1 2.8 0zm36.1-33.4a2 2 0 0 1 0 2.8l-4.2 4.3a2 2 0 0 1-2.8-2.8l4.2-4.3a2 2 0 0 1 2.8 0z" fill="#facc15" opacity="0.5" />
    </g>
  </svg>
);

const ClearNightIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M43.6,18.3C40,17.2,36,18.8,34.4,22.2c-1.6,3.4,0,7.4,3.4,9.1c3.4,1.6,7.4,0,9.1-3.4C48.4,24.5,47,20,43.6,18.3z" fill="#fde047"/>
  </svg>
);

const PartlyCloudyDayIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <g>
      <circle cx="26" cy="26" r="12" fill="#facc15" />
      <path d="M46.6,33.4c-0.2,0-0.4,0-0.6,0c-1.5-6.5-7.7-11.2-14.8-11.2c-4,0-7.6,1.6-10.4,4.2c-2.3-2.1-5.3-3.3-8.6-3.3c-6.6,0-12,5.4-12,12c0,0.3,0,0.6,0.1,0.9C6.4,36.5,4,40,4,44.2c0,5.4,4.4,9.8,9.8,9.8h28.4c4.9,0,8.8-4,8.8-8.8C51,40,49.1,36.2,46.6,33.4z" fill="#e2e8f0"/>
    </g>
  </svg>
);

const PartlyCloudyNightIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <g>
      <path d="M38.6,22.3c-3.6-1.1-7.5,0.5-9.1,3.9s0,7.4,3.4,9.1s7.4,0,9.1-3.4S42,23.5,38.6,22.3z" fill="#fde047"/>
      <path d="M46.5,34.5c-0.2,0-0.4,0-0.6,0c-1.5-6.5-7.7-11.2-14.8-11.2c-4,0-7.6,1.6-10.4,4.2c-2.3-2.1-5.3-3.3-8.6-3.3c-6.6,0-12,5.4-12,12c0,0.3,0,0.6,0.1,0.9C6.3,37.6,4,41,4,45.2c0,5.4,4.4,9.8,9.8,9.8h28.4c4.9,0,8.8-4,8.8-8.8C51,41,49.1,37.2,46.5,34.5z" fill="#94a3b8"/>
    </g>
  </svg>
);

const CloudyIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <path d="M46.5,34.5c-0.2,0-0.4,0-0.6,0c-1.5-6.5-7.7-11.2-14.8-11.2c-4,0-7.6,1.6-10.4,4.2c-2.3-2.1-5.3-3.3-8.6-3.3c-6.6,0-12,5.4-12,12c0,0.3,0,0.6,0.1,0.9C6.3,37.6,4,41,4,45.2c0,5.4,4.4,9.8,9.8,9.8h28.4c4.9,0,8.8-4,8.8-8.8C51,41,49.1,37.2,46.5,34.5z" fill="#94a3b8"/>
  </svg>
);

const RainIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <g>
      <path d="M46.5,34.5c-0.2,0-0.4,0-0.6,0c-1.5-6.5-7.7-11.2-14.8-11.2c-4,0-7.6,1.6-10.4,4.2c-2.3-2.1-5.3-3.3-8.6-3.3c-6.6,0-12,5.4-12,12c0,0.3,0,0.6,0.1,0.9C6.3,37.6,4,41,4,45.2c0,5.4,4.4,9.8,9.8,9.8h28.4c4.9,0,8.8-4,8.8-8.8C51,41,49.1,37.2,46.5,34.5z" fill="#94a3b8"/>
      <path d="M24,52c-1.1,0-2-0.9-2-2s2-4,2-4s2,2.9,2,4S25.1,52,24,52z" fill="#60a5fa"/>
      <path d="M32,58c-1.1,0-2-0.9-2-2s2-4,2-4s2,2.9,2,4S33.1,58,32,58z" fill="#60a5fa"/>
      <path d="M40,52c-1.1,0-2-0.9-2-2s2-4,2-4s2,2.9,2,4S41.1,52,40,52z" fill="#60a5fa"/>
    </g>
  </svg>
);

const ShowersIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <g>
      <circle cx="26" cy="26" r="12" fill="#facc15" />
      <path d="M46.5,34.5c-0.2,0-0.4,0-0.6,0c-1.5-6.5-7.7-11.2-14.8-11.2c-4,0-7.6,1.6-10.4,4.2c-2.3-2.1-5.3-3.3-8.6-3.3c-6.6,0-12,5.4-12,12c0,0.3,0,0.6,0.1,0.9C6.3,37.6,4,41,4,45.2c0,5.4,4.4,9.8,9.8,9.8h28.4c4.9,0,8.8-4,8.8-8.8C51,41,49.1,37.2,46.5,34.5z" fill="#e2e8f0"/>
      <path d="M24,52c-1.1,0-2-0.9-2-2s2-4,2-4s2,2.9,2,4S25.1,52,24,52z" fill="#60a5fa"/>
      <path d="M32,58c-1.1,0-2-0.9-2-2s2-4,2-4s2,2.9,2,4S33.1,58,32,58z" fill="#60a5fa"/>
    </g>
  </svg>
);


const SnowIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <g>
      <path d="M46.5,34.5c-0.2,0-0.4,0-0.6,0c-1.5-6.5-7.7-11.2-14.8-11.2c-4,0-7.6,1.6-10.4,4.2c-2.3-2.1-5.3-3.3-8.6-3.3c-6.6,0-12,5.4-12,12c0,0.3,0,0.6,0.1,0.9C6.3,37.6,4,41,4,45.2c0,5.4,4.4,9.8,9.8,9.8h28.4c4.9,0,8.8-4,8.8-8.8C51,41,49.1,37.2,46.5,34.5z" fill="#94a3b8"/>
      <path d="M24,55l-2-1.5l-2,1.5l1-2.5l-2-1.5h2.5l1-2.5l1,2.5h2.5l-2,1.5L24,55z" fill="#dbeafe"/>
      <path d="M36,55l-2-1.5l-2,1.5l1-2.5l-2-1.5h2.5l1-2.5l1,2.5h2.5l-2,1.5L36,55z" fill="#dbeafe"/>
      <path d="M30,62l-2-1.5l-2,1.5l1-2.5l-2-1.5h2.5l1-2.5l1,2.5h2.5l-2,1.5L30,62z" fill="#dbeafe"/>
    </g>
  </svg>
);

const ThunderstormIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}>
    <g>
      <path d="M46.5,34.5c-0.2,0-0.4,0-0.6,0c-1.5-6.5-7.7-11.2-14.8-11.2c-4,0-7.6,1.6-10.4,4.2c-2.3-2.1-5.3-3.3-8.6-3.3c-6.6,0-12,5.4-12,12c0,0.3,0,0.6,0.1,0.9C6.3,37.6,4,41,4,45.2c0,5.4,4.4,9.8,9.8,9.8h28.4c4.9,0,8.8-4,8.8-8.8C51,41,49.1,37.2,46.5,34.5z" fill="#475569"/>
      <path d="M33,46l-6,8h4l-2,8l8-10h-6L33,46z" fill="#facc15"/>
    </g>
  </svg>
);

const FogIcon = ({ size }: { size: number }) => <CloudFog width={size} height={size} className="text-slate-400" />;

// Open-Meteo Weather Codes: https://open-meteo.com/en/docs
export function getWeatherIcon(code: number, isDay: boolean = true, size: number = 24) {
    switch (code) {
      case 0:
        return isDay ? <ClearDayIcon size={size} /> : <ClearNightIcon size={size} />;
      case 1:
      case 2:
        return isDay ? <PartlyCloudyDayIcon size={size} /> : <PartlyCloudyNightIcon size={size} />;
      case 3:
        return <CloudyIcon size={size} />;
      case 45:
      case 48:
        return <FogIcon size={size} />;
      case 51: // Drizzle
      case 53:
      case 55:
      case 56:
      case 57:
        return <RainIcon size={size} />; // Simple rain icon for drizzle
      case 61: // Rain
      case 63:
      case 65:
      case 66:
      case 67:
        return <RainIcon size={size} />;
      case 80: // Showers
      case 81:
      case 82:
        return <ShowersIcon size={size} />;
      case 71: // Snow
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return <SnowIcon size={size} />;
      case 95: // Thunderstorm
      case 96:
      case 99:
        return <ThunderstormIcon size={size} />;
      default:
        return <CloudyIcon size={size} />;
    }
}
