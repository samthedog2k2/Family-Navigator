
export interface FamilyMember {
  id: number;
  name: string;
  age: number;
  role: 'Adult' | 'Child' | 'Infant';
}

export interface FamilyData {
  id: string;
  lastName: string;
  members: FamilyMember[];
}

export interface TripRequest {
  origin: string;
  destination: string;
  budget: number;
  additionalInfo?: string;
}

export interface AgentConfig {
  [agentId: string]: {
    enabled: boolean;
    priority: number;
  };
}

export interface FullTripRequest extends TripRequest {
    family: FamilyData;
    activeAgents: string[];
}
