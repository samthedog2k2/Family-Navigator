'use client';

import { useState } from 'react';
import { findCruisesAutonomous, CruiseCoordinatorInput, CoordinatedCruiseResultSchema } from '@/ai/agents/cruise-coordinator/agent';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import TravelDashboard from '@/components/TravelDashboard';
import { FamilyData, TripRequest } from '@/lib/travel-types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Sparkles, Ship } from 'lucide-react';

type CruiseResult = z.infer<typeof CoordinatedCruiseResultSchema>;

// Enhanced family data
const mockFamily: FamilyData = {
    id: 'family-123',
    name: 'The Adventure Family',
    members: [
      { id: '1', name: 'Adam', age: 45, preferences: {} },
      { id: '2', name: 'Holly', age: 42, preferences: {} },
      { id: '3', name: 'Ethan', age: 12, preferences: {} },
      { id: '4', name: 'Elle', age: 8, preferences: {} },
    ],
    homeAddress: {
      street: '123 Adventure Ave',
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
    
    try {
        const coordinatorInput: CruiseCoordinatorInput = {
            departurePort: request.origin,
            destination: request.destinations.join(', '),
            dateRange: {
              from: request.startDate.toISOString().split('T')[0],
              to: request.endDate.toISOString().split('T')[0],
            },
            duration: Math.round((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 60 * 60 * 24)),
            interests: request.interests.join(', ')
        };

        const result = await findCruisesAutonomous(coordinatorInput);
        
        if (result && result.cruises) {
            setAiResults(result);
            toast({
                title: "AI Agent Success",
                description: `Found ${result.cruises.length} synthesized cruise options.`,
            });
        } else {
             toast({
                title: "AI Agent Notice", 
                description: "The agent returned no options. Please try adjusting your criteria.",
                variant: "destructive",
            });
        }

    } catch (error: any) {
      console.error('AI agent processing failed:', error);
      toast({
        title: "AI Agent Error",
        description: `The autonomous agent failed to process the request: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl">
        <div className="flex items-center space-x-3 mb-4">
          <Sparkles className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">SP Travel Intelligence</h1>
        </div>
        <p className="text-gray-600">
          Powered by autonomous AI agents to find your perfect cruise.
        </p>
      </div>

      <TravelDashboard 
        family={mockFamily}
        onTripRequest={handleTripRequest} 
        isProcessing={isProcessing} 
      />

      {aiResults && aiResults.cruises.length > 0 && (
        <div className="space-y-8">
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Ship className="w-6 h-6 text-green-600" />
                <CardTitle className="text-green-800">AI Agent Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-700 font-medium">{aiResults.summary}</p>
            </CardContent>
          </Card>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {aiResults.cruises.map((cruise, index) => (
              <Card key={index} className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-blue-900">{cruise.shipName}</CardTitle>
                      <CardDescription className="text-blue-700 font-medium">{cruise.cruiseLine}</CardDescription>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                       <p className="font-bold text-lg text-green-600">{cruise.price}</p>
                       <p className="text-sm text-gray-600">{cruise.durationDays} days</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow p-6">
                   <p className="font-semibold text-sm mb-3 text-gray-800">
                     🚢 Sailing from {cruise.departurePort} on {cruise.departureDate}
                   </p>
                   <p className="text-sm mb-3">
                     <strong className="text-blue-600">Itinerary:</strong> {cruise.itinerary.join(' → ')}
                   </p>
                   <p className="text-xs text-gray-500">
                     <strong>Source:</strong> {cruise.source}
                   </p>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                   <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" size="lg">
                      <a href={cruise.bookingLink} target="_blank" rel="noopener noreferrer">
                         Book This Adventure
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
  );
}
