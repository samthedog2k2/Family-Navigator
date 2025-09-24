
"use client";

import { TravelPlanner } from "@/components/travel-planner";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CruiseFinder } from "@/components/cruise-finder";

export default function TravelPage() {
  return (
    <LayoutWrapper>
      <PageHeader
        title="Travel Planner"
        description="Plan your next family adventure, from road trips to cruises."
      />
      <Tabs defaultValue="planner" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="planner">AI Travel Planner</TabsTrigger>
          <TabsTrigger value="cruises">Cruise Finder</TabsTrigger>
        </TabsList>
        <TabsContent value="planner" className="mt-4">
          <TravelPlanner />
        </TabsContent>
        <TabsContent value="cruises" className="mt-4">
          <CruiseFinder />
        </TabsContent>
      </Tabs>
    </LayoutWrapper>
  );
}
