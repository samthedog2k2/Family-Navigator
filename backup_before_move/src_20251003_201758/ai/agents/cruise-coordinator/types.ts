
import { z } from 'zod';

/**
 * Schema for the user's preferences, gathered from the UI.
 * This is the initial input to the main coordinator agent.
 */
export const UserPreferencesSchema = z.object({
    departurePort: z.string().optional().describe("The desired departure port, e.g., 'Miami, FL'"),
    destination: z.string().optional().describe("The desired destination region, e.g., 'Caribbean'"),
    dateRange: z.object({
        from: z.string().optional().describe("Start of date range, YYYY-MM-DD"),
        to: z.string().optional().describe("End of date range, YYYY-MM-DD"),
    }),
    duration: z.number().optional().describe("Desired cruise duration in days."),
    interests: z.string().optional().describe("Free-form text describing user's interests, e.g., 'relaxing, good for kids, water slides'"),
});
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;


/**
 * Schema for the structured query created by the QueryAnalyst agent.
 * This is the input for the InformationRetriever agent.
 */
export const StructuredQuerySchema = z.object({
    departurePorts: z.array(z.string()).describe("A list of specific airport or port codes, e.g., ['MIA', 'FLL']"),
    destinations: z.array(z.string()).describe("A list of specific destination regions."),
    startDate: z.string().describe("The earliest departure date in YYYY-MM-DD format."),
    endDate: z.string().describe("The latest departure date in YYYY-MM-DD format."),
    tags: z.array(z.string()).describe("A list of tags inferred from interests, e.g., ['family-friendly', 'water park', 'luxury']"),
});


/**
 * Schema for the raw, messy data returned by the InformationRetriever agent's tools.
 */
export const RawCruiseDataSchema = z.object({
    results: z.array(z.any()).describe("An array of raw, unstructured data objects from APIs or web scraping."),
});


/**
 * Schema for the final, clean, and structured cruise data.
 * This is the output from the DataSynthesizer and the main Coordinator agent.
 */
export const CoordinatedCruiseResultSchema = z.object({
  cruises: z.array(z.object({
    cruiseLine: z.string(),
    shipName: z.string(),
    itinerary: z.array(z.string()).describe("A list of ports of call."),
    departurePort: z.string(),
    departureDate: z.string().describe("Formatted as 'Month Day, Year'"),
    durationDays: z.number(),
    price: z.string().describe("Formatted as a currency string, e.g., '$1,200/person'"),
    bookingLink: z.string().url(),
    source: z.string().describe("Where the data came from, e.g., 'CruiseDirect API' or 'CruiseCritic.com'"),
  })),
  summary: z.string().optional().describe("An optional summary of the results."),
});


// Define the main input for the coordinator, which is the user's raw preferences.
export const CruiseCoordinatorInputSchema = UserPreferencesSchema;
export type CruiseCoordinatorInput = z.infer<typeof CruiseCoordinatorInputSchema>;

// Define the final output schema for the coordinator.
export const CruiseCoordinatorOutputSchema = CoordinatedCruiseResultSchema;
export type CruiseCoordinatorOutput = z.infer<typeof CruiseCoordinatorOutputSchema>;

// Schema for the API tool's input
export const CruiseApiInputSchema = z.object({
    destination: z.string().optional().describe("e.g., 'Caribbean', 'Alaska'"),
    departurePort: z.string().optional().describe("e.g., 'MIA', 'FLL'"),
    duration: z.number().optional().describe("Length of the cruise in days."),
});

// Schema for the API tool's output
export const CruiseApiOutputSchema = z.object({
    cruises: z.array(z.object({
        apiId: z.string(),
        cruiseName: z.string(),
        price: z.number(),
        departure: z.string(),
        itinerary: z.array(z.string()),
    })),
});

// Schema for the scraper tool's input
export const ScraperInputSchema = z.object({
    url: z.string().url().describe("The specific URL of the cruise deals page to scrape."),
});

// Schema for the scraper tool's output
export const ScraperOutputSchema = z.object({
    scrapedData: z.array(z.any()).describe("An array of raw, scraped data objects."),
});
