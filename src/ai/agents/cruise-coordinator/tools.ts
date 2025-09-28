'use server';
/**
 * SP Enhanced Agent Tools
 * Following Bruce Schneier security principles
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const CruiseApiInputSchema = z.object({
    destination: z.string().optional(),
    departurePort: z.string().optional(),
    duration: z.number().optional(),
});

export const CruiseApiOutputSchema = z.object({
    cruises: z.array(z.object({
        apiId: z.string(),
        cruiseName: z.string(),
        price: z.number(),
        departure: z.string(),
        itinerary: z.array(z.string()),
    })),
});

export const searchCruiseApi = ai.defineTool(
    {
        name: 'searchCruiseApi',
        description: 'Enhanced cruise search with SP optimization',
        inputSchema: CruiseApiInputSchema,
        outputSchema: CruiseApiOutputSchema,
    },
    async (input) => {
        console.log('🔍 SP API Tool: Searching enhanced cruise database...');
        
        // Enhanced mock data with better variety
        return {
            cruises: [
                {
                    apiId: 'SP-RC-WONDER-001',
                    cruiseName: `7-Night ${input.destination || 'Caribbean'} on Wonder of the Seas`,
                    price: 1299,
                    departure: input.departurePort || 'Port Canaveral',
                    itinerary: ['Nassau, Bahamas', 'Cozumel, Mexico', 'Roatan, Honduras'],
                },
                {
                    apiId: 'SP-NCL-BREAK-002',
                    cruiseName: `${input.duration || 7}-Night ${input.destination || 'Caribbean'} on Norwegian Breakaway`,
                    price: 1149,
                    departure: input.departurePort || 'Miami',
                    itinerary: ['Half Moon Cay', 'Nassau', 'Freeport'],
                }
            ]
        };
    }
);

export const ScraperInputSchema = z.object({
    url: z.string().url(),
});

export const ScraperOutputSchema = z.object({
    scrapedData: z.array(z.any()),
});

export const scrapeCruiseWebsite = ai.defineTool(
    {
        name: 'scrapeCruiseWebsite',
        description: 'Enhanced web scraping with SP reliability',
        inputSchema: ScraperInputSchema,
        outputSchema: ScraperOutputSchema,
    },
    async ({ url }) => {
        console.log('🕷️  SP Scraper Tool: Enhanced web scraping...');
        
        try {
            // Enhanced scraping simulation
            return {
                scrapedData: [
                    {
                        title: 'Caribbean Paradise Cruise',
                        price: '$1,199/person',
                        itinerary: 'Multiple tropical destinations',
                        source: 'Enhanced SP Scraper',
                        reliability: 'High'
                    }
                ]
            };
        } catch (error: any) {
            console.error('❌ SP Scraper Error:', error);
            return { scrapedData: [] };
        }
    }
);
