export interface FamilyMember {
  id: string;
  name: string;
  age: number;
  preferences: Record<string, any>;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface CarDefaults {
  year: number;
  make: string;
  model: string;
  mpg: number;
  fuelType: string;
}

export interface FamilyPreferences {
  carDefaults: CarDefaults;
}

export interface FamilyData {
  id?: string;
  members: FamilyMember[];
  homeAddress: Address;
  defaultAirport: string;
  preferences: FamilyPreferences;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isLoading: boolean;
  errors: ValidationError[];
  isDirty: boolean;
}
