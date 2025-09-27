
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

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
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-4">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <p className="font-semibold">Puppeteer Disabled</p>
              <p className="text-sm">This feature requires a browser automation tool (Puppeteer) which is not supported in the current server environment.</p>
              <p className="text-xs">The public cruise scraper has been modified to use a more stable `fetch` method.</p>
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
