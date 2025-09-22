
"use client";

import { useSearchParams } from "next/navigation";
import { TravelPlanner } from "@/components/travel-planner";
import { FinanceTools } from "@/components/finance-tools";
import { HealthTracker } from "@/components/health-tracker";
import { WebAgentForm } from "@/components/web-agent-form";
import { ChatInterface } from "@/components/chat";
import { FamilyCalendar } from "@/components/family-calendar";
import { SchoolDashboard } from "@/components/school-dashboard";
import { PageHeader } from "./page-header";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

const featureMap: { [key: string]: React.ComponentType } = {
  travel: TravelPlanner,
  finance: FinanceTools,
  health: HealthTracker,
  agents: WebAgentForm,
  chat: ChatInterface,
  calendar: FamilyCalendar,
  school: SchoolDashboard,
};

const featureTitles: { [key: string]: string } = {
    travel: "Travel Planner",
    finance: "Financial Tools",
    health: "Health Tracker",
    agents: "Webpages Agent",
    chat: "Chat Agent",
    calendar: "Family Calendar",
    school: "School Dashboard",
}

export function Dashboard() {
  const searchParams = useSearchParams();
  const featuresParam = searchParams.get("features");
  const features = featuresParam ? featuresParam.split(",") : [];
  
  if (features.length === 0 || !featuresParam) {
    return (
        <div>
            <PageHeader title="Empty Dashboard" description="No features selected. Go back to the homepage to select features for your dashboard."/>
        </div>
    )
  }

  const singleFeature = features.length === 1;

  return (
    <div className="space-y-6">
       {!singleFeature && <PageHeader title="Your Custom Dashboard" description="Here are the features you selected."/>}
        <div className={cn("grid gap-6", !singleFeature && "lg:grid-cols-1")}>
      {features.map((featureKey) => {
        const Component = featureMap[featureKey];
        const title = featureTitles[featureKey];
        if (!Component || !title) return null;

        if (singleFeature) {
            return (
                <div key={featureKey}>
                    <PageHeader title={title} />
                    <Component />
                </div>
            )
        }

        return (
          <Card key={featureKey}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <Component />
            </CardContent>
          </Card>
        ) 
      })}
      </div>
    </div>
  );
}
