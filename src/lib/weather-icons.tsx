
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  CloudHail,
  CloudSun,
  CloudMoon,
} from "lucide-react";
import React from "react";

// Open-Meteo Weather Codes: https://open-meteo.com/en/docs
export function getWeatherIcon(code: number, isDay: boolean = true, size: number = 24) {
    const iconProps = {
        width: size,
        height: size,
        className: isDay ? "text-yellow-500" : "text-gray-300"
    };
    const dayCloudProps = {
        width: size,
        height: size,
        className: "text-gray-500"
    };
     const nightCloudProps = {
        width: size,
        height: size,
        className: "text-gray-400"
    };

  switch (code) {
    // Clear sky
    case 0:
      return isDay ? React.createElement(Sun, iconProps) : React.createElement(Moon, nightCloudProps);

    // Mainly clear, partly cloudy, overcast
    case 1:
    case 2:
    case 3:
        return isDay? React.createElement(CloudSun, dayCloudProps) : React.createElement(CloudMoon, nightCloudProps);

    // Fog and depositing rime fog
    case 45:
    case 48:
      return React.createElement(CloudFog, dayCloudProps);

    // Drizzle
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return React.createElement(CloudDrizzle, dayCloudProps);

    // Rain
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return React.createElement(CloudRain, dayCloudProps);

    // Snow fall
    case 71:
    case 73:
    case 75:
    case 77:
      return React.createElement(CloudSnow, dayCloudProps);
    
    // Snow showers
    case 85:
    case 86:
        return React.createElement(CloudSnow, dayCloudProps);

    // Thunderstorm
    case 80:
    case 81:
    case 82:
    case 95:
    case 96:
    case 99:
      return React.createElement(CloudLightning, dayCloudProps);

    // Default fallback
    default:
      return React.createElement(Cloud, dayCloudProps);
  }
}

    