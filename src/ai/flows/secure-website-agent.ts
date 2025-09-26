
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
import puppeteer from 'puppeteer';

// Define the schema for the secure login tool's input
const LoginToolInputSchema = z.object({
  website: z.enum(['RoyalCaribbean', 'Netflix', 'BankOfAmerica', 'Hulu', 'MSCCruises']).describe('The canonical name of the website to log into.'),
  task: z.string().describe('A simple, specific task to perform after logging in. e.g., "Get the account holder\'s name from the profile page."'),
  loginUrl: z.string().url().describe('The direct URL for the website\'s login page.'),
  postLoginUrl: z.string().url().describe('The URL to navigate to after a successful login to perform the task.'),
  successIndicator: z.string().describe('A unique piece of text or a CSS selector that is only visible AFTER a successful login. e.g., "Sign Out", "#profile-icon".'),
  taskScrapeSelector: z.string().describe('The CSS selector for the element containing the information needed to complete the task. e.g., ".account-name", "#balance-display".'),
  username: z.string().optional().describe("The username or email for login."),
  password: z.string().optional().describe("The password for login.")
});

/**
 * A secure tool that logs into a website using credentials from environment variables
 * and performs a specified scraping task.
 */
const loginAndPerformTask = ai.defineTool(
  {
    name: 'loginAndPerformTask',
    description: 'Logs into a supported website and extracts a piece of information. Credentials must be provided if not pre-configured in a secure secret manager.',
    inputSchema: LoginToolInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`[Agent] Starting login task for ${input.website}`);

    // Securely retrieve credentials from input if available, otherwise from environment variables.
    const username = input.username || process.env[`${input.website.toUpperCase()}_USERNAME`];
    const password = input.password || process.env[`${input.website.toUpperCase()}_PASSWORD`];

    if (!username || !password) {
      console.error(`[Agent] Credentials for ${input.website} not found.`);
      return `Error: Credentials for ${input.website} were not provided and have not been pre-configured by the user.`;
    }

    let browser;
    try {
      console.log('[Agent] Launching browser...');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
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
  username: z.string().optional().describe("The username or email for the website."),
  password: z.string().optional().describe("The password for the website."),
  geminiApiKey: z.string().optional().describe("The user's Gemini API Key.")
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
    
    // Use provided Gemini API Key if available
    const config = input.geminiApiKey ? { plugins: [googleAI({ apiKey: input.geminiApiKey })] } : {};
    const localAi = genkit(config);

    const llmResponse = await localAi.generate({
      prompt: `You are a helpful assistant with access to a secure login tool.
      Your job is to figure out the correct parameters to call the 'loginAndPerformTask' tool based on the user's request.
      Map the user's mention of a website (e.g., 'hulu.com', 'Netflix') to the correct canonical 'website' enum value (e.g., 'Hulu', 'Netflix').
      Use your knowledge of common website structures to fill in the other parameters.
      You have been provided with the username and password, you must pass them to the tool.

      User request: "${input.request}"
      Username: "${input.username}"
      Password: "[hidden]"
      `,
      tools: [loginAndPerformTask],
      // Provide some known website configurations to help the AI.
      context: [
        {
          role: 'system',
          content: `
            Known Website Configurations & Mappings:
            - Canonical Name: 'Hulu'
              - Maps from: 'Hulu', 'hulu.com'
              - loginUrl: https://auth.hulu.com/web/login
              - postLoginUrl: https://www.hulu.com/account
              - successIndicator: "Log Out"
              - taskScrapeSelector for "account holder name": "[data-testid=profile-button]"
            - Canonical Name: 'RoyalCaribbean'
              - Maps from: 'Royal Caribbean', 'royalcaribbean.com'
              - loginUrl: https://www.royalcaribbean.com/account/signin
              - postLoginUrl: https://www.royalcaribbean.com/account/profile
              - successIndicator: "Sign Out"
              - taskScrapeSelector for "account holder name": ".profile-name"
            - Canonical Name: 'Netflix'
              - Maps from: 'Netflix', 'netflix.com'
              - loginUrl: https://www.netflix.com/login
              - postLoginUrl: https://www.netflix.com/browse
              - successIndicator: "Sign out of Netflix"
              - taskScrapeSelector for "primary profile name": ".profile-link .profile-name"
            - Canonical Name: 'MSCCruises'
              - Maps from: 'MSC', 'msccruisesusa.com'
              - loginUrl: https://www.msccruisesusa.com/manage-booking/manage-your-booking
              - postLoginUrl: https://www.msccruisesusa.com/manage-booking/manage-your-booking
              - successIndicator: "MY BOOKINGS"
              - taskScrapeSelector for "booking number": ".booking-number-selection"
          `
        }
      ],
      custom: {
        username: input.username,
        password: input.password
      }
    });

    const toolRequest = llmResponse.toolRequest;

    if (toolRequest) {
      // Pass the credentials to the tool call
      toolRequest.input.username = input.username;
      toolRequest.input.password = input.password;

      const toolResponse = await toolRequest.run();

      if (typeof toolResponse === 'string' && toolResponse.startsWith('Error:')) {
          return { response: `I'm sorry, I wasn't able to get that information for you. ${toolResponse}` };
      }
      return { response: `Task completed. Here is the information I found: ${toolResponse}` };
    } else {
      return { response: llmResponse.text || "I was unable to complete the request. The tool did not return a response." };
    }
  }
);

export async function secureWebsiteAgent(input: SecureWebsiteAgentInput): Promise<SecureWebsiteAgentOutput> {
  return secureWebsiteAgentFlow(input);
}
