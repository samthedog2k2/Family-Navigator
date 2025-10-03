/**
 * Astronomy utilities for sunrise/sunset and moon phases
 * Using simplified astronomical calculations for demonstration
 */

// Default coordinates (can be made configurable later)
const DEFAULT_LATITUDE = 40.7128; // New York City
const DEFAULT_LONGITUDE = -74.0060;

/**
 * Calculate sunrise and sunset times for a given date
 * Uses simplified calculations - for production, consider using a library like suncalc
 */
export function getSunriseSunset(date: Date, lat: number = DEFAULT_LATITUDE, lng: number = DEFAULT_LONGITUDE) {
  const dayOfYear = getDayOfYear(date);
  const year = date.getFullYear();

  // Simplified calculation for solar declination
  const P = Math.asin(0.39795 * Math.cos(0.01723 * (dayOfYear - 173)));

  // Hour angle calculation
  const argument = -Math.tan(lat * Math.PI / 180) * Math.tan(P);

  // Check for polar day/night
  if (argument < -1) {
    return { sunrise: null, sunset: null, type: 'polar_day' };
  }
  if (argument > 1) {
    return { sunrise: null, sunset: null, type: 'polar_night' };
  }

  const hourAngle = Math.acos(argument) * 180 / Math.PI;

  // Calculate sunrise and sunset
  const sunriseHour = 12 - hourAngle / 15;
  const sunsetHour = 12 + hourAngle / 15;

  return {
    sunrise: formatTime(sunriseHour),
    sunset: formatTime(sunsetHour),
    type: 'normal'
  };
}

/**
 * Calculate moon phase for a given date
 * Returns moon phase name and phase value
 */
export function getMoonPhase(date: Date) {
  // Known new moon date for calculation reference
  const knownNewMoon = new Date('2000-01-06T18:14:00Z');
  const synodicMonth = 29.530588853; // Average length of lunar cycle in days

  const daysSinceKnownNewMoon = (date.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const currentPhase = ((daysSinceKnownNewMoon % synodicMonth) + synodicMonth) % synodicMonth;

  // Determine phase
  if (currentPhase < 1.84566) {
    return { name: 'New Moon', phase: 0 };
  } else if (currentPhase < 5.53699) {
    return { name: 'Waxing Crescent', phase: 0.125 };
  } else if (currentPhase < 9.22831) {
    return { name: 'First Quarter', phase: 0.25 };
  } else if (currentPhase < 12.91963) {
    return { name: 'Waxing Gibbous', phase: 0.375 };
  } else if (currentPhase < 16.61096) {
    return { name: 'Full Moon', phase: 0.5 };
  } else if (currentPhase < 20.30228) {
    return { name: 'Waning Gibbous', phase: 0.625 };
  } else if (currentPhase < 23.99361) {
    return { name: 'Last Quarter', phase: 0.75 };
  } else if (currentPhase < 27.68493) {
    return { name: 'Waning Crescent', phase: 0.875 };
  } else {
    return { name: 'New Moon', phase: 1 };
  }
}

/**
 * Get day of year (1-366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Format decimal hour to HH:MM format
 */
function formatTime(decimalHour: number): string {
  const hour = Math.floor(decimalHour);
  const minute = Math.round((decimalHour - hour) * 60);
  const adjustedHour = hour % 24;
  const adjustedMinute = minute === 60 ? 0 : minute;
  const finalHour = minute === 60 ? (adjustedHour + 1) % 24 : adjustedHour;

  const period = finalHour < 12 ? 'AM' : 'PM';
  const displayHour = finalHour === 0 ? 12 : finalHour > 12 ? finalHour - 12 : finalHour;

  return `${displayHour}:${adjustedMinute.toString().padStart(2, '0')} ${period}`;
}

/**
 * Get comprehensive day information
 */
export function getDayInfo(date: Date) {
  const sunTimes = getSunriseSunset(date);
  const moonPhase = getMoonPhase(date);

  return {
    sunrise: sunTimes.sunrise,
    sunset: sunTimes.sunset,
    sunType: sunTimes.type,
    moonPhase: moonPhase.name,
    moonPhaseValue: moonPhase.phase
  };
}