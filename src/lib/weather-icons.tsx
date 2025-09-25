
"use client";
import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudDrizzle, CloudSun, CloudMoon, Moon } from 'lucide-react';

const iconSize = "100%";

const ClearDayIcon = () => (
  <svg viewBox="0 0 64 64" width={iconSize} height={iconSize}>
    <defs>
      <filter id="blur" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="4" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.05" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <radialGradient id="sun-gradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FFD700" />
        <stop offset="100%" stopColor="#FFA500" />
      </radialGradient>
    </defs>
    <circle cx="32" cy="32" r="16" fill="url(#sun-gradient)" filter="url(#blur)" />
  </svg>
);

const ClearNightIcon = () => (
    <svg viewBox="0 0 64 64" width={iconSize} height={iconSize}>
        <defs>
            <filter id="moon-blur" width="200%" height="200%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                <feOffset dx="0" dy="2" result="offsetblur" />
                <feComponentTransfer>
                <feFuncA type="linear" slope="0.1" />
                </feComponentTransfer>
                <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        <path
        d="M46.6,34.5c-2.3-0.5-4.7-0.1-6.8,1.2c-2.1,1.2-3.8,3.1-5,5.2c-1.2,2.1-1.7,4.5-1.2,6.8s1.7,4.3,3.7,5.9 c2,1.6,4.5,2.4,7,2.4c0.5,0,1,0,1.5-0.1c-3.5-1.3-6.4-3.8-8.2-7.1c-1.8-3.3-2.4-7.2-1.6-11C37.3,34,41.4,32,46,32 c0.2,0,0.4,0,0.6,0C46.6,32.8,46.6,33.7,46.6,34.5z"
        fill="#E5E5E5"
        filter="url(#moon-blur)"
        />
    </svg>
);

const PartlyCloudyDayIcon = () => (
  <svg viewBox="0 0 64 64" width={iconSize} height={iconSize}>
    <defs>
      <filter id="blur" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="4" result="offsetblur" />
        <feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer>
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <linearGradient id="cloud-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#F2F2F2" />
        <stop offset="100%" stopColor="#E0E0E0" />
      </linearGradient>
    </defs>
    <circle cx="26" cy="26" r="12" fill="#FFD700" />
    <path d="M 23.529 46.125 C 20.391 46.125 17.656 44.594 15.938 42.438 C 14.219 40.281 13.781 37.656 14.75 35.156 C 11.813 34.594 9.5 32.156 9.5 29.031 C 9.5 25.438 12.438 22.5 16.031 22.5 L 43.125 22.5 C 46.438 22.5 49 25.063 49 28.375 C 49 31.688 46.438 34.25 43.125 34.25 L 25.844 34.25 C 24.375 34.25 23.25 35.375 23.25 36.844 C 23.25 38.313 24.375 39.438 25.844 39.438 L 35.906 39.438 C 36.531 39.438 37.031 39.938 37.031 40.563 C 37.031 41.188 36.531 41.688 35.906 41.688 L 23.529 41.688 Z" fill="url(#cloud-gradient)" filter="url(#blur)" transform="translate(5, -2) scale(1.1)" />
  </svg>
);

const PartlyCloudyNightIcon = () => (
  <svg viewBox="0 0 64 64" width={iconSize} height={iconSize}>
    <defs><filter id="blur" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" /><feOffset dx="0" dy="4" result="offsetblur" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
    <path d="M46.6,34.5c-2.3-0.5-4.7-0.1-6.8,1.2c-2.1,1.2-3.8,3.1-5,5.2c-1.2,2.1-1.7,4.5-1.2,6.8s1.7,4.3,3.7,5.9 c2,1.6,4.5,2.4,7,2.4c0.5,0,1,0,1.5-0.1c-3.5-1.3-6.4-3.8-8.2-7.1c-1.8-3.3-2.4-7.2-1.6-11C37.3,34,41.4,32,46,32 c0.2,0,0.4,0,0.6,0C46.6,32.8,46.6,33.7,46.6,34.5z" fill="#E5E5E5" transform="translate(-10, -8)" />
    <path d="M 23.529 46.125 C 20.391 46.125 17.656 44.594 15.938 42.438 C 14.219 40.281 13.781 37.656 14.75 35.156 C 11.813 34.594 9.5 32.156 9.5 29.031 C 9.5 25.438 12.438 22.5 16.031 22.5 L 43.125 22.5 C 46.438 22.5 49 25.063 49 28.375 C 49 31.688 46.438 34.25 43.125 34.25 L 25.844 34.25 C 24.375 34.25 23.25 35.375 23.25 36.844 C 23.25 38.313 24.375 39.438 25.844 39.438 L 35.906 39.438 C 36.531 39.438 37.031 39.938 37.031 40.563 C 37.031 41.188 36.531 41.688 35.906 41.688 L 23.529 41.688 Z" fill="#B0B0B0" filter="url(#blur)" transform="translate(5, 0) scale(1.2)" />
  </svg>
);


const CloudIcon = () => (
  <svg viewBox="0 0 64 64" width={iconSize} height={iconSize}>
    <defs><filter id="blur" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" /><feOffset dx="0" dy="4" result="offsetblur" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
    <path d="M 23.529 46.125 C 20.391 46.125 17.656 44.594 15.938 42.438 C 14.219 40.281 13.781 37.656 14.75 35.156 C 11.813 34.594 9.5 32.156 9.5 29.031 C 9.5 25.438 12.438 22.5 16.031 22.5 L 43.125 22.5 C 46.438 22.5 49 25.063 49 28.375 C 49 31.688 46.438 34.25 43.125 34.25 L 25.844 34.25 C 24.375 34.25 23.25 35.375 23.25 36.844 C 23.25 38.313 24.375 39.438 25.844 39.438 L 35.906 39.438 C 36.531 39.438 37.031 39.938 37.031 40.563 C 37.031 41.188 36.531 41.688 35.906 41.688 L 23.529 41.688 Z" fill="#B0B0B0" filter="url(#blur)" transform="translate(5, 5) scale(1.2)" />
  </svg>
);

const RainIcon = () => (
  <svg viewBox="0 0 64 64" width={iconSize} height={iconSize}>
    <defs><filter id="blur" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" /><feOffset dx="0" dy="4" result="offsetblur" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
    <path d="M 23.529 46.125 C 20.391 46.125 17.656 44.594 15.938 42.438 C 14.219 40.281 13.781 37.656 14.75 35.156 C 11.813 34.594 9.5 32.156 9.5 29.031 C 9.5 25.438 12.438 22.5 16.031 22.5 L 43.125 22.5 C 46.438 22.5 49 25.063 49 28.375 C 49 31.688 46.438 34.25 43.125 34.25" fill="#808080" transform="translate(5, -5) scale(1.2)" filter="url(#blur)" />
    <path d="M 24 40 L 22 48" stroke="#4682B4" strokeWidth="3" strokeLinecap="round" />
    <path d="M 32 42 L 30 50" stroke="#4682B4" strokeWidth="3" strokeLinecap="round" />
    <path d="M 40 40 L 38 48" stroke="#4682B4" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const SnowIcon = () => (
    <svg viewBox="0 0 64 64" width={iconSize} height={iconSize}>
        <defs><filter id="blur" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" /><feOffset dx="0" dy="4" result="offsetblur" /><feComponentTransfer><feFuncA type="linear" slope="0.05" /></feComponentTransfer><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
        <path d="M 23.529 46.125 C 20.391 46.125 17.656 44.594 15.938 42.438 C 14.219 40.281 13.781 37.656 14.75 35.156 C 11.813 34.594 9.5 32.156 9.5 29.031 C 9.5 25.438 12.438 22.5 16.031 22.5 L 43.125 22.5 C 46.438 22.5 49 25.063 49 28.375 C 49 31.688 46.438 34.25 43.125 34.25" fill="#B0B0B0" transform="translate(5, -5) scale(1.2)" filter="url(#blur)" />
        <g fill="none" stroke="#FFFFFF" strokeLinecap="round">
            <path d="M 23 43 L 29 49 M 29 43 L 23 49" strokeWidth="2.5" />
            <path d="M 26 42 V 50" strokeWidth="2.5" />
            <path d="M 35 46 L 41 52 M 41 46 L 35 52" strokeWidth="2.5" />
            <path d="M 38 45 V 53" strokeWidth="2.5" />
        </g>
    </svg>
);

const ThunderstormIcon = () => (
  <svg viewBox="0 0 64 64" width={iconSize} height={iconSize}>
    <path d="M 23.529 46.125 C 20.391 46.125 17.656 44.594 15.938 42.438 C 14.219 40.281 13.781 37.656 14.75 35.156 C 11.813 34.594 9.5 32.156 9.5 29.031 C 9.5 25.438 12.438 22.5 16.031 22.5 L 43.125 22.5 C 46.438 22.5 49 25.063 49 28.375 C 49 31.688 46.438 34.25 43.125 34.25" fill="#505050" transform="translate(5, -5) scale(1.2)" />
    <path d="M 32 42 L 28 48 L 34 48 L 30 54" stroke="#FFD700" fill="none" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

const FogIcon = () => (
    <svg viewBox="0 0 64 64" width={iconSize} height={iconSize}>
        <path d="M 23.529 46.125 C 20.391 46.125 17.656 44.594 15.938 42.438 C 14.219 40.281 13.781 37.656 14.75 35.156 C 11.813 34.594 9.5 32.156 9.5 29.031 C 9.5 25.438 12.438 22.5 16.031 22.5 L 43.125 22.5 C 46.438 22.5 49 25.063 49 28.375 C 49 31.688 46.438 34.25 43.125 34.25" fill="#B0B0B0" transform="translate(5, 0) scale(1.2)" />
        <g stroke="#D3D3D3" strokeWidth="3" strokeLinecap="round">
            <path d="M 12 42 H 52" />
            <path d="M 16 48 H 48" />
        </g>
    </svg>
);

// Open-Meteo Weather Codes: https://open-meteo.com/en/docs
export function getWeatherIcon(code: number, isDay: boolean = true) {
  switch (code) {
    case 0: return isDay ? <ClearDayIcon /> : <ClearNightIcon />;
    case 1:
    case 2:
    case 3:
      return isDay ? <PartlyCloudyDayIcon /> : <PartlyCloudyNightIcon />;
    case 45:
    case 48:
      return <FogIcon />;
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return <RainIcon />; // Using Rain for Drizzle
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return <RainIcon />;
    case 71:
    case 73:
    case 75:
    case 77:
    case 85:
    case 86:
        return <SnowIcon />;
    case 95:
    case 96:
    case 99:
      return <ThunderstormIcon />;
    default:
      return <CloudIcon />;
  }
}
