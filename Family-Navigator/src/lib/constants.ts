/**
 * SP Travel System Constants
 * Default values based on collective travel wisdom
 */

import { FamilyData, AgentConfig } from './travel-types';

export const DEFAULT_FAMILY: FamilyData = {
  id: 'default-family',
  name: 'Our Family',
  members: [
    { id: 'parent1', name: 'Parent 1', age: 53, preferences: {} },
    { id: 'parent2', name: 'Parent 2', age: 52, preferences: {} },
    { id: 'teen1', name: 'Teen 1', age: 16, preferences: {} },
    { id: 'teen2', name: 'Teen 2', age: 13, preferences: {} },
  ],
  homeAddress: {
    street: '4433 Chital Place',
    city: 'Greenwood',
    state: 'Indiana',
    zip: '46143',
    country: 'USA',
    coordinates: {
      lat: 39.6137,
      lng: -86.1066,
    },
  },
  defaultAirport: 'IND', // Indianapolis International Airport
  preferences: {
    cruiseDefaults: {
      cabinType: 'balcony',
      diningTime: 'anytime',
      wifiPackages: 2,
      tipsIncluded: true,
    },
    hotelDefaults: {
      chains: ['Marriott', 'Hilton'],
      maxBudgetPerNight: 300,
      nearbyPOI: ['Target', 'Olive Garden'],
      maxDistanceToPOI: 5,
    },
    flightDefaults: {
      class: 'economy',
      seatPreference: 'aisle',
      carryOnBags: 4,
      checkedBags: 2,
    },
    carDefaults: {
      make: 'Toyota',
      model: 'Sienna XLE',
      year: 2025,
      mpg: 34,
      fuelType: 'regular',
    },
  },
};

export const AVAILABLE_AGENTS: AgentConfig[] = [
  {
    id: 'cruise',
    name: 'Cruise Specialist',
    icon: '🚢',
    description: 'Finds and compares cruise deals',
    enabled: true,
    priority: 1,
    capabilities: ['search', 'compare', 'book', 'track'],
  },
  {
    id: 'flight',
    name: 'Flight Expert',
    icon: '✈️',
    description: 'Searches flights and tracks prices',
    enabled: true,
    priority: 2,
    capabilities: ['search', 'track', 'alert', 'points'],
  },
  {
    id: 'hotel',
    name: 'Hotel Finder',
    icon: '🏨',
    description: 'Locates hotels meeting your criteria',
    enabled: true,
    priority: 3,
    capabilities: ['search', 'filter', 'compare', 'rewards'],
  },
  {
    id: 'roadtrip',
    name: 'Road Trip Planner',
    icon: '🚗',
    description: 'Optimizes routes and finds stops',
    enabled: true,
    priority: 4,
    capabilities: ['route', 'gas', 'stops', 'scenic'],
  },
  {
    id: 'weather',
    name: 'Weather Monitor',
    icon: '🌤️',
    description: 'Tracks weather for all destinations',
    enabled: true,
    priority: 5,
    capabilities: ['forecast', 'alerts', 'historical'],
  },
  {
    id: 'expense',
    name: 'Expense Tracker',
    icon: '💰',
    description: 'Monitors and categorizes spending',
    enabled: true,
    priority: 6,
    capabilities: ['track', 'receipt', 'budget', 'report'],
  },
  {
    id: 'insurance',
    name: 'Insurance Advisor',
    icon: '🛡️',
    description: 'Recommends travel insurance options',
    enabled: false,
    priority: 7,
    capabilities: ['compare', 'recommend', 'claim'],
  },
  {
    id: 'activity',
    name: 'Activity Scout',
    icon: '🎭',
    description: 'Finds attractions and experiences',
    enabled: true,
    priority: 8,
    capabilities: ['search', 'book', 'recommend'],
  },
  {
    id: 'restaurant',
    name: 'Restaurant Guide',
    icon: '🍽️',
    description: 'Discovers dining options',
    enabled: true,
    priority: 9,
    capabilities: ['search', 'reserve', 'dietary'],
  },
  {
    id: 'deal',
    name: 'Deal Hunter',
    icon: '🏷️',
    description: 'Finds discounts and promo codes',
    enabled: true,
    priority: 10,
    capabilities: ['scan', 'alert', 'apply'],
  },
];

export const API_ENDPOINTS = {
  // Google APIs (Free tier)
  GOOGLE_MAPS: 'https://maps.googleapis.com/maps/api',
  GOOGLE_PLACES: 'https://places.googleapis.com/v1',
  
  // Free Travel APIs
  OPENWEATHER: 'https://api.openweathermap.org/data/2.5',
  AMADEUS_AUTH: 'https://api.amadeus.com/v1/security/oauth2/token',
  AMADEUS_API: 'https://api.amadeus.com/v2',
  EXCHANGE_RATE: 'https://v6.exchangerate-api.com/v6',
  
  // Free Gas Price APIs
  GASBUDDY: 'https://api.gasbuddy.com', // If available
  
  // Scraping fallbacks (from the CSV data)
  CRUISE_SITES: [
    'cruisemapper.com',
    'cruisecritic.com',
    'vacationstogo.com',
  ],
  
  HOTEL_SITES: [
    'marriott.com',
    'hilton.com',
    'hotels.com',
  ],
};

export const TRIP_CATEGORIES = [
  { id: 'budget', label: 'Budget', icon: '💵', range: [0, 2000] },
  { id: 'moderate', label: 'Moderate', icon: '💳', range: [2000, 5000] },
  { id: 'premium', label: 'Premium', icon: '💎', range: [5000, 10000] },
  { id: 'luxury', label: 'Luxury', icon: '👑', range: [10000, Infinity] },
];

export const SEASONAL_EVENTS = {
  'black-friday': { name: 'Black Friday', dates: ['11-24', '11-25', '11-26'] },
  'cyber-monday': { name: 'Cyber Monday', dates: ['11-27'] },
  'wave-season': { name: 'Wave Season', dates: ['01-01', '03-31'] }, // Cruise deals
  'shoulder-season': { name: 'Shoulder Season', dates: ['04-15', '05-31', '09-01', '11-15'] },
};
