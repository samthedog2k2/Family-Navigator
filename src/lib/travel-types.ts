/**
 * SP Travel System Type Definitions
 * Comprehensive type system for all travel agents
 */

export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  preferences: {
    dietary?: string[];
    activities?: string[];
    accessibility?: string[];
  };
}

export interface FamilyData {
  id: string;
  name: string;
  members: FamilyMember[];
  homeAddress: Address;
  defaultAirport: string;
  preferences: FamilyPreferences;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface FamilyPreferences {
  cruiseDefaults: {
    cabinType: 'interior' | 'oceanview' | 'balcony' | 'suite';
    diningTime: 'early' | 'late' | 'anytime';
    wifiPackages: number;
    tipsIncluded: boolean;
  };
  hotelDefaults: {
    chains: string[];
    maxBudgetPerNight: number;
    nearbyPOI: string[]; // Points of Interest like Target, Olive Garden
    maxDistanceToPOI: number; // in miles
  };
  flightDefaults: {
    class: 'economy' | 'premium' | 'business' | 'first';
    seatPreference: 'aisle' | 'window' | 'middle' | 'no-preference';
    carryOnBags: number;
    checkedBags: number;
  };
  carDefaults: {
    make: string;
    model: string;
    year: number;
    mpg: number;
    fuelType: 'regular' | 'premium' | 'diesel' | 'electric';
  };
}

export interface TripRequest {
  id?: string;
  type: 'cruise' | 'flight' | 'roadtrip' | 'hybrid';
  startDate: Date;
  endDate: Date;
  origin?: string;
  destinations: string[];
  budget: {
    total: number;
    flexibility: 'strict' | 'flexible' | 'very-flexible';
  };
  interests: string[];
  specialRequests?: string;
}

export interface TripPlan {
  id: string;
  request: TripRequest;
  segments: TripSegment[];
  totalCost: CostBreakdown;
  recommendations: string[];
  warnings?: string[];
  alternativeOptions?: TripPlan[];
}

export interface TripSegment {
  type: 'cruise' | 'flight' | 'hotel' | 'car' | 'activity';
  startDate: Date;
  endDate: Date;
  provider: string;
  details: any; // Specific to segment type
  cost: number;
  bookingUrl?: string;
}

export interface CostBreakdown {
  transportation: number;
  accommodation: number;
  meals: number;
  activities: number;
  insurance: number;
  taxes: number;
  fees: number;
  total: number;
  currency: string;
}

export interface AgentConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  enabled: boolean;
  priority: number;
  capabilities: string[];
}

export interface AgentResponse {
  agentId: string;
  success: boolean;
  data?: any;
  error?: string;
  processingTime: number;
  confidence: number;
}

export interface SearchResult {
  id: string;
  type: string;
  provider: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  availability: boolean;
  rating?: number;
  reviews?: number;
  imageUrl?: string;
  bookingUrl?: string;
  metadata?: Record<string, any>;
}

export interface RouteData {
  origin: Address;
  destination: Address;
  distance: number; // miles
  duration: number; // minutes
  fuelCost: number;
  tolls: number;
  waypoints?: Address[];
  gasStations?: GasStation[];
}

export interface GasStation {
  name: string;
  brand: string;
  address: Address;
  price: number;
  lastUpdated: Date;
  amenities: string[];
}

export interface WeatherData {
  location: string;
  date: Date;
  temperature: {
    high: number;
    low: number;
    current?: number;
  };
  conditions: string;
  precipitation: number;
  windSpeed: number;
  humidity: number;
}

export interface ExpenseItem {
  id: string;
  tripId: string;
  date: Date;
  category: 'transport' | 'food' | 'accommodation' | 'activity' | 'shopping' | 'other';
  amount: number;
  currency: string;
  description: string;
  paymentMethod: 'cash' | 'credit' | 'debit' | 'points';
  receipt?: string; // Base64 or URL
  tags?: string[];
}

export interface ComparisonResult {
  trips: TripPlan[];
  winner: {
    byPrice: string;
    byValue: string;
    byConvenience: string;
  };
  matrix: ComparisonMatrix;
}

export interface ComparisonMatrix {
  criteria: string[];
  scores: Record<string, Record<string, number>>;
}
