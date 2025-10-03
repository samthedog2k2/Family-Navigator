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
