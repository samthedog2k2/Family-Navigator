
export type FamilyMember = "Adam" | "Holly" | "Ethan" | "Elle";

export type HealthData = {
  height: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  weight: string;
  glucose: string;
  notes?: string;
};

export type AppState = {
  [key in FamilyMember]: HealthData;
};

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
export interface AgentConfig {
    id: string;
    name: string;
    icon: string;
    description: string;
    enabled: boolean;
    priority: number;
    capabilities: string[];
  }
