
'use server';
/**
 * @fileOverview The "Query Analyst" sub-agent.
 * This agent specializes in translating natural language user preferences
 * into a structured query for other agents and tools.
 */

import { ai } from '@/ai/genkit';
import { UserPreferencesSchema, StructuredQuerySchema, type UserPreferences } from './types';

/**
 * Analyzes the user's free-form preferences and converts them into a structured query.
 * @param input The user's preferences.
 * @returns A promise that resolves to a structured query object.
 */
export async function analyzeUserQuery(input: UserPreferences): Promise<z.infer<typeof StructuredQuerySchema>> {
    return queryAnalystAgent(input);
}

const queryAnalystAgent = ai.defineFlow(
  {
    name: 'queryAnalystAgent',
    inputSchema: UserPreferencesSchema,
    outputSchema: StructuredQuerySchema,
  },
  async (userPreferences) => {
    const prompt = `You are a specialized Query Analyst agent. Your job is to convert a user's travel preferences into a structured JSON object.

    Analyze the user's request:
    - Departure Port: ${userPreferences.departurePort}
    - Destination: ${userPreferences.destination}
    - Date Range: ${userPreferences.dateRange.from} to ${userPreferences.dateRange.to}
    - Duration: ${userPreferences.duration} days
    - Free-form Text: "${userPreferences.interests}"

    Extract key entities and preferences. Infer things like budget level (budget, mid-range, luxury) and specific interests (e.g., "water slides" implies "family-friendly", "water park").

    Generate a structured query based on your analysis.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
      output: { schema: StructuredQuerySchema },
    });

    return output!;
  }
);
