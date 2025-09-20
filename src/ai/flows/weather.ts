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
  location: z.string().describe('The city or zip code for the weather forecast.'),
});
export type WeatherInput = z.infer<typeof WeatherInputSchema>;

const DailyForecastSchema = z.object({
  day: z.string().describe('The day of the week.'),
  temp: z.number().describe('The temperature in Fahrenheit.'),
  conditions: z.string().describe('A brief description of the weather conditions.'),
  icon: z.enum(['sun', 'cloud', 'rain', 'snow', 'wind', 'thunderstorm']).describe('An icon representing the weather conditions.'),
});

const WeatherOutputSchema = z.object({
  currentTemp: z.number().describe('The current temperature in Fahrenheit.'),
  currentConditions: z.string().describe('A brief description of the current weather conditions.'),
  currentIcon: z.enum(['sun', 'cloud', 'rain', 'snow', 'wind', 'thunderstorm']).describe('An icon representing the current weather conditions.'),
  forecast: z.array(DailyForecastSchema).describe('The 5-day weather forecast.'),
});
export type WeatherOutput = z.infer<typeof WeatherOutputSchema>;


// This is a mock implementation. In a real app, you would use a tool to call a weather API.
const getWeatherForecastFlow = ai.defineFlow(
  {
    name: 'getWeatherForecastFlow',
    inputSchema: WeatherInputSchema,
    outputSchema: WeatherOutputSchema,
  },
  async ({ location }) => {
    // Mock data based on a "known" location for consistent output
    const isSunnyLocation = location.toLowerCase().includes('san diego');

    return {
      currentTemp: isSunnyLocation ? 72 : 64,
      currentConditions: isSunnyLocation ? 'Sunny' : 'Partly Cloudy',
      currentIcon: isSunnyLocation ? 'sun' : 'cloud',
      forecast: [
        { day: 'Mon', temp: isSunnyLocation ? 75 : 68, conditions: 'Sunny', icon: 'sun' },
        { day: 'Tue', temp: isSunnyLocation ? 73 : 65, conditions: 'Partly Cloudy', icon: 'cloud' },
        { day: 'Wed', temp: isSunnyLocation ? 70 : 62, conditions: 'Showers', icon: 'rain' },
        { day: 'Thu', temp: isSunnyLocation ? 71 : 63, conditions: 'Partly Cloudy', icon: 'cloud' },
        { day: 'Fri', temp: isSunnyLocation ? 74 : 66, conditions: 'Sunny', icon: 'sun' },
      ],
    };
  }
);


export async function getWeatherForecast(input: WeatherInput): Promise<WeatherOutput> {
  return getWeatherForecastFlow(input);
}
