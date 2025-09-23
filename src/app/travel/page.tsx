"use client";

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { LayoutWrapper } from "@/components/layout-wrapper";
import { PageHeader } from "@/components/page-header";
import { BudgetEstimator } from '@/components/budget-estimator';
import { PackingGuide } from '@/components/packing-guide';
import { DealFinder } from '@/components/deal-finder';
import { InsiderTips } from '@/components/insider-tips';

import './react-tabs.css';

// Create a client
const queryClient = new QueryClient();

export default function TravelPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const mode = tabIndex === 0 ? 'family' : 'couple';

  return (
    <QueryClientProvider client={queryClient}>
      <LayoutWrapper>
        <PageHeader
          title="Travel Dashboard"
          description="Your AI-powered toolkit for planning the perfect cruise."
        />
        
        <div className="space-y-6">
          <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList>
              <Tab>Family of 4</Tab>
              <Tab>Adult Couple</Tab>
            </TabList>
            
            {/* The TabPanels are required for the tabs to function, but we can render the same layout in both. The 'mode' prop will handle the content changes. */}
            <TabPanel>
                <div className="pt-4"> {/* Added padding for content below tabs */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 space-y-6">
                            <BudgetEstimator mode={mode} />
                            <DealFinder />
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <PackingGuide mode={mode} />
                            <InsiderTips mode={mode} />
                        </div>
                    </div>
                </div>
            </TabPanel>
            <TabPanel>
                <div className="pt-4">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="lg:col-span-3 space-y-6">
                            <BudgetEstimator mode={mode} />
                            <DealFinder />
                        </div>
                        <div className="lg:col-span-2 space-y-6">
                            <PackingGuide mode={mode} />
                            <InsiderTips mode={mode} />
                        </div>
                    </div>
                </div>
            </TabPanel>
          </Tabs>
        </div>
      </LayoutWrapper>
    </QueryClientProvider>
  );
}
