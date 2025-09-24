
export type FamilyMember = "Adam" | "Holly" | "Ethan" | "Elle";

export type HealthData = {
  height: string;
  age: number;
  gender: "Male" | "Female" | "Other" | string;
  weight: string;
  glucose: string;
  notes?: string;
};

export type AppState = {
  [key in FamilyMember]: HealthData;
};
