
'use server';
/**
 * @fileOverview The "Information Retrieval" sub-agent.
 * This agent decides the best strategy to fetch cruise data,
 * using available tools like APIs and web scrapers.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { StructuredQuerySchema, RawCruiseDataSchema } from './types';
import { searchCruiseApi, scrapeCruiseWebsite } from './tools';

/**
 * Retrieves raw cruise information based on a structured query.
 * It autonomously decides which tools to use.
 * @param input A structured query from the Query Analyst.
 * @returns A promise that resolves to a collection of raw, unstructured cruise data.
 */
export async function retrieveCruiseInformation(input: z.infer<typeof StructuredQuerySchema>): Promise<z.infer<typeof RawCruiseDataSchema>> {
    return infoRetrieverAgent(input);
}

const infoRetrieverAgent = ai.defineFlow(
  {
    name: 'infoRetrieverAgent',
    inputSchema: StructuredQuerySchema,
    outputSchema: RawCruiseDataSchema,
  },
  async (structuredQuery) => {
    console.log('[InfoRetriever] Starting information retrieval with query:', structuredQuery);

    const retrievalStrategyPrompt = `You are an autonomous Information Retrieval agent. Your goal is to find raw data about cruises based on a structured query. You have access to two tools:

    1.  \`searchCruiseApi\`: A direct and fast API for searching cruises. This should be your first choice.
    2.  \`scrapeCruiseWebsite\`: A web scraper that can get data from public websites. Use this as a fallback if the API returns no results.

    Based on the following query, decide which tool to use and call it with the appropriate parameters.

    Structured Query:
    ${JSON.stringify(structuredQuery, null, 2)}
    `;

    const llmResponse = await ai.generate({
        prompt: retrievalStrategyPrompt,
        model: 'googleai/gemini-2.5-flash',
        tools: [searchCruiseApi, scrapeCruiseWebsite],
    });

    const toolRequest = llmResponse.toolRequest;

    if (!toolRequest) {
        console.log('[InfoRetriever] LLM did not request a tool. Returning empty results.');
        return { results: [] };
    }

    console.log(`[InfoRetriever] LLM decided to use tool: ${toolRequest.name}`);
    let rawResults: any[] = [];

    // Execute the chosen tool
    if (toolRequest.name === 'searchCruiseApi') {
        const apiResult = await searchCruiseApi(toolRequest.input as any);
        rawResults = apiResult.cruises;
    } else if (toolRequest.name === 'scrapeCruiseWebsite') {
        const scrapeResult = await scrapeCruiseWebsite(toolRequest.input as any);
        rawResults = scrapeResult.scrapedData;
    }

    // A more advanced agent could have a fallback strategy here.
    // e.g., if API results are empty, then call the scraper.

    return { results: rawResults };
  }
);
