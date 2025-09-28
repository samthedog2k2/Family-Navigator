
'use client';

import { useState } from 'react';
import { findCruisesAutonomous, CruiseCoordinatorInput, CoordinatedCruiseResultSchema } from '@/ai/agents/cruise-coordinator/agent';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import TravelDashboard from '@/components/TravelDashboard';
import { TripRequest, FamilyData } from '@/lib/travel-types';
import { DEFAULT_FAMILY } from '@/lib/constants';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

type CruiseResult = z.infer<typeof CoordinatedCruiseResultSchema>;

export default function TravelPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResults, setAiResults] = useState<CruiseResult | null>(null);
  const { toast } = useToast();

  const handleTripRequest = async (request: TripRequest) => {
    setIsProcessing(true);
    setAiResults(null);
    
    try {
        const coordinatorInput: CruiseCoordinatorInput = {
            departurePort: request.origin || DEFAULT_FAMILY.homeAddress.city,
            destination: request.destinations.join(', '),
            dateRange: { 
              from: request.startDate.toISOString().split('T')[0], 
              to: request.endDate.toISOString().split('T')[0] 
            },
            duration: Math.round((request.endDate.getTime() - request.startDate.getTime()) / (1000 * 3600 * 24)),
            interests: request.interests.join(', ')
        };

        const result = await findCruisesAutonomous(coordinatorInput);
        
        setAiResults(result);

        toast({
            title: "AI Recommendations Ready",
            description: result.summary || "The autonomous agent has returned cruise options.",
        });

    } catch (error) {
      console.error('AI agent processing failed:', error);
      toast({
        title: "AI Agent Error",
        description: "The autonomous agent failed to process the request.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🌟 Find Your Perfect Trip</h1>
        <p className="text-gray-600">AI-powered travel planning with instant results</p>
      </div>

      <TravelDashboard 
        family={DEFAULT_FAMILY} 
        onTripRequest={handleTripRequest} 
        isProcessing={isProcessing} 
      />

      {isProcessing && (
        <div className="text-center text-muted-foreground">
            <p>The autonomous agent is analyzing your request, retrieving information, and synthesizing the best options...</p>
        </div>
      )}

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
          
          <div className="grid gap-6">
            {aiResults.cruises.map((cruise, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{cruise.shipName}</CardTitle>
                      <CardDescription>{cruise.cruiseLine}</CardDescription>
                    </div>
                    <div className="text-right">
                       <p className="font-bold text-lg">{cruise.price}</p>
                       <p className="text-sm text-muted-foreground">{cruise.durationDays} days</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                   <p className="font-semibold text-sm">Sailing from {cruise.departurePort} on {cruise.departureDate}</p>
                   <p className="text-sm mt-2"><strong>Itinerary:</strong> {cruise.itinerary.join(', ')}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
