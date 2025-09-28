export type TripType = 'cruise' | 'flight' | 'roadtrip' | 'hybrid';

export interface Trip {
  id: string;
  name: string;
  type: TripType;
  cost: number;
  duration: number;
  rating: number;
  convenience: number;
  familyFriendly: number;
  description?: string;
  imageUrl?: string;
  highlights?: string[];
}

export interface TripMetric {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  getValue: (trip: Trip) => string;
  formatValue?: (value: number) => string;
}

export interface ChartData {
  name: string;
  cost: number;
  duration?: number;
  rating?: number;
}

export interface RadarData {
  metric: string;
  value: number;
  convenience: number;
  familyScore: number;
}

export interface ComparisonState {
  selectedTrips: string[];
  isLoading: boolean;
  error: string | null;
  sortBy: 'cost' | 'duration' | 'rating' | 'familyFriendly';
  sortOrder: 'asc' | 'desc';
}

export interface TripComparisonProps {
  trips: Trip[];
  family?: any; // Keep existing family prop for compatibility
  isLoading?: boolean;
  onTripSelect?: (tripIds: string[]) => void;
}