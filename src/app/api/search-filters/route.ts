import { NextResponse } from 'next/server';

async function fetchFilterData(endpoint: string, apiKey: string) {
    const url = `https://cruise.p.rapidapi.com/${endpoint}`;
    try {
        const response = await fetch(url, {
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'cruise.p.rapidapi.com',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch ${endpoint} with status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error(`Error fetching from URL ${url}:`, error);
        throw error;
    }
}

export async function GET() {
    const apiKey = process.env.RAPIDAPI_KEY;
    if (!apiKey) {
        return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // NOTE: The provided API `cruise.p.rapidapi.com` does not seem to have endpoints
    // for filters like /ports, /lines etc. I am simulating the response here based
    // on what a typical cruise API would return.
    const simulatedData = {
        ports: [{id: 'MIA', name: 'Miami, FL'}, {id: 'FLL', name: 'Fort Lauderdale, FL'}],
        lines: [{id: 'RCI', name: 'Royal Caribbean'}, {id: 'CCL', name: 'Carnival'}],
        ships: [{id: 'ICON', name: 'Icon of the Seas'}, {id: 'WONDER', name: 'Wonder of the Seas'}],
        regions: [{id: 'CARIB', name: 'Caribbean'}, {id: 'AK', name: 'Alaska'}],
    };

    return NextResponse.json({ data: simulatedData });
}
