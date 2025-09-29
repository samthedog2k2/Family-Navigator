'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { findCruisesAutonomous, CruiseCoordinatorInput } from '@/ai/agents/cruise-coordinator/agent';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CruiseSearch } from "@/components/cruise-search";
import { BudgetEstimator } from "@/components/budget-estimator";
import { InsiderTips } from "@/components/insider-tips";
import { PackingGuide } from "@/components/packing-guide";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export default function TravelPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);
  const { toast } = useToast();

  const handleSearch = async (searchCriteria: any) => {
    setIsProcessing(true);
    setResults(null);
    try {
      // This function will now trigger the n8n webhook behind the scenes
      // For now, we simulate the results from the scraping and synthesis process
      const coordinatorInput: CruiseCoordinatorInput = {
        destination: searchCriteria.destinations.join(', '),
        departurePort: searchCriteria.departurePort,
        dateRange: {
          from: searchCriteria.dateRange?.from?.toISOString().split('T')[0],
          to: searchCriteria.dateRange?.to?.toISOString().split('T')[0],
        },
        duration: 7, // Example duration
        interests: 'family, relaxation', // Example interests
      };
      
      const response = await findCruisesAutonomous(coordinatorInput);
      setResults(response.cruises);
      toast({
        title: 'AI Search Complete',
        description: `Found ${response.cruises.length} synthesized options.`,
      });
    } catch (error) {
      console.error('Error during autonomous search:', error);
      toast({
        title: 'Search Failed',
        description: 'The AI agents failed to complete the search.',
        variant: 'destructive',
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
                <CruiseSearch onSearch={handleSearch} isLoading={isProcessing} />
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
                 <CruiseSearch onSearch={handleSearch} isLoading={isProcessing} />
              </div>
              <div className="space-y-6">
                <BudgetEstimator mode="couple" />
                <InsiderTips mode="couple" />
                <PackingGuide mode="couple" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {results && (
            <Card>
                <CardHeader>
                    <CardTitle>Search Results</CardTitle>
                </CardHeader>
                <CardContent>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}
