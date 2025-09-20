'use server';

/**
 * @fileOverview This flow enables users to interact with websites by scraping content and automating tasks using RAG agents.
 *
 * - websiteIntegrationRAG - A function that takes a URL and a query, scrapes the website content, and returns an answer using RAG.
 * - WebsiteIntegrationRAGInput - The input type for the websiteIntegrationRAG function.
 * - WebsiteIntegrationRAGOutput - The return type for the websiteIntegrationRAG function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WebsiteIntegrationRAGInputSchema = z.object({
  url: z.string().describe('The URL of the website to scrape.'),
  query: z.string().describe('The query to answer using the website content.'),
});
export type WebsiteIntegrationRAGInput = z.infer<typeof WebsiteIntegrationRAGInputSchema>;

const WebsiteIntegrationRAGOutputSchema = z.object({
  answer: z.string().describe('The answer to the query based on the website content.'),
});
export type WebsiteIntegrationRAGOutput = z.infer<typeof WebsiteIntegrationRAGOutputSchema>;

export async function websiteIntegrationRAG(input: WebsiteIntegrationRAGInput): Promise<WebsiteIntegrationRAGOutput> {
  return websiteIntegrationRAGFlow(input);
}

const websiteIntegrationRAGPrompt = ai.definePrompt({
  name: 'websiteIntegrationRAGPrompt',
  input: {schema: WebsiteIntegrationRAGInputSchema},
  output: {schema: WebsiteIntegrationRAGOutputSchema},
  prompt: `You are a helpful assistant that answers questions based on content scraped from a website.

  Website URL: {{{url}}}
  Website Content: {{scrape url=url}}
  User Query: {{{query}}}

  Answer:`,
});

const websiteIntegrationRAGFlow = ai.defineFlow(
  {
    name: 'websiteIntegrationRAGFlow',
    inputSchema: WebsiteIntegrationRAGInputSchema,
    outputSchema: WebsiteIntegrationRAGOutputSchema,
  },
  async input => {
    const {output} = await websiteIntegrationRAGPrompt(input);
    return output!;
  }
);
