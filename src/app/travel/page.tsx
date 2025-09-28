
'use client';

import { useState } from 'react';
import { findCruisesAutonomous, CruiseCoordinatorInput, CoordinatedCruiseResultSchema } from '@/ai/agents/cruise-coordinator/agent';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import TravelCoordinatorFast from '@/components/travel-coordinator-fast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type CruiseResult = z.infer<typeof CoordinatedCruiseResultSchema>;

export default function TravelPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResults, setAiResults] = useState<CruiseResult | null>(null);
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    setIsProcessing(true);
    setAiResults(null);
    
    try {
        // Hard-coded input for now to test the agent
        const coordinatorInput: CruiseCoordinatorInput = {
            departurePort: "Miami, FL",
            destination: "Caribbean",
            dateRange: { 
              from: "2025-10-01", 
              to: "2025-10-31"
            },
            duration: 7,
            interests: "family-friendly, water slides, relaxation"
        };

        // This call is currently commented out until foundational issues are resolved
        // const result = await findCruisesAutonomous(coordinatorInput);
        // setAiResults(result);

        // Simulate a delay to show the processing state
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
            title: "AI Agent Processed (Simulated)",
            description: "Displaying static results for now.",
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
    <div className="space-y-8">
      
      <TravelCoordinatorFast 
        onFindTrip={handleGetRecommendations} 
        isProcessing={isProcessing} 
      />

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
