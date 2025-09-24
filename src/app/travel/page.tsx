
"use client";

import { useState } from "react";
import { TravelPlanner } from "@/components/travel-planner";
import { BudgetEstimator } from "@/components/budget-estimator";
import { InsiderTips } from "@/components/insider-tips";
import { PackingGuide } from "@/components/packing-guide";
import { DealFinder } from "@/components/deal-finder";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a Tanstack Query client
const queryClient = new QueryClient();

export default function TravelPage() {
  const [activeTab, setActiveTab] = useState("family");

  return (
    <QueryClientProvider client={queryClient}>
      <main className="min-h-screen p-4 sm:p-6">
        <PageHeader
          title="Travel Planning Center"
          description="Your one-stop dashboard for planning your next family adventure."
        />
        <Tabs defaultValue="family" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="family">For the Family</TabsTrigger>
            <TabsTrigger value="couple">For Couples</TabsTrigger>
          </TabsList>
          
          <TabsContent value="family">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <BudgetEstimator mode="family" />
                <PackingGuide mode="family" />
            </div>
          </TabsContent>

          <TabsContent value="couple">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <BudgetEstimator mode="couple" />
                <PackingGuide mode="couple" />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
            <InsiderTips mode={activeTab as 'family' | 'couple'} />
        </div>

        <div className="mt-6">
            <DealFinder />
        </div>

        <div className="mt-6">
            <TravelPlanner />
        </div>

      </main>
    </QueryClientProvider>
  );
}
