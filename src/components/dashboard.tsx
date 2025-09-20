
"use client";

import { useSearchParams } from "next/navigation";
import { TravelPlanner } from "@/components/travel-planner";
import { FinanceTools } from "@/components/finance-tools";
import { HealthTracker } from "@/components/health-tracker";
import { WebAgentForm } from "@/components/web-agent-form";
import { ChatInterface } from "@/components/chat";
import { PageHeader } from "./page-header";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const featureMap: { [key: string]: React.ComponentType } = {
  travel: TravelPlanner,
  finance: FinanceTools,
  health: HealthTracker,
  agents: WebAgentForm,
  chat: ChatInterface,
};

const featureTitles: { [key: string]: string } = {
    travel: "Travel Planner",
    finance: "Financial Tools",
    health: "Health Tracker",
    agents: "Webpages Agent",
    chat: "Chat Agent",
}

export function Dashboard() {
  const searchParams = useSearchParams();
  const features = searchParams.get("features")?.split(",") || [];
  
  if (features.length === 0) {
    return (
        <div>
            <PageHeader title="Empty Dashboard" description="No features selected. Go back to the homepage to select features for your dashboard."/>
        </div>
    )
  }

  return (
    <div className="space-y-6">
        <PageHeader title="Your Custom Dashboard" description="Here are the features you selected."/>
        <div className="grid gap-6 lg:grid-cols-1">
      {features.map((featureKey) => {
        const Component = featureMap[featureKey];
        const title = featureTitles[featureKey];
        return Component ? (
          <Card key={featureKey}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Component />
            </CardContent>
          </Card>
        ) : null;
      })}
      </div>
    </div>
  );
}
