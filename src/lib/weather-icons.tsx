
"use client";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  CloudSun,
  CloudMoon,
} from "lucide-react";
import { cn } from "./utils";

// Open-Meteo Weather Codes: https://open-meteo.com/en/docs
export function getWeatherIcon(code: number, isDay: boolean = true, size: number = 24) {
  const props = {
    width: size,
    height: size,
    className: "text-muted-foreground",
  }
  switch (code) {
    // Clear sky
    case 0:
      return isDay ? <Sun {...props} className="text-yellow-500" /> : <CloudMoon {...props} />;

    // Mainly clear, partly cloudy, overcast
    case 1:
    case 2:
    case 3:
        return isDay? <CloudSun {...props} className={cn("text-gray-400", props.className)} /> : <CloudMoon {...props} />;

    // Fog and depositing rime fog
    case 45:
    case 48:
      return <CloudFog {...props} />;

    // Drizzle
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return <CloudDrizzle {...props} />;

    // Rain
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return <CloudRain {...props} />;

    // Snow fall & Snow grains
    case 71:
    case 73:
    case 75:
    case 77:
      return <CloudSnow {...props} />;
    
    // Rain showers
    case 80:
    case 81:
    case 82:
        return <CloudRain {...props}/>
        
    // Snow showers
    case 85:
    case 86:
        return <CloudSnow {...props} />;

    // Thunderstorm
    case 95:
    case 96:
    case 99:
      return <CloudLightning {...props} />;

    // Default fallback
    default:
      return <Cloud {...props} />;
  }
}
