
'use server';

/**
 * @fileOverview AI-powered cruise search flow.
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


export async function searchCruises(input: CruiseSearchInput): Promise<CruiseSearchResult> {
  return cruiseSearchFlow(input);
}

const cruiseSearchPrompt = ai.definePrompt({
  name: 'cruiseSearchPrompt',
  input: { schema: CruiseSearchInputSchema },
  output: { schema: CruiseSearchResultSchema },
  prompt: `You are an expert AI travel agent specializing in cruises. A user will provide a query describing their ideal cruise.
Your task is to act as if you have access to a real-time cruise search engine and generate a list of 3 to 5 realistic, matching cruise options.

To inform your results, you should act as if you have consulted data from live cruise platforms like CruiseMapper, The Cruise Globe, and Cruising Earth.
This means your generated itineraries, ship locations, and schedules should be plausible and reflect real-world cruise patterns.

For each cruise, you must provide:
- A real cruise line and a real ship from that line.
- A plausible itinerary for that ship and departure port.
- A realistic departure date and estimated price based on the user's query.
- A *placeholder* latitude and longitude for the ship's current location (make it realistic for a ship at sea on its itinerary).
- A valid, but generic, booking link to a major cruise booking website like CruiseDirect.com or Expedia.com.
- Realistic details for the ship: tonnage, passenger capacity, crew capacity, and last refurbished year.

User Query: {{{query}}}
`,
});

const cruiseSearchFlow = ai.defineFlow(
  {
    name: 'cruiseSearchFlow',
    inputSchema: CruiseSearchInputSchema,
    outputSchema: CruiseSearchResultSchema,
  },
  async input => {
    const { output } = await cruiseSearchPrompt(input);
    return output!;
  }
);
