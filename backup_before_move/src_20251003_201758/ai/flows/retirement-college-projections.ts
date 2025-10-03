// Retirement and College Savings Projections
'use server';

/**
 * @fileOverview Flow for AI-powered retirement and college savings projections.
 *
 * - retirementCollegeProjections - A function that handles the retirement and college savings projections process.
 * - RetirementCollegeProjectionsInput - The input type for the retirementCollegeProjections function.
 * - RetirementCollegeProjectionsOutput - The return type for the retirementCollegeProjections function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetirementCollegeProjectionsInputSchema = z.object({
  currentAge: z.number().describe('Your current age.'),
  retirementAge: z.number().describe('The age you plan to retire.'),
  currentSavings: z.number().describe('Your current retirement savings.'),
  annualContribution: z.number().describe('Your annual contribution to retirement savings.'),
  collegeCurrentAge: z.number().describe('Current age of child for college savings.'),
  collegeStartAge: z.number().describe('Age child will start college.'),
  collegeSavings: z.number().describe('Current college savings.'),
  annualCollegeContribution: z.number().describe('Annual contribution to college savings.'),
  marketOptimism: z.string().describe('Select how optimistic you are in the market. (e.g. Very Optimistic, Optimistic, Neutral, Pessimistic, Very Pessimistic)'),
});
export type RetirementCollegeProjectionsInput = z.infer<typeof RetirementCollegeProjectionsInputSchema>;

const RetirementCollegeProjectionsOutputSchema = z.object({
  retirementProjection: z.string().describe('Projected retirement savings at retirement age.'),
  collegeProjection: z.string().describe('Projected college savings when child starts college.'),
});
export type RetirementCollegeProjectionsOutput = z.infer<typeof RetirementCollegeProjectionsOutputSchema>;

export async function retirementCollegeProjections(input: RetirementCollegeProjectionsInput): Promise<RetirementCollegeProjectionsOutput> {
  return retirementCollegeProjectionsFlow(input);
}

const retirementCollegeProjectionsPrompt = ai.definePrompt({
  name: 'retirementCollegeProjectionsPrompt',
  input: {schema: RetirementCollegeProjectionsInputSchema},
  output: {schema: RetirementCollegeProjectionsOutputSchema},
  prompt: `You are a financial advisor providing retirement and college savings projections.

  Based on the following information, provide projections for retirement and college savings:

  Current Age: {{{currentAge}}}
  Retirement Age: {{{retirementAge}}}
  Current Retirement Savings: {{{currentSavings}}}
  Annual Retirement Contribution: {{{annualContribution}}}
  Child's Current Age: {{{collegeCurrentAge}}}
  College Start Age: {{{collegeStartAge}}}
  Current College Savings: {{{collegeSavings}}}
  Annual College Contribution: {{{annualCollegeContribution}}}
  Market Optimism: {{{marketOptimism}}}

  Provide a retirement projection, including potential market performance based on optimism.
  Provide a college savings projection, estimating growth until college start age.
`,
});

const retirementCollegeProjectionsFlow = ai.defineFlow(
  {
    name: 'retirementCollegeProjectionsFlow',
    inputSchema: RetirementCollegeProjectionsInputSchema,
    outputSchema: RetirementCollegeProjectionsOutputSchema,
  },
  async input => {
    const {output} = await retirementCollegeProjectionsPrompt(input);
    return output!;
  }
);
