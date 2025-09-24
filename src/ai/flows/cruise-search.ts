'use server';

/**
 * @fileOverview AI-powered cruise search flow.
 *
 * - searchCruises - A function that provides cruise search results based on a user query.
 * - CruiseSearchInput - The input type for the searchCruises function.
 * - CruiseSearchResult - The return type for the searchCruises function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CruiseSearchInputSchema = z.object({
  query: z.string().describe('A natural language query describing the desired cruise. e.g., "A 7-night family-friendly cruise to the Caribbean from Miami in June 2025, with lots of activities for kids."'),
});
export type CruiseSearchInput = z.infer<typeof CruiseSearchInputSchema>;


const CruiseSchema = z.object({
    cruiseLine: z.string().describe("The name of the cruise line, e.g., 'Royal Caribbean'"),
    shipName: z.string().describe("The name of the cruise ship, e.g., 'Icon of the Seas'"),
    itinerary: z.string().describe("A brief, one-sentence summary of the cruise itinerary. e.g., 'Sails to Cozumel, Roatan, and Costa Maya.'"),
    departurePort: z.string().describe("The city and state/country of the departure port, e.g., 'Miami, Florida'"),
    date: z.string().describe("The departure date in a readable format, e.g., 'June 14, 2025'"),
    price: z.string().describe("An estimated starting price for the cruise, e.g., '$1,200/person'"),
    bookingLink: z.string().url().describe("A valid URL to a booking or information page for this cruise."),
    lat: z.number().describe("The last known latitude of the ship."),
    lng: z.number().describe("The last known longitude of the ship."),
});

const CruiseSearchResultSchema = z.object({
  cruises: z.array(CruiseSchema).describe('A list of 3-5 cruise options that match the user query.'),
});
export type CruiseSearchResult = z.infer<typeof CruiseSearchResultSchema>;


export async function searchCruises(input: CruiseSearchInput): Promise<CruiseSearchResult> {
  return cruiseSearchFlow(input);
}

const cruiseSearchPrompt = ai.definePrompt({
  name: 'cruiseSearchPrompt',
  input: { schema: CruiseSearchInputSchema },
  output: { schema: CruiseSearchResultSchema },
  prompt: `You are an expert AI travel agent specializing in cruises. A user will provide a query describing their ideal cruise. Your task is to act as if you have access to a real-time cruise search engine and generate a list of 3 to 5 realistic, matching cruise options.

For each cruise, you must provide:
- A real cruise line and a real ship from that line.
- A plausible itinerary for that ship and departure port.
- A realistic departure date and estimated price based on the user's query.
- A *placeholder* latitude and longitude for the ship's current location (make it realistic for a ship at sea).
- A valid, but generic, booking link to a major cruise booking website like CruiseDirect.com or Expedia.com.

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
