
'use server';

import { FullTripRequest } from "@/lib/travel-types";
import { ai } from "@/ai/genkit";
import { z } from "zod";

const TravelCoordinatorOutputSchema = z.object({
  summary: z.string(),
  options: z.array(z.any()),
});

/**
 * Initializes the travel coordinator.
 * In a real scenario, this might warm up models or load configurations.
 */
export async function initializeCoordinator(): Promise<{ success: boolean; message: string }> {
  console.log("SP Travel Coordinator Initialized");
  return { success: true, message: "Coordinator is ready." };
}

/**
 * Plans a trip by orchestrating calls to various sub-agents.
 * @param request The full trip request details from the user.
 * @returns A synthesized trip plan.
 */
export async function planTrip(request: FullTripRequest): Promise<any> {
  console.log("[Coordinator] Received full trip request:", request);

  const planningFlow = ai.defineFlow(
    {
      name: 'planningFlow',
      inputSchema: z.any(),
      outputSchema: TravelCoordinatorOutputSchema,
    },
    async (req) => {
      console.log('[Coordinator] Starting planning flow...');
      
      // Step 1: Analyze the request
      const analysisPrompt = `Analyze the following travel request and break it down into tasks for sub-agents (e.g., flight agent, hotel agent).
      Request: ${JSON.stringify(req, null, 2)}`;
      
      const analysisResult = await ai.generate({ prompt: analysisPrompt });
      console.log('[Coordinator] Analysis complete:', analysisResult.text);

      // Step 2 & 3: Delegate to sub-agents and gather results (mocked)
      const subAgentTasks = [
        `Find flights for ${req.family.members.length} people from ${req.origin} to ${req.destinations[0]}`,
        `Find hotels in ${req.destinations[0]} under a budget of $${req.budget.total}`,
      ];

      console.log('[Coordinator] Delegating tasks:', subAgentTasks);

      // Mocked results
      const gatheredData = {
        flights: [{ airline: 'Delta', price: 450 * req.family.members.length, details: 'Direct' }],
        hotels: [{ name: 'Grand Floridian', pricePerNight: 700 }],
      };

      // Step 4: Synthesize a final plan
      const synthesisPrompt = `Synthesize the following data into a cohesive travel plan summary.
      Data: ${JSON.stringify(gatheredData, null, 2)}`;
      
      const synthesisResult = await ai.generate({ prompt: synthesisPrompt });

      return {
        summary: synthesisResult.text,
        options: [gatheredData],
      };
    }
  );

  return planningFlow(request);
}
