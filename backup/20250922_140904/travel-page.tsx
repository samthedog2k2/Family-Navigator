"use client";

import { TravelPlanner } from "@/components/travel-planner";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CruiseSearch } from "@/components/cruise-search";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function TravelPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutWrapper>
        <PageHeader
          title="Travel Hub"
          description="Plan your next family adventure, from road trips to cruises."
        />
        <Tabs defaultValue="cruises" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cruises">AI Cruise Finder</TabsTrigger>
            <TabsTrigger value="planner">AI Road Trip & Lodging</TabsTrigger>
          </TabsList>
          <TabsContent value="planner" className="mt-4">
            <TravelPlanner />
          </TabsContent>
          <TabsContent value="cruises" className="mt-4 space-y-6">
            <CruiseSearch />
          </TabsContent>
        </Tabs>
      </LayoutWrapper>
    </QueryClientProvider>
  );
}
