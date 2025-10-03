#!/bin/bash

echo "================================================"
echo "  FIXING FAMILY NAVIGATOR PROJECT"
echo "================================================"
echo ""

# Create backup directory
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Backing up original files to $BACKUP_DIR/"
cp src/lib/types.ts "$BACKUP_DIR/types.ts" 2>/dev/null
cp src/components/health-tracker.tsx "$BACKUP_DIR/health-tracker.tsx" 2>/dev/null
cp src/app/travel/page.tsx "$BACKUP_DIR/page.tsx" 2>/dev/null

echo "✅ Backups created"
echo ""

# Fix File 1: types.ts
echo "🔧 Fixing src/lib/types.ts..."
cat > src/lib/types.ts << 'EOF'
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
EOF

echo "✅ types.ts fixed"
echo ""

# Fix File 2: health-tracker.tsx
echo "🔧 Fixing src/components/health-tracker.tsx..."
cat > src/components/health-tracker.tsx << 'EOF'
"use client";
import { useState, useEffect } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import type { FamilyMember, HealthData, AppState } from "@/lib/types";
import { ClientDataService } from "@/services/client-data-service";
import { Loader2 } from "lucide-react";
import { Badge } from "./ui/badge";

const familyMembers: FamilyMember[] = ["Adam", "Holly", "Ethan", "Elle"];

const healthSchema = z.object({
  height: z.string().min(1, "Height is required"),
  age: z.coerce.number().positive("Age must be positive"),
  gender: z.enum(["Male", "Female", "Other"]).optional(),
  weight: z.string().min(1, "Weight is required"),
  glucose: z.string().min(1, "Glucose level is required"),
  notes: z.string().max(140, "Notes must be 140 characters or less").optional(),
});

type HealthFormData = z.infer<typeof healthSchema>;

function HealthForm({
  member,
  data,
  onSave,
  isSaving,
}: {
  member: FamilyMember;
  data: HealthData;
  onSave: (member: FamilyMember, data: HealthData) => void;
  isSaving: boolean;
}) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<HealthFormData>({
    resolver: zodResolver(healthSchema),
    defaultValues: {
      ...data,
      gender: data.gender || undefined,
    },
  });

  useEffect(() => {
    reset({
      ...data,
      gender: data.gender || undefined,
    });
  }, [data, reset]);

  const onSubmit: SubmitHandler<HealthFormData> = (formData) => {
    const healthData: HealthData = {
      ...formData,
      gender: formData.gender || "",
    };
    onSave(member, healthData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Log Vitals for {member}</CardTitle>
          <CardDescription>
            Enter the latest health information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`height-${member}`}>Height</Label>
              <Input
                id={`height-${member}`}
                placeholder="e.g., 5'10&quot;"
                {...register("height")}
              />
              {errors.height && (
                <p className="text-destructive text-sm">{errors.height.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`age-${member}`}>Age</Label>
              <Input
                id={`age-${member}`}
                type="number"
                placeholder="e.g., 35"
                {...register("age")}
              />
              {errors.age && (
                <p className="text-destructive text-sm">{errors.age.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`gender-${member}`}>Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <SelectTrigger id={`gender-${member}`}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`weight-${member}`}>Weight (lbs)</Label>
              <Input
                id={`weight-${member}`}
                placeholder="e.g., 180"
                {...register("weight")}
              />
              {errors.weight && (
                <p className="text-destructive text-sm">{errors.weight.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor={`glucose-${member}`}>Glucose (mg/dL)</Label>
              <Input
                id={`glucose-${member}`}
                placeholder="e.g., 95"
                {...register("glucose")}
              />
              {errors.glucose && (
                <p className="text-destructive text-sm">{errors.glucose.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`notes-${member}`}>Notes</Label>
            <Textarea
              id={`notes-${member}`}
              placeholder="Any relevant notes (max 140 chars)"
              {...register("notes")}
            />
            {errors.notes && (
              <p className="text-destructive text-sm">{errors.notes.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSaving}>
            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Data
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

const emptyHealthData: HealthData = {
  height: "",
  age: 0,
  gender: "",
  weight: "",
  glucose: "",
  notes: "",
};

const defaultState: AppState = {
  Adam: { ...emptyHealthData, gender: "Male" },
  Holly: { ...emptyHealthData, gender: "Female" },
  Ethan: { ...emptyHealthData, gender: "Male" },
  Elle: { ...emptyHealthData, gender: "Female" },
};

export function HealthTracker() {
  const [appState, setAppState] = useState<AppState | null>(null);
  const [dataSource, setDataSource] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<FamilyMember>(familyMembers[0]);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const loadedData: AppState = { ...defaultState };
        let source = "default";
        for (const member of familyMembers) {
          const memberData = await ClientDataService.getHealthData(member);
          if (memberData) {
            loadedData[member] = memberData as HealthData;
            source = "firebase";
          }
        }
        setAppState(loadedData);
        setDataSource(source);
      } catch (error) {
        toast({
          title: "Error Loading Data",
          description: "Could not retrieve health data. Please try again later.",
          variant: "destructive",
        });
        setAppState(defaultState);
        setDataSource("error");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  const handleSave = async (member: FamilyMember, data: HealthData) => {
    setIsSaving(true);
    try {
      await ClientDataService.saveHealthData(member, data);

      setAppState((prevState) => {
        if (!prevState) return null;
        return {
          ...prevState,
          [member]: data,
        };
      });
      toast({
        title: "Data Saved",
        description: `Health data for ${member} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error Saving Data",
        description: `Could not save health data for ${member}.`,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!appState) {
    return <p>Could not load health data.</p>;
  }

  return (
    <div className="relative">
      {dataSource && (
        <Badge variant="outline" className="absolute top-0 right-0">
          Data Source: {dataSource}
        </Badge>
      )}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as FamilyMember)}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          {familyMembers.map((member) => (
            <TabsTrigger key={member} value={member}>
              {member}
            </TabsTrigger>
          ))}
        </TabsList>
        {familyMembers.map((member) => (
          <TabsContent
            key={member}
            value={member}
            forceMount={true}
            hidden={activeTab !== member}
          >
            <HealthForm
              member={member}
              data={appState[member]}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
EOF

echo "✅ health-tracker.tsx fixed"
echo ""

# Fix File 3: travel/page.tsx
echo "🔧 Fixing src/app/travel/page.tsx..."
cat > src/app/travel/page.tsx << 'EOF'
'use client';

import { useState } from 'react';
import { findCruisesAutonomous, CruiseCoordinatorInput, CoordinatedCruiseResultSchema } from '@/ai/agents/cruise-coordinator/agent';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import TravelDashboard from '@/components/TravelDashboard';
import { FamilyData, TripRequest } from '@/lib/travel-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Loader2 } from 'lucide-react';

type CruiseResult = z.infer<typeof CoordinatedCruiseResultSchema>;

const mockFamily: FamilyData = {
  id: 'family-123',
  name: 'The Millers',
  members: [
    { id: '1', name: 'Adam', age: 45, preferences: {} },
    { id: '2', name: 'Holly', age: 42, preferences: {} },
    { id: '3', name: 'Ethan', age: 12, preferences: {} },
    { id: '4', name: 'Elle', age: 8, preferences: {} },
  ],
  homeAddress: {
    street: '123 Main St',
    city: 'Greenwood',
    state: 'IN',
    zip: '46143',
    country: 'USA'
  },
  defaultAirport: 'IND',
  preferences: {
    cruiseDefaults: { cabinType: 'balcony', diningTime: 'anytime', wifiPackages: 2, tipsIncluded: true },
    hotelDefaults: { chains: ['Marriott', 'Hilton'], maxBudgetPerNight: 300, nearbyPOI: [], maxDistanceToPOI: 5 },
    flightDefaults: { class: 'economy', seatPreference: 'aisle', carryOnBags: 4, checkedBags: 2 },
    carDefaults: { make: 'Toyota', model: 'Highlander', year: 2022, mpg: 28, fuelType: 'regular' }
  },
};

export default function TravelPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResults, setAiResults] = useState<CruiseResult | null>(null);
  const { toast } = useToast();

  const handleTripRequest = async (request: TripRequest) => {
    setIsProcessing(true);
    setAiResults(null);

    console.log('[Travel Page] Received trip request:', request);

    try {
      const coordinatorInput: CruiseCoordinatorInput = {
        departurePort: request.origin || mockFamily.homeAddress.city,
        destination: Array.isArray(request.destinations)
          ? request.destinations.join(', ')
          : request.destinations,
        dateRange: {
          from: request.startDate instanceof Date
            ? request.startDate.toISOString().split('T')[0]
            : String(request.startDate),
          to: request.endDate instanceof Date
            ? request.endDate.toISOString().split('T')[0]
            : String(request.endDate),
        },
        duration: Math.round(
          (request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24)
        ),
        interests: Array.isArray(request.interests)
          ? request.interests.join(', ')
          : request.interests
      };

      console.log('[Travel Page] Calling AI agent with:', coordinatorInput);

      const result = await findCruisesAutonomous(coordinatorInput);

      console.log('[Travel Page] AI agent returned:', result);

      setAiResults(result);

      toast({
        title: "Search Complete",
        description: `Found ${result.cruises.length} cruise options`,
      });

    } catch (error: any) {
      console.error('[Travel Page] AI agent error:', error);

      toast({
        title: "Search Failed",
        description: error.message || "Unable to find cruises. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <TravelDashboard
        family={mockFamily}
        onTripRequest={handleTripRequest}
        isProcessing={isProcessing}
      />

      {isProcessing && (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
              <p className="text-gray-600">Searching for perfect cruise options...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {aiResults && !isProcessing && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>AI Search Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{aiResults.summary}</p>
            </CardContent>
          </Card>

          {aiResults.cruises.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {aiResults.cruises.map((cruise, index) => (
                <Card key={index} className="overflow-hidden flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{cruise.shipName}</CardTitle>
                        <CardDescription>{cruise.cruiseLine}</CardDescription>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-bold text-lg">{cruise.price}</p>
                        <p className="text-sm text-muted-foreground">{cruise.durationDays} days</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="font-semibold text-sm">
                      Sailing from {cruise.departurePort} on {cruise.departureDate}
                    </p>
                    <p className="text-sm mt-2">
                      <strong>Itinerary:</strong> {cruise.itinerary.join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">Source: {cruise.source}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild className="w-full" variant="outline">
                      <a href={cruise.bookingLink} target="_blank" rel="noopener noreferrer">
                        View Details
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-600">No cruise options found matching your criteria.</p>
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search parameters.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
EOF

echo "✅ page.tsx fixed"
echo ""

# Clear caches
echo "🧹 Clearing build caches..."
rm -rf .next
rm -rf node_modules/.cache
echo "✅ Caches cleared"
echo ""

echo "================================================"
echo "  ✅ ALL FIXES APPLIED SUCCESSFULLY"
echo "================================================"
echo ""
echo "Backups saved in: $BACKUP_DIR/"
echo ""
echo "Next steps:"
echo "1. Run: npm run dev"
echo "2. Open browser to test health tracker"
echo "3. Navigate to /travel to test AI search"
echo "4. Check browser console for [Travel Page] logs"
echo ""
echo "If you see errors, check the console output."
echo "================================================"
