'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { findCruisesAutonomous } from '@/ai/agents/cruise-coordinator/agent';
import type { CruiseCoordinatorInput } from '@/ai/agents/cruise-coordinator/types';
import { CoordinatedCruiseResultSchema } from '@/ai/agents/cruise-coordinator/types';
import { z } from 'zod';
import TravelCoordinatorFast from '@/components/travel-coordinator-fast';
import { FamilyData, type TripRequest } from '@/lib/travel-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BudgetEstimator } from "@/components/budget-estimator";
import { InsiderTips } from "@/components/insider-tips";
import { PackingGuide } from "@/components/packing-guide";

type CruiseResult = z.infer<typeof CoordinatedCruiseResultSchema>;

// Mock family data for the dashboard
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

  const handleTripRequest = async () => {
    setIsProcessing(true);
    setAiResults(null);
    
    try {
        // Hardcoded for now based on the UI summary
        const coordinatorInput: CruiseCoordinatorInput = {
            departurePort: 'Miami, FL',
            destination: 'Caribbean',
            dateRange: {
              from: '2025-10-04',
              to: '2025-10-11',
            },
            duration: 7,
            interests: 'family, relaxation, beaches'
        };

        const result = await findCruisesAutonomous(coordinatorInput);
        setAiResults(result);

        toast({
            title: "AI Agent Processed",
            description: `Found ${result.cruises.length} synthesized cruise options.`,
        });

    } catch (error) {
      console.error('AI agent processing failed:', error);
      toast({
        title: "AI Agent Error",
        description: (error as Error).message || "The autonomous agent failed to process the request.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            SP Autonomous Cruise Finder
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Harnessing n8n and AI to find your perfect family vacation.
          </p>
        </div>

        <Tabs defaultValue="family">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="family">Family of 4</TabsTrigger>
            <TabsTrigger value="couple">Adult Couple</TabsTrigger>
          </TabsList>
          <TabsContent value="family">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                 <TravelCoordinatorFast 
                    onFindTrip={handleTripRequest} 
                    isProcessing={isProcessing} 
                  />
              </div>
              <div className="space-y-6">
                <BudgetEstimator mode="family" />
                <InsiderTips mode="family" />
                <PackingGuide mode="family" />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="couple">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              <div className="lg:col-span-2">
                 <TravelCoordinatorFast 
                    onFindTrip={handleTripRequest}
                    isProcessing={isProcessing} 
                  />
              </div>
              <div className="space-y-6">
                <BudgetEstimator mode="couple" />
                <InsiderTips mode="couple" />
                <PackingGuide mode="couple" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {aiResults && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>AI Agent Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{aiResults.summary}</p>
              </CardContent>
            </Card>
            
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
                     <p className="font-semibold text-sm">Sailing from {cruise.departurePort} on {cruise.departureDate}</p>
                     <p className="text-sm mt-2"><strong>Itinerary:</strong> {cruise.itinerary.join(', ')}</p>
                  </CardContent>
                  <CardFooter>
                     <Button asChild className="w-full" variant="outline">
                        <a href={cruise.bookingLink} target="_blank" rel="noopener noreferrer">
                           View Deal
                           <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                     </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
