
/**
 * Free Weather APIs Integration
 *
 * Primary: Open-Meteo (unlimited, no key required)
 * Secondary: OpenWeatherMap free tier (1000 calls/day)
 * Maps: RainViewer (free radar tiles)
 */

export interface WeatherLocation {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface CurrentWeather {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  time: string;
  uvIndex?: number;
  visibility?: number;
  pressure?: number;
  feelsLike?: number;
}

export interface HourlyWeather {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitation: number[];
  weatherCode: number[];
  windSpeed: number[];
  uvIndex: number[];
}

export interface DailyWeather {
  time: string[];
  temperatureMax: number[];
  temperatureMin: number[];
  weatherCode: number[];
  precipitationSum: number[];
  windSpeedMax: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
}

export interface AirQuality {
  aqi: number;
  pm2_5: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
}

export interface WeatherAlert {
  id: string;
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: string;
  end: string;
}

export interface ComprehensiveWeatherData {
  location: WeatherLocation;
  current: CurrentWeather;
  hourly: HourlyWeather;
  daily: DailyWeather;
  airQuality?: AirQuality;
  alerts?: WeatherAlert[];
}

/**
 * Open-Meteo API (Primary - Free, No Key Required)
 */
class OpenMeteoService {
  private baseUrl = 'https://api.open-meteo.com/v1';

  async getWeatherData(lat: number, lon: number): Promise<Partial<ComprehensiveWeatherData>> {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
        'uv_index',
        'surface_pressure'
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'precipitation_probability',
        'weather_code',
        'wind_speed_10m',
        'uv_index'
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'sunrise',
        'sunset',
        'precipitation_sum',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'uv_index_max'
      ].join(','),
      temperature_unit: 'fahrenheit',
      wind_speed_unit: 'mph',
      precipitation_unit: 'inch',
      timezone: 'auto',
      forecast_days: '14'
    });

    const response = await fetch(`${this.baseUrl}/forecast?${params}`);
    if (!response.ok) throw new Error('Open-Meteo API failed');

    const data = await response.json();

    return {
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day === 1,
        time: data.current.time,
        uvIndex: data.current.uv_index,
        pressure: data.current.surface_pressure,
        feelsLike: data.current.apparent_temperature
      },
      hourly: {
        time: data.hourly.time,
        temperature: data.hourly.temperature_2m,
        humidity: data.hourly.relative_humidity_2m,
        precipitation: data.hourly.precipitation_probability,
        weatherCode: data.hourly.weather_code,
        windSpeed: data.hourly.wind_speed_10m,
        uvIndex: data.hourly.uv_index
      },
      daily: {
        time: data.daily.time,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
        weatherCode: data.daily.weather_code,
        precipitationSum: data.daily.precipitation_probability_max,
        windSpeedMax: data.daily.wind_speed_10m_max,
        sunrise: data.daily.sunrise,
        sunset: data.daily.sunset,
        uvIndexMax: data.daily.uv_index_max
      }
    };
  }

  async getAirQuality(lat: number, lon: number): Promise<AirQuality | null> {
    try {
      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: ['us_aqi', 'pm2_5', 'pm10', 'nitrogen_dioxide', 'sulphur_dioxide', 'carbon_monoxide', 'ozone'].join(',')
      });

      const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?${params}`);
      if (!response.ok) return null;

      const data = await response.json();

      return {
        aqi: data.current.us_aqi,
        pm2_5: data.current.pm2_5,
        pm10: data.current.pm10,
        no2: data.current.nitrogen_dioxide,
        so2: data.current.sulphur_dioxide,
        co: data.current.carbon_monoxide,
        o3: data.current.ozone
      };
    } catch (error) {
      console.error('Air quality data unavailable:', error);
      return null;
    }
  }
}


/**
 * Location Service (Free reverse geocoding)
 */
class LocationService {
  async getLocationName(lat: number, lon: number): Promise<string> {
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
      );

      if (!response.ok) return 'Unknown Location';

      const data = await response.json();
      return data.city || data.locality || data.principalSubdivision || 'Unknown Location';
    } catch (error) {
      console.error('Location lookup failed:', error);
      return 'Unknown Location';
    }
  }
}

/**
 * Main Weather Service - Combines all free APIs
 */
class WeatherService {
  private openMeteo = new OpenMeteoService();
  private location = new LocationService();

  async getComprehensiveWeather(lat: number, lon: number): Promise<ComprehensiveWeatherData> {
    try {
      const [weatherData, locationName, airQuality] = await Promise.all([
        this.openMeteo.getWeatherData(lat, lon),
        this.location.getLocationName(lat, lon),
        this.openMeteo.getAirQuality(lat, lon)
      ]);
      
      // Since OpenWeatherMap isn't configured, we'll return an empty array for alerts.
      const alerts: WeatherAlert[] = [];

      return {
        location: { latitude: lat, longitude: lon, name: locationName },
        current: weatherData.current!,
        hourly: weatherData.hourly!,
        daily: weatherData.daily!,
        airQuality: airQuality || undefined,
        alerts: alerts
      };
    } catch (error) {
      console.error('Weather service error:', error);
      throw new Error('Failed to fetch weather data');
    }
  }
}

// Export singleton instance
export const weatherService = new WeatherService();
