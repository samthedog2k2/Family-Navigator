
export function degreesToCompass(deg: number) {
  const val = Math.floor((deg / 22.5) + 0.5);
  const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return arr[(val % 16)];
}

export function getUVIndexInfo(uvIndex: number): { level: string, color: string } {
    if (uvIndex <= 2) return { level: 'Low', color: '#5cb85c' };
    if (uvIndex <= 5) return { level: 'Moderate', color: '#f0ad4e' };
    if (uvIndex <= 7) return { level: 'High', color: '#d9534f' };
    if (uvIndex <= 10) return { level: 'Very High', color: '#d9534f' };
    return { level: 'Extreme', color: '#d9534f' };
}

    