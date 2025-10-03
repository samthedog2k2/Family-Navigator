import { z } from 'zod';

// Health Data Schema - Fixed to remove empty string from gender enum
export const HealthDataSchema = z.object({
  height: z.string().min(1, "Height is required"),
  age: z.number().positive("Age must be positive"),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  weight: z.string().min(1, "Weight is required"),
  glucose: z.string().min(1, "Glucose level is required"),
  notes: z.string().max(140, "Notes must be 140 characters or less").optional(),
});

export type HealthData = z.infer<typeof HealthDataSchema>;

// Family Member Types
export type FamilyMember = 'Adam' | 'Holly' | 'Ethan' | 'Elle';

export interface AppState {
  Adam: HealthData;
  Holly: HealthData;
  Ethan: HealthData;
  Elle: HealthData;
}

// Travel Types
export interface TripRequest {
  type: 'cruise' | 'flight' | 'roadtrip' | 'hybrid';
  startDate: Date;
  endDate: Date;
  origin: string;
  destinations: string[];
  budget: {
    total: number;
    flexibility: 'strict' | 'flexible' | 'very-flexible';
  };
  interests: string[];
}

export interface FamilyData {
  id: string;
  name: string;
  members: Array<{
    id: string;
    name: string;
    age: number;
    preferences: Record<string, any>;
  }>;
  homeAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  defaultAirport: string;
  preferences: {
    cruiseDefaults: {
      cabinType: string;
      diningTime: string;
      wifiPackages: number;
      tipsIncluded: boolean;
    };
    hotelDefaults: {
      chains: string[];
      maxBudgetPerNight: number;
      nearbyPOI: string[];
      maxDistanceToPOI: number;
    };
    flightDefaults: {
      class: string;
      seatPreference: string;
      carryOnBags: number;
      checkedBags: number;
    };
    carDefaults: {
      make: string;
      model: string;
      year: number;
      mpg: number;
      fuelType: string;
    };
  };
}

export interface TripPlan {
  id: string;
  segments: TripSegment[];
  totalCost: {
    transportation: number;
    accommodation: number;
    meals: number;
    activities: number;
    insurance: number;
    taxes: number;
    fees: number;
    total: number;
    currency: string;
  };
  recommendations: string[];
  warnings: string[];
}

export interface TripSegment {
  type: 'cruise' | 'flight' | 'hotel' | 'car';
  startDate: Date;
  endDate: Date;
  provider: string;
  details: any;
  cost: number;
  bookingUrl?: string;
}
