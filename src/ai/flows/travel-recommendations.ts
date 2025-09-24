
'use server';

/**
 * @fileOverview AI-powered travel recommendations for cruises, road trips, and lodging.
 *
 * - getTravelRecommendations - A function that provides travel recommendations based on user preferences.
 * - TravelRecommendationsInput - The input type for the getTravelRecommendations function.
 * - TravelRecommendationsOutput - The return type for the getTravelRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TravelPreferencesSchema = z.object({
  destinationType: z.enum(['cruise', 'road trip', 'lodging']).describe('The type of travel (cruise, road trip, or lodging).'),
  interests: z.string().describe('Interests and preferences for the trip, such as beaches, mountains, or city life.'),
  budget: z.string().describe('The budget for the trip.'),
  travelers: z.number().describe('The number of travelers.'),
  duration: z.string().describe('The duration of the trip.'),
  departureDate: z.string().describe('The departure date for the trip.'),
});

const TravelRecommendationsInputSchema = z.object({
  preferences: TravelPreferencesSchema.describe('Travel preferences provided by the user.'),
});
export type TravelRecommendationsInput = z.infer<typeof TravelRecommendationsInputSchema>;

const TravelRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('AI-powered travel recommendations based on user preferences and real-time data.'),
});
export type TravelRecommendationsOutput = z.infer<typeof TravelRecommendationsOutputSchema>;

export async function getTravelRecommendations(input: TravelRecommendationsInput): Promise<TravelRecommendationsOutput> {
  return travelRecommendationsFlow(input);
}

const travelRecommendationsPrompt = ai.definePrompt({
  name: 'travelRecommendationsPrompt',
  input: {schema: TravelRecommendationsInputSchema},
  output: {schema: TravelRecommendationsOutputSchema},
  prompt: `You are an AI travel assistant that provides personalized travel recommendations based on user preferences and real-time data.

  Based on the following travel preferences:
  - Destination Type: {{{preferences.destinationType}}}
  - Interests: {{{preferences.interests}}}
  - Budget: {{{preferences.budget}}}
  - Travelers: {{{preferences.travelers}}}
  - Duration: {{{preferences.duration}}}
  - Departure Date: {{{preferences.departureDate}}}

  Provide detailed and engaging travel recommendations for the user.`, 
});

const travelRecommendationsFlow = ai.defineFlow(
  {
    name: 'travelRecommendationsFlow',
    inputSchema: TravelRecommendationsInputSchema,
    outputSchema: TravelRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await travelRecommendationsPrompt(input);
    return output!;
  }
);
