
import { z } from 'zod';

export const CruiseSearchInputSchema = z.object({
  query: z.string().describe('A natural language query describing the desired cruise. e.g., "A 7-night family-friendly cruise to the Caribbean from Miami in June 2025, with lots of activities for kids."'),
});
export type CruiseSearchInput = z.infer<typeof CruiseSearchInputSchema>;


export const CruiseSchema = z.object({
    cruiseLine: z.string().describe("The name of the cruise line, e.g., 'Royal Caribbean'"),
    shipName: z.string().describe("The name of the cruise ship, e.g., 'Icon of the Seas'"),
    itinerary: z.string().describe("A brief, one-sentence summary of the cruise itinerary. e.g., 'Sails to Cozumel, Roatan, and Costa Maya.'"),
    departurePort: z.string().describe("The city and state/country of the departure port, e.g., 'Miami, Florida'"),
    date: z.string().describe("The departure date in a readable format, e.g., 'June 14, 2025'"),
    price: z.string().describe("An estimated starting price for the cruise, e.g., '$1,200/person'"),
    bookingLink: z.string().url().describe("A valid URL to a booking or information page for this cruise."),
    lat: z.number().describe("The last known latitude of the ship."),
    lng: z.number().describe("The last known longitude of the ship."),
    // New ship details
    tonnage: z.number().optional().describe("The gross tonnage of the ship, e.g., 250800."),
    passengerCapacity: z.number().optional().describe("The total passenger capacity."),
    lastRefurb: z.string().optional().describe("The year the ship was last refurbished, e.g., '2022' or 'N/A'."),
    crewCapacity: z.number().optional().describe("The total crew capacity."),
});
export type Cruise = z.infer<typeof CruiseSchema>;


export const CruiseSearchResultSchema = z.object({
  cruises: z.array(CruiseSchema).describe('A list of 3-5 cruise options that match the user query.'),
});
export type CruiseSearchResult = z.infer<typeof CruiseSearchResultSchema>;
