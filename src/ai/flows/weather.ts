'use server';

/**
 * @fileOverview A flow for fetching weather forecasts.
 *
 * - getWeatherForecast - Fetches the weather forecast for a given location.
 * - WeatherInput - The input type for the getWeatherForecast function.
 * - WeatherOutput - The return type for the getWeatherForecast function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const WeatherInputSchema = z.object({
  latitude: z.number().describe('The latitude for the weather forecast.'),
  longitude: z.number().describe('The longitude for the weather forecast.'),
});
export type WeatherInput = z.infer<typeof WeatherInputSchema>;

const DailyForecastSchema = z.object({
  day: z.string().describe('The day of the week.'),
  temp: z.number().describe('The temperature in Fahrenheit.'),
  conditions: z.string().describe('A brief description of the weather conditions.'),
  icon: z.enum(['sun', 'cloud', 'rain', 'snow', 'wind', 'thunderstorm']).describe('An icon representing the weather conditions.'),
});

const WeatherOutputSchema = z.object({
  locationName: z.string().describe('The name of the location.'),
  currentTemp: z.number().describe('The current temperature in Fahrenheit.'),
  currentConditions: z.string().describe('A brief description of the current weather conditions.'),
  currentIcon: z.enum(['sun', 'cloud', 'rain', 'snow', 'wind', 'thunderstorm']).describe('An icon representing the current weather conditions.'),
  windSpeed: z.number().describe('The current wind speed in mph.'),
  windDirection: z.number().describe('The current wind direction in degrees.'),
  forecast: z.array(DailyForecastSchema).describe('The 5-day weather forecast.'),
});
export type WeatherOutput = z.infer<typeof WeatherOutputSchema>;

type WeatherCode = 0 | 1 | 2 | 3 | 45 | 48 | 51 | 53 | 55 | 61 | 63 | 65 | 71 | 73 | 75 | 80 | 81 | 82 | 85 | 86 | 95;

const weatherCodeMap: Record<WeatherCode, { description: string, icon: 'sun' | 'cloud' | 'rain' | 'snow' | 'thunderstorm' }> = {
    0: { description: "Clear sky", icon: 'sun' },
    1: { description: "Mainly clear", icon: 'sun' },
    2: { description: "Partly cloudy", icon: 'cloud' },
    3: { description: "Overcast", icon: 'cloud' },
    45: { description: "Fog", icon: 'cloud' },
    48: { description: "Depositing rime fog", icon: 'cloud' },
    51: { description: "Light drizzle", icon: 'rain' },
    53: { description: "Moderate drizzle", icon: 'rain' },
    55: { description: "Dense drizzle", icon: 'rain' },
    61: { description: "Slight rain", icon: 'rain' },
    63: { description: "Moderate rain", icon: 'rain' },
    65: { description: "Heavy rain", icon: 'rain' },
    71: { description: "Slight snow fall", icon: 'snow' },
    73: { description: "Moderate snow fall", icon: 'snow' },
    75: { description: "Heavy snow fall", icon: 'snow' },
    80: { description: "Slight rain showers", icon: 'rain' },
    81: { description: "Moderate rain showers", icon: 'rain' },
    82: { description: "Violent rain showers", icon: 'rain' },
    85: { description: "Slight snow showers", icon: 'snow' },
    86: { description: "Heavy snow showers", icon: 'snow' },
    95: { description: "Thunderstorm", icon: 'thunderstorm' },
};

function getWeatherInfo(code: WeatherCode) {
    return weatherCodeMap[code] || { description: "Unknown", icon: 'cloud' };
}


const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherOutputSchema,
  },
  async ({ latitude, longitude }) => {
    
    // Fetch location name
    let locationName = "Unknown Location";
    try {
        const locationResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        if (locationResponse.ok) {
            const locationData = await locationResponse.json();
            locationName = locationData.city || locationData.principalSubdivision || "Unknown Location";
        }
    } catch (err) {
        console.error("Could not fetch location name", err);
    }
    
    // Fetch weather data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max&temperature_unit=fahrenheit&windspeed_unit=mph&timeformat=unixtime&timezone=auto&forecast_days=6`;

    const weatherResponse = await fetch(weatherUrl);
    if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data from Open-Meteo.");
    }
    const weatherData = await weatherResponse.json();
    
    const { current_weather, daily } = weatherData;
    const currentInfo = getWeatherInfo(current_weather.weathercode as WeatherCode);

    const forecast = daily.time.slice(1).map((time: number, index: number) => {
        const date = new Date(time * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        const forecastInfo = getWeatherInfo(daily.weathercode[index + 1] as WeatherCode);

        return {
            day: day,
            temp: Math.round(daily.temperature_2m_max[index + 1]),
            conditions: forecastInfo.description,
            icon: forecastInfo.icon,
        };
    });

    return {
        locationName,
        currentTemp: Math.round(current_weather.temperature),
        currentConditions: currentInfo.description,
        currentIcon: currentInfo.icon,
        windSpeed: Math.round(current_weather.windspeed),
        windDirection: current_weather.winddirection,
        forecast,
    };
  }
);


export async function getWeatherForecast(input: WeatherInput): Promise<WeatherOutput> {
  return getWeatherForecastFlow(input);
}
