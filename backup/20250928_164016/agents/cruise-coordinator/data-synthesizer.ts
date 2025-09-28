
'use server';
/**
 * @fileOverview The "Data Synthesizer" sub-agent.
 * This agent specializes in cleaning, standardizing, and formatting
 * messy, raw data into a clean, consistent structure.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { RawCruiseDataSchema, CoordinatedCruiseResultSchema } from './types';

/**
 * Takes raw scraped or API data and synthesizes it into a clean, structured format.
 * @param input Raw data from the Information Retriever.
 * @returns A promise that resolves to a clean, structured list of cruises.
 */
export async function synthesizeCruiseData(input: z.infer<typeof RawCruiseDataSchema>): Promise<z.infer<typeof CoordinatedCruiseResultSchema>> {
    return dataSynthesizerAgent(input);
}

const dataSynthesizerAgent = ai.defineFlow(
  {
    name: 'dataSynthesizerAgent',
    inputSchema: RawCruiseDataSchema,
    outputSchema: CoordinatedCruiseResultSchema,
  },
  async (rawData) => {
    if (!rawData.results || rawData.results.length === 0) {
        return { cruises: [], summary: "No data to synthesize." };
    }
    
    const prompt = `You are a Data Synthesizer agent. Your job is to take a messy array of raw cruise data and convert it into a clean, structured JSON format.

    Tasks:
    1.  Normalize cruise line and ship names (e.g., "RCI" -> "Royal Caribbean").
    2.  Standardize prices into a consistent format (e.g., "$1,200/person").
    3.  Parse and format dates into "Month Day, Year" format.
    4.  Summarize itineraries into a bulleted list of ports.
    5.  Ensure all URLs are absolute.
    6.  Fill in missing data with "N/A" where appropriate.

    Raw Data to Process:
    ${JSON.stringify(rawData.results, null, 2)}

    Process the data and return it in the specified clean format.
    `;

    const { output } = await ai.generate({
      prompt: prompt,
      model: 'googleai/gemini-2.5-flash',
      output: { schema: CoordinatedCruiseResultSchema },
    });

    return output!;
  }
);
