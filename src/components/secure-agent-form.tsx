
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SecureAgentForm() {

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
          <CardHeader>
            <CardTitle>Secure Agent Temporarily Unavailable</CardTitle>
            <CardDescription>
              The AI agent system is currently undergoing maintenance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-12">
              <p>This feature is being improved and will be available again soon.</p>
            </div>
          </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>AI Agent Response</CardTitle>
          <CardDescription>
            The information retrieved by the agent.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground py-12">
              The agent is currently offline for maintenance.
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
