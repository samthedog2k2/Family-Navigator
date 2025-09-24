'use server';

/**
 * @fileOverview AI-powered recommendations for entertainment.
 *
 * - getEntertainmentRecommendations - A function that provides recommendations.
 * - EntertainmentRecommendationsInput - Input type.
 * - EntertainmentRecommendationsOutput - Output type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EntertainmentInputSchema = z.object({
  category: z.enum(['movies', 'tv-shows', 'sports']).describe('The category for recommendations.'),
});
export type EntertainmentRecommendationsInput = z.infer<typeof EntertainmentInputSchema>;

const EntertainmentRecommendationSchema = z.object({
    title: z.string().describe("The title of the movie, TV show, or sporting event."),
    year: z.string().describe("The year of release or event."),
    genre: z.string().describe("The genre or type of sport."),
    description: z.string().describe("A one-sentence engaging description."),
    rating: z.string().describe("The critical rating, e.g., '8.5/10' or 'PG-13'."),
    audienceScore: z.number().int().min(0).max(100).describe("A Rotten Tomatoes-style audience score as a percentage."),
});

export type EntertainmentRecommendation = z.infer<typeof EntertainmentRecommendationSchema>;

const EntertainmentOutputSchema = z.object({
  recommendations: z.array(EntertainmentRecommendationSchema).describe('A list of 3 entertainment recommendations.'),
});
export type EntertainmentRecommendationsOutput = z.infer<typeof EntertainmentOutputSchema>;

export async function getEntertainmentRecommendations(input: EntertainmentRecommendationsInput): Promise<EntertainmentRecommendationsOutput> {
  return entertainmentRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'entertainmentRecommendationsPrompt',
  input: { schema: EntertainmentInputSchema },
  output: { schema: EntertainmentOutputSchema },
  prompt: `You are an expert curator of entertainment. A user wants recommendations for the following category: {{{category}}}.

Provide a list of 3 diverse and interesting recommendations. For each item, provide a realistic title, year, genre, a short engaging description, a plausible rating, and a realistic audience score percentage.
Make the recommendations interesting and not just the most popular items.
- For 'movies', suggest a mix of classic, indie, or recent hits.
- For 'tv-shows', suggest shows from different streaming platforms or genres.
- For 'sports', suggest an upcoming or recent interesting matchup, a documentary, or a classic game.
`,
});

const entertainmentRecommendationsFlow = ai.defineFlow(
  {
    name: 'entertainmentRecommendationsFlow',
    inputSchema: EntertainmentInputSchema,
    outputSchema: EntertainmentOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
