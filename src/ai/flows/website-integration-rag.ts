
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
import * as cheerio from 'cheerio';

const WebsiteIntegrationRAGInputSchema = z.object({
  url: z.string().describe('The URL of the website to scrape.'),
  query: z.string().describe('The query to answer using the website content.'),
});
export type WebsiteIntegrationRAGInput = z.infer<typeof WebsiteIntegrationRAGInputSchema>;

const WebsiteIntegrationRAGOutputSchema = z.object({
  answer: z.string().describe('The answer to the query based on the website content.'),
});
export type WebsiteIntegrationRAGOutput = z.infer<typeof WebsiteIntegrationRAGOutputSchema>;


/**
 * A tool that scrapes the text content from a given URL.
 */
const scrapeWebsite = ai.defineTool(
  {
    name: 'scrapeWebsite',
    description: 'Scrapes the text content from a website URL.',
    inputSchema: z.object({ url: z.string().url() }),
    outputSchema: z.string(),
  },
  async ({ url }) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return `Error: Failed to fetch URL. Status: ${response.status}`;
      }
      const html = await response.text();
      const $ = cheerio.load(html);
      // Remove script, style, and other non-visible elements
      $('script, style, noscript, iframe, img, svg, header, footer, nav').remove();
      return $('body').text().replace(/\s\s+/g, ' ').trim();
    } catch (e: any) {
      return `Error scraping website: ${e.message}`;
    }
  }
);


const websiteIntegrationRAGPrompt = ai.definePrompt({
  name: 'websiteIntegrationRAGPrompt',
  tools: [scrapeWebsite],
  prompt: `You are a helpful assistant that answers questions based on content from a website.
  First, use the scrapeWebsite tool to get the content of the provided URL.
  Then, analyze the scraped content to answer the user's query.

  Website URL: {{{url}}}
  User Query: {{{query}}}
`,
});

const websiteIntegrationRAGFlow = ai.defineFlow(
  {
    name: 'websiteIntegrationRAGFlow',
    inputSchema: WebsiteIntegrationRAGInputSchema,
    outputSchema: WebsiteIntegrationRAGOutputSchema,
  },
  async input => {
     const llmResponse = await websiteIntegrationRAGPrompt(input);

     // If the model returns text directly, use it. Otherwise, it might have called a tool.
     // In a more complex flow, you would handle the tool output here.
     // For this RAG pattern, the model should be able to answer in one go after using the tool.
     return {
        answer: llmResponse.text() || "I was unable to find an answer from the provided website."
     }
  }
);


export async function websiteIntegrationRAG(input: WebsiteIntegrationRAGInput): Promise<WebsiteIntegrationRAGOutput> {
  return websiteIntegrationRAGFlow(input);
}
