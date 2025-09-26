
'use server';
/**
 * @fileOverview An AI agent that can securely log into websites and perform tasks.
 *
 * This agent uses Puppeteer to control a headless browser and retrieves credentials
 * securely from environment variables, which are expected to be populated by
 * Google Cloud Secret Manager.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import puppeteer from 'puppeteer-core';

// Define the schema for the secure login tool's input
const LoginToolInputSchema = z.object({
  website: z.string().describe('The name of the website to log into (can be any website name).'),
  task: z.string().describe('A simple, specific task to perform after logging in. e.g., "Get the account holder\'s name from the profile page." or "Check for redirects."'),
  loginUrl: z.string().url().describe('The direct URL for the website\'s login page.'),
  postLoginUrl: z.string().url().optional().describe('The URL to navigate to after a successful login to perform the task.'),
  successIndicator: z.string().optional().describe('A unique piece of text or a CSS selector that is only visible AFTER a successful login. e.g., "Sign Out", "#profile-icon".'),
  taskScrapeSelector: z.string().optional().describe('The CSS selector for the element containing the information needed to complete the task. e.g., ".account-name", "#balance-display".'),
  username: z.string().optional().describe("The username or email for login."),
  password: z.string().optional().describe("The password for login."),
  usernameSelector: z.string().optional().describe("CSS selector for the username/email input field. Defaults to 'input[type=\"email\"]' if not provided."),
  passwordSelector: z.string().optional().describe("CSS selector for the password input field. Defaults to 'input[type=\"password\"]' if not provided."),
  loginButtonSelector: z.string().optional().describe("CSS selector for the login/submit button. Defaults to 'button[type=\"submit\"]' if not provided."),
  waitForNavigation: z.boolean().optional().describe("Whether to wait for navigation after submitting credentials. Defaults to true."),
  customLoginFlow: z.boolean().optional().describe("Set to true for complex login flows (OAuth, multi-step, etc.) that require custom handling.")
});

/**
 * A secure tool that logs into a website using credentials from input
 * and performs a specified scraping task.
 */
const loginAndPerformTask = ai.defineTool(
  {
    name: 'loginAndPerformTask',
    description: 'Logs into a supported website, performs a task, or checks for redirects. For login, credentials must be provided.',
    inputSchema: LoginToolInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    console.log(`[Agent] Starting task for ${input.website}: ${input.task}`);

    let browser;
    try {
      console.log('[Agent] Launching browser...');
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.goto(input.loginUrl, { waitUntil: 'networkidle2' });
      const finalUrl = page.url();
      console.log(`[Agent] Navigated to ${input.loginUrl}, ended at ${finalUrl}`);
      
      if (input.task === 'Check for redirects.') {
        return `Redirect check complete. Started at ${input.loginUrl} and landed on ${finalUrl}`;
      }

      const username = input.username;
      const password = input.password;

      if (!username || !password) {
        console.error(`[Agent] Credentials for ${input.website} not found for login task.`);
        return `Error: Credentials for ${input.website} were not provided for the login task.`;
      }

      // Enter credentials using flexible selectors
      const userSel = input.usernameSelector || 'input[type="email"], input[name="email"]';
      const passSel = input.passwordSelector || 'input[type="password"], input[name="password"]';
      const btnSel = input.loginButtonSelector || 'button[type="submit"]';

      // Check for custom flow - handles OAuth, B2C, and complex login sequences
      if (input.customLoginFlow) {
        console.log('[Agent] Custom login flow detected. Attempting to handle complex authentication...');

        // For OAuth/B2C flows, try to find standard form elements
        const forms = await page.$$('form');
        console.log(`[Agent] Found ${forms.length} forms on the page`);

        // Try common OAuth form patterns with more flexible selectors
        const emailInputs = await page.$$('input[type="email"], input[name="email"], input[id*="email"], input[placeholder*="email" i], input[name*="username"], input[name*="Email"]');
        const passwordInputs = await page.$$('input[type="password"], input[name="password"], input[id*="password"], input[name*="Password"]');
        const submitButtons = await page.$$('button[type="submit"], input[type="submit"], button[id*="submit"], button[class*="submit"], button[id*="next"], button[id*="continue"], button[id*="login"]');

        console.log(`[Agent] Found ${emailInputs.length} email inputs, ${passwordInputs.length} password inputs, ${submitButtons.length} submit buttons`);

        if (emailInputs.length > 0 && submitButtons.length > 0) {
          // Fill email
          await emailInputs[0].type(username);
          console.log('[Agent] Filled email field');

          // Check if password field is present on the same page
          if (passwordInputs.length > 0) {
            await passwordInputs[0].type(password);
            console.log('[Agent] Filled password field');
          }

          // Click submit
          await submitButtons[0].click();
          console.log('[Agent] Clicked submit button');

          // Wait for response/navigation
          if (input.waitForNavigation !== false) {
            try {
              await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
              console.log('[Agent] Navigation completed after first submit');
            } catch (e) {
              console.log('[Agent] No navigation detected after login attempt, continuing...');
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }

          // If password field wasn't on first page, try to find it now
          if (passwordInputs.length === 0) {
            const newPasswordInputs = await page.$$('input[type="password"], input[name="password"], input[id*="password"], input[name*="Password"]');
            const newSubmitButtons = await page.$$('button[type="submit"], input[type="submit"], button[id*="submit"], button[class*="submit"], button[id*="next"], button[id*="continue"], button[id*="login"]');

            if (newPasswordInputs.length > 0 && newSubmitButtons.length > 0) {
              await newPasswordInputs[0].type(password);
              console.log('[Agent] Filled password field on second page');

              await newSubmitButtons[0].click();
              console.log('[Agent] Clicked submit button on second page');

              if (input.waitForNavigation !== false) {
                try {
                  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
                  console.log('[Agent] Navigation completed after password submit');
                } catch (e) {
                  console.log('[Agent] No navigation detected after password submit');
                  await new Promise(resolve => setTimeout(resolve, 3000));
                }
              }
            }
          }
        } else {
          return `Error: Could not find standard login form elements for custom login flow on ${input.website}`;
        }
      } else {
        // Standard login flow
        await page.type(userSel, username);
        console.log(`[Agent] Typed username into selector: ${userSel}`);
  
        // Handle cases where username and password are on the same page vs. two steps
        const passwordInput = await page.$(passSel);
        if (passwordInput) {
          await page.type(passSel, password);
          console.log(`[Agent] Typed password into selector: ${passSel}`);
          await page.click(btnSel);
          console.log(`[Agent] Clicked login button: ${btnSel}`);
        } else {
          // Handle cases where it's a two-step login
          await page.click(btnSel); // Click to submit username
          console.log(`[Agent] Submitted username form with button: ${btnSel}`);
          if(input.waitForNavigation !== false) {
             await page.waitForNavigation({ waitUntil: 'networkidle2' });
          } else {
             await new Promise(resolve => setTimeout(resolve, 2000)); // wait for JS to load password field
          }
          await page.type(passSel, password);
          console.log(`[Agent] Typed password into selector on second step: ${passSel}`);
          await page.click(btnSel);
          console.log(`[Agent] Clicked login button on second step: ${btnSel}`);
        }
      }


      // Wait for final navigation and confirm login success
      if (input.waitForNavigation !== false) {
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
      if (!input.successIndicator) {
        throw new Error("A success indicator is required to confirm login.");
      }

      const loginSuccess = await page.evaluate((indicator) => {
        return document.body.innerText.includes(indicator) || document.querySelector(indicator);
      }, input.successIndicator);

      if (!loginSuccess) {
        throw new Error('Login failed. The success indicator was not found. This could be due to incorrect credentials or a change in the website\'s layout.');
      }
      console.log('[Agent] Login successful.');

      // Navigate to the target page to perform the task
      if (!input.postLoginUrl || !input.taskScrapeSelector) {
        throw new Error("Post-login URL and scrape selector are required for scraping tasks.");
      }
      await page.goto(input.postLoginUrl, { waitUntil: 'networkidle2' });
      console.log(`[Agent] Navigated to post-login page: ${input.postLoginUrl}`);

      // Scrape the required information
      const result = await page.$eval(input.taskScrapeSelector, (el) => el.textContent);
      console.log(`[Agent] Scraped result: ${result}`);

      return result?.trim() || `Could not find the requested information at selector: ${input.taskScrapeSelector}`;
    } catch (error: any) {
      console.error('[Agent] Error during secure task:', error);
      return `Error: An automated browser error occurred. The website's structure may have changed or the headless browser was detected. Details: ${error.message}`;
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
      model: 'googleai/gemini-2.5-flash',
      prompt: `You are a helpful assistant with access to a secure login tool.
      Your job is to figure out the correct parameters to call the 'loginAndPerformTask' tool based on the user's request.
      If the user asks to check a redirect, set the task to "Check for redirects." and use the starting URL as the loginUrl.
      For logins, use your knowledge of common website structures to fill in the other parameters.
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
            - website: 'Hulu'
              - Maps from: 'Hulu', 'hulu.com'
              - loginUrl: https://auth.hulu.com/web/login
              - postLoginUrl: https://www.hulu.com/account
              - successIndicator: "Log Out"
              - taskScrapeSelector for "account holder name": "[data-testid=profile-button]"
              - usernameSelector: "#email_id"
              - passwordSelector: "#password_id"
              - loginButtonSelector: "button[data-testid=login-button]"
              - waitForNavigation: true
            - website: 'RoyalCaribbean'
              - Maps from: 'Royal Caribbean', 'royalcaribbean.com'
              - loginUrl: https://www.royalcaribbean.com/account/signin
              - postLoginUrl: https://www.royalcaribbean.com/account/profile
              - successIndicator: "Sign Out"
              - taskScrapeSelector for "account holder name": ".profile-name"
            - website: 'Netflix'
              - Maps from: 'Netflix', 'netflix.com'
              - loginUrl: https://www.netflix.com/login
              - postLoginUrl: https://www.netflix.com/browse
              - successIndicator: "Sign out of Netflix"
              - taskScrapeSelector for "primary profile name": ".profile-link .profile-name"
              - usernameSelector: "input[name=userLoginId]"
              - passwordSelector: "input[name=password]"
              - loginButtonSelector: "button[data-uia=login-submit-button]"
            - website: 'MSCCruises'
              - Maps from: 'MSC', 'msccruisesusa.com'
              - loginUrl: https://www.msccruisesusa.com/manage-booking/manage-your-booking
              - postLoginUrl: https://www.msccruisesusa.com/manage-booking/manage-your-booking
              - successIndicator: "MY BOOKINGS"
              - taskScrapeSelector for "booking number": ".booking-number-selection"
          `
        }
      ]
    });

    const toolRequest = llmResponse.toolRequest;

    if (toolRequest) {
      // Pass the credentials to the tool call
      const toolInput = {
        ...toolRequest.input as any,
        username: input.username,
        password: input.password
      };

      const toolResponse = await loginAndPerformTask(toolInput);

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
