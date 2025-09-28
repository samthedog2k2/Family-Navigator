/**
 * @fileOverview Defines the tools available to the autonomous agents.
 * Includes tools for calling APIs and scraping websites.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as cheerio from "cheerio";
import { CruiseApiInputSchema, CruiseApiOutputSchema, ScraperInputSchema, ScraperOutputSchema } from './types';

/**
 * A tool that simulates calling a direct cruise search API.
 */
export const searchCruiseApi = ai.defineTool(
    {
        name: 'searchCruiseApi',
        description: 'Searches a structured cruise database API for deals. This is fast and should be the first choice.',
        inputSchema: CruiseApiInputSchema,
        outputSchema: CruiseApiOutputSchema,
    },
    async (input) => {
        console.log('[Tool:searchCruiseApi] Searching with input:', input);
        // In a real application, this would make a fetch call to a real API.
        // We will return mock data for this example.
        return {
            cruises: [
                {
                    apiId: 'RCI-WONDER-123',
                    cruiseName: '7-Night Western Caribbean on Wonder of the Seas',
                    price: 1499,
                    departure: 'Port Canaveral',
                    itinerary: ['Nassau, Bahamas', 'Cozumel, Mexico', 'Roatan, Honduras'],
                }
            ]
        };
    }
);


/**
 * A tool that scrapes a website for cruise information. This is a fallback
 * if the primary API tool fails or returns no results.
 */
export const scrapeCruiseWebsite = ai.defineTool(
    {
        name: 'scrapeCruiseWebsite',
        description: 'Scrapes a known cruise website for deals. Slower than an API, use as a fallback.',
        inputSchema: ScraperInputSchema,
        outputSchema: ScraperOutputSchema,
    },
    async ({ url }) => {
        console.log(`[Tool:scrapeCruiseWebsite] Scraping ${url}...`);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}. Status: ${response.status}`);
            }
            const html = await response.text();
            const $ = cheerio.load(html);

            const results: any[] = [];
            // A simple, generic selector for demonstration. A real implementation
            // would have a map of selectors for different sites.
            $('.cruise-card, .result-card-container').each((_, el) => {
                const $el = $(el);
                results.push({
                    title: $el.find('.title, .cruise-title').text().trim(),
                    price: $el.find('.price, .price-amount').text().trim(),
                    itinerary: $el.find('.itinerary-overview').text().trim(),
                    rawHtml: $el.html(),
                });
            });

            return { scrapedData: results.slice(0, 5) }; // Limit to 5 results
        } catch (error: any) {
            console.error(`[Tool:scrapeCruiseWebsite] Error:`, error);
            return { scrapedData: [{ error: error.message }] };
        }
    }
);
