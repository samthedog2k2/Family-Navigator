import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    try {
        const searchCriteria = await request.json();

        // This uses an AI flow as the actual API does not support complex search.
        // We will replace this with a direct API call if a suitable endpoint is found.
        const { searchCruises } = await import('@/ai/flows/cruise-search');
        
        // Convert structured criteria to a natural language query for the AI.
        const query = `
            Find cruises with the following criteria:
            - Query: ${searchCriteria.query || 'any cruise'}
            - For a realistic response, please generate valid latitude and longitude coordinates.
        `;

        const results = await searchCruises({ query });
        return NextResponse.json(results);

    } catch (error: any) {
        console.error("Error in search-cruises route:", error);
        return NextResponse.json({ error: error.message || "An unknown error occurred" }, { status: 500 });
    }
}
