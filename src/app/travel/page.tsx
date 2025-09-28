/**
 * SP Travel Coordinator Page - FAST & STABLE
 * Embodying: Werner Vogels (Performance) + Steve Jobs (Simplicity) + Linus Torvalds (Stability)
 */

'use client';

import { useState } from 'react';
import { Calendar, MapPin, Users, CheckCircle, Clock, Ship, Plane, Hotel, Activity, Sparkles } from 'lucide-react';
import { findCruisesAutonomous, CruiseCoordinatorInput, CoordinatedCruiseResultSchema } from '@/ai/agents/cruise-coordinator/agent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

type CruiseResult = z.infer<typeof CoordinatedCruiseResultSchema>;

export default function TravelPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResults, setAiResults] = useState<CruiseResult | null>(null);
  const { toast } = useToast();

  const handleAICruiseSearch = async () => {
    setIsProcessing(true);
    setAiResults(null);
    
    try {
        const UserPreferences: CruiseCoordinatorInput = {
            departurePort: 'Miami, FL',
            destination: 'Caribbean',
            dateRange: { from: '2025-10-01', to: '2025-10-31' },
            duration: 7,
            interests: 'family-friendly, good food, beaches, relaxation'
        };
        const result = await findCruisesAutonomous(UserPreferences);
        setAiResults(result);
        toast({
            title: "AI Recommendations Ready",
            description: "The autonomous agent has returned cruise options.",
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
        <h1 className="text-4xl font-bold text-gray-900 mb-2">🌟 Find Perfect Trip</h1>
        <p className="text-gray-600">AI-powered travel planning with instant results</p>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-semibold mb-6 flex items-center">
          <MapPin className="w-6 h-6 mr-3 text-blue-600" />
          Your Caribbean Cruise Adventure
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <Ship className="w-5 h-5 mr-3 text-blue-500" />
            <div>
              <div className="font-semibold">Caribbean Cruise</div>
              <div className="text-sm text-gray-600">7-night adventure</div>
            </div>
          </div>
          <div className="flex items-center p-4 bg-green-50 rounded-lg">
            <Calendar className="w-5 h-5 mr-3 text-green-500" />
            <div>
              <div className="font-semibold">October 2025</div>
              <div className="text-sm text-gray-600">Perfect timing</div>
            </div>
          </div>
          <div className="flex items-center p-4 bg-purple-50 rounded-lg">
            <Users className="w-5 h-5 mr-3 text-purple-500" />
            <div>
              <div className="font-semibold">4 Family Members</div>
              <div className="text-sm text-gray-600">From Greenwood, IN</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={handleAICruiseSearch}
          disabled={isProcessing}
          size="lg"
          className="px-12 py-8 rounded-xl font-bold text-xl transition-all duration-300 transform hover:scale-105"
        >
          {isProcessing ? (
            <>
              <Clock className="w-6 h-6 mr-3 animate-spin" />
              AI Agent is Planning...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 mr-3" />
              Get AI Cruise Recommendations
            </>
          )}
        </Button>
      </div>

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
