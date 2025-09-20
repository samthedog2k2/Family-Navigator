// This is a server-side file.
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating smart finance summaries, highlighting key spending and saving opportunities.
 *
 * - `generateFinanceSummary` - An asynchronous function that takes financial data as input and returns an AI-driven summary.
 * - `FinanceSummaryInput` - The input type for the `generateFinanceSummary` function, defining the structure of the financial data.
 * - `FinanceSummaryOutput` - The output type for the `generateFinanceSummary` function, defining the structure of the AI-driven summary.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema for the flow
const FinanceSummaryInputSchema = z.object({
  income: z.number().describe('Total monthly income.'),
  expenses: z.array(
    z.object({
      category: z.string().describe('Category of expense (e.g., Housing, Food, Transportation).'),
      amount: z.number().describe('Amount spent in the category.'),
    })
  ).describe('List of monthly expenses.'),
  savings: z.number().describe('Total savings amount.'),
  debt: z.number().describe('Total debt amount.'),
  financialGoals: z.array(
    z.string().describe('Financial goals (e.g., Buy a house, Pay off debt).')
  ).describe('List of financial goals.'),
});

export type FinanceSummaryInput = z.infer<typeof FinanceSummaryInputSchema>;

// Define the output schema for the flow
const FinanceSummaryOutputSchema = z.object({
  summary: z.string().describe('AI-generated summary of the financial data, highlighting key spending and saving opportunities.'),
});

export type FinanceSummaryOutput = z.infer<typeof FinanceSummaryOutputSchema>;

// Define the Genkit prompt
const financeSummaryPrompt = ai.definePrompt({
  name: 'financeSummaryPrompt',
  input: {schema: FinanceSummaryInputSchema},
  output: {schema: FinanceSummaryOutputSchema},
  prompt: `You are a financial advisor. Analyze the following financial data and provide a concise summary, highlighting key spending and saving opportunities.

Income: {{{income}}}
Expenses:
{{#each expenses}}
- {{{category}}}: {{{amount}}}
{{/each}}
Savings: {{{savings}}}
Debt: {{{debt}}}
Financial Goals:
{{#each financialGoals}}
- {{{this}}}
{{/each}}

Summary:`,
});

// Define the Genkit flow
const financeSummaryFlow = ai.defineFlow(
  {
    name: 'financeSummaryFlow',
    inputSchema: FinanceSummaryInputSchema,
    outputSchema: FinanceSummaryOutputSchema,
  },
  async input => {
    const {output} = await financeSummaryPrompt(input);
    return output!;
  }
);

/**
 * Generates an AI-driven summary of financial data, highlighting key spending and saving opportunities.
 * @param input - The financial data to analyze.
 * @returns A promise that resolves to the AI-driven summary.
 */
export async function generateFinanceSummary(input: FinanceSummaryInput): Promise<FinanceSummaryOutput> {
  return financeSummaryFlow(input);
}
