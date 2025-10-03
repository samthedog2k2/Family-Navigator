
'use server';
/**
 * @fileOverview The main "Cruise Travel Coordinator" autonomous agent.
 * This agent orchestrates the sub-agents to find cruise options based on user criteria.
 */

import { ai } from '@/ai/genkit';
import { CruiseCoordinatorInputSchema, CruiseCoordinatorOutputSchema, type CruiseCoordinatorInput } from './types';
import { analyzeUserQuery } from './query-analyst';
import { retrieveCruiseInformation } from './info-retriever';
import { synthesizeCruiseData } from './data-synthesizer';

/**
 * The main entry point for the autonomous cruise travel agent.
 * @param input The user's preferences from the UI.
 * @returns A promise that resolves to a structured list of curated cruise options.
 */
export async function findCruisesAutonomous(input: CruiseCoordinatorInput) {
  return cruiseCoordinatorAgent(input);
}

const cruiseCoordinatorAgent = ai.defineFlow(
  {
    name: 'cruiseCoordinatorAgent',
    inputSchema: CruiseCoordinatorInputSchema,
    outputSchema: CruiseCoordinatorOutputSchema,
  },
  async (userPreferences) => {
    console.log('[Coordinator] Received user preferences:', userPreferences);

    // Step 1: Delegate to the Query Analyst to structure the user's request.
    console.log('[Coordinator] Delegating to Query Analyst...');
    const structuredQuery = await analyzeUserQuery(userPreferences);
    console.log('[Coordinator] Received structured query:', structuredQuery);

    // Step 2: Delegate to the Information Retriever to find raw data.
    console.log('[Coordinator] Delegating to Information Retriever...');
    const rawData = await retrieveCruiseInformation(structuredQuery);
    console.log(`[Coordinator] Retrieved ${rawData.results.length} raw results.`);

    // Step 3: Delegate to the Data Synthesizer to clean and format the results.
    console.log('[Coordinator] Delegating to Data Synthesizer...');
    const finalResults = await synthesizeCruiseData(rawData);
    console.log('[Coordinator] Received synthesized results:', finalResults);

    // Step 4: Return the final, clean data to the user.
    return {
      cruises: finalResults.cruises,
      summary: `Found ${finalResults.cruises.length} synthesized cruise options based on your preferences.`,
    };
  }
);
