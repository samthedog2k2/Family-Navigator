
export function degreesToCompass(deg: number) {
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}

export function getAqiInfo(aqi: number): { level: string, message: string, color: string } {
    if (aqi <= 50) return { level: 'Good', message: 'Air quality is satisfactory.', color: 'text-green-400' };
    if (aqi <= 100) return { level: 'Moderate', message: 'Some pollutants may be a concern.', color: 'text-yellow-400' };
    if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', message: 'Members of sensitive groups may experience health effects.', color: 'text-orange-400' };
    if (aqi <= 200) return { level: 'Unhealthy', message: 'Everyone may begin to experience health effects.', color: 'text-red-500' };
    if (aqi <= 300) return { level: 'Very Unhealthy', message: 'Health alert: everyone may experience more serious health effects.', color: 'text-purple-500' };
    return { level: 'Hazardous', message: 'Health warnings of emergency conditions.', color: 'text-maroon-500' };
}

export function getUVIndexInfo(uvIndex: number): { level: string, color: string } {
    if (uvIndex <= 2) return { level: 'Low', color: 'bg-green-500' };
    if (uvIndex <= 5) return { level: 'Moderate', color: 'bg-yellow-500' };
    if (uvIndex <= 7) return { level: 'High', color: 'bg-orange-500' };
    if (uvIndex <= 10) return { level: 'Very High', color: 'bg-red-500' };
    return { level: 'Extreme', color: 'bg-purple-500' };
}

    