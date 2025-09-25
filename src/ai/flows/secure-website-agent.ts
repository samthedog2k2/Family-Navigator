
'use server';
/**
 * @fileOverview An AI agent that can securely log into websites and perform tasks.
 *
 * This agent uses Puppeteer to control a headless browser and retrieves credentials
 * securely from environment variables, which are expected to be populated by
 * Google Cloud Secret Manager.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Define the schema for the secure login tool's input
const LoginToolInputSchema = z.object({
  website: z.enum(['RoyalCaribbean', 'Netflix', 'BankOfAmerica', 'Hulu', 'MSCCruises']).describe('The canonical name of the website to log into.'),
  task: z.string().describe('A simple, specific task to perform after logging in. e.g., "Get the account holder\'s name from the profile page."'),
  loginUrl: z.string().url().describe('The direct URL for the website\'s login page.'),
  postLoginUrl: z.string().url().describe('The URL to navigate to after a successful login to perform the task.'),
  successIndicator: z.string().describe('A unique piece of text or a CSS selector that is only visible AFTER a successful login. e.g., "Sign Out", "#profile-icon".'),
  taskScrapeSelector: z.string().describe('The CSS selector for the element containing the information needed to complete the task. e.g., ".account-name", "#balance-display".'),
});

/**
 * A secure tool that logs into a website using credentials from environment variables
 * and performs a specified scraping task.
 */
const loginAndPerformTask = ai.defineTool(
  {
    name: 'loginAndPerformTask',
    description: 'Logs into a supported website and extracts a piece of information. Credentials must be pre-configured by the user in a secure secret manager.',
    inputSchema: LoginToolInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`[Agent] Starting login task for ${input.website}`);

    // Securely retrieve credentials from environment variables.
    // These are set by Secret Manager, NOT hard-coded.
    const username = process.env[`${input.website.toUpperCase()}_USERNAME`];
    const password = process.env[`${input.website.toUpperCase()}_PASSWORD`];

    if (!username || !password) {
      console.error(`[Agent] Credentials for ${input.website} not found in environment.`);
      return `Error: Credentials for ${input.website} have not been configured by the user.`;
    }

    let browser;
    try {
      console.log('[Agent] Launching browser...');
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });

      const page = await browser.newPage();
      await page.goto(input.loginUrl, { waitUntil: 'networkidle2' });
      console.log(`[Agent] Navigated to login page: ${input.loginUrl}`);

      // Enter credentials (using common selectors, may need adjustment)
      await page.type('input[name="email"], input[name="username"], input[type="email"]', username);
      await page.type('input[name="password"], input[type="password"]', password);
      await page.click('button[type="submit"], input[type="submit"]');
      console.log('[Agent] Submitted login form.');

      // Wait for navigation and confirm login success
      await page.waitForNavigation({ waitUntil: 'networkidle2' });
      const loginSuccess = await page.evaluate((indicator) => {
        return document.body.innerText.includes(indicator) || document.querySelector(indicator);
      }, input.successIndicator);

      if (!loginSuccess) {
        throw new Error('Login failed. The success indicator was not found.');
      }
      console.log('[Agent] Login successful.');

      // Navigate to the target page to perform the task
      await page.goto(input.postLoginUrl, { waitUntil: 'networkidle2' });
      console.log(`[Agent] Navigated to post-login page: ${input.postLoginUrl}`);

      // Scrape the required information
      const result = await page.$eval(input.taskScrapeSelector, (el) => el.textContent);
      console.log(`[Agent] Scraped result: ${result}`);

      return result?.trim() || `Could not find the requested information at selector: ${input.taskScrapeSelector}`;
    } catch (error: any) {
      console.error('[Agent] Error during secure login task:', error);
      return `Error: An automated browser error occurred. The website's structure may have changed. Details: ${error.message}`;
    } finally {
      if (browser) {
        await browser.close();
        console.log('[Agent] Browser closed.');
      }
    }
  }
);


const SecureWebsiteAgentInputSchema = z.object({
  request: z.string().describe('The user\'s request, e.g., "Log into Netflix and find the primary profile name."'),
});
export type SecureWebsiteAgentInput = z.infer<typeof SecureWebsiteAgentInputSchema>;

const SecureWebsiteAgentOutputSchema = z.object({
  response: z.string().describe('The final answer to the user\'s request.'),
});
export type SecureWebsiteAgentOutput = z.infer<typeof SecureWebsiteAgentOutputSchema>;


const secureWebsiteAgentFlow = ai.defineFlow(
  {
    name: 'secureWebsiteAgentFlow',
    inputSchema: SecureWebsiteAgentInputSchema,
    outputSchema: SecureWebsiteAgentOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `You are a helpful assistant with access to a secure login tool.
      A user wants you to log into a website and perform a task.
      Your job is to figure out the correct parameters to call the 'loginAndPerformTask' tool based on the user's request.
      Use your knowledge of common website structures to fill in the parameters.

      User request: "${input.request}"
      `,
      tools: [loginAndPerformTask],
      // Provide some known website configurations to help the AI.
      context: [
        {
          role: 'system',
          content: `
            Known Website Configurations:
            - RoyalCaribbean:
              - loginUrl: https://www.royalcaribbean.com/account/signin
              - postLoginUrl: https://www.royalcaribbean.com/account/profile
              - successIndicator: "Sign Out"
              - taskScrapeSelector for "account holder name": ".profile-name"
            - Netflix:
              - loginUrl: https://www.netflix.com/login
              - postLoginUrl: https://www.netflix.com/browse
              - successIndicator: "Sign out of Netflix"
              - taskScrapeSelector for "primary profile name": ".profile-link .profile-name"
            - Hulu:
              - loginUrl: https://auth.hulu.com/web/login
              - postLoginUrl: https://www.hulu.com/account
              - successIndicator: "Log Out"
              - taskScrapeSelector for "account holder name": "[data-testid=profile-button]"
            - MSCCruises:
              - loginUrl: https://www.msccruisesusa.com/manage-booking/manage-your-booking
              - postLoginUrl: https://www.msccruisesusa.com/manage-booking/manage-your-booking
              - successIndicator: "MY BOOKINGS"
              - taskScrapeSelector for "booking number": ".booking-number-selection"
          `
        }
      ]
    });

    const toolResponse = llmResponse.toolRequest?.output;

    if (toolResponse) {
      return { response: `Task completed. Here is the information I found: ${toolResponse}` };
    } else {
      return { response: llmResponse.text || "I was unable to complete the request. The tool did not return a response." };
    }
  }
);

export async function secureWebsiteAgent(input: SecureWebsiteAgentInput): Promise<SecureWebsiteAgentOutput> {
  return secureWebsiteAgentFlow(input);
}
