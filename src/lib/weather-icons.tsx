
"use client";

// High-fidelity SVG icons inspired by MSN Weather
// Each icon is a self-contained React component for clarity and performance.

import React from 'react';

const iconDescriptions: { [key: number]: string } = {
  0: 'Clear', 1: 'Mostly Clear', 2: 'Partly Cloudy', 3: 'Cloudy',
  45: 'Fog', 48: 'Rime Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Heavy Drizzle',
  56: 'Light Freezing Drizzle', 57: 'Heavy Freezing Drizzle', 61: 'Light Rain',
  63: 'Rain', 65: 'Heavy Rain', 66: 'Light Freezing Rain', 67: 'Heavy Freezing Rain',
  71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 77: 'Snow Grains',
  80: 'Light Showers', 81: 'Showers', 82: 'Heavy Showers', 85: 'Snow Showers', 86: 'Heavy Snow Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm with Hail', 99: 'Thunderstorm with Heavy Hail',
};

const ClearDayIcon = ({ size }: { size: number }) => (
  <svg viewBox="0 0 64 64" width={size} height={size}><defs><filter id="blur" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur><feOffset dy="4" dx="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.5"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><style>{`.sun{fill:#F1D363}.light-sun{fill:#F3D874}`}</style></defs><g filter="url(#blur)" id="day-clear"><g transform="translate(20 20)"><g id="sun"><path d="M22.5 15.5a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v4a.5.5 0 01-.5.5z" className="sun"></path><path d="M11.5 26.5a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v4a.5.5 0 01-.5.5z" className="sun"></path><path d="M17.16 22.84a.48.48 0 01-.35-.15l-2.83-2.83a.5.5 0 01.71-.71l2.83 2.83a.5.5 0 01-.36.86z" className="sun"></path><path d="M6.84 12.16a.48.48 0 01-.35-.15.5.5 0 010-.71l2.83-2.83a.5.5 0 01.71.71L7.19 12a.48.48 0 01-.35.16z" className="sun"></path><path d="M22.34 12.16a.48.48 0 01-.35-.86l2.83-2.83a.5.5 0 01.71.71l-2.83 2.83a.48.48 0 01-.36.15z" className="sun"></path><path d="M10 6.5a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v4a.5.5 0 01-.5.5z" className="sun"></path><path d="M6.84 22.84a.48.48 0 01-.35-.15l-2.83-2.83a.5.5 0 01.71-.71l2.83 2.83a.5.5 0 01-.36.86z" className="sun"></path><path d="M25.5 16.5h-4a.5.5 0 010-1h4a.5.5 0 010 1z" className="sun"></path><path d="M12.5 16.5h-4a.5.5 0 010-1h4a.5.5 0 010 1z" className="sun"></path><circle cx="16" cy="16" r="7.5" className="light-sun"></circle></g></g></g></svg>
);
const ClearNightIcon = ({ size }: { size: number }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}><defs><filter id="blur-night" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur><feOffset dy="4" dx="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.5"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><style>{`.moon{fill:#D6D6D6}`}</style></defs><g filter="url(#blur-night)"><g transform="translate(20 20)"><path d="M25.61 24.2a10 10 0 01-12-15.47A12 12 0 0019 31a11.91 11.91 0 006.66-2.14 10 10 0 01-.05-4.66z" className="moon"></path></g></g></svg>
);
const PartlyCloudyDayIcon = ({ size }: { size: number }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}><defs><filter id="blur-day-cloud" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur><feOffset dy="4" dx="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.5"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><style>{`.sun{fill:#F1D363}.light-sun{fill:#F3D874}.cloud{fill:#D6D6D6}`}</style></defs><g filter="url(#blur-day-cloud)" id="day-cloudy"><g transform="translate(19 18)"><path transform="translate(-15 -15)" d="M25.5 15.5a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v4a.5.5 0 01-.5.5z" className="sun"></path><path transform="translate(-15 -15)" d="M17.16 22.84a.48.48 0 01-.35-.15l-2.83-2.83a.5.5 0 01.71-.71l2.83 2.83a.5.5 0 01-.36.86z" className="sun"></path><path transform="translate(-15 -15)" d="M6.84 12.16a.48.48 0 01-.35-.15.5.5 0 010-.71l2.83-2.83a.5.5 0 01.71.71L7.19 12a.48.48 0 01-.35.16z" className="sun"></path><path transform="translate(-15 -15)" d="M22.34 12.16a.48.48 0 01-.35-.86l2.83-2.83a.5.5 0 01.71.71l-2.83 2.83a.48.48 0 01-.36.15z" className="sun"></path><path transform="translate(-15 -15)" d="M10 6.5a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v4a.5.5 0 01-.5.5z" className="sun"></path><circle cx="16" cy="16" r="7.5" transform="translate(-15 -15)" className="light-sun"></circle><path d="M31.25 18A5.75 5.75 0 0025.5 12.25H25a8 8 0 00-7.3-8A8.18 8.18 0 0011 7.4a10.43 10.43 0 00-10 10.39A10.32 10.32 0 0011.53 28H31.25A5.75 5.75 0 0031.25 18z" className="cloud"></path></g></g></svg>
);
const CloudyIcon = ({ size }: { size: number }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}><defs><filter id="blur-cloud" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur><feOffset dy="4" dx="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.5"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><style>{`.cloud{fill:#D6D6D6}.dark-cloud{fill:#C4C4C4}`}</style></defs><g filter="url(#blur-cloud)" transform="translate(15 15)"><path d="M25.5 12.25H25a8 8 0 00-7.3-8A8.18 8.18 0 0011 7.4a10.43 10.43 0 00-10 10.39A10.32 10.32 0 0011.53 28H25.5a5.75 5.75 0 000-11.5z" className="cloud"></path><path d="M28.12 18.75A5.75 5.75 0 0022.37 13H22a8 8 0 00-7.3-8 8.18 8.18 0 00-6.68 3.2 10.43 10.43 0 00-10 10.39A10.32 10.32 0 008.55 28.8h19.57a5.75 5.75 0 00-.01-10.05z" className="dark-cloud" opacity="0.5"></path></g></svg>
);
const RainIcon = ({ size }: { size: number }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}><defs><filter id="blur-rain" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur><feOffset dy="4" dx="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.5"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><style>{`.cloud{fill:#C4C4C4}.rain{fill:#74B9EF}`}</style></defs><g filter="url(#blur-rain)" transform="translate(15 15)"><path d="M25.5 12.25H25a8 8 0 00-7.3-8A8.18 8.18 0 0011 7.4a10.43 10.43 0 00-10 10.39A10.32 10.32 0 0011.53 28H25.5a5.75 5.75 0 000-11.5z" className="cloud"></path><path d="M12 30.5a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v4a.5.5 0 01-.5.5z" className="rain"></path><path d="M16 30.5a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v4a.5.5 0 01-.5.5z" className="rain"></path><path d="M20 30.5a.5.5 0 01-.5-.5v-4a.5.5 0 011 0v4a.5.5 0 01-.5.5z" className="rain"></path></g></svg>
);
const SnowIcon = ({ size }: { size: number }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}><defs><filter id="blur-snow" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur><feOffset dy="4" dx="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.5"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><style>{`.cloud{fill:#C4C4C4}.snow{fill:#FFFFFF}`}</style></defs><g filter="url(#blur-snow)" transform="translate(15 15)"><path d="M25.5 12.25H25a8 8 0 00-7.3-8A8.18 8.18 0 0011 7.4a10.43 10.43 0 00-10 10.39A10.32 10.32 0 0011.53 28H25.5a5.75 5.75 0 000-11.5z" className="cloud"></path><g className="snow"><path d="M12.71 27.29a1 1 0 01-.71-.29 1 1 0 010-1.42l4-4a1 1 0 011.42 1.42l-4 4a1 1 0 01-.71.29z"></path><path d="M16.71 27.29a1 1 0 01-.71-.29l-4-4a1 1 0 011.42-1.42l4 4a1 1 0 01-.71 1.71z"></path></g><g className="snow" transform="translate(6 6)"><path d="M12.71 27.29a1 1 0 01-.71-.29 1 1 0 010-1.42l4-4a1 1 0 011.42 1.42l-4 4a1 1 0 01-.71.29z"></path><path d="M16.71 27.29a1 1 0 01-.71-.29l-4-4a1 1 0 011.42-1.42l4 4a1 1 0 01-.71 1.71z"></path></g></g></svg>
);
const ThunderstormIcon = ({ size }: { size: number }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}><defs><filter id="blur-thunder" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur><feOffset dy="4" dx="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.5"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><style>{`.dark-cloud{fill:#A9A9A9}.lightning{fill:#F3D874}`}</style></defs><g filter="url(#blur-thunder)" transform="translate(15 15)"><path d="M25.5 12.25H25a8 8 0 00-7.3-8A8.18 8.18 0 0011 7.4a10.43 10.43 0 00-10 10.39A10.32 10.32 0 0011.53 28H25.5a5.75 5.75 0 000-11.5z" className="dark-cloud"></path><path d="M19.5 25.5l-6 7h4l-2 7 9-11h-5z" className="lightning"></path></g></svg>
);
const FogIcon = ({ size }: { size: number }) => (
    <svg viewBox="0 0 64 64" width={size} height={size}><defs><filter id="blur-fog" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3"></feGaussianBlur><feOffset dy="4" dx="0"></feOffset><feComponentTransfer><feFuncA type="linear" slope="0.5"></feFuncA></feComponentTransfer><feMerge><feMergeNode></feMergeNode><feMergeNode in="SourceGraphic"></feMergeNode></feMerge></filter><style>{`.cloud{fill:#C4C4C4}.fog{fill:#B0B0B0}`}</style></defs><g filter="url(#blur-fog)" transform="translate(15 15)"><path d="M25.5 12.25H25a8 8 0 00-7.3-8A8.18 8.18 0 0011 7.4a10.43 10.43 0 00-10 10.39A10.32 10.32 0 0011.53 28H25.5a5.75 5.75 0 000-11.5z" className="cloud"></path><path d="M8.5 28.5h15a.5.5 0 010 1h-15a.5.5 0 010-1z" className="fog"></path><path d="M10.5 31.5h11a.5.5 0 010 1h-11a.5.5 0 010-1z" className="fog"></path></g></svg>
);


export function getWeatherIcon(code: number, isDay: boolean = true, size: number = 24) {
  const altText = iconDescriptions[code] || 'Weather';
  let IconComponent;
  switch (code) {
    case 0: IconComponent = isDay ? ClearDayIcon : ClearNightIcon; break;
    case 1:
    case 2: IconComponent = PartlyCloudyDayIcon; break; // Simplified to one partly cloudy icon
    case 3: IconComponent = CloudyIcon; break;
    case 45: case 48: IconComponent = FogIcon; break;
    case 51: case 53: case 55: case 56: case 57: IconComponent = RainIcon; break; // Drizzle grouped with rain
    case 61: case 63: case 65: case 66: case 67: IconComponent = RainIcon; break;
    case 71: case 73: case 75: case 77: IconComponent = SnowIcon; break;
    case 80: case 81: case 82: IconComponent = RainIcon; break; // Showers grouped with rain
    case 85: case 86: IconComponent = SnowIcon; break; // Snow showers grouped with snow
    case 95: case 96: case 99: IconComponent = ThunderstormIcon; break;
    default: IconComponent = CloudyIcon; break;
  }
  return <IconComponent size={size} />;
}

    