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

// Open-Meteo Weather Codes: https://open-meteo.com/en/docs
export function getWeatherIcon(code: number, isDay: boolean = true) {
  switch (code) {
    // Clear sky
    case 0:
      return isDay ? <Sun className="w-6 h-6 text-yellow-500" /> : <CloudMoon className="w-6 h-6" />;

    // Mainly clear, partly cloudy, overcast
    case 1:
    case 2:
    case 3:
        return isDay? <CloudSun className="w-6 h-6" /> : <Cloud className="w-6 h-6" />;

    // Fog and depositing rime fog
    case 45:
    case 48:
      return <CloudFog className="w-6 h-6" />;

    // Drizzle
    case 51:
    case 53:
    case 55:
    case 56:
    case 57:
      return <CloudDrizzle className="w-6 h-6" />;

    // Rain
    case 61:
    case 63:
    case 65:
    case 66:
    case 67:
      return <CloudRain className="w-6 h-6" />;

    // Snow fall
    case 71:
    case 73:
    case 75:
    case 77:
      return <CloudSnow className="w-6 h-6" />;
    
    // Snow showers
    case 85:
    case 86:
        return <CloudSnow className="w-6 h-6" />;

    // Thunderstorm
    case 80:
    case 81:
    case 82:
    case 95:
    case 96:
    case 99:
      return <CloudLightning className="w-6 h-6" />;

    // Default fallback
    default:
      return <Cloud className="w-6 h-6" />;
  }
}
