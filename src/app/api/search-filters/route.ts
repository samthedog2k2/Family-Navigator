import { NextResponse } from 'next/server';

// This function fetches data from a given CruiseMapper filter API endpoint
async function fetchFilterData(endpoint: string) {
    const url = `https://www.cruisemapper.com/api/v2/c/f/${endpoint}`;
    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            // Throw an error with status to be caught below
            throw new Error(`Failed to fetch ${endpoint} with status: ${response.status}`);
        }
        return await response.json();
    } catch(error) {
        console.error(`Error fetching from URL ${url}:`, error);
        // Re-throw the error to be handled by Promise.allSettled
        throw error;
    }
}

export async function GET() {
    const endpoints = ['ports', 'lines', 'ships', 'regions'];
    
    try {
        const results = await Promise.allSettled(
            // Use the correct singular form for the API endpoint
            endpoints.map(ep => fetchFilterData(ep.endsWith('s') ? ep.slice(0, -1) : ep)) 
        );

        const data: { [key: string]: any } = {};
        const errors: string[] = [];

        results.forEach((result, index) => {
            const endpointName = endpoints[index];
            if (result.status === 'fulfilled') {
                data[endpointName] = result.value;
            } else {
                console.error(`Error fetching ${endpointName}:`, result.reason);
                const errorMessage = result.reason instanceof Error ? result.reason.message : `Failed to load ${endpointName}`;
                errors.push(errorMessage);
            }
        });

        if (errors.length === endpoints.length) {
            // All requests failed, this is a critical error
            return NextResponse.json({ 
                error: 'Failed to load any filter data. The external service may be down.' 
            }, { status: 503 }); // Service Unavailable
        }

        // Successfully fetched some or all data
        return NextResponse.json({ 
            data, 
            errors: errors.length > 0 ? errors : undefined 
        });

    } catch (error: any) {
        // This would catch errors in the logic of this route itself, not the fetches
        console.error("Internal server error in search-filters route:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
