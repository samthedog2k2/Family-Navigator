'use server';

/**
 * @fileOverview AI-powered cruise search flow. This agent uses its knowledge of real-world cruise data from platforms like CruiseMapper to generate realistic itineraries.
 *
 * - searchCruises - A function that provides cruise search results based on a user query.
 */

import { ai } from '@/ai/genkit';
import {
  CruiseSearchInputSchema,
  CruiseSearchResultSchema,
  type CruiseSearchInput,
  type CruiseSearchResult,
} from './cruise-search-types';
import { shipData } from '@/data/cruise-ship-data';


export async function searchCruises(input: CruiseSearchInput): Promise<CruiseSearchResult> {
  return cruiseSearchFlow(input);
}

// Convert our static ship data into a format the AI can easily reference
const shipDataForPrompt = shipData.map(ship => 
  `- ${ship.name} (${ship.cruiseLine}): Built ${ship.built}, ${ship.tonnage} GRT, ${ship.pax} passengers, ${ship.crew} crew.`
).join('\n');


const cruiseSearchPrompt = ai.definePrompt({
  name: 'cruiseSearchPrompt',
  input: { schema: CruiseSearchInputSchema },
  output: { schema: CruiseSearchResultSchema },
  prompt: `You are an expert AI travel agent specializing in cruises. A user will provide a query describing their ideal cruise.
Your task is to generate a list of 3 to 5 realistic, matching cruise options.

You must use your knowledge of real-world cruise data from platforms like CruiseMapper.com, The Cruise Globe, and CruisingEarth.com to generate plausible results.

For each cruise, you must provide:
- A real cruise line and a real ship from that line.
- A plausible itinerary for that ship and departure port.
- A realistic departure date and estimated price based on the user's query.
- A *placeholder* latitude and longitude for the ship's current location (make it realistic for a ship at sea on its itinerary).
- A valid, but generic, booking link to a major cruise booking website like CruiseDirect.com or Expedia.com.
- Use the provided ship data to fill in tonnage, passenger capacity, crew capacity, and refurbished year.

REFERENCE SHIP DATA:
{{{shipData}}}

USER QUERY:
{{{query}}}
`,
});

const cruiseSearchFlow = ai.defineFlow(
  {
    name: 'cruiseSearchFlow',
    inputSchema: CruiseSearchInputSchema,
    outputSchema: CruiseSearchResultSchema,
  },
  async input => {
    const { output } = await cruiseSearchPrompt({ ...input, shipData: shipDataForPrompt });
    return output!;
  }
);

    