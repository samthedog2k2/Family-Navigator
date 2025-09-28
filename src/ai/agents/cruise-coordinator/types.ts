import { z } from 'zod';

/**
 * SP Enhanced Type System
 * Following Donald Knuth's literate programming principles
 */

export const UserPreferencesSchema = z.object({
    departurePort: z.string().optional(),
    destination: z.string().optional(),
    dateRange: z.object({
        from: z.string().optional(),
        to: z.string().optional(),
    }),
    duration: z.number().optional(),
    interests: z.string().optional(),
});

export const StructuredQuerySchema = z.object({
    departurePorts: z.array(z.string()),
    destinations: z.array(z.string()),
    startDate: z.string(),
    endDate: z.string(),
    tags: z.array(z.string()),
});

export const RawCruiseDataSchema = z.object({
    results: z.array(z.any()),
});

export const CoordinatedCruiseResultSchema = z.object({
    cruises: z.array(z.object({
        cruiseLine: z.string(),
        shipName: z.string(),
        itinerary: z.array(z.string()),
        departurePort: z.string(),
        departureDate: z.string(),
        durationDays: z.number(),
        price: z.string(),
        bookingLink: z.string().url(),
        source: z.string(),
    })),
    summary: z.string(),
});

export const CruiseCoordinatorInputSchema = UserPreferencesSchema;
export const CruiseCoordinatorOutputSchema = CoordinatedCruiseResultSchema;

export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
export type CruiseCoordinatorInput = z.infer<typeof CruiseCoordinatorInputSchema>;
export type CruiseCoordinatorOutput = z.infer<typeof CruiseCoordinatorOutputSchema>;
